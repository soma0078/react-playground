# Timing

**어떤 시간감으로** 변하는가. `spec.md`의 `timing:` 에 이 표의 키를 쓴다.
요청할 때 숫자를 말할 필요는 없다. 숫자는 AI가 `spec.md`의 수치에 남긴다.

| 키                | 정의                                                                            | 실제 값 예시                               | 쓰인 곳                                 |
| ----------------- | ------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| `ease-out-quart`  | 빠르게 출발해 길게 감속                                                         | `cubic-bezier(0.25, 1, 0.5, 1)`, 0.9~1.1s  | ScrollStackHero (Lab), text-mask-reveal |
| `ease-in-out`     | 천천히 출발 · 천천히 도착                                                       | `easeInOut`                                | —                                       |
| `linear`          | 일정 속도                                                                       | 투명도 0.35s                               | ScrollStackHero (Lab)                   |
| `spring`          | 시간 대신 물리값으로 움직인다. `stiffness`↑ = 빠르고 단단, `damping`↓ = 더 출렁 | 220/12 (복귀), bounce 400/14 (드래그 복귀) | magnetic-button, elastic-drag           |
| `split-timing`    | 속성마다 길이를 다르게 준다                                                     | 이동 1.1s + 투명도 0.35s                   | ScrollStackHero (Lab)                   |
| `stagger`         | 여러 요소의 시작을 일정 간격으로 어긋나게                                       | 줄마다 0.12s                               | text-mask-reveal                        |
| `mirror-loop`     | 끝까지 가면 거꾸로 되돌아오며 무한 반복                                         | `repeat: Infinity, repeatType: 'mirror'`   | —                                       |
| `throttle`        | 비싼 계산을 일정 간격으로 묶고, 사이는 보간으로 메운다                          | 120ms 묶음 + spring 보간                   | —                                       |
| `scroll-distance` | 시간 대신 스크롤 거리로 길이를 정한다 (scroll-linked 전용)                      | 화면 1 · 2 · 3장 분량 (vh)                 | scroll-expand-hero                      |
