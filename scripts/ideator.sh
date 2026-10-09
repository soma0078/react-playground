#!/usr/bin/env bash
# 자율 모드 진입점. launchd가 호출하며 수동 실행도 가능
# 사용: scripts/ideator.sh [--dry-run]
#
# 흐름: 잠금 → 점검 → (A) 채택 · 거절 기록 PR → (B) 새 모션 제안 PR
# - 사용자 작업 폴더는 건드리지 않고 격리된 git worktree에서만 작업
# - claude는 파일만 수정. 커밋 · push · PR은 이 스크립트가 직접 수행
# - 점검 실패 시 최대 MAX_RETRY회 수정 요청, 끝내 실패하면 아무것도 올리지 않음
#
# 환경변수 (모두 선택)
#   MAX_OPEN     열린 AI 제안 PR 상한 (기본 2)
#   MAX_RETRY    점검 실패 시 재시도 횟수 (기본 3)
#   RUN_TIMEOUT  claude 1회 실행 제한 초 (기본 1500)
#   BASE_REF     작업 사본의 기준 (기본 origin/main). 머지 전 브랜치 시험용
#   NO_PUSH=1    커밋까지만 하고 push · PR 생략
#   FAKE_AGENT   claude 대신 실행할 명령 (배관 시험용). 인자: <agent> <prompt>
#   PENDING_JSON 기록 대기 목록 직접 지정 (시험용)
#   STATE_DIR · LOG  작업 폴더 · 로그 위치 (시험용)
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

MAX_OPEN="${MAX_OPEN:-2}"
MAX_RETRY="${MAX_RETRY:-3}"
RUN_TIMEOUT="${RUN_TIMEOUT:-1500}"
BASE_REF="${BASE_REF:-origin/main}"
ENV_ERROR=75 # check-motion의 "점검 환경 문제" 종료 코드. 모션을 고쳐도 해결되지 않음

STATE_DIR="${STATE_DIR:-$HOME/.cache/react-playground-ideator}"
WT="$STATE_DIR/worktree"
LOCK="$STATE_DIR/lock"
LOG="${LOG:-$HOME/Library/Logs/react-playground-ideator.log}"
TODAY="$(date +%F)"

# claude가 쓸 수 있는 도구. git · gh는 허용하지 않음
ALLOWED=(Read Glob Grep Write Edit
  "Bash(npm run:*)" "Bash(npx tsc:*)" "Bash(npx prettier:*)"
  "Bash(node scripts/check-motion.mjs:*)" "Bash(ls:*)")
DENIED=("Bash(git:*)" "Bash(gh:*)" "Bash(rm:*)" "Bash(curl:*)" "Bash(wget:*)" WebFetch WebSearch)

mkdir -p "$STATE_DIR" "$(dirname "$LOG")"

log() { printf '%s %s\n' "$(date '+%F %T')" "$*" | tee -a "$LOG"; }
die() { log "중단: $*"; exit 1; }

# 잠금: 동시 실행 방지 (3시간 넘은 잠금은 비정상 종료로 보고 제거)
if [ -d "$LOCK" ] && [ -n "$(find "$LOCK" -maxdepth 0 -mmin +180 2>/dev/null)" ]; then
  log "오래된 잠금 제거"
  rmdir "$LOCK" 2>/dev/null
fi
mkdir "$LOCK" 2>/dev/null || { log "이미 실행 중 → 종료"; exit 0; }

cleanup_worktree() {
  if [ -d "$WT" ]; then
    rm -f "$WT/node_modules" # 링크만 제거 (원본 보존)
    git -C "$REPO" worktree remove --force "$WT" 2>/dev/null
    rm -rf "$WT"
  fi
  git -C "$REPO" worktree prune 2>/dev/null
}
trap 'cleanup_worktree; rmdir "$LOCK" 2>/dev/null' EXIT

# ---------- 점검 ----------
for tool in claude gh git node npm npx jq; do
  command -v "$tool" >/dev/null || die "$tool 없음 (PATH: $PATH)"
done
gh auth status >/dev/null 2>&1 || die "gh 로그인 필요"
cd "$REPO" || die "저장소 경로 없음"
git fetch -q origin main || die "origin 접근 실패"
[ -d "$REPO/node_modules" ] || die "node_modules 없음 (npm ci 필요)"

# 커밋 작성자는 저장소에 적용되는 설정을 그대로 사용 (작업 사본은 ~/.cache 아래라 폴더 조건 설정이 안 먹음)
GIT_NAME="$(git -C "$REPO" config user.name)"
GIT_EMAIL="$(git -C "$REPO" config user.email)"
[ -n "$GIT_NAME" ] && [ -n "$GIT_EMAIL" ] || die "git user.name · user.email 설정 필요"

OPEN_SLUGS="$(gh pr list --label ai-proposal --state open --json headRefName \
  --jq '.[].headRefName | ltrimstr("feature/motion-")' 2>/dev/null)"
OPEN_COUNT="$(printf '%s' "$OPEN_SLUGS" | grep -c . || true)"
OPEN_ARCHIVE="$(gh pr list --label ai-archive --state open --json number --jq length 2>/dev/null)"

TASTE_TMP="$STATE_DIR/taste.origin.md"
git show "$BASE_REF:taste.md" >"$TASTE_TMP" 2>/dev/null || die "$BASE_REF 에서 taste.md를 읽지 못함"
PENDING="${PENDING_JSON:-$(node scripts/autonomous/pending-archive.mjs "$TASTE_TMP")}" || die "기록 대기 목록 조회 실패"
PENDING_COUNT="$(printf '%s' "$PENDING" | jq length)"

log "시작 (열린 제안 ${OPEN_COUNT}/${MAX_OPEN}, 기록 대기 ${PENDING_COUNT}, 열린 기록 PR ${OPEN_ARCHIVE:-0}, 기준 ${BASE_REF}, 작성자 ${GIT_NAME} <${GIT_EMAIL}>)"

if [ "$DRY_RUN" = 1 ]; then
  log "dry-run: 아래 판단으로 실제 실행 시 동작함"
  [ "$PENDING_COUNT" -gt 0 ] && [ "${OPEN_ARCHIVE:-0}" -eq 0 ] \
    && log "  - 기록 PR 생성: $(printf '%s' "$PENDING" | jq -r 'map(.slug + "(" + .state + ")") | join(", ")')" \
    || log "  - 기록 PR 없음 (대기 0건이거나 이미 열린 기록 PR 존재)"
  [ "$OPEN_COUNT" -lt "$MAX_OPEN" ] \
    && log "  - 새 모션 제안 PR 생성 (claude --agent ideator, 시간 제한 ${RUN_TIMEOUT}s)" \
    || log "  - 새 모션 제안 건너뜀 (열린 제안 ${OPEN_COUNT}개 ≥ 상한 ${MAX_OPEN})"
  log "  - claude 허용 도구: ${ALLOWED[*]}"
  log "  - claude 차단 도구: ${DENIED[*]}"
  exit 0
fi

# ---------- 공통 ----------
setup_worktree() { # $1 = 임시 브랜치명
  cleanup_worktree
  git -C "$REPO" worktree add -q -B "$1" "$WT" "$BASE_REF" || die "작업 사본 생성 실패"
  ln -s "$REPO/node_modules" "$WT/node_modules"
}

run_with_timeout() { # $1 = 초, 나머지 = 명령. 시간 초과 시 자식까지 프로세스 그룹째 종료
  local limit="$1" pid waited=0 rc=0
  shift
  set -m # 백그라운드 작업에 별도 프로세스 그룹 부여 (pid == pgid)
  "$@" &
  pid=$!
  set +m
  while kill -0 "$pid" 2>/dev/null; do
    sleep 1
    waited=$((waited + 1))
    if [ "$waited" -ge "$limit" ]; then
      kill -TERM -- "-$pid" 2>/dev/null
      sleep 2
      kill -KILL -- "-$pid" 2>/dev/null
      break
    fi
  done
  wait "$pid" || rc=$?
  return "$rc"
}

AGENT_OUT="$STATE_DIR/agent.out"
run_agent() { # $1 = 에이전트, $2 = 프롬프트
  local rc=0
  (
    cd "$WT" || exit 1
    if [ -n "${FAKE_AGENT:-}" ]; then
      "$FAKE_AGENT" "$1" "$2"
    else
      run_with_timeout "$RUN_TIMEOUT" claude -p "$2" --agent "$1" \
        --setting-sources project --no-session-persistence \
        --allowedTools "${ALLOWED[@]}" --disallowedTools "${DENIED[@]}"
    fi
  ) >"$AGENT_OUT" 2>&1 || rc=$?
  cat "$AGENT_OUT" >>"$LOG"
  return "$rc"
}

ensure_labels() {
  gh label create ai-proposal --color 8957e5 --description "AI가 제안한 모션" >/dev/null 2>&1 || true
  gh label create ai-archive --color 6e7781 --description "채택 · 거절 기록 반영" >/dev/null 2>&1 || true
}

# 변경 파일이 허용 범위 안인지 확인. $1 = ideator | archivist
scope_ok() {
  local lines pattern bad
  lines="$(git -C "$WT" status --porcelain --untracked-files=all)"
  [ -n "$lines" ] || { log "변경 없음"; return 1; }
  if [ "$1" = ideator ]; then
    pattern='^(\?\?) src/motions/[a-z0-9-]+/.+$|^( M|M ) vocabulary/[a-z-]+\.md$'
  else
    pattern='^( M|M ) (src/motions/[a-z0-9-]+/spec\.md|taste\.md|vocabulary/feel\.md)$'
  fi
  bad="$(printf '%s\n' "$lines" | grep -vE "$pattern" || true)"
  [ -z "$bad" ] || { log "허용 범위 밖 변경 → 폐기:"; printf '%s\n' "$bad" | tee -a "$LOG"; return 1; }
}

commit_and_publish() { # $1 = 브랜치 | $2 = 커밋 제목 | $3 = 커밋 본문 | $4 = PR 본문 | $5 = 라벨 | $6... = add 대상
  local branch="$1" title="$2" body="$3" pr_body="$4" label="$5"
  shift 5
  git -C "$WT" add -- "$@" || return 1
  if git -C "$WT" diff --cached | grep -q 'claude.ai/code/session'; then
    log "변경에 세션 링크가 포함됨 → 중단"
    return 1
  fi
  git -C "$WT" -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" -c core.hooksPath=/dev/null \
    commit -q -m "$title" -m "$body" || return 1
  git -C "$WT" branch -m "$branch" || return 1
  log "커밋 완료: $branch"
  if [ "${NO_PUSH:-0}" = 1 ]; then
    log "NO_PUSH=1 → push · PR 생략. 로컬 브랜치 $branch 는 남김 (삭제: git branch -D $branch)"
    git -C "$WT" log --stat -1 | tee -a "$LOG"
    return 0
  fi
  git -C "$WT" push -q -u origin "$branch" || return 1
  (cd "$WT" && gh pr create --base main --head "$branch" --title "$title" \
    --label "$label" --body "$pr_body") | tee -a "$LOG" || return 1
  # 원격에 올라갔으므로 로컬 브랜치는 정리 (작업 사본이 쥐고 있어 먼저 제거)
  cleanup_worktree
  git -C "$REPO" branch -D "$branch" >/dev/null 2>&1 || true
}

# ---------- A. 채택 · 거절 기록 ----------
archive_phase() {
  local branch="chore/motion-archive-$TODAY" slugs
  slugs="$(printf '%s' "$PENDING" | jq -r 'map(.slug) | join(", ")')"
  git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1 && { log "기록 브랜치가 이미 있음 → 건너뜀"; return 0; }

  log "기록 반영 시작: $slugs"
  setup_worktree "auto/archive-wip"
  run_agent archivist "오늘 날짜는 $TODAY. .claude/agents/archivist.md 절차대로 아래 pending 항목을 기록해.
pending: $PENDING" || { log "archivist 실행 실패"; return 1; }
  scope_ok archivist || return 1
  (cd "$WT" && npx prettier --write taste.md vocabulary >/dev/null && npm run lint >/dev/null 2>&1 && npm run build >/dev/null 2>&1) \
    || { log "기록 반영 후 점검 실패 → 폐기"; return 1; }

  local pr_body
  pr_body="## 기록 대상
$(printf '%s' "$PENDING" | jq -r '.[] | "- #\(.number) \(.slug) → \(if .state == "merged" then "채택" else "거절" end)"')

머지된 제안은 spec 상태를 adopted로, 닫힌 제안은 taste.md에 거절 사유를 남깁니다. 사유는 PR에 남긴 코멘트에서 읽었습니다.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
  commit_and_publish "$branch" "docs: 모션 채택 · 거절 기록 반영 ($slugs)" \
    "- taste.md: 채택 · 거절 기록 추가
- src/motions/*/spec.md: 채택된 제안의 status를 adopted로 변경
- vocabulary/feel.md: 채택된 제안의 느낌 표현 가설을 확인됨으로 변경" \
    "$pr_body" ai-archive taste.md src/motions vocabulary
}

# ---------- B. 새 모션 제안 ----------
VERIFY_LOG="$STATE_DIR/verify.log"
verify_motion() { # $1 = slug
  (cd "$WT" && npx prettier --write "src/motions/$1" vocabulary >/dev/null \
    && npx tsc -b && npm run lint && npm run build && node scripts/check-motion.mjs "$1") >"$VERIFY_LOG" 2>&1
}

new_slug() {
  git -C "$WT" status --porcelain --untracked-files=all \
    | sed -n 's#^?? src/motions/\([a-z0-9-]*\)/.*#\1#p' | sort -u
}

ideator_phase() {
  setup_worktree "auto/ideator-wip"
  run_agent ideator "오늘 날짜는 $TODAY. .claude/agents/ideator.md 절차대로 새 모션 1개를 제안 · 구현해.
이미 열려 있는 제안(있는 것으로 취급): ${OPEN_SLUGS:-없음}" || { log "ideator 실행 실패 (종료 코드 $?)"; return 1; }

  scope_ok ideator || return 1
  local slug count
  slug="$(new_slug)"
  count="$(printf '%s' "$slug" | grep -c . || true)"
  [ "$count" -eq 1 ] || { log "새 모션 폴더가 ${count}개 → 폐기"; return 1; }
  [ -f "$WT/src/motions/$slug/spec.md" ] && [ -f "$WT/src/motions/$slug/demo.tsx" ] \
    || { log "spec.md · demo.tsx 누락 → 폐기"; return 1; }
  grep -q '^origin: ai$' "$WT/src/motions/$slug/spec.md" && grep -q '^status: proposed$' "$WT/src/motions/$slug/spec.md" \
    || { log "spec.md에 origin: ai · status: proposed 필요 → 폐기"; return 1; }
  git ls-remote --exit-code --heads origin "feature/motion-$slug" >/dev/null 2>&1 \
    && { log "원격에 feature/motion-$slug 가 이미 있음 → 폐기"; return 1; }

  local attempt=1 rc
  while true; do
    verify_motion "$slug"
    rc=$?
    [ "$rc" -eq 0 ] && break
    if [ "$rc" -eq "$ENV_ERROR" ]; then
      # 에이전트가 고칠 수 없는 문제라 수정 요청 없이 바로 중단 (사용량 낭비 방지)
      log "점검 환경 오류 (모션 문제 아님) → 중단"
      tail -5 "$VERIFY_LOG" | tee -a "$LOG"
      return 1
    fi
    if [ "$attempt" -ge "$MAX_RETRY" ]; then
      log "점검 ${MAX_RETRY}회 실패 → 폐기 (마지막 로그: $VERIFY_LOG)"
      tail -30 "$VERIFY_LOG" | tee -a "$LOG"
      return 1
    fi
    log "점검 실패 → 수정 요청 ($attempt/$MAX_RETRY)"
    run_agent ideator "오늘 날짜는 $TODAY. 방금 만든 모션 ${slug}의 점검이 실패함. 로그 마지막 80줄:
$(tail -80 "$VERIFY_LOG")
원인을 고쳐 점검을 다시 통과시키고 DONE $slug 를 출력해." || log "수정 실행 실패"
    scope_ok ideator || return 1
    attempt=$((attempt + 1))
  done
  scope_ok ideator || return 1

  local spec="$WT/src/motions/$slug/spec.md" title summary request numbers vocab_files
  title="$(sed -n 's/^title: //p' "$spec" | head -1)"
  summary="$(sed -n 's/^summary: //p' "$spec" | head -1)"
  request="$(awk '/^## 요청/{f=1;next}/^## /{f=0}f && /^> /{sub(/^> /,"");print}' "$spec")"
  numbers="$(awk '/^## 수치/{f=1;next}/^## /{f=0}f && /^- /' "$spec")"
  vocab_files="$(git -C "$WT" status --porcelain | sed -n 's# M vocabulary/\(.*\)#\1#p' | paste -sd, - | sed 's/,/, /g')"

  local commit_body="- src/motions/$slug: $summary (Motion.tsx · demo.tsx · spec.md)"
  [ -n "$vocab_files" ] && commit_body="$commit_body
- vocabulary: ${vocab_files} 갱신"

  local pr_body="## 제안
> $request

## 수치
$numbers

## 확인 방법
\`\`\`bash
git fetch origin && git switch feature/motion-$slug && npm run dev
\`\`\`
\`npm run dev\`가 알려주는 주소 뒤에 \`/motions/$slug\`

## 판단
- **머지** = 채택, **닫기** = 거절
- 이유를 PR 코멘트로 한 줄 남기면 다음 실행 때 \`taste.md\`에 기록됩니다. 구체적일수록 다음 제안이 정확해집니다 (예: \"튕김이 과함\")

🤖 Generated with [Claude Code](https://claude.com/claude-code)"

  commit_and_publish "feature/motion-$slug" "feat: $title 모션 추가 (AI 제안)" "$commit_body" \
    "$pr_body" ai-proposal "src/motions/$slug" vocabulary
}

# ---------- 실행 ----------
[ "${NO_PUSH:-0}" = 1 ] || ensure_labels # PR을 만들 때만 라벨 생성
STATUS=0

if [ "$PENDING_COUNT" -gt 0 ] && [ "${OPEN_ARCHIVE:-0}" -eq 0 ]; then
  archive_phase || STATUS=1
elif [ "$PENDING_COUNT" -gt 0 ]; then
  log "열린 기록 PR이 있어 기록 반영 건너뜀"
fi

if [ "$OPEN_COUNT" -ge "$MAX_OPEN" ]; then
  log "열린 제안 ${OPEN_COUNT}개 ≥ 상한 ${MAX_OPEN} → 새 제안 건너뜀"
else
  ideator_phase || STATUS=1
fi

log "종료 (상태 $STATUS)"
exit "$STATUS"
