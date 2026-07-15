<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { getPlacesByCategory, CATEGORIES } from '../services/mapService'

const mapContainer = ref(null)
const map = ref(null)
const places = ref([])
const selectedCategory = ref('all')
const loading = ref(true)
const errorMessage = ref('')
const selectedId = ref(null)

let kakaoMapInstance = null
let markers = []          // { id, marker, color } 형태로 저장
let selectedMarker = null // 현재 강조된 마커 참조

// 일반/강조 두 종류의 핀 이미지 생성 (색 + 강조여부)
const markerImageCache = {}
const getMarkerImage = (color, active = false) => {
  const key = `${color}-${active}`
  if (markerImageCache[key]) return markerImageCache[key]

  const size = active ? 24 : 16        // 강조 시 더 크게
  const h = active ? 42 : 18
  const stroke = active ? '<path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="none" stroke="#ffb300" stroke-width="3"/>' : ''
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${h}" viewBox="0 0 28 40">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.3 21.7 0 14 0z" fill="${color}"/>
      ${stroke}
      <circle cx="14" cy="14" r="${active ? 6 : 5.5}" fill="#fff"/>
    </svg>`
  const url = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)))
  const image = new kakaoMapInstance.MarkerImage(
    url,
    new kakaoMapInstance.Size(size, h),
    { offset: new kakaoMapInstance.Point(size / 2, h) }
  )
  markerImageCache[key] = image
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
  markers.forEach((m) => m.marker.setMap(null))
  markers = []
  selectedMarker = null
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
      image: getMarkerImage(color, false)
    })
    marker.setMap(map.value)
    // 지도 핀 클릭으로도 강조되게 연결
    kakaoMapInstance.event.addListener(marker, 'click', () => focusPlace(item))
    return { id: item.contentid, marker, color }
  })
}

// 목록/핀 클릭 → 지도 이동 + 해당 핀 강조
const focusPlace = (place) => {
  if (!map.value || !kakaoMapInstance) return
  const lat = Number(place.mapy)
  const lng = Number(place.mapx)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

  // 이전 강조 핀을 원래 색으로 되돌림
  if (selectedMarker) {
    selectedMarker.marker.setImage(getMarkerImage(selectedMarker.color, false))
    selectedMarker.marker.setZIndex(0)
  }

  selectedId.value = place.contentid
  map.value.panTo(new kakaoMapInstance.LatLng(lat, lng))

  // 새로 선택한 핀을 강조 이미지로 교체
  const target = markers.find((m) => m.id === place.contentid)
  if (target) {
    target.marker.setImage(getMarkerImage(target.color, true))
    target.marker.setZIndex(100)   // 겹칠 때 위로 올림
    selectedMarker = target
  }
}

const loadPlaces = async () => {
  loading.value = true
  errorMessage.value = ''
  selectedId.value = null
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
    map.value.setZoomable(false)
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
        <p>목록에서 장소를 클릭하면 지도에서 위치를 짚어줍니다.</p>
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
          <li
            v-for="place in places"
            :key="place.contentid"
            :class="{ selected: place.contentid === selectedId }"
            @click="focusPlace(place)"
          >
            <strong>{{ place.title }} <span class="cat-label">({{ CATEGORIES[place.category]?.label }})</span></strong>
            <span class="addr">{{ place.addr1 || '주소 정보 없음' }}</span>
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
  color: var(--sub);
}

.map-toolbar p {
  margin: 4px 0 0;
  color: #587058;
}

.filter-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-group button {
  border: 1px solid var(--border);
  background: white;
  color: var(--sub);
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
}

.filter-group button.active {
  background: var(--sub);
  color: white;
  border-color: var(--sub);
}

.legend {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #516952;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.legend-item i {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.map-card {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.map-area {
  position: relative;
}

.map-container {
  width: 100%;
  min-height: 480px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.map-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 250, 246, 0.9);
  border-radius: 16px;
  color: #374f37;
  font-size: 15px;
}

.map-overlay.error {
  background: rgba(255, 202, 40, 0.16);
  color: #7a5f00;
}

.place-list {
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  max-height: 480px;
  overflow-y: auto;
  box-shadow: var(--shadow);
}

.place-list h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: var(--sub);
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
  padding: 8px;
  border-radius: 8px;
  border-bottom: 1px solid #eef5eb;
  cursor: pointer;
  transition: background 0.15s;
}

.place-list li:hover {
  background: #f3f9f0;
}

.place-list li.selected {
  background: rgba(255, 202, 40, 0.2);
  border-left: 3px solid var(--point);
}

.place-list strong {
  font-size: 15px;
  color: var(--sub);
}

.place-list span {
  color: #6a7d68;
  font-size: 13px;
}
</style>