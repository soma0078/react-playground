import { useState, useRef } from 'react'
import ReactQuill from 'react-quill-new'

import TitleEditor from './TitleEditor'
import ContentEditor from './ContentEditor'
import { modules } from './constant'

import './ArticleEditor.css'

export default function ArticleEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const titleEditorRef = useRef<ReactQuill>(null)
  const contentEditorRef = useRef<ReactQuill>(null)

  const titleEditorModules = {
    toolbar: false,
    keyboard: {
      bindings: {
        enter: {
          key: 'Enter',
          handler: () => {
            setTimeout(() => {
              contentEditorRef.current?.getEditor().focus()
            }, 0)
            return false
          }
        }
      }
    }
  }

  return (
    <div className="-order-1 mx-auto">
      <div className="article-editor-container">
        <div id="toolbar-mount-point" />
        <div className="px-4 py-5">
          <TitleEditor
            quillRef={titleEditorRef}
            initialValue={title}
            onTitleChange={setTitle}
            modules={titleEditorModules}
          />
          <hr className="article-separator" />
          <ContentEditor
            quillRef={contentEditorRef}
            value={content}
            onChange={setContent}
            modules={modules}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-170">
        <div>
          제목:
          {titleEditorRef.current && (
            <>{titleEditorRef.current.value as string}</>
            // <div>제목: {JSON.stringify(titleEditorRef.current.value)}</div>
          )}
        </div>
        <div>
          내용:
          {contentEditorRef.current && (
            <>{contentEditorRef.current.value as string}</>
          )}
        </div>
      </div>
    </div>
  )
}
