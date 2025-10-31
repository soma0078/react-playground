import { useState, useRef } from 'react'
import ReactQuill from 'react-quill-new'

import CustomToolbar from './CustomToolbar'
import TitleEditor from './TitleEditor'
import ContentEditor from './ContentEditor'
import './ArticleEditor.css'

export default function ArticleEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const contentEditorRef = useRef<ReactQuill>(null)

  const titleEditorModules = {
    toolbar: false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          handler: () => {
            contentEditorRef.current?.getEditor().focus()
            return false
          }
        }
      }
    }
  }

  const contentEditorModules = {
    toolbar: '#toolbar'
  }

  return (
    <div className="article-editor-container">
      <CustomToolbar />
      <TitleEditor
        value={title}
        onChange={setTitle}
        modules={titleEditorModules}
      />
      <hr className="article-separator" />
      <ContentEditor
        ref={contentEditorRef}
        value={content}
        onChange={setContent}
        placeholder="내용을 입력하세요..."
        modules={contentEditorModules}
      />
    </div>
  )
}
