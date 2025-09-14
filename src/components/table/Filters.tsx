import type { ColumnFiltersState } from '@tanstack/react-table'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { useState, type ChangeEvent } from 'react'

interface FiltersProps {
  columnFilters: ColumnFiltersState
  setColumnFilters: (value: ColumnFiltersState) => void
}

export default function Filters({
  columnFilters,
  setColumnFilters
}: FiltersProps) {
  const [selectedValue, setSelectedValue] = useState('')

  const onFilterChange = (id: string, value: string) =>
    setColumnFilters(
      columnFilters
        .filter((f) => f.id !== id)
        .concat({
          id,
          value
        })
    )

  const handleSelectChange = (value: string) => {
    setColumnFilters([])
    setSelectedValue(value)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (selectedValue) {
      onFilterChange(selectedValue, e.target.value)
    }
  }

  const inputValue =
    (columnFilters.find((f) => f.id === selectedValue)?.value as string) || ''

  return (
    <div className="flex gap-2">
      <Select value={selectedValue} onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Search type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="task">Task</SelectItem>
          <SelectItem value="email">Email</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder="Search texts...."
        value={inputValue}
        onChange={handleInputChange}
        disabled={!selectedValue}
        className="max-w-sm"
      />
    </div>
  )
}
