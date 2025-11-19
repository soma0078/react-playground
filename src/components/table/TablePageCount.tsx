import type { TableType } from '@/types/table.types'

export default function TablePageCount<T>({ table }: TableType<T>) {
  return (
    <div className="text-muted-foreground flex-1 text-sm">
      page {table.getState().pagination.pageIndex + 1} of{' '}
      {table.getPageCount().toLocaleString()}
    </div>
  )
}
