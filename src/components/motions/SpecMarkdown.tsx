import type { ReactNode } from 'react'

/**
 * spec.md 본문에 쓰는 만큼만 그리는 마크다운 렌더러.
 * 문단, `- ` 목록, `> ` 인용, 인라인 `code` · **굵게** 만 지원한다.
 * 의존성을 늘리지 않으려고 직접 둔다. 더 필요해지면 그때 라이브러리로 바꾼다.
 */

const renderInline = (text: string): ReactNode[] =>
  text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="bg-nb-bg rounded-[3px] border border-black box-decoration-clone px-1 py-px font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-extrabold">
          {part.slice(2, -2)}
        </strong>
      )
    }

    return part
  })

export const SpecMarkdown = ({ source }: { source: string }) => {
  const blocks = source.split(/\r?\n\s*\r?\n/).filter((block) => block.trim())

  return (
    <div className="space-y-3 text-sm leading-relaxed font-medium break-keep">
      {blocks.map((block, index) => {
        const lines = block.split(/\r?\n/)

        if (lines.every((line) => line.startsWith('- '))) {
          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          )
        }

        if (lines.every((line) => line.startsWith('>'))) {
          return (
            <blockquote key={index} className="border-l-4 border-black pl-3">
              {renderInline(
                lines.map((line) => line.replace(/^>\s?/, '')).join(' ')
              )}
            </blockquote>
          )
        }

        return <p key={index}>{renderInline(lines.join(' '))}</p>
      })}
    </div>
  )
}
