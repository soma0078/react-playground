import { Outlet, ScrollRestoration } from 'react-router'
import { TheHeader } from '../../components/TheHeader'

export const DefaultLayout = () => {
  return (
    <>
      <TheHeader />
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
