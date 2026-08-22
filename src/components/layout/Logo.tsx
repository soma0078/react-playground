import { cn } from '@/lib/utils'

/** 노란 타일 + 굵은 워드마크. 테두리 2px, 오프셋 그림자는 필수. */
export const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="bg-nb-yellow shadow-nb-sm grid size-9 place-items-center rounded-[5px] border-2 border-black">
        <span className="size-3 rounded-[2px] border-2 border-black bg-white" />
      </span>
      <span className="text-base leading-none font-extrabold tracking-tight whitespace-nowrap uppercase">
        React <span className="bg-nb-purple px-1 py-0.5">Playground</span>
      </span>
    </span>
  )
}
