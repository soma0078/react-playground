import { MagneticButton } from './Motion'

export default function MagneticButtonDemo() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center gap-16 bg-[#f5f3ee]">
      <MagneticButton className="rounded-full bg-zinc-900 px-10 py-5 text-lg font-bold text-white">
        시작하기
      </MagneticButton>
      <MagneticButton className="grid size-28 place-items-center rounded-full border-2 border-zinc-900 text-sm font-bold text-zinc-900">
        더 보기 →
      </MagneticButton>
    </div>
  )
}
