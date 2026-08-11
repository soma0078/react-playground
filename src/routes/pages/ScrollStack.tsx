import { ScrollHighlightHero } from '@/components/ui/ScrollHighlightHero'
import { ScrollStackHero } from '@/components/ui/ScrollStackHero'

/**
 * ScrollStackHero 데모.
 * 문장과 카드를 1:1로 넘기면, 스크롤에 맞춰 문장이 진해지고 카드가 한 장씩 쌓인다.
 */
const ITEMS = [
  {
    image: 'https://picsum.photos/id/180/880/560',
    alt: '대시보드 화면',
    sentence:
      '흩어져 있던 지표를 한 화면에 모아, 오늘 무엇을 먼저 처리해야 하는지 바로 보이게 했습니다.'
  },
  {
    image: 'https://picsum.photos/id/48/880/560',
    alt: '목표 화면',
    sentence:
      '목표 아래 할 일과 노트를 연결해 진행 상황이 자연스럽게 따라오도록 구조를 잡았습니다.'
  },
  {
    image: 'https://picsum.photos/id/60/880/560',
    alt: '할 일 목록 화면',
    sentence:
      '할 일 목록은 상태 변경이 잦은 만큼 낙관적 업데이트로 즉시 반응하게 만들었습니다.'
  },
  {
    image: 'https://picsum.photos/id/119/880/560',
    alt: '노트 화면',
    sentence:
      '작성 중이던 노트가 사라지지 않도록 임시 저장을 붙이고 복구 흐름을 다듬었습니다.'
  }
]

const ScrollStackPage = () => {
  return (
    <div className="w-full">
      {/* A. 문장이 한 줄씩 떠오르는 방식 */}
      <ScrollStackHero items={ITEMS} />

      {/* B. 문장 전체를 깔아두고 색으로 읽는 위치를 짚어주는 방식 */}
      <ScrollHighlightHero items={ITEMS} />

      {/* 고정이 풀린 뒤 이어지는 영역이 자연스러운지 확인용 */}
      <section className="flex h-screen items-center justify-center bg-white">
        <p className="text-sm tracking-widest text-zinc-400">NEXT SECTION</p>
      </section>
    </div>
  )
}

export default ScrollStackPage
