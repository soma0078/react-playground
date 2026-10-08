---
title: Scroll Expand Hero
summary: 스크롤을 내리는 만큼 가운데 카드처럼 놓인 히어로 이미지가 화면 가득 펼쳐진다
origin: human
status: adopted
created: 2026-10-08
preview: flow
triggers: [scroll-linked, sticky-pin]
properties: [clip-path]
timing: [scroll-distance]
hooks: [useScroll, useTransform]
feel: []
---

## 요청

> 히어로 섹션을 화면에 고정한 채로, 가운데 둥근 카드 모양으로 잘려 있던 배경 이미지의 틀이 스크롤에 맞춰 화면 전체로 넓어지게 해줘. 스크롤에 직접 연동해서 멈추면 그 자리에 서고, 위로 올리면 다시 작아지게. 고정 구간의 85%에서 다 펼쳐지고 끝까지 펼쳐진 상태를 유지해. 이미지 크기는 그대로 두고 틀(clip-path)만 넓혀줘.

## 수치

- 시작 모양: 위아래 14%, 좌우 18% 안쪽으로 잘린 카드, 모서리 24px
- 끝 모양: 화면 가득, 모서리 0
- 진행: 스크롤에 직접 연동, 85% 지점에서 다 펼쳐짐, 이후 유지
- 스크롤 양: 화면 2장 분량 (SCROLL_SCREENS, 1 빠름 · 3 느림)

## 메모

- `useTransform` 입력 구간은 `[0, 0.85, 1]`처럼 1까지 명시. 0.85에서 끊으면 Chrome ScrollTimeline이 끝 구간을 처음 모양으로 채워 다시 줄어듦
- 이미지 확대 대신 틀(clip-path) 확장. 해상도 · 구도 유지 목적
