// 카테고리별 JSON 경로 + 색상 정의 (한 곳에서 관리)
export const CATEGORIES = {
  tourist:  { label: '관광지',   path: '/data/대전_충청권_관광지.json',   color: '#2563eb' },
  food:     { label: '맛집',     path: '/data/대전_충청권_음식점.json',   color: '#dc2626' },
  stay:     { label: '숙박',     path: '/data/대전_충청권_숙박.json',     color: '#16a34a' },
  culture:  { label: '문화시설', path: '/data/대전_충청권_문화시설.json', color: '#9333ea' },
  shopping: { label: '쇼핑',     path: '/data/대전_충청권_쇼핑.json',     color: '#ea580c' }
}

// 대전/충청 범위 밖 좌표(깨진 데이터) 걸러내기
const isValidDCC = (item) => {
  const x = Number(item.mapx)
  const y = Number(item.mapy)
  return Number.isFinite(x) && Number.isFinite(y) &&
         x >= 125 && x <= 129 && y >= 35 && y <= 38
}

// 특정 카테고리 JSON 하나 불러오기 (+ category 표시 부착, 좌표 필터)
const loadCategory = async (key) => {
  const { path } = CATEGORIES[key]
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${CATEGORIES[key].label} 데이터를 불러오지 못했습니다.`)
  const data = await res.json()
  const items = data?.items || []
  return items
    .filter(isValidDCC)
    .map((item) => ({ ...item, category: key }))
}

// 카테고리별 장소 반환. 'all'이면 5개 전부 합쳐서 반환
export const getPlacesByCategory = async (category = 'all') => {
  if (category === 'all') {
    const keys = Object.keys(CATEGORIES)
    const results = await Promise.all(keys.map(loadCategory))
    return results.flat()
  }
  return loadCategory(category)
}

export default { CATEGORIES, getPlacesByCategory }