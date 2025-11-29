import { PATHS } from '@/constants'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'

export const TheHeader = () => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY > 0) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-10 px-4 py-4 transition-all ${isSticky ? 'top-2 mx-4 rounded-lg bg-white/50 shadow-[0_-2px_10px_1px_lightgray] backdrop-blur-md' : 'w-full bg-transparent'}`}
    >
      <div className="relative w-full">
        <h1>Vite + React + TS Playground</h1>
        <nav className="absolute top-0 right-0 *:not-first:ml-2">
          <NavLink to={PATHS.HOME}>Home</NavLink>
          <NavLink to={PATHS.CAROUSEL}>Carousel</NavLink>
          <NavLink to={PATHS.AREAT_CHART}>Chart</NavLink>
          <NavLink to={PATHS.TABLE}>Table</NavLink>
          <NavLink to={PATHS.TEXT_EDITOR}>Text Editor</NavLink>
          <NavLink to={PATHS.FLOAT_BUTTON}>Float Button</NavLink>
          <NavLink to={PATHS.TEST}>Test</NavLink>
          <NavLink to={PATHS.GRADIENT}>Gradient</NavLink>
          <NavLink to={PATHS.BLOB}>Blob</NavLink>
        </nav>
      </div>
    </header>
  )
}
