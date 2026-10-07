---
title: Elastic Drag
summary: 카드를 당기면 고무줄처럼 버티며 늘어나고, 놓으면 출렁이며 제자리로 돌아온다
origin: ai
status: adopted
created: 2026-10-06
preview: frame
triggers: [drag]
properties: [translate, rotate, scale]
timing: [spring]
feel: [고무줄 같은]
---

## 요청

> 카드를 잡아당기면 고무줄에 묶인 것처럼 버티면서 조금만 끌려오고, 놓으면 띠용 하고 제자리로 돌아오게 해줘.

## 수치

- 버팀: 끌 수 있는 범위 0, 탄성 0.35 (손 이동의 약 1/3만 따라옴)
- 복귀: bounceStiffness 400, bounceDamping 14
- 기울기: 옆으로 160px 당기면 12°
- 잡는 중: 1.04배

## 메모

- 어휘집에 drag 예시가 없어서 고른 조합
- 탄성 0.35가 "버틴다"로 느껴지는지는 가설. 0.2 · 0.5와 비교해 볼 것
