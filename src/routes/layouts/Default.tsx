import { useEffect, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router'
import { X } from 'lucide-react'

import { ACCENT_BG } from '@/components/layout/accent'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Logo } from '@/components/layout/Logo'
import { SidebarNav } from '@/components/layout/Sidebar'
import { TheHeader } from '@/components/layout/TheHeader'
import { TopBanner } from '@/components/layout/TopBanner'
import { findNavEntry } from '@/constants'
import { cn } from '@/lib/utils'

/**
 * Neobrutalism 문서 셸.
 * 상단 고정 헤더 + 좌측 카테고리 사이드바 + 우측 본문.
 */
export const DefaultLayout = () => {
  const { pathname, search } = useLocation()
  const { section, item } = findNavEntry(pathname, search)

  const [navOpen, setNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // 경로가 바뀌면 모바일 드로어는 닫는다
  useEffect(() => setNavOpen(false), [pathname, search])

  const isHome = pathname === '/'
  const showHeading = !isHome && !item?.fullBleed

  return (
    <div className="bg-nb-bg text-foreground min-h-dvh">
      <TopBanner />
      <TheHeader
        navOpen={navOpen}
        onToggleNav={() => setNavOpen((prev) => !prev)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <div className="mx-auto flex w-full max-w-[1600px]">
        {/* 데스크톱 사이드바 */}
        <aside className="bg-nb-surface sticky top-16 hidden h-[calc(100dvh-4rem)] w-64 shrink-0 overflow-y-auto border-r-2 border-black lg:block">
          <SidebarNav />
        </aside>

        {/* 모바일 드로어 */}
        <div
          className={cn(
            'fixed inset-0 z-40 lg:hidden',
            navOpen ? 'pointer-events-auto' : 'pointer-events-none'
          )}
          aria-hidden={!navOpen}
        >
          <div
            onClick={() => setNavOpen(false)}
            className={cn(
              'absolute inset-0 bg-black/40 transition-opacity duration-200',
              navOpen ? 'opacity-100' : 'opacity-0'
            )}
          />
          <nav
            className={cn(
              'bg-nb-surface absolute top-0 left-0 flex h-full w-72 flex-col overflow-y-auto border-r-2 border-black transition-transform duration-200',
              navOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b-2 border-black px-3">
              <Logo />
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                aria-label="메뉴 닫기"
                className="nb-press shadow-nb-sm grid size-9 place-items-center rounded-[5px] border-2 border-black bg-white"
              >
                <X className="size-4" strokeWidth={3} />
              </button>
            </div>
            <SidebarNav onNavigate={() => setNavOpen(false)} />
          </nav>
        </div>

        <main className="relative z-1 min-w-0 flex-1">
          {showHeading && (
            <div className="bg-nb-bg border-b-2 border-black px-6 pt-10 pb-8 lg:px-10">
              {section && (
                <span
                  className={cn(
                    'shadow-nb-sm inline-block border-2 border-black px-2 py-0.5 text-[11px] font-extrabold tracking-[0.12em] uppercase',
                    ACCENT_BG[section.accent]
                  )}
                >
                  {section.title}
                </span>
              )}
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight uppercase">
                {item?.label}
              </h1>
              {item?.description && (
                <p className="text-nb-muted mt-2 max-w-2xl text-sm font-medium break-keep">
                  {item.description}
                </p>
              )}
            </div>
          )}

          <div
            className={cn(!item?.fullBleed && !isHome && 'px-6 py-8 lg:px-10')}
          >
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
      <ScrollRestoration />
    </div>
  )
}
