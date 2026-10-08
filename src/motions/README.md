# src/motions

모션 하나 = 폴더 하나. 폴더 이름이 slug이고 주소가 된다 (`/motions/<slug>`).
`spec.md`와 `demo.tsx`만 있으면 사이드바 · 홈 · ⌘K · 상세 페이지에 자동으로 붙는다
(`registry.ts`). 라우터나 `nav.ts`는 건드리지 않는다.

```
<slug>/
  spec.md     필수. 아래 형식
  demo.tsx    필수. default export 컴포넌트 하나
  Motion.tsx  새로 생성하는 모션의 본체. 기존 컴포넌트를 역기술한 경우엔 없고 `source:`로 가리킨다
```

## spec.md 형식

```md
---
title: Magnetic Button
summary: 한 줄 묘사. 사이드바 · 카드 설명으로 쓰인다
origin: ai # human | ai
status: proposed # proposed | adopted | rejected
created: 2026-10-06
preview: frame # frame (고정 높이 박스) | flow (페이지 흐름, 스크롤 연출용)
triggers: [cursor-follow, hover]
properties: [translate, scale]
timing: [spring]
feel: [통 튕기는]
source: src/components/ui/Some.tsx # 선택. 본체가 폴더 밖에 있을 때만
---

## 요청

> 처음 한 말 그대로. 수치 없이 일상어로
> 결과를 보고 고친 말 (한 줄 = 한 번)
> …

## 수치

- 항목: 값 (결과를 정하는 숫자만 3~5줄)

## 메모

- 선택. 필요할 때만 1~2줄
```

규칙:

- frontmatter는 `key: value`와 `key: [a, b]`만 쓴다 (주석은 위 예시 설명용. 실제 파일엔 쓰지 않는다)
- `triggers` · `properties` · `timing`은 `vocabulary/`의 키를 쓴다. 없는 키가 필요하면 어휘집에 먼저 추가한다
- `feel`은 `vocabulary/feel.md`의 말을 쓴다. 새 말은 숫자와 함께 **가설**로 추가한다
- 요청은 주고받은 순서대로 한 줄씩 쌓는다. 결과를 보고 고친 말("더 세게 튕기게")이 어휘집의 재료가 된다
- AI가 스스로 제안한 항목(`origin: ai`)의 요청은 ideator가 일상어로 쓴 기획 한 줄이다
- 섹션은 이 셋뿐이다. 상세 페이지의 "프롬프트 복사"는 요청 + 수치를 합쳐 만든다
- **요청은 고치지 않는다.** 말이 모호해도 그대로 남겨야 "이 말 → 이 결과" 짝이 쌓인다
- `status: rejected`는 목록에서 빠지지만 기록으로 남는다. 지우지 않는다
