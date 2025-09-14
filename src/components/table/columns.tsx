import type { Payment } from '@/mock'
import { createColumnHelper } from '@tanstack/react-table'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import { ArrowUpDown } from 'lucide-react'
import EditableCell from './EditableCell'

const columnHelper = createColumnHelper<Payment>()

export const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 30
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('status')}</div>
    ),
    size: 50
  }),
  columnHelper.accessor('email', {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    size: 50
  }),
  columnHelper.accessor('amount', {
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    }
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    // cell: ({ row }) => <div>{row.getValue('firstName')}</div>
    cell: ({ row }) => row.getValue('firstName')
  }),
  // columnHelper.group({
  //   header: 'Name',
  //   columns: [
  //     columnHelper.accessor('firstName', {
  //       header: 'First Name',
  //       cell: (row) => row.getValue()
  //     }),
  //     columnHelper.accessor((row) => row.lastName, {
  //       header: 'Last Name'
  //     })
  //   ]
  // })
  columnHelper.accessor('task', {
    header: 'Task',
    cell: EditableCell
  })
]
