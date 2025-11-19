import { createColumnHelper } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'

import type { Payment } from '@/mock'

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

    size: 50
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 50
  }),
  columnHelper.accessor('amount', {
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    }
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: ({ row }) => row.getValue('firstName')
  }),
  columnHelper.accessor('task', {
    header: 'Task'
  })
]
