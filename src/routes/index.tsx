import { createBrowserRouter, RouterProvider } from 'react-router'

import { PATHS } from '@/constants'

import {
  AreaChartGradient,
  Carousel,
  FloatButton,
  Home,
  DataTableDemo,
  TextEditor,
  Gradient,
  Blobs,
  Canvas
} from './pages'
import { DefaultLayout } from './layouts/Default'
import TestPage from './pages/Test'

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
      },
      {
        path: PATHS.FLOAT_BUTTON,
        element: <FloatButton />
      },
      {
        path: PATHS.TEST,
        element: <TestPage />
      },
      {
        path: PATHS.GRADIENT,
        element: <Gradient />
      },
      {
        path: PATHS.BLOB,
        element: <Blobs />
      },
      {
        path: PATHS.CANVAS,
        element: <Canvas />
      }
    ]
  }
])

export const Router = () => {
  return <RouterProvider router={router} />
}
