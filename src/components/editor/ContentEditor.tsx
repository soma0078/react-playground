import { useLayoutEffect, type RefObject } from 'react'
import ReactQuill from 'react-quill-new'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
  modules: Record<string, unknown>
  quillRef: RefObject<ReactQuill | null>
}

export default function ContentEditor({
  value,
  onChange,
  modules,
  quillRef
}: ContentEditorProps) {
  // 툴바 엘리먼트를 찾아서 이동시키는 Effect
  useLayoutEffect(() => {
    const editor = quillRef.current ?? null

    const quillElement = editor?.getEditor().container
    const toolbar = quillElement?.previousElementSibling
    const targetContainer = document.getElementById('toolbar-mount-point')

    if (
      toolbar &&
      toolbar.classList.contains('ql-toolbar') &&
      targetContainer
    ) {
      targetContainer.appendChild(toolbar)

      // 클린업
      return () => {
        if (quillElement && toolbar) {
          quillElement.parentNode?.insertBefore(toolbar, quillElement)
        }
      }
    }
  }, [quillRef])

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder="내용을 입력하세요..."
      className="content-editor h-60"
    />
  )
}
