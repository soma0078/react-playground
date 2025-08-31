import { readdirSync, writeFileSync } from 'fs'
import { join, parse } from 'path'

const ICONS_DIR = join(process.cwd(), 'src/assets/icons')
const OUT_FILE = join(ICONS_DIR, 'index.ts')

// kebab-case → PascalCase 변환 함수
const toPascalCase = (str: string) =>
  str
    .split(/[-_]/) // - 또는 _ 기준 분리
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')

// icons 폴더 안에 있는 svg 파일 읽기
const files = readdirSync(ICONS_DIR).filter((f) => f.endsWith('.svg'))

// export 구문 생성
const exports = files
  .map((file) => {
    const { name } = parse(file)
    // 파일명 → PascalCase + Icon suffix
    const componentName = toPascalCase(name) + 'Icon'
    return `export { default as ${componentName} } from './${file}?react'`
  })
  .join('\n')

// index.ts 파일 쓰기
writeFileSync(OUT_FILE, exports + '\n')

console.log(`✅ icons index.ts generated with ${files.length} icons.`)
