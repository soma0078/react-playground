import { ScrollExpandHero } from './Motion'

export default function ScrollExpandHeroDemo() {
  return (
    <div className="bg-[#f5f3ee]">
      <ScrollExpandHero
        image="https://picsum.photos/id/1018/1920/1080"
        alt="산과 호수"
      >
        <h2 className="text-center text-5xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-7xl">
          Scroll to Expand
        </h2>
      </ScrollExpandHero>

      {/* 고정 해제 후 이어짐 확인용 */}
      <section className="grid h-[60vh] place-items-center">
        <p className="text-sm tracking-widest text-zinc-400">NEXT SECTION</p>
      </section>
    </div>
  )
}
