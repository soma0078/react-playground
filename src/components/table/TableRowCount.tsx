import type { TableType } from '@/types/table.types'

// 선택된 row 상태 표시
export default function TableRowCount<T>({ table }: TableType<T>) {
  return (
    <div className="text-muted-foreground flex-1 text-sm">
      {table.getFilteredSelectedRowModel().rows.length} of{' '}
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
  )
}
