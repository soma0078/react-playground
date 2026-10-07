import { ElasticDrag } from './Motion'

export default function ElasticDragDemo() {
  return (
    <div className="grid h-full w-full place-items-center bg-[#f5f3ee]">
      <ElasticDrag className="w-64 rounded-[1.5rem] bg-zinc-900 p-6 text-white select-none">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
          Drag me
        </p>
        <p className="mt-10 text-2xl leading-snug font-extrabold">
          잡아서 아무 방향으로 당겨 보세요
        </p>
      </ElasticDrag>
    </div>
  )
}
