const TOURIST_JSON_PATH = '/data/대전_충청권_관광지.json'
const FOOD_JSON_PATH = '/data/대전_충청권_음식점.json'

export const loadMapData = async () => {
  try {
    const [touristResponse, foodResponse] = await Promise.all([
      fetch(TOURIST_JSON_PATH),
      fetch(FOOD_JSON_PATH)
    ])

    if (!touristResponse.ok || !foodResponse.ok) {
      throw new Error('지도 데이터를 불러오지 못했습니다.')
    }

    const [touristData, foodData] = await Promise.all([
      touristResponse.json(),
      foodResponse.json()
    ])

    return {
      tourist: touristData?.items || [],
      food: foodData?.items || []
    }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getPlacesByCategory = async (category = 'all') => {
  const { tourist, food } = await loadMapData()

  if (category === 'tourist') return tourist
  if (category === 'food') return food

  return [...tourist, ...food]
}

export default {
  loadMapData,
  getPlacesByCategory
}