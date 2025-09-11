export type Payment = {
  id: string
  amount: number
  role: 'agent' | 'distributor' | 'user'
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    role: 'agent',
    status: 'success',
    email: 'ken99@example.com'
  },
  {
    id: '3u1reuv4',
    amount: 242,
    role: 'distributor',
    status: 'success',
    email: 'Abe45@example.com'
  },
  {
    id: 'derv1ws0',
    amount: 837,
    role: 'distributor',
    status: 'processing',
    email: 'Monserrat44@example.com'
  },
  {
    id: '5kma53ae',
    amount: 874,
    role: 'user',
    status: 'success',
    email: 'Silas22@example.com'
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    role: 'user',
    status: 'failed',
    email: 'carmella@example.com'
  }
]

export const useGetData = () => data
