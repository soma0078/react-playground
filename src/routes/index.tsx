import { createBrowserRouter, RouterProvider } from 'react-router'
import { Home } from './pages/Home'
import { DefaultLayout } from './layouts/Default'

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  }
])

export const Router = () => {
  return <RouterProvider router={router} />
}
