import type { NavAccent } from '@/constants'

/** 동적 클래스 조합은 Tailwind가 못 잡으므로 색 → 클래스는 표로 고정한다. */
export const ACCENT_BG: Record<NavAccent, string> = {
  yellow: 'bg-nb-yellow',
  blue: 'bg-nb-blue',
  green: 'bg-nb-green',
  purple: 'bg-nb-purple',
  orange: 'bg-nb-orange'
}

export const ACCENT_HOVER_BG: Record<NavAccent, string> = {
  yellow: 'hover:bg-nb-yellow',
  blue: 'hover:bg-nb-blue',
  green: 'hover:bg-nb-green',
  purple: 'hover:bg-nb-purple',
  orange: 'hover:bg-nb-orange'
}
