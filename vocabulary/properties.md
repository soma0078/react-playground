# Properties

**무엇이** 변하는가. `spec.md`의 `properties:` 에 이 표의 키를 쓴다.

| 키            | 뜻                                                               | 메모                                                                       | 쓰인 곳                                                                |
| ------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `translate`   | 위치 이동 (x · y)                                                | 단위를 말한다. `px`는 고정 거리, `%`는 요소 크기 대비                      | ScrollStackHero (Lab), text-mask-reveal, magnetic-button, elastic-drag |
| `rotate`      | 회전                                                             | 방향을 번갈아 주면 "던져진" 느낌이 난다 (ScrollStackHero (Lab): 홀짝 ±14°) | ScrollStackHero (Lab), elastic-drag                                    |
| `scale`       | 크기                                                             | 1에서 조금만 벗어나도 크게 보인다. 0.9 · 1.1 정도가 기본 폭                | ScrollStackHero (Lab), magnetic-button, elastic-drag                   |
| `opacity`     | 투명도                                                           | 이동과 같은 길이로 두면 늦게 나타나 보일 수 있다 → `split-timing`          | ScrollStackHero (Lab), skeleton-pulse                                  |
| `color`       | 글자 · 배경색                                                    | "읽은 것은 흐리게" 같은 상태 표현에 쓴다                                   | ScrollStackHero (Lab)                                                  |
| `clip-path`   | 보이는 영역을 잘라 드러낸다. `overflow: hidden` 틀로도 같은 효과 | "가려져 있다가 열리듯", "선 밑에서 올라오게"                               | text-mask-reveal, scroll-expand-hero                                   |
| `blur`        | 흐림 (CSS filter · SVG `feGaussianBlur`)                         | 비싸다. 큰 영역에 애니메이션으로 걸지 말고 정적으로 깔아 둔다              | —                                                                      |
| `path-morph`  | SVG path 모양 자체가 변한다                                      | 점 개수가 같아야 보간된다                                                  | —                                                                      |
| `layout`      | 요소의 크기 · 위치가 레이아웃 변화로 바뀐다 (FLIP)               | framer-motion `layout`                                                     | —                                                                      |
| `stroke-draw` | 선이 그려지듯 나타난다 (`pathLength`)                            |                                                                            | —                                                                      |
