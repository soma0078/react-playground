import { useState } from 'react'
import { X } from 'lucide-react'

/**
 * 헤더 sticky 동작 확인용 띠.
 * 네오브루탈리즘답게 색을 깔고 아래에 검정 2px 선을 긋는다.
 */
export const TopBanner = () => {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-nb-green relative z-30 flex h-13 items-center justify-center gap-3 border-b-2 border-black px-4 text-sm font-bold">
      <span className="border-2 border-black bg-black px-2 py-0.5 text-xs font-extrabold text-white uppercase">
        New
      </span>
      <p className="truncate">
        스크롤을 내려 헤더가 어떻게 붙는지 확인해 보세요 — sticky header
        테스트용 배너입니다.
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="배너 닫기"
        className="shadow-nb-sm absolute right-3 grid size-7 place-items-center rounded-[4px] border-2 border-black bg-white transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
      >
        <X className="size-3.5" strokeWidth={3} />
      </button>
    </div>
  )
}
