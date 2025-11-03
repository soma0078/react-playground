import { useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'
import { modules } from './constant'

export default function QuillEditor() {
  const [content, setContent] = useState('')
  const quillRef = useRef<ReactQuill | null>(null)

  // console.log('content', quillRef.current?.value)
  return (
    <ReactQuill
      theme="snow"
      ref={quillRef}
      modules={modules}
      value={content}
      onChange={setContent}
      placeholder="내용을 입력하세요..."
      className="mx-auto h-60 w-100"
    />
  )
}
