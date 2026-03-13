import type { ReactNode } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from './ui/dialog'
import { cn } from '@/lib/utils'

/**
 * CustomDialog component
 *
 * @param children - Dialog children
 * @param open - Dialog open state
 * @param onOpenChange - Dialog open change handler
 * @param title - Dialog title
 * @param description - Dialog description
 * @param trigger - Dialog trigger
 * @param closeText - Dialog close text
 * @param confirmText - Dialog confirm text
 * @param isVerticalFooter - Dialog footer vertical
 * @param onConfirm - Dialog confirm handler
 */

interface CustomDialogProps {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  trigger: string | ReactNode
  closeText?: string
  confirmText?: string
  footerLayout?: 'right' | 'vertical' | 'full'
  onConfirm?: () => void
}

const buttonBaseClasses = 'rounded px-4 py-2 transition-colors'

const FOOTER_LAYOUT_CLASSES: Record<
  NonNullable<CustomDialogProps['footerLayout']>,
  { footer: string; button: string }
> = {
  right: { footer: 'flex-row justify-end', button: '' },
  vertical: { footer: 'flex-col!', button: 'flex-1' },
  full: { footer: 'flex-row', button: 'flex-1' }
}

export default function CustomDialog({
  children,
  open,
  onOpenChange,
  title,
  description,
  trigger,
  closeText = '확인',
  confirmText,
  footerLayout = 'right',
  onConfirm
}: CustomDialogProps) {
  const { footer: footerVariant, button: buttonVariant } =
    FOOTER_LAYOUT_CLASSES[footerLayout]

  const footerClasses = cn('flex gap-2', footerVariant)
  const buttonClasses = cn(buttonBaseClasses, buttonVariant)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {typeof trigger === 'string' ? <button>{trigger}</button> : trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="py-4">{children}</div>

        <DialogFooter className={footerClasses}>
          <DialogClose asChild>
            <button
              className={cn(buttonClasses, 'bg-gray-100 hover:bg-gray-200')}
            >
              {closeText}
            </button>
          </DialogClose>
          {confirmText && (
            <button
              className={cn(
                buttonClasses,
                'bg-blue-500 text-white hover:bg-blue-600'
              )}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
