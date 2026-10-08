---
title: Text Mask Reveal
summary: 제목이 줄마다 보이지 않는 선 아래에서 밀려 올라오며 또렷하게 드러난다
origin: ai
status: adopted
created: 2026-10-06
preview: frame
triggers: [in-view]
properties: [translate, clip-path]
timing: [ease-out-quart, stagger]
hooks: [useInView]
feel: [또렷하게 올라오는]
---

## 요청

> 큰 제목이 화면에 들어오면, 흐릿하게 나타나지 말고 줄마다 바닥 선 밑에서 쓱 올라오게 해줘.

## 수치

- 숨김: 줄마다 overflow hidden 틀, 글자는 110% 아래에서 대기
- 움직임: 0.9s, cubic-bezier(0.25, 1, 0.5, 1)
- 시차: 줄마다 0.12s
- 재생 시점: 요소가 60% 보일 때 한 번

## 메모

- 어휘집에 in-view 예시가 없어서 고른 조합. 이동 곡선은 Lab `ScrollStackHero`의 ease-out-quart를 재사용해 비교가 쉽게 했다
- 투명도를 쓰지 않는 것이 "또렷하게"의 조건이라는 것은 가설
