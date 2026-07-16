import { ref, onMounted } from 'vue'

const BOARD_STORAGE_KEY = 'vue3-board-items'

const DATA_FILES = [
  { key: 'tourism', label: '관광지', path: '/data/대전_충청권_관광지.json' },
  { key: 'culture', label: '문화시설', path: '/data/대전_충청권_문화시설.json' },
  { key: 'shopping', label: '쇼핑', path: '/data/대전_충청권_쇼핑.json' },
  { key: 'stay', label: '숙박', path: '/data/대전_충청권_숙박.json' },
  { key: 'food', label: '음식점', path: '/data/대전_충청권_음식점.json' }
]

const toPercent = (value, total) => {
  if (!total) return 0
  return Number(((value / total) * 100).toFixed(2))
}

const normalizeCount = (payload) => {
  const fromTotal = Number(payload?.total)

  if (Number.isFinite(fromTotal) && fromTotal > 0) {
    return fromTotal
  }

  const items = Array.isArray(payload?.items) ? payload.items : []
  return items.length
}

const readLocalStorageArray = (key) => {
  if (typeof window === 'undefined') return []

  try {
    const rawValue = window.localStorage.getItem(key)
    if (!rawValue) return []

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

const getBoardPostCount = () => {
  const boards = readLocalStorageArray(BOARD_STORAGE_KEY)
  return boards.length
}

const getTotalLikes = () => {
  const boards = readLocalStorageArray(BOARD_STORAGE_KEY)
  return boards.reduce((sum, board) => sum + (Number(board?.likes) || 0), 0)
}

export const fetchDashboardStats = async () => {
  const results = await Promise.all(
    DATA_FILES.map(async ({ label, path }) => {
      const response = await fetch(path)
      if (!response.ok) {
        throw new Error(`${label} 데이터를 불러오지 못했습니다.`)
      }

      const payload = await response.json()
      const count = normalizeCount(payload)

      return {
        label,
        count
      }
    })
  )

  const totalTourismCount = results.reduce((sum, item) => sum + item.count, 0)
  const boardCount = getBoardPostCount()
  const totalLikes = getTotalLikes()

  const tourismTypeRatio = results.map((item) => ({
    label: item.label,
    count: item.count,
    ratio: toPercent(item.count, totalTourismCount)
  }))

  const categoryCount = results.reduce((acc, item) => {
    acc[item.label] = item.count
    return acc
  }, {})

  const categoryRatio = Object.entries(categoryCount).map(([label, count]) => ({
    label,
    count,
    ratio: toPercent(count, totalTourismCount)
  }))

  const categoryTypeCount = DATA_FILES.length

  return {
    totalTourismCount,
    boardCount,
    totalLikes,
    categoryCount,
    categoryRatio,
    tourismTypeRatio,
    categoryTypeCount
  }
}

export const useDashboardStats = () => {
  const stats = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const loadStats = async () => {
    isLoading.value = true
    error.value = null

    try {
      stats.value = await fetchDashboardStats()
    } catch (err) {
      error.value = err?.message || '대시보드 통계를 불러오지 못했습니다.'
      stats.value = null
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadStats)

  return {
    stats,
    isLoading,
    error,
    loadStats
  }
}

export default {
  fetchDashboardStats,
  useDashboardStats
}