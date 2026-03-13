import { useState } from 'react'

export const useDialog = () => {
  const [open, setOpen] = useState(false)

  const openDialog = () => {
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
  }

  return {
    open,
    setOpen,
    openDialog,
    closeDialog
  }
}
