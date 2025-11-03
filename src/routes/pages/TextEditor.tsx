import 'react-quill-new/dist/quill.snow.css'

import QuillEditor from '@/components/editor/QuillEditor'
import ArticleEditor from '@/components/editor/ArticleEditor'

export default function TextEditorPage() {
  return (
    <div className="mt-20">
      <div className="flex flex-col gap-10">
        <QuillEditor />
        <ArticleEditor />
      </div>
    </div>
  )
}
