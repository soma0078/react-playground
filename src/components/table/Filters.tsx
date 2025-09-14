import type { ColumnFiltersState } from '@tanstack/react-table'
import { Input } from '../ui/input'

interface FiltersProps {
  columnFilters: ColumnFiltersState
  setColumnFilters: (value: ColumnFiltersState) => void
}

export default function Filters({
  columnFilters,
  setColumnFilters
}: FiltersProps) {
  const taskName = (columnFilters.find((f) => f.id === 'task')?.value ||
    '') as string

  const onFilterChange = (id: string, value: string) =>
    setColumnFilters(
      columnFilters
        .filter((f) => f.id !== id)
        .concat({
          id,
          value
        })
    )

  return (
    <Input
      placeholder="Filter tasks..."
      value={taskName}
      onChange={(e) => onFilterChange('task', e.target.value)}
      className="max-w-sm"
    />
  )
}
