import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

import { PATHS } from '@/constants'

import {
  AreaChartGradient,
  Carousel,
  FloatButton,
  Home,
  DataTableDemo,
  TextEditor,
  Backgrounds,
  Responsive,
  ScrollStack,
  MotionPage
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
        path: PATHS.BACKGROUNDS,
        element: <Backgrounds />
      },
      // 예전 개별 경로는 합쳐진 탭으로 보낸다
      {
        path: PATHS.GRADIENT,
        element: <Navigate to={`${PATHS.BACKGROUNDS}?tab=css-canvas`} replace />
      },
      {
        path: PATHS.BLOB,
        element: <Navigate to={`${PATHS.BACKGROUNDS}?tab=svg-motion`} replace />
      },
      {
        path: PATHS.CANVAS,
        element: <Navigate to={`${PATHS.BACKGROUNDS}?tab=canvas-2d`} replace />
      },
      {
        path: PATHS.RESPONSIVE,
        element: <Responsive />
      },
      {
        path: PATHS.SCROLL_STACK,
        element: <ScrollStack />
      },
      {
        path: `${PATHS.MOTIONS}/:slug`,
        element: <MotionPage />
      }
    ]
  }
])

export const Router = () => {
  return <RouterProvider router={router} />
}
