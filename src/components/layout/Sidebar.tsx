import { Link, useLocation } from 'react-router'

import { findNavEntry, NAV_SECTIONS } from '@/constants'
import { cn } from '@/lib/utils'
import { ACCENT_BG } from './accent'

const Badge = ({ kind }: { kind: 'new' | 'wip' }) => (
  <span
    className={cn(
      'rounded-[3px] border-2 border-black px-1 text-[10px] leading-4 font-extrabold uppercase',
      kind === 'new' ? 'bg-nb-orange text-black' : 'bg-white text-black'
    )}
  >
    {kind}
  </span>
)

/**
 * 카테고리 사이드바.
 * 활성 항목은 섹션 색 + 검정 테두리 + 오프셋 그림자로 "붙어 있는 스티커"처럼 둔다.
 * 쿼리로 구분되는 탭 링크도 있어서 활성 판정은 findNavEntry 에 맡긴다.
 */
export const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { pathname, search } = useLocation()
  const { item: activeItem } = findNavEntry(pathname, search)

  return (
    <nav className="flex flex-col gap-7 px-4 py-6 text-sm">
      {NAV_SECTIONS.map((section) => (
        <section key={section.title}>
          <h2 className="mb-3 inline-block border-2 border-black bg-black px-2 py-0.5 text-[11px] font-extrabold tracking-[0.12em] text-white uppercase">
            {section.title}
          </h2>

          <ul className="flex flex-col gap-1.5">
            {section.items.map((item) => {
              const isActive = item === activeItem

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-[5px] border-2 px-3 py-1.5 font-bold transition-all',
                      isActive
                        ? cn(
                            'shadow-nb-sm border-black',
                            ACCENT_BG[section.accent]
                          )
                        : 'hover:shadow-nb-sm border-transparent hover:border-black hover:bg-white'
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge && <Badge kind={item.badge} />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </nav>
  )
}
