<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { getPlacesByCategory } from '../services/mapService'

const mapContainer = ref(null)
const map = ref(null)
const markers = ref([])
const places = ref([])
const selectedCategory = ref('all')
const loading = ref(true)
const errorMessage = ref('')

let kakaoMapInstance = null

const loadKakaoMap = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao.maps)
      return
    }

    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY || ''}&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => resolve(window.kakao.maps))
    }
    script.onerror = () => reject(new Error('Kakao Maps SDK를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })
}

const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null))
  markers.value = []
}

const drawMarkers = (items) => {
  if (!kakaoMapInstance || !map.value) return

  clearMarkers()

  const bounds = new kakaoMapInstance.LatLngBounds()

  items.forEach((item) => {
    const lat = Number(item.mapy)
    const lng = Number(item.mapx)

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

    const markerPosition = new kakaoMapInstance.LatLng(lat, lng)
    const marker = new kakaoMapInstance.Marker({
      position: markerPosition,
      title: item.title
    })

    marker.setMap(map.value)
    markers.value.push(marker)
    bounds.extend(markerPosition)
  })

  if (items.length > 0) {
    map.value.setBounds(bounds)
  }
}

const loadPlaces = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await getPlacesByCategory(selectedCategory.value)
    places.value = data
    drawMarkers(data)
  } catch (error) {
    errorMessage.value = error.message || '데이터를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

watch(selectedCategory, () => {
  loadPlaces()
})

onMounted(async () => {
  try {
    const kakaoMaps = await loadKakaoMap()
    kakaoMapInstance = kakaoMaps

    const options = {
      center: new kakaoMaps.LatLng(36.35, 127.39),
      level: 11
    }

    map.value = new kakaoMaps.Map(mapContainer.value, options)
    await loadPlaces()
  } catch (error) {
    errorMessage.value = error.message || '지도를 초기화하지 못했습니다.'
    loading.value = false
  }
})

onBeforeUnmount(() => {
  clearMarkers()
})
</script>

<template>
  <section class="map-page">
    <div class="map-toolbar">
      <div>
        <h2>대전·충청권 지도</h2>
        <p>관광지와 음식점을 한눈에 확인할 수 있습니다.</p>
      </div>

      <div class="filter-group">
        <button :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">
          전체
        </button>
        <button :class="{ active: selectedCategory === 'tourist' }" @click="selectedCategory = 'tourist'">
          관광지
        </button>
        <button :class="{ active: selectedCategory === 'food' }" @click="selectedCategory = 'food'">
          맛집
        </button>
      </div>
    </div>

    <div v-if="loading" class="status">지도 데이터를 불러오는 중입니다...</div>
    <div v-else-if="errorMessage" class="status error">{{ errorMessage }}</div>

    <div v-else class="map-card">
      <div ref="mapContainer" class="map-container"></div>
      <div class="place-list">
        <h3>표시된 장소</h3>
        <ul>
          <li v-for="place in places" :key="place.contentid">
            <strong>{{ place.title }}</strong>
            <span>{{ place.addr1 || '주소 정보 없음' }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.map-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.map-toolbar h2 {
  margin: 0;
  font-size: 24px;
}

.map-toolbar p {
  margin: 4px 0 0;
  color: #666;
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-group button {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #333;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
}

.filter-group button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.status {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  color: #374151;
}

.status.error {
  background: #fff1f2;
  color: #be123c;
}

.map-card {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.map-container {
  width: 100%;
  min-height: 480px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.place-list {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  max-height: 480px;
  overflow-y: auto;
}

.place-list h3 {
  margin-top: 0;
  margin-bottom: 12px;
}

.place-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.place-list li {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.place-list strong {
  font-size: 15px;
}

.place-list span {
  color: #666;
  font-size: 13px;
}

@media (max-width: 768px) {
  .map-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .map-card {
    grid-template-columns: 1fr;
  }

  .map-container {
    min-height: 360px;
  }
}
</style>