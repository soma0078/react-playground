import { Outlet, ScrollRestoration } from 'react-router'
import { TheHeader } from '../components/TheHeader'

export const DefaultLayout = () => {
  return (
    <>
      <TheHeader />
      <main className="min-h-[1000px]">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
