import { useMediaQuery } from '@/lib/useMediaQuery'
import { useEffect } from 'react'

const DUMMY_ITEMS = Array.from({ length: 300 }, (_, i) => ({
  id: i,
  title: `Item ${i}`,
  description: `더미 데이터 ${i} — 메모리 차이를 측정하기 위한 무거운 리스트입니다.`,
  imageUrl: `https://picsum.photos/seed/${i}/200/150`
}))

function HeavyList({ label }: { label: string }) {
  return (
    <ul className="grid max-h-60 grid-cols-3 gap-2 overflow-y-auto">
      {DUMMY_ITEMS.map((item) => (
        <li key={item.id} className="rounded border p-2 text-xs">
          <img src={item.imageUrl} alt={item.title} className="w-full" />
          <p className="font-bold">
            {label} — {item.title}
          </p>
          <p className="text-gray-400">{item.description}</p>
        </li>
      ))}
    </ul>
  )
}

export default function Responsive() {
  const isDesktop = useMediaQuery(1024)

  useEffect(() => {
    console.log(
      'DOM nodes:',
      document.querySelectorAll('#section-responsive li').length
    )
  }, [isDesktop])

  return (
    <section id="section-responsive" className="space-y-6">
      <h1>Responsive Design</h1>
      <p>This is a responsive design example.</p>
      <button className={`border ${isDesktop ? 'p-8' : 'p-2'}`}>
        반응형 버튼
      </button>
      {/* ① CSS hidden: HeavyList 2개 항상 마운트 → DOM 노드 300*2 = 600개 */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400">
          CSS hidden — li 노드 항상 600개 (300 * 2)
        </p>
        <div className="hidden lg:block">
          <HeavyList label="[CSS] Desktop" />
        </div>
        <div className="lg:hidden">
          <HeavyList label="[CSS] Mobile" />
        </div>
      </div>
      {/* ② useMediaQuery: HeavyList 1개만 마운트 → DOM 노드 300개 */}
      {/* 검증 방식: Dev Tools > Memory 탭 > 📸 Take heap snapshot (①,② 각각 측정) > Statistics 에서 수치 확인
        => useMediaQuery 방식에서 img 노드 300개가 DOM에서 제거되어 70.8KB 절약 */}
      <div className="space-y-2">
        <p className="text-sm text-gray-400">useMediaQuery — li 노드 300개</p>
        {isDesktop ? (
          <HeavyList label="[useMediaQuery] Desktop" />
        ) : (
          <HeavyList label="[useMediaQuery] Mobile" />
        )}
      </div>
    </section>
  )
}
