import { useRef, useState } from 'react'
import ReactQuill from 'react-quill-new'

export default function QuillEditor() {
  const [content, setContent] = useState('')
  const quillRef = useRef<ReactQuill | null>(null)

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' }
      ],
      [{ color: [] }, { background: [] }],
      ['link', 'image'],
      ['clean']
    ]
  }

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
