import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { Button } from '../ui/button'
import type { TableType } from '@/types/table.types'

// 페이지네이션 버튼
export default function TablePagination<T>({ table }: TableType<T>) {
  return (
    <div className="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="go to first page"
      >
        <ChevronsLeft />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="go to previous page"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="go to next page"
      >
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
        aria-label="go to last page"
      >
        <ChevronsRight />
      </Button>
    </div>
  )
}
