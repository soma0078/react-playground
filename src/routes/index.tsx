import { createBrowserRouter, RouterProvider } from 'react-router'
import { Home } from './pages/Home'
import { DefaultLayout } from './layouts/Default'
import { Carousel } from './pages/Carousel'

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
      }
    ]
  }
])

export const Router = () => {
  return <RouterProvider router={router} />
}
