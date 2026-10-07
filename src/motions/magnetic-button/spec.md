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
---

## 요청

> 버튼에 마우스를 가까이 대면 자석처럼 살짝 끌려오고, 손을 떼면 통 튕기면서 제자리로 돌아오게 해줘.

## 수치

- 자력 범위: 버튼 바깥 40px부터
- 끌림: 커서와 중심 거리의 35%, 글자는 거기에 40% 더
- 복귀: spring stiffness 220, damping 12, mass 0.6
- 누름: 0.94배

## 메모

- 어휘집에 cursor-follow가 빠르게 반응하는 예시가 없어서 고른 조합. spring을 단단하고 덜 감쇠되게 잡았다
- damping 12가 "통 튕기는" 정도로 맞는지는 가설. 8 · 18과 비교해 볼 것
