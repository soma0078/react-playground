import { MOTIONS } from '@/motions/registry'

import { BACKGROUND_TABS } from './backgrounds'
import { PATHS } from './paths'

export interface NavItem {
  /** 사이드바에 보이는 이름 */
  label: string
  path: string
  /** 목록/카드에서 한 줄로 붙는 설명 */
  description: string
  badge?: 'new' | 'wip'
  /** 데모가 화면 전체를 쓰는 경우 (배경/스크롤 실험). 제목 블록과 패딩을 생략한다. */
  fullBleed?: boolean
}

/** 섹션마다 배정하는 플랫 컬러. 사이드바·칩·카드가 같은 색을 공유한다. */
export type NavAccent = 'yellow' | 'blue' | 'green' | 'purple' | 'orange'

export interface NavSection {
  title: string
  accent: NavAccent
  items: NavItem[]
}

/**
 * reactbits.dev 사이드바처럼 카테고리 → 컴포넌트 순으로 묶는다.
 * 라우터와 홈 카드 그리드가 이 한 곳을 함께 참조한다.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Get Started',
    accent: 'yellow',
    items: [
      {
        label: 'Introduction',
        path: PATHS.HOME,
        description: '이 플레이그라운드에 무엇이 들어 있는지'
      }
    ]
  },
  {
    // src/motions/* 에서 자동으로 채워진다. AI가 제안한 항목은 new 배지로 구분한다
    title: 'Motions',
    accent: 'orange',
    items: MOTIONS.map((motion) => ({
      label: motion.title,
      path: `${PATHS.MOTIONS}/${motion.slug}`,
      description: motion.summary,
      badge:
        motion.origin === 'ai' && motion.status === 'proposed'
          ? 'new'
          : undefined
    }))
  },
  {
    title: 'Animations',
    accent: 'blue',
    items: [
      {
        label: 'Carousel',
        path: PATHS.CAROUSEL,
        description: 'motion 드래그 캐러셀'
      },
      {
        label: 'Scroll Stack',
        path: PATHS.SCROLL_STACK,
        description: '스크롤에 맞춰 쌓이는 카드와 문장',
        badge: 'new',
        fullBleed: true
      },
      {
        label: 'Float Button',
        path: PATHS.FLOAT_BUTTON,
        description: '떠 있는 액션 버튼',
        badge: 'wip'
      }
    ]
  },
  {
    title: 'Backgrounds',
    accent: 'green',
    items: BACKGROUND_TABS.map((tab) => ({
      label: tab.label,
      path: `${PATHS.BACKGROUNDS}?tab=${tab.id}`,
      description: tab.summary
    }))
  },
  {
    title: 'Components',
    accent: 'purple',
    items: [
      {
        label: 'Data Table',
        path: PATHS.TABLE,
        description: 'TanStack Table 정렬·필터·페이지네이션'
      },
      {
        label: 'Area Chart',
        path: PATHS.AREAT_CHART,
        description: 'Recharts 그라디언트 영역 차트'
      },
      {
        label: 'Text Editor',
        path: PATHS.TEXT_EDITOR,
        description: 'Quill 기반 에디터'
      }
    ]
  },
  {
    title: 'Layout',
    accent: 'orange',
    items: [
      {
        label: 'Responsive',
        path: PATHS.RESPONSIVE,
        description: 'CSS hidden vs useMediaQuery 비교'
      },
      {
        label: 'Sandbox',
        path: PATHS.TEST,
        description: '아무거나 던져보는 임시 페이지'
      }
    ]
  }
]

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap(
  (section) => section.items
)

const findBy = (predicate: (item: NavItem) => boolean) => {
  for (const section of NAV_SECTIONS) {
    const item = section.items.find(predicate)
    if (item) return { section, item }
  }

  return null
}

/**
 * 현재 위치의 사이드바 항목과 소속 카테고리.
 * 탭 링크(`/backgrounds?tab=blobs`)를 먼저 정확히 맞춰 보고,
 * 쿼리가 없으면 그 경로의 첫 항목(= 기본 탭)으로 떨어진다.
 */
export const findNavEntry = (pathname: string, search = '') => {
  const matched =
    findBy((item) => item.path === `${pathname}${search}`) ??
    findBy((item) => item.path.split('?')[0] === pathname)

  return matched ?? { section: undefined, item: undefined }
}
