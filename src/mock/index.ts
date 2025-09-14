export type Payment = {
  id: string
  amount: number
  role: 'agent' | 'distributor' | 'user'
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  firstName: string
  lastName: string
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    role: 'agent',
    status: 'success',
    email: 'ken99@example.com',
    firstName: 'Mac',
    lastName: 'Donald'
  },
  {
    id: '3u1reuv4',
    amount: 242,
    role: 'distributor',
    status: 'success',
    email: 'Abe45@example.com',
    firstName: 'Mec',
    lastName: 'Donald'
  },
  {
    id: 'derv1ws0',
    amount: 837,
    role: 'distributor',
    status: 'processing',
    email: 'Monserrat44@example.com',
    firstName: 'Mic',
    lastName: 'Donald'
  },
  {
    id: '5kma53ae',
    amount: 874,
    role: 'user',
    status: 'success',
    email: 'Silas22@example.com',
    firstName: 'Moc',
    lastName: 'Donald'
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    role: 'user',
    status: 'failed',
    email: 'carmella@example.com',
    firstName: 'Muc',
    lastName: 'Donald'
  }
]

export const useGetData = () => data
