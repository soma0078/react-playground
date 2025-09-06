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
      className={`sticky top-0 z-10 px-4 py-4 transition-all ${isSticky ? 'top-2 mx-4 rounded-full bg-neutral-700/90' : 'w-full bg-transparent'}`}
    >
      <div className="relative w-full">
        <h1>Vite + React + TS Playground</h1>
        <nav className="absolute top-0 right-0 *:not-first:ml-2">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/carousel">Carousel</NavLink>
          <NavLink to="/chart/area-chart">Chart</NavLink>
        </nav>
      </div>
    </header>
  )
}
