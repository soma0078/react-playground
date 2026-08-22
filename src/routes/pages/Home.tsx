import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'

import CustomDialog from '@/components/CustomDialog'
import { ACCENT_BG } from '@/components/layout/accent'
import { NAV_SECTIONS, PATHS } from '@/constants'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'

export default function Home() {
  const { open, setOpen } = useDialog()

  const sections = NAV_SECTIONS.filter(
    (section) => section.title !== 'Get Started'
  )

  return (
    <div className="pb-24">
      {/* 히어로 — 블록 하나에 제목과 버튼만 */}
      <section className="nb-grid border-b-2 border-black px-6 py-14 lg:px-10">
        <div className="bg-nb-surface shadow-nb-lg max-w-3xl border-2 border-black p-7 lg:p-9">
          <span className="bg-nb-yellow shadow-nb-sm inline-block border-2 border-black px-2 py-0.5 text-[11px] font-extrabold tracking-[0.12em] uppercase">
            React 19 · Vite · Tailwind v4
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight break-keep uppercase sm:text-5xl">
            애니메이션과 레이아웃 실험을 모아 둔 플레이그라운드
          </h1>
          <p className="text-nb-muted mt-4 max-w-xl text-sm font-medium break-keep sm:text-base">
            왼쪽 사이드바에서 데모를 고르거나 <Kbd>⌘</Kbd> <Kbd>K</Kbd> 로 바로
            검색하세요.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to={PATHS.SCROLL_STACK}
              className="nb-press bg-nb-blue shadow-nb rounded-[5px] border-2 border-black px-5 py-2.5 text-sm font-extrabold uppercase"
            >
              최신 데모 보기
            </Link>
            <a
              href="https://neobrutalism.dev"
              target="_blank"
              rel="noreferrer"
              className="nb-press shadow-nb flex items-center gap-1.5 rounded-[5px] border-2 border-black bg-white px-5 py-2.5 text-sm font-extrabold uppercase"
            >
              레퍼런스
              <ArrowUpRight className="size-4" strokeWidth={3} />
            </a>
          </div>
        </div>
      </section>

      {/* 카테고리별 데모 목록 */}
      <div className="space-y-10 px-6 pt-12 lg:px-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2
              className={cn(
                'shadow-nb-sm mb-4 inline-block border-2 border-black px-2.5 py-1 text-xs font-extrabold tracking-[0.12em] uppercase',
                ACCENT_BG[section.accent]
              )}
            >
              {section.title}
            </h2>

            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {section.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="nb-press bg-nb-surface shadow-nb flex h-full flex-col rounded-[5px] border-2 border-black p-5"
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-base font-extrabold uppercase">
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          'grid size-7 shrink-0 place-items-center rounded-[4px] border-2 border-black',
                          ACCENT_BG[section.accent]
                        )}
                      >
                        <ArrowUpRight className="size-4" strokeWidth={3} />
                      </span>
                    </span>
                    <span className="text-nb-muted mt-2 text-xs leading-relaxed font-medium break-keep">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {/* 라우트가 따로 없는 다이얼로그 데모 */}
        <section>
          <h2 className="bg-nb-yellow shadow-nb-sm mb-4 inline-block border-2 border-black px-2.5 py-1 text-xs font-extrabold tracking-[0.12em] uppercase">
            Overlay
          </h2>
          <CustomDialog
            open={open}
            onOpenChange={setOpen}
            title="Custom Dialog"
            description="Radix Dialog 를 감싼 공용 다이얼로그"
            trigger={
              <button className="nb-press shadow-nb rounded-[5px] border-2 border-black bg-white px-5 py-2.5 text-sm font-extrabold uppercase">
                다이얼로그 열기
              </button>
            }
            closeText="닫기"
            confirmText="확인"
          >
            <p className="text-nb-muted text-sm font-medium">
              footerLayout 으로 버튼 배치를 바꿀 수 있습니다.
            </p>
          </CustomDialog>
        </section>
      </div>
    </div>
  )
}

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="bg-nb-yellow rounded-[3px] border-2 border-black px-1.5 py-0.5 font-mono text-[11px] font-extrabold text-black">
    {children}
  </kbd>
)
