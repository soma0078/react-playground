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
title: Scroll Expand Hero
summary: 한 줄 묘사. 사이드바 · 카드 설명으로 쓰인다
origin: human # human | ai
status: proposed # proposed | adopted | rejected
created: 2026-10-08
preview: flow # frame (고정 높이 박스) | flow (페이지 흐름, 스크롤 연출용)
triggers: [scroll-linked, sticky-pin]
properties: [clip-path]
timing: [scroll-distance]
hooks: [useScroll, useTransform]
feel: []
source: src/components/ui/Some.tsx # 선택. 본체가 폴더 밖에 있을 때만
chosen: 통 튕기게 # 선택. 변형 탭을 만든 경우 고른 것
---

## 요청

> 이 한 문단만 보고 같은 결과를 만들 수 있는 프롬프트. 사용자의 문장을 그대로 옮기지 않는다

## 수치

- 항목: 값 (결과를 정하는 숫자만 3~5줄)

## 메모

- 선택. 다시 만들 때 필요한 주의점만 1~2줄
```

규칙:

- frontmatter는 `key: value`와 `key: [a, b]`만 쓴다 (주석은 위 예시 설명용. 실제 파일엔 쓰지 않는다)
- `triggers` · `properties` · `timing`은 `vocabulary/`의 키를 쓴다. 없는 키가 필요하면 어휘집에 먼저 추가한다
- `hooks`는 구현에 쓴 framer-motion 훅 (`useRef` 같은 React 기본 훅은 뺀다). 상세 화면 태그 줄에 표시된다
- `feel`은 `vocabulary/feel.md`의 말을 쓴다. 새 말은 숫자와 함께 **가설**로 추가한다
- **요청**은 수정할 때마다 최종 결과 기준으로 다시 쓴다. 줄을 덧붙이지 않는다. 사용자가 쓴 느낌 표현은 `feel.md`에만 남긴다
- AI가 스스로 제안한 항목(`origin: ai`)의 요청은 ideator가 쓴 기획 한 문단이다
- **메모**는 최종본 기준. 시행착오 경위는 남기지 않는다
- **변형**(선택): 사용자가 비교를 원할 때만 `## 변형`(`- 이름: 수치`)을 둔다. `demo.tsx`가 `variant` prop으로 이름을 받고 상세 화면에 탭이 생긴다. 고르면 `chosen`에 적는다. 기본은 데모 하나 + 조절 상수 주석
- 상세 페이지의 "프롬프트 복사"는 요청 + 수치 (+ 보고 있는 변형)를 합쳐 만든다
- `status: rejected`는 목록에서 빠지지만 기록으로 남는다. 지우지 않는다

## 코드 주석

- 최대한 짧게, `~음` · `~임` · 명사로 끝낸다 (예: `// 글자 가독성용 어두운 막`)
- 핵심 모션을 조절하는 상수 · 코드에는 반드시 단다. 무엇을 바꾸면 어떻게 되는지 적는다 (예: `1 빠름 · 2 보통 · 3 느림`)
