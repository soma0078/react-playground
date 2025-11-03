import { useEffect, type RefObject } from 'react'
import ReactQuill from 'react-quill-new'

interface TitleEditorProps {
  initialValue: string
  onTitleChange: (value: string) => void
  modules: Record<string, unknown>
  quillRef?: RefObject<ReactQuill | null>
}

export default function TitleEditor({
  initialValue,
  onTitleChange,
  modules,
  quillRef
}: TitleEditorProps) {
  useEffect(() => {
    if (quillRef?.current) {
      const quill = quillRef.current.getEditor()

      const handleChange = () => {
        onTitleChange(quill.root.innerText.trim())
      }

      quill.on('text-change', handleChange)

      return () => {
        quill.off('text-change', handleChange)
      }
    }
  }, [quillRef, onTitleChange])

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      defaultValue={initialValue}
      modules={modules}
      placeholder="제목을 입력하세요..."
      className="title-editor"
    />
  )
}
