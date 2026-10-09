#!/usr/bin/env bash
# 자율 모드 launchd 등록 · 해제 · 상태. 이 Mac에서만 동작 (클라우드 사용 안 함)
# 사용: scripts/autonomous/install.sh [--print | --uninstall | --status | --run-now]
#   (인자 없음)  등록
#   --print      등록될 plist 출력만 (파일 생성 없음)
#   --uninstall  등록 해제
#   --status     등록 여부 · 마지막 실행 결과 · 로그 끝부분
#   --run-now    launchd 환경(PATH 등)에서 지금 즉시 1회 실행
# 일정 변경: SCHEDULE="1:9:30 4:14:0" scripts/autonomous/install.sh  (요일:시:분, 일=0 월=1 … 토=6)
set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LABEL="local.react-playground.ideator"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"
SCHEDULE="${SCHEDULE:-2:9:0 5:9:0}" # 기본: 화 · 금 09:00
LAUNCHD_LOG="$HOME/Library/Logs/react-playground-ideator.launchd.log"
RUN_LOG="$HOME/Library/Logs/react-playground-ideator.log"

# launchd는 PATH가 최소라서 필요한 도구 위치를 등록 시점에 고정
tool_path() {
  local dirs=() tool
  for tool in node claude gh git jq npx; do
    command -v "$tool" >/dev/null || { echo "$tool 없음" >&2; exit 1; }
    dirs+=("$(dirname "$(command -v "$tool")")")
  done
  printf '%s\n' "${dirs[@]}" /usr/bin /bin /usr/sbin /sbin | awk '!seen[$0]++' | paste -sd: -
}

render_plist() {
  local entries="" spec weekday hour minute
  for spec in $SCHEDULE; do
    IFS=: read -r weekday hour minute <<<"$spec"
    entries+="    <dict><key>Weekday</key><integer>$weekday</integer><key>Hour</key><integer>$hour</integer><key>Minute</key><integer>$minute</integer></dict>
"
  done
  cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$REPO/scripts/ideator.sh</string></array>
  <key>WorkingDirectory</key><string>$REPO</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key><string>$(tool_path)</string>
    <key>HOME</key><string>$HOME</string>
  </dict>
  <key>StartCalendarInterval</key>
  <array>
$entries  </array>
  <key>StandardOutPath</key><string>$LAUNCHD_LOG</string>
  <key>StandardErrorPath</key><string>$LAUNCHD_LOG</string>
</dict>
</plist>
EOF
}

case "${1:-}" in
  --print)
    render_plist
    ;;
  --uninstall)
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null
    rm -f "$PLIST"
    echo "해제 완료: $LABEL"
    ;;
  --status)
    if launchctl print "$DOMAIN/$LABEL" >/tmp/ideator-launchd.status 2>&1; then
      echo "등록됨: $LABEL"
      grep -E "^\s+(state|runs|last exit code|path) =" /tmp/ideator-launchd.status
    else
      echo "등록 안 됨: $LABEL"
    fi
    echo "--- 실행 로그 (끝 8줄): $RUN_LOG"
    tail -8 "$RUN_LOG" 2>/dev/null || echo "(아직 실행 기록 없음)"
    ;;
  --run-now)
    launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1 || { echo "먼저 등록 필요" >&2; exit 1; }
    launchctl kickstart "$DOMAIN/$LABEL" && echo "실행 시작. 진행 확인: tail -f $RUN_LOG"
    ;;
  "")
    [ "$(uname)" = Darwin ] || { echo "macOS 전용" >&2; exit 1; }
    mkdir -p "$(dirname "$PLIST")" "$(dirname "$LAUNCHD_LOG")"
    render_plist >"$PLIST" || exit 1
    plutil -lint "$PLIST" || exit 1
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null
    launchctl bootstrap "$DOMAIN" "$PLIST" || { echo "등록 실패" >&2; exit 1; }
    echo "등록 완료: $LABEL"
    echo "일정(요일:시:분): $SCHEDULE"
    echo "확인: scripts/autonomous/install.sh --status"
    ;;
  *)
    sed -n '2,9p' "${BASH_SOURCE[0]}"
    exit 2
    ;;
esac
