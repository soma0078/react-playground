import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: number): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(`(min-width: ${query}px)`)
      media.addEventListener('change', callback)
      return () => media.removeEventListener('change', callback)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(`(min-width: ${query}px)`).matches
  )
}
