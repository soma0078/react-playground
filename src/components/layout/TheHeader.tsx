import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Github, Menu, Search, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Logo } from './Logo'

const REPO_URL = 'https://github.com/soma0078/react-playground'

const squareButton =
  'grid size-10 place-items-center rounded-[5px] border-2 border-black bg-white shadow-nb-sm nb-press'

interface TheHeaderProps {
  onOpenSearch: () => void
  onToggleNav: () => void
  navOpen: boolean
}

export const TheHeader = ({
  onOpenSearch,
  onToggleNav,
  navOpen
}: TheHeaderProps) => {
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsStuck(window.scrollY > 0)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'bg-nb-surface sticky top-0 z-30 h-16 w-full border-b-2 border-black',
        // 붙는 순간을 그림자로 알린다 (블러 없는 하드 섀도)
        isStuck && 'shadow-[0_4px_0_0_#000]'
      )}
    >
      <div className="flex h-full items-center gap-2 px-4 lg:px-6">
        <button
          type="button"
          onClick={onToggleNav}
          aria-label="메뉴 열기"
          aria-expanded={navOpen}
          className={cn(squareButton, 'lg:hidden')}
        >
          {navOpen ? (
            <X className="size-4" strokeWidth={3} />
          ) : (
            <Menu className="size-4" strokeWidth={3} />
          )}
        </button>

        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="nb-press shadow-nb-sm flex h-10 items-center gap-2 rounded-[5px] border-2 border-black bg-white px-3 text-sm font-bold sm:w-60"
          >
            <Search className="size-4" strokeWidth={3} />
            <span className="hidden sm:inline">데모 검색</span>
            <kbd className="bg-nb-yellow ml-auto hidden rounded-[3px] border-2 border-black px-1.5 py-0.5 font-mono text-[10px] font-extrabold sm:inline">
              ⌘K
            </kbd>
          </button>

          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub 저장소"
            className={squareButton}
          >
            <Github className="size-4" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </header>
  )
}
