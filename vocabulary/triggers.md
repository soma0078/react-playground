# Triggers

모션이 **언제, 무엇에 반응해** 움직이는가. `spec.md`의 `triggers:` 에 이 표의 키를 쓴다.

| 키                 | 뜻                                                                               | 이렇게 말한다                                           | 쓰인 곳                                                           |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| `scroll-linked`    | 스크롤 진행도에 값을 그대로 묶는다. 스크롤을 멈추면 모션도 그 자리에서 멈춘다    | "스크롤한 만큼 따라 움직이게", "스크롤에 직접 묶어서"   | —                                                                 |
| `scroll-triggered` | 스크롤을 구간(차례)으로 끊고, 구간이 바뀌면 모션이 자기 시간으로 끝까지 재생된다 | "스크롤을 차례로 끊어서", "차례가 바뀔 때마다 재생되게" | [ScrollStackHero (Lab)](../src/components/ui/ScrollStackHero.tsx) |
| `sticky-pin`       | 화면을 고정해 두고 바깥 래퍼의 남은 높이를 스크롤 구간으로 쓴다                  | "sticky로 고정하고 그 동안 스크롤로 진행"               | [ScrollStackHero (Lab)](../src/components/ui/ScrollStackHero.tsx) |
| `in-view`          | 요소가 화면에 들어올 때 재생                                                     | "보일 때 나타나게", "화면에 들어오면"                   | [text-mask-reveal](../src/motions/text-mask-reveal/spec.md)       |
| `ambient-loop`     | 입력 없이 계속 재생되는 배경 연출                                                | "가만히 둬도 계속", "배경이 은은하게"                   | —                                                                 |
| `cursor-follow`    | 커서 위치를 따라가거나 커서 쪽으로 반응                                          | "커서 쪽으로 끌려오게", "마우스를 따라오게"             | [magnetic-button](../src/motions/magnetic-button/spec.md)         |
| `hover`            | 포인터가 올라가 있는 동안의 상태 변화                                            | "올리면", "가까이 대면"                                 | [magnetic-button](../src/motions/magnetic-button/spec.md)         |
| `press`            | 누르는 순간의 반응                                                               | "누를 때 눌리는 느낌"                                   | [magnetic-button](../src/motions/magnetic-button/spec.md)         |
| `drag`             | 끌기와 놓은 뒤의 관성 · 복귀                                                     | "잡아서 끌면", "놓으면 제자리로"                        | [elastic-drag](../src/motions/elastic-drag/spec.md)               |
| `load`             | 페이지 · 컴포넌트가 처음 나타날 때 한 번                                         | "처음 들어오면", "진입 시"                              | —                                                                 |

## 헷갈리기 쉬운 것

- **scroll-linked vs scroll-triggered**: "스크롤에 따라"라고만 말하면 AI는 대개 scroll-linked로 만든다.
  멈췄을 때 중간 상태로 서 있어도 되는지가 기준이다. 안 되면 scroll-triggered라고 명시한다.
