---
title: Magnetic Button
summary: 커서가 다가가면 버튼이 끌려오고, 벗어나면 통 튕기며 제자리로 돌아간다
origin: ai
status: adopted
created: 2026-10-06
preview: frame
triggers: [cursor-follow, hover, press]
properties: [translate, scale]
timing: [spring]
feel: [통 튕기는]
chosen: 통 튕기게
---

## 요청

> 버튼에 마우스를 가까이 대면 자석처럼 살짝 끌려오고, 손을 떼면 통 튕기면서 제자리로 돌아오게 해줘.

## 수치

- 자력 범위: 버튼 바깥 40px부터
- 끌림: 커서와 중심 거리의 35%, 글자는 거기에 40% 더
- 복귀: spring stiffness 220, mass 0.6 (damping은 변형별)
- 누름: 0.94배

## 변형

- 차분하게: damping 18, 거의 넘치지 않고 멈춘다 (2%)
- 통 튕기게: damping 12, 제자리를 살짝 넘었다 돌아온다 (15%)
- 출렁이게: damping 8, 제자리를 크게 넘었다 돌아온다 (31%)

## 메모

- 변형의 % 는 커서를 놓은 뒤 제자리를 넘어가는 거리 / 끌려간 거리 (headless 브라우저 측정)
- 어휘집에 cursor-follow가 빠르게 반응하는 예시가 없어서 고른 조합. spring을 단단하고 덜 감쇠되게 잡았다
