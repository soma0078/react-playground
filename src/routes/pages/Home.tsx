import CustomDialog from '@/components/CustomDialog'
import { useDialog } from '@/hooks/useDialog'

export default function Home() {
  const { open, setOpen } = useDialog()

  return (
    <div>
      Home page
      <CustomDialog
        open={open}
        onOpenChange={setOpen}
        title="Custom Dialog"
        description="Custom Dialog Description"
        trigger="Open Dialog"
        closeText="닫기"
        confirmText="확인"
      >
        <p>Custom Dialog Content</p>
      </CustomDialog>
    </div>
  )
}
