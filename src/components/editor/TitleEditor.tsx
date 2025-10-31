import ReactQuill from 'react-quill-new'

interface TitleEditorProps {
  value: string
  onChange: (value: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules: any
}

export default function TitleEditor({
  value,
  onChange,
  modules
}: TitleEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      placeholder="제목을 입력하세요..."
      className="title-editor"
    />
  )
}
