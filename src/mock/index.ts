export type Payment = {
  id: string
  amount: number
  role: 'agent' | 'distributor' | 'user'
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  firstName: string
  lastName: string
  task: string
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    amount: 316,
    role: 'agent',
    status: 'success',
    email: 'ken99@example.com',
    firstName: 'Mac',
    lastName: 'Donald',
    task: 'Write Intergration Tests'
  },
  {
    id: '3u1reuv4',
    amount: 242,
    role: 'distributor',
    status: 'success',
    email: 'Abe45@example.com',
    firstName: 'Mec',
    lastName: 'Donald',
    task: 'Cleanup Database'
  },
  {
    id: 'derv1ws0',
    amount: 837,
    role: 'distributor',
    status: 'processing',
    email: 'Monserrat44@example.com',
    firstName: 'Mic',
    lastName: 'Donald',
    task: 'Update NPM Packages'
  },
  {
    id: '5kma53ae',
    amount: 874,
    role: 'user',
    status: 'success',
    email: 'Silas22@example.com',
    firstName: 'Moc',
    lastName: 'Donald',
    task: 'Optimize Database Queries'
  },
  {
    id: 'bhqecj4p',
    amount: 721,
    role: 'user',
    status: 'failed',
    email: 'carmella@example.com',
    firstName: 'Muc',
    lastName: 'Donald',
    task: 'Design User Interface'
  }
]

export const useGetData = () => data
