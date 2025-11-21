import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type PaginationState,
  type SortingState
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { useGetData } from '@/mock'
import { columns } from './columns'
import TableRowCountSelect from '../TableRowCountSelect'
import TablePagination from '../TablePagination'

/**
 * StickyTable 컴포넌트
 * - tanstack/react-table 기반 데이터 테이블 구현
 * - table head에 sticky 지원
 **/
export default function StickyTable() {
  const DATA = useGetData()

  /* 정렬 상태 */
  const [sorting, setSorting] = useState<SortingState>([])

  /* 페이지네이션 초기값 */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const table = useReactTable({
    data: DATA,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination
    }
  })

  return (
    // TODO: 가로 스크롤 안됨 (원인: overflow-x-clip)
    <>
      <div className="flex justify-end py-4">
        <TableRowCountSelect table={table} />
      </div>
      <Table>
        <TableHeader className="sticky top-16 z-1 bg-purple-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="relative">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="relative hover:*:opacity-100"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    <div
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`absolute top-0 right-0 h-full w-1 cursor-col-resize touch-none rounded-lg bg-[#27bbff] opacity-0 select-none ${header.column.getIsResizing() && 'bg-[#2eff31] opacity-100'} `}
                    />
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {/* Row 데이터가 있을 경우 */}
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      // style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            /* 데이터가 없을 경우 */
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex justify-center">
        <TablePagination table={table} />
      </div>
    </>
  )
}
