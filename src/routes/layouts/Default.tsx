import { Outlet, ScrollRestoration } from 'react-router'
import { TheHeader } from '../../components/TheHeader'

export const DefaultLayout = () => {
  return (
    <>
      <TheHeader />
      <main className="relative z-1">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
