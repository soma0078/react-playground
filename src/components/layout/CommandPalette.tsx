import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { NAV_SECTIONS } from '@/constants'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** ⌘K / Ctrl+K 로 열리는 페이지 이동 팔레트. */
export const CommandPalette = ({ open, onOpenChange }: CommandPaletteProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k') return
      if (!event.metaKey && !event.ctrlKey) return

      event.preventDefault()
      onOpenChange(!open)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="페이지 검색"
      description="이동할 데모를 검색합니다"
      className="shadow-nb-lg rounded-[5px] border-2 border-black bg-white sm:max-w-lg"
    >
      <CommandInput placeholder="데모 검색…" className="font-bold" />
      <CommandList>
        <CommandEmpty className="py-6 text-center text-sm font-bold">
          결과가 없습니다.
        </CommandEmpty>
        {NAV_SECTIONS.map((section) => (
          <CommandGroup
            key={section.title}
            heading={section.title}
            className="[&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-extrabold [&_[cmdk-group-heading]]:tracking-[0.12em] [&_[cmdk-group-heading]]:uppercase"
          >
            {section.items.map((item) => (
              <CommandItem
                key={item.path}
                value={`${section.title} ${item.label} ${item.description}`}
                onSelect={() => {
                  navigate(item.path)
                  onOpenChange(false)
                }}
                className="data-[selected=true]:bg-nb-yellow rounded-[4px] border-2 border-transparent font-bold data-[selected=true]:border-black"
              >
                <span>{item.label}</span>
                <span className="text-nb-muted truncate text-xs font-medium">
                  {item.description}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
