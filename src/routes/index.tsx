import { createBrowserRouter, RouterProvider } from 'react-router'
import { Home } from './pages/Home'
import { DefaultLayout } from './layouts/Default'
import { Carousel } from './pages/Carousel'
import { AreaChartGradient } from './pages/AreaChart'
import DataTableDemo from './pages/Table'

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/carousel',
        element: <Carousel />
      },
      {
        path: '/chart',
        children: [{ path: 'area-chart', element: <AreaChartGradient /> }]
      },
      {
        path: '/table',
        element: <DataTableDemo />
      }
    ]
  }
])

export const Router = () => {
  return <RouterProvider router={router} />
}
