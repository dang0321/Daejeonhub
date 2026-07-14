<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { getPlacesByCategory, CATEGORIES } from '../services/mapService'

const mapContainer = ref(null)
const map = ref(null)
const places = ref([])
const selectedCategory = ref('all')
const loading = ref(true)
const errorMessage = ref('')

let kakaoMapInstance = null
let markers = []

// 카테고리 색상별 물방울 핀 SVG를 마커 이미지로 생성 (크기 축소: 20x28)
const markerImageCache = {}
const getMarkerImage = (color) => {
  if (markerImageCache[color]) return markerImageCache[color]
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="28" viewBox="0 0 28 40">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="5.5" fill="#fff"/>
    </svg>`
  const url = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  const image = new kakaoMapInstance.MarkerImage(
    url,
    new kakaoMapInstance.Size(20, 28),
    { offset: new kakaoMapInstance.Point(10, 28) }
  )
  markerImageCache[color] = image
  return image
}

const loadKakaoMap = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao.maps)
      return
    }
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY || ''}&autoload=false`
    script.async = true
    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao.maps))
    script.onerror = () => reject(new Error('Kakao Maps SDK를 불러오지 못했습니다.'))
    document.head.appendChild(script)
  })
}

const clearMarkers = () => {
  markers.forEach((m) => m.setMap(null))
  markers = []
}

const drawMarkers = (items) => {
  if (!kakaoMapInstance || !map.value) return
  clearMarkers()

  markers = items.map((item) => {
    const color = CATEGORIES[item.category]?.color || '#666'
    const position = new kakaoMapInstance.LatLng(Number(item.mapy), Number(item.mapx))
    const marker = new kakaoMapInstance.Marker({
      position,
      title: item.title,
      image: getMarkerImage(color)
    })
    marker.setMap(map.value)
    return marker
  })
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

watch(selectedCategory, loadPlaces)

onMounted(async () => {
  try {
    const kakaoMaps = await loadKakaoMap()
    kakaoMapInstance = kakaoMaps
    map.value = new kakaoMaps.Map(mapContainer.value, {
      center: new kakaoMaps.LatLng(36.35, 127.39),
      level: 8
    })
    map.value.setZoomable(false)   // 확대 잠금 (렌더링 오류 방지)
    await loadPlaces()
  } catch (error) {
    errorMessage.value = error.message || '지도를 초기화하지 못했습니다.'
    loading.value = false
  }
})

onBeforeUnmount(clearMarkers)
</script>

<template>
  <section class="map-page">
    <div class="map-toolbar">
      <div>
        <h2>대전·충청권 지도</h2>
        <p>카테고리별 장소를 색상으로 구분해 확인할 수 있습니다.</p>
      </div>
      <div class="filter-group">
        <button :class="{ active: selectedCategory === 'all' }" @click="selectedCategory = 'all'">전체</button>
        <button
          v-for="(cat, key) in CATEGORIES"
          :key="key"
          :class="{ active: selectedCategory === key }"
          @click="selectedCategory = key"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <div class="legend">
      <span v-for="(cat, key) in CATEGORIES" :key="key" class="legend-item">
        <i :style="{ background: cat.color }"></i>{{ cat.label }}
      </span>
    </div>

    <div class="map-card">
      <div class="map-area">
        <div ref="mapContainer" class="map-container"></div>
        <div v-if="loading" class="map-overlay">지도 데이터를 불러오는 중입니다...</div>
        <div v-else-if="errorMessage" class="map-overlay error">{{ errorMessage }}</div>
      </div>
      <div class="place-list">
        <h3>표시된 장소 ({{ places.length }})</h3>
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
.map-page { display: flex; flex-direction: column; gap: 16px; }
.map-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.map-toolbar h2 { margin: 0; font-size: 24px; }
.map-toolbar p { margin: 4px 0 0; color: #666; }
.filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-group button {
  border: 1px solid #d1d5db; background: #fff; color: #333;
  border-radius: 999px; padding: 8px 12px; cursor: pointer;
}
.filter-group button.active { background: #007bff; color: #fff; border-color: #007bff; }
.legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 13px; color: #555; }
.legend-item { display: flex; align-items: center; gap: 5px; }
.legend-item i { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.map-card { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
.map-area { position: relative; }
.map-container {
  width: 100%; min-height: 480px; border-radius: 16px;
  overflow: hidden; border: 1px solid #e5e7eb;
}
.map-overlay {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(248,250,252,0.85); border-radius: 16px; color: #374151; font-size: 15px;
}
.map-overlay.error { background: rgba(255,241,242,0.9); color: #be123c; }
.place-list {
  background: #fff; border: 1px solid #e5e7eb; border-radius: 16px;
  padding: 16px; max-height: 480px; overflow-y: auto;
}
.place-list h3 { margin-top: 0; margin-bottom: 12px; }
.place-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.place-list li { display: flex; flex-direction: column; gap: 4px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
.place-list strong { font-size: 15px; }
.place-list span { color: #666; font-size: 13px; }
@media (max-width: 768px) {
  .map-toolbar { flex-direction: column; align-items: flex-start; }
  .map-card { grid-template-columns: 1fr; }
  .map-container { min-height: 360px; }
}
</style>