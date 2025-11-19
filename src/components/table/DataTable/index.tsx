import { useState } from 'react'
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type PaginationState
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import Filters from '@/components/table/Filters'
import { useGetData } from '@/mock'
import { columns } from './columns'
import TablePagination from '../TablePagination'
import TablePageCount from '../TablePageCount'
import TableRowCount from '../TableRowCount'

/**
 * DataTableDemo 컴포넌트
 * - tanstack/react-table 기반 데이터 테이블 구현
 * - 정렬, 필터링, 컬럼 visibility, pagination 지원
 **/
export default function DataTable() {
  /* Mock 데이터 가져오기 */
  const DATA = useGetData()
  const [data, setData] = useState(DATA)

  /* 정렬 상태 */
  const [sorting, setSorting] = useState<SortingState>([])

  /* 컬럼 필터 상태 */
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  /* 컬럼 표시 여부 상태 */
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  /* 선택된 row 상태 */
  const [rowSelection, setRowSelection] = useState({})

  /* 페이지네이션 초기값 */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  /**
   * useReactTable()
   * - tanstack/react-table의 핵심 훅
   * - 테이블의 상태(state)와 기능(getRowModel 등)을 연결하고,
   *   테이블을 렌더링할 수 있는 "table 객체"를 반환함
   *
   * 주요 옵션 설명:
   * --------------------------------------------------------
   * data: 실제 테이블에 렌더링할 데이터 배열
   * columns: 컬럼 정의 (헤더명, 셀 렌더링 방식, accessor 등)
   *
   * onSortingChange: 정렬 상태 변경 핸들러
   * onColumnFiltersChange: 컬럼 필터 상태 변경 핸들러
   * onColumnVisibilityChange: 컬럼 표시/숨김 변경 핸들러
   * onRowSelectionChange: Row 선택 상태 변경 핸들러
   *
   * getCoreRowModel: 기본 row 모델 (data -> row 변환)
   * getPaginationRowModel: pagination 적용된 row 모델
   * getSortedRowModel: 정렬된 row 모델
   * getFilteredRowModel: 필터링된 row 모델
   *
   * state: 현재 테이블 상태를 외부에서 직접 관리하기 위해 전달
   *   - sorting: 정렬 상태
   *   - columnFilters: 필터 상태
   *   - columnVisibility: 컬럼 가시성 상태
   *   - rowSelection: row 선택 상태
   *
   * 결과적으로 table 객체를 반환하며,
   * - table.getHeaderGroups()
   * - table.getRowModel()
   * - table.previousPage(), table.nextPage()
   * 등 다양한 유틸 메서드를 제공함
   **/
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    columnResizeMode: 'onChange',

    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value
                }
              : row
          )
        )
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        {/* 컬럼 표시/숨김 Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 테이블 영역 */}
      <div className="relative rounded-md border py-3">
        {/* TODO: sticky filter & sticky table header */}
        {/* <div className="sticky top-16 z-1 mb-2 bg-white px-2"> */}
        <div className="mx-2">
          <Filters
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </div>
        {/* </div> */}
        <Table>
          {/* <TableHeader className="sticky top-25 z-10 bg-white"> */}
          <TableHeader>
            {/* 헤더 그룹 출력 */}
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="relative">
                {headerGroup.headers.map((header) => {
                  // console.log('table header size', header.getSize())
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
                    // console.log('table cell size', cell.column.getSize())
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination + 선택 상태 표시 */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <TableRowCount table={table} />
        <TablePageCount table={table} />
        <TablePagination table={table} />
      </div>
    </div>
  )
}
