import { forwardRef } from 'react'
import ReactQuill from 'react-quill-new'

interface ContentEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules: any
}

const ContentEditor = forwardRef<ReactQuill, ContentEditorProps>(
  ({ value, onChange, placeholder, modules }, ref) => {
    return (
      <ReactQuill
        ref={ref}
        theme="snow"
        modules={modules}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="content-editor"
      />
    )
  }
)

export default ContentEditor
