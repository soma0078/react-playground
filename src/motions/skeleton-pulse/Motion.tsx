import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '@/lib/utils'

/**
 * 불러오는 동안 회색 뼈대가 투명도만으로 천천히 깜빡이고,
 * 다 오면 같은 칸에 겹친 실제 내용으로 바뀜. 레이아웃은 그대로임.
 */

/** 깜빡임 편도 길이 (s). 0.6 급함 · 0.9 보통 · 1.4 느긋 */
const PULSE_DURATION = 0.9
/** 가장 흐릴 때 투명도. 낮을수록 깜빡임이 셈 (0.3 이하면 거슬림) */
const PULSE_MIN_OPACITY = 0.45
/** 블록 사이 시작 간격 (s). 0이면 한꺼번에, 키우면 물결이 느려짐 */
const PULSE_STAGGER = 0.1
/** 뼈대 퇴장 길이 (s). 짧게 둬야 내용이 늦게 보이지 않음 */
const SKELETON_EXIT = 0.2
/** 내용 등장 길이 (s) */
const CONTENT_ENTER = 0.35

export interface Profile {
  name: string
  role: string
  bio: string
  avatar: string
}

export interface SkeletonPulseCardProps {
  /** null이면 불러오는 중 */
  profile: Profile | null
  className?: string
}

const Bone = ({ className, index }: { className: string; index: number }) => (
  <motion.div
    className={cn('rounded-md bg-zinc-300', className)}
    initial={{ opacity: 1 }}
    animate={{ opacity: PULSE_MIN_OPACITY }}
    transition={{
      duration: PULSE_DURATION,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'mirror',
      delay: index * PULSE_STAGGER
    }}
  />
)

export const SkeletonPulseCard = ({
  profile,
  className
}: SkeletonPulseCardProps) => (
  <div
    className={cn(
      'grid w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm',
      className
    )}
    aria-busy={profile === null}
  >
    {/* 뼈대 · 내용을 한 칸에 겹침. 교체 중 높이 고정용 */}
    <AnimatePresence initial={false}>
      {profile === null ? (
        <motion.div
          key="skeleton"
          className="col-start-1 row-start-1 flex flex-col gap-4"
          exit={{ opacity: 0, transition: { duration: SKELETON_EXIT } }}
        >
          <div className="flex items-center gap-4">
            <Bone index={0} className="size-14 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Bone index={1} className="h-5 w-2/3" />
              <Bone index={2} className="h-4 w-1/2" />
            </div>
          </div>
          <div className="flex flex-col gap-2 py-1">
            <Bone index={3} className="h-4 w-full" />
            <Bone index={4} className="h-4 w-4/5" />
          </div>
          <Bone index={5} className="h-10 w-full rounded-lg" />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          className="col-start-1 row-start-1 flex flex-col gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: CONTENT_ENTER, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar}
              alt=""
              className="size-14 shrink-0 rounded-full bg-zinc-200 object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="truncate text-lg leading-5 font-bold text-zinc-900">
                {profile.name}
              </p>
              <p className="truncate text-sm leading-4 text-zinc-500">
                {profile.role}
              </p>
            </div>
          </div>
          <p className="line-clamp-2 text-sm leading-6 text-zinc-700">
            {profile.bio}
          </p>
          <button
            type="button"
            className="h-10 w-full rounded-lg bg-zinc-900 text-sm font-bold text-white"
          >
            팔로우
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)
