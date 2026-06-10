import { PATHS } from '@/constants'
import { useEffect, useState } from 'react'
import { NavLink as RouterNavLink } from 'react-router'

const NavLink = ({
  to,
  children
}: {
  to: string
  children: React.ReactNode
}) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `rounded p-1 transition-colors ${
          isActive
            ? 'bg-gray-400 text-white!'
            : 'text-gray-600 hover:bg-gray-200'
        }`
      }
    >
      {children}
    </RouterNavLink>
  )
}

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
          {Object.entries(PATHS).map(([key, value]) => (
            <NavLink key={key} to={value}>
              {key}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
