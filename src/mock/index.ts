export type Payment = {
  id: string
  amount: number
  role: 'agent' | 'distributor' | 'user' | 'admin' | 'manager' | 'editor'
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
  },

  {
    id: 'a1x9k2lm',
    amount: 532,
    role: 'admin',
    status: 'success',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    task: 'Prepare Monthly Report'
  },
  {
    id: 'b7p4z8qh',
    amount: 874,
    role: 'manager',
    status: 'pending',
    email: 'sophia.ray@example.com',
    firstName: 'Sophia',
    lastName: 'Ray',
    task: 'Team Coordination'
  },
  {
    id: 'c3m2t9we',
    amount: 265,
    role: 'user',
    status: 'failed',
    email: 'liam.white@example.com',
    firstName: 'Liam',
    lastName: 'White',
    task: 'Upload Documents'
  },
  {
    id: 'd9k4s1vo',
    amount: 911,
    role: 'editor',
    status: 'success',
    email: 'emily.brown@example.com',
    firstName: 'Emily',
    lastName: 'Brown',
    task: 'Edit Product Description'
  },
  {
    id: 'e6w7u3pl',
    amount: 487,
    role: 'admin',
    status: 'pending',
    email: 'noah.kim@example.com',
    firstName: 'Noah',
    lastName: 'Kim',
    task: 'System Check'
  },
  {
    id: 'f2c5o7rs',
    amount: 328,
    role: 'user',
    status: 'success',
    email: 'ava.cho@example.com',
    firstName: 'Ava',
    lastName: 'Cho',
    task: 'Submit Feedback'
  },
  {
    id: 'g8n1y4bx',
    amount: 799,
    role: 'manager',
    status: 'failed',
    email: 'ethan.park@example.com',
    firstName: 'Ethan',
    lastName: 'Park',
    task: 'Plan Sprint'
  },
  {
    id: 'h1f6q2lt',
    amount: 403,
    role: 'editor',
    status: 'success',
    email: 'mia.lee@example.com',
    firstName: 'Mia',
    lastName: 'Lee',
    task: 'Review Content'
  },
  {
    id: 'i9d5m8qw',
    amount: 954,
    role: 'user',
    status: 'pending',
    email: 'lucas.stone@example.com',
    firstName: 'Lucas',
    lastName: 'Stone',
    task: 'File Complaint'
  },
  {
    id: 'j4t7k3na',
    amount: 542,
    role: 'manager',
    status: 'success',
    email: 'amelia.han@example.com',
    firstName: 'Amelia',
    lastName: 'Han',
    task: 'Update Guidelines'
  },
  {
    id: 'k0y2v6pe',
    amount: 678,
    role: 'admin',
    status: 'failed',
    email: 'loganjun@example.com',
    firstName: 'Logan',
    lastName: 'Jun',
    task: 'Server Maintenance'
  },
  {
    id: 'l5o8r1zw',
    amount: 231,
    role: 'editor',
    status: 'pending',
    email: 'harper.jeong@example.com',
    firstName: 'Harper',
    lastName: 'Jeong',
    task: 'Update Documentation'
  },
  {
    id: 'm3s9p4ch',
    amount: 781,
    role: 'user',
    status: 'success',
    email: 'ben.morris@example.com',
    firstName: 'Ben',
    lastName: 'Morris',
    task: 'Join Event'
  },
  {
    id: 'n6q4e2tm',
    amount: 412,
    role: 'editor',
    status: 'failed',
    email: 'ella.jones@example.com',
    firstName: 'Ella',
    lastName: 'Jones',
    task: 'Fix Typos'
  },
  {
    id: 'o2b7w9vk',
    amount: 903,
    role: 'admin',
    status: 'success',
    email: 'henry.shin@example.com',
    firstName: 'Henry',
    lastName: 'Shin',
    task: 'Audit Logs'
  },
  {
    id: 'p8t1c6ry',
    amount: 354,
    role: 'user',
    status: 'pending',
    email: 'grace.young@example.com',
    firstName: 'Grace',
    lastName: 'Young',
    task: 'Request Support'
  },
  {
    id: 'q7m3z1af',
    amount: 746,
    role: 'manager',
    status: 'success',
    email: 'jackson.kang@example.com',
    firstName: 'Jackson',
    lastName: 'Kang',
    task: 'Quarterly Planning'
  },
  {
    id: 'r1e8v5qd',
    amount: 527,
    role: 'editor',
    status: 'pending',
    email: 'scarlett.ahn@example.com',
    firstName: 'Scarlett',
    lastName: 'Ahn',
    task: 'Review Application'
  },
  {
    id: 's9k0l4ut',
    amount: 889,
    role: 'admin',
    status: 'failed',
    email: 'daniel.roy@example.com',
    firstName: 'Daniel',
    lastName: 'Roy',
    task: 'Optimize Database'
  },
  {
    id: 't4p6n8we',
    amount: 618,
    role: 'user',
    status: 'success',
    email: 'zoe.larson@example.com',
    firstName: 'Zoe',
    lastName: 'Larson',
    task: 'Download Resources'
  },
  {
    id: 'u3n4d1kx',
    amount: 254,
    role: 'manager',
    status: 'pending',
    email: 'carter.im@example.com',
    firstName: 'Carter',
    lastName: 'Im',
    task: 'Prepare Presentation'
  },
  {
    id: 'v5h9y2mp',
    amount: 934,
    role: 'editor',
    status: 'success',
    email: 'victoria.kim@example.com',
    firstName: 'Victoria',
    lastName: 'Kim',
    task: 'Revise Proposal'
  },
  {
    id: 'w7f1o3cz',
    amount: 476,
    role: 'user',
    status: 'failed',
    email: 'asher.choi@example.com',
    firstName: 'Asher',
    lastName: 'Choi',
    task: 'Change Password'
  },
  {
    id: 'x9l8r5bd',
    amount: 672,
    role: 'admin',
    status: 'success',
    email: 'stella.song@example.com',
    firstName: 'Stella',
    lastName: 'Song',
    task: 'Approve Budget'
  },
  {
    id: 'y2c7m4qe',
    amount: 319,
    role: 'editor',
    status: 'pending',
    email: 'mason.lim@example.com',
    firstName: 'Mason',
    lastName: 'Lim',
    task: 'Translate Content'
  },
  {
    id: 'z4n5p1xt',
    amount: 865,
    role: 'manager',
    status: 'failed',
    email: 'hannah.park@example.com',
    firstName: 'Hannah',
    lastName: 'Park',
    task: 'Resource Allocation'
  },
  {
    id: 'aa6k3wlf',
    amount: 588,
    role: 'user',
    status: 'success',
    email: 'wyatt.ahn@example.com',
    firstName: 'Wyatt',
    lastName: 'Ahn',
    task: 'Complete Survey'
  },
  {
    id: 'bb2s9eom',
    amount: 733,
    role: 'editor',
    status: 'failed',
    email: 'lily.cho@example.com',
    firstName: 'Lily',
    lastName: 'Cho',
    task: 'Proofread Article'
  },
  {
    id: 'cc8d0tpr',
    amount: 441,
    role: 'admin',
    status: 'pending',
    email: 'julian.moon@example.com',
    firstName: 'Julian',
    lastName: 'Moon',
    task: 'Security Update'
  },
  {
    id: 'dd3f2ukn',
    amount: 902,
    role: 'manager',
    status: 'success',
    email: 'nora.hwang@example.com',
    firstName: 'Nora',
    lastName: 'Hwang',
    task: 'Strategy Meeting'
  }
]

export const useGetData = () => data
