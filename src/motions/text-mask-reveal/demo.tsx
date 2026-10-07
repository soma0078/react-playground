import { useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { TextMaskReveal } from './Motion'

export default function TextMaskRevealDemo() {
  const [round, setRound] = useState(0)

  return (
    <div className="relative grid h-full w-full place-items-center bg-[#f5f3ee] px-8">
      <TextMaskReveal
        key={round}
        lines={['움직임을 말로', '기록하고,', 'AI가 만든다.']}
        className="text-5xl leading-[1.1] font-extrabold tracking-tight text-zinc-900 md:text-7xl"
      />
      <button
        type="button"
        onClick={() => setRound((value) => value + 1)}
        className="nb-press shadow-nb-sm absolute right-4 bottom-4 flex items-center gap-1.5 rounded-[5px] border-2 border-black bg-white px-3 py-1.5 text-xs font-extrabold uppercase"
      >
        <RotateCcw className="size-3.5" strokeWidth={3} />
        다시 재생
      </button>
    </div>
  )
}
