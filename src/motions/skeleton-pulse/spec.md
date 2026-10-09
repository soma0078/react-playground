---
title: Skeleton Pulse
summary: 불러오는 동안 회색 뼈대가 숨 쉬듯 깜빡이고, 다 오면 같은 자리에 내용이 겹쳐 떠오른다
origin: ai
status: proposed
created: 2026-10-10
preview: frame
triggers: [load, ambient-loop]
properties: [opacity]
timing: [mirror-loop, ease-in-out, stagger, split-timing]
hooks: []
feel: [숨 쉬듯 깜빡이는]
---

## 요청

> 프로필 카드(아바타 원 · 이름 · 직함 · 소개 두 줄 · 버튼)를 불러오는 동안, 실제 내용과 같은 크기 · 위치의 회색 뼈대 블록을 보여 주고 각 블록의 투명도를 1과 0.45 사이에서 천천히 오가게(편도 0.9s ease-in-out, 끝에서 되돌아오는 무한 반복) 해줘. 블록마다 시작을 0.1s씩 어긋나게 해서 위에서 아래로 물결치듯 보이게. 데이터가 오면(데모는 2.4s 뒤) 뼈대는 0.2s 만에 빠르게 사라지고, 같은 칸에 겹쳐 둔 실제 내용이 0.35s 동안 떠올라 카드 높이가 한 번도 움찔하지 않게 해줘. 반짝이는 띠(shimmer) 없이 투명도만 쓴다.

## 수치

- 깜빡임: opacity 1 ↔ 0.45, 편도 0.9s, easeInOut, repeat Infinity · mirror (PULSE_DURATION, 0.6 급함 · 1.4 느긋)
- 블록 시차: 0.1s
- 교체: 뼈대 퇴장 0.2s, 내용 등장 0.35s (서로 다른 길이)
- 로딩 시간: 2.4s (데모용)

## 메모

- 뼈대와 내용을 grid 한 칸에 겹쳐 둠. 교체 중 높이가 바뀌지 않는 조건
- 최소 투명도 0.45가 "숨 쉬듯"으로 읽히는지는 가설. 0.3 이하면 깜빡임이 거슬릴 수 있음
