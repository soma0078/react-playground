import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'

import { SkeletonPulseCard, type Profile } from './Motion'

/** 가짜 로딩 시간 (ms) */
const LOAD_MS = 2400

const PROFILE: Profile = {
  name: '김하늘',
  role: '프로덕트 디자이너 · 서울',
  bio: '움직임으로 인터페이스의 상태를 설명하는 일을 합니다. 작은 전환 하나가 화면을 얼마나 덜 낯설게 만드는지에 관심이 많아요.',
  avatar:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop'
}

export default function SkeletonPulseDemo() {
  const [round, setRound] = useState(0)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setProfile(PROFILE), LOAD_MS)
    return () => clearTimeout(timer)
  }, [round])

  const reload = () => {
    setProfile(null)
    setRound((value) => value + 1)
  }

  return (
    <div className="relative grid h-full w-full place-items-center bg-[#f5f3ee] px-8">
      <SkeletonPulseCard profile={profile} />
      <button
        type="button"
        onClick={reload}
        className="nb-press shadow-nb-sm absolute right-4 bottom-4 flex items-center gap-1.5 rounded-[5px] border-2 border-black bg-white px-3 py-1.5 text-xs font-extrabold uppercase"
      >
        <RotateCcw className="size-3.5" strokeWidth={3} />
        다시 불러오기
      </button>
    </div>
  )
}
