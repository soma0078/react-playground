import { Outlet, ScrollRestoration } from 'react-router'
import { TheHeader } from '../../components/TheHeader'
import TopBanner from '@/components/TopBanner'

export const DefaultLayout = () => {
  return (
    <>
      <TopBanner />
      <TheHeader />
      <main className="relative z-1 min-h-screen">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
