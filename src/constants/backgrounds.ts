export type BackgroundTabId = 'css-canvas' | 'svg-motion' | 'canvas-2d'

export interface BackgroundTab {
  id: BackgroundTabId
  /** 무엇으로 만들었는지가 바로 보이도록 도구 조합을 그대로 이름으로 쓴다 */
  label: string
  /** 그리는 방식의 성격 — 탭끼리 비교하는 축 */
  kind: string
  summary: string
  /** 비교용 메모 */
  notes: string[]
}

/**
 * 같은 배경 화면을 도구만 바꿔 만들어 본 목록.
 * 사이드바 항목, 페이지 탭, 본문 헤더가 모두 이 정의를 쓴다.
 */
export const BACKGROUND_TABS: BackgroundTab[] = [
  {
    id: 'css-canvas',
    label: 'CSS + Canvas',
    kind: '혼합',
    summary:
      'CSS 그라디언트를 바탕에 깔고 그 위에 캔버스 블롭과 SVG 노이즈를 얹은 버전.',
    notes: ['배경은 CSS', '블롭은 canvas blur', '노이즈 SVG 오버레이']
  },
  {
    id: 'svg-motion',
    label: 'SVG + Motion',
    kind: '선언형 DOM',
    summary:
      'SVG path 를 매 프레임 다시 계산해 블롭을 움직이는 버전. 마우스에 반응한다.',
    notes: ['SVG path 애니메이션', 'framer-motion spring', '블롭이 DOM 노드']
  },
  {
    id: 'canvas-2d',
    label: 'Canvas 2D',
    kind: '명령형 그리기',
    summary:
      '같은 화면을 캔버스 2D 로만 그린 버전. 그라디언트·블러·마우스 반응을 직접 계산한다.',
    notes: ['전부 직접 그리기', 'requestAnimationFrame', 'DOM 노드 1개']
  }
]
