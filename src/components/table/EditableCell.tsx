import type { CellContext } from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { Input } from '../ui/input'

export default function EditableCell<TData, TValue>({
  getValue,
  row,
  column,
  table
}: CellContext<TData, TValue>) {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  const onBlur = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(table.options.meta as any)?.updateData(row.index, column.id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value as TValue)}
      onBlur={onBlur}
    />
  )
}
