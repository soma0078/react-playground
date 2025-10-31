import { createBrowserRouter, RouterProvider } from 'react-router'

import { DefaultLayout } from './layouts/Default'
import { Home } from './pages/Home'
import { Carousel } from './pages/Carousel'
import { AreaChartGradient } from './pages/AreaChart'
import DataTableDemo from './pages/Table'
import TextEditor from './pages/TextEditor'
import { PATHS } from '@/constants'

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <Home />
      },
      {
        path: PATHS.CAROUSEL,
        element: <Carousel />
      },
      {
        path: PATHS.CHART,
        children: [{ path: PATHS.AREAT_CHART, element: <AreaChartGradient /> }]
      },
      {
        path: PATHS.TABLE,
        element: <DataTableDemo />
      },
      {
        path: PATHS.TEXT_EDITOR,
        element: <TextEditor />
      }
    ]
  }
])

export const Router = () => {
  return <RouterProvider router={router} />
}
