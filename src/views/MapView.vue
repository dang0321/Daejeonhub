<script setup>
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import { getPlacesByCategory, CATEGORIES } from '../services/mapService'

const mapContainer = ref(null)
const map = ref(null)
const places = ref([])
const selectedCategory = ref('all')
const loading = ref(true)
const errorMessage = ref('')
const selectedId = ref(null)

let kakaoMapInstance = null
let markers = []
let selectedMarker = null

const markerImageCache = {}
const getMarkerImage = (color, active = false) => {
  const key = `${color}-${active}`
  if (markerImageCache[key]) return markerImageCache[key]

  const size = active ? 24 : 14
  const h = active ? 44 : 25
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
      image: getMarkerImage(color, false),
      clickable: true
    })
    marker.setMap(map.value)
    kakaoMapInstance.event.addListener(marker, 'click', () => focusPlace(item))
    return { id: item.contentid, marker, color }
  })
}

// 목록/핀 클릭 → 이동 + 강조
const focusPlace = (place) => {
  if (!map.value || !kakaoMapInstance) return
  const lat = Number(place.mapy)
  const lng = Number(place.mapx)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

  // 이전 강조 되돌리기
  if (selectedMarker) {
    selectedMarker.marker.setImage(getMarkerImage(selectedMarker.color, false))
    selectedMarker.marker.setZIndex(0)
    selectedMarker = null
  }

  selectedId.value = place.contentid
  const pos = new kakaoMapInstance.LatLng(lat, lng)
  map.value.setCenter(pos)
  map.value.setLevel(5)

  const target = markers.find((m) => m.id === place.contentid)
  if (target) {
    target.marker.setImage(getMarkerImage(target.color, true))
    target.marker.setZIndex(100)
    selectedMarker = target
  }
}

const zoomIn = () => {
  if (!map.value) return
  const level = map.value.getLevel()
  if (level > 1) map.value.setLevel(level - 1)
}
const zoomOut = () => {
  if (!map.value) return
  const level = map.value.getLevel()
  if (level < 14) map.value.setLevel(level + 1)
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

// ===== 경로 계산 =====
const routePoints = ref([])
let routePolyline = null

const allPlaces = ref([])
const searchKeyword = ref('')

const loadAllPlaces = async () => {
  try {
    allPlaces.value = await getPlacesByCategory('all')
  } catch {
    allPlaces.value = []
  }
}

const searchResults = computed(() => {
  const kw = searchKeyword.value.trim().toLowerCase()
  if (!kw) return []
  return allPlaces.value
    .filter((p) => p.title && p.title.toLowerCase().includes(kw))
    .slice(0, 8)
})

const haversine = (a, b) => {
  const R = 6371, rad = (d) => d * Math.PI / 180
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

const routeSummary = computed(() => {
  const pts = routePoints.value
  if (pts.length < 2) return { km: 0, minutes: 0 }
  let km = 0
  for (let i = 0; i < pts.length - 1; i++) {
    km += haversine(
      { lat: Number(pts[i].mapy), lng: Number(pts[i].mapx) },
      { lat: Number(pts[i + 1].mapy), lng: Number(pts[i + 1].mapx) }
    )
  }
  km *= 1.3
  const minutes = Math.round(km / 40 * 60)
  return { km: km.toFixed(1), minutes }
})

const addToRoute = (place) => {
  const pts = routePoints.value
  if (pts.length > 0 && pts[pts.length - 1].contentid === place.contentid) return
  routePoints.value.push(place)
  drawRoute()
}

const removeFromRoute = (index) => {
  routePoints.value.splice(index, 1)
  routePoints.value = [...routePoints.value]
  drawRoute()
}

const moveRoutePoint = (index, dir) => {
  const arr = routePoints.value
  const newIndex = index + dir
  if (newIndex < 0 || newIndex >= arr.length) return
  ;[arr[index], arr[newIndex]] = [arr[newIndex], arr[index]]
  routePoints.value = [...arr]
  drawRoute()
}

const clearRoute = () => {
  routePoints.value = []
  drawRoute()
}

const drawRoute = () => {
  if (!map.value || !kakaoMapInstance) return
  if (routePolyline) { routePolyline.setMap(null); routePolyline = null }
  if (routePoints.value.length < 2) return

  const path = routePoints.value.map(
    (p) => new kakaoMapInstance.LatLng(Number(p.mapy), Number(p.mapx))
  )
  routePolyline = new kakaoMapInstance.Polyline({
    path,
    strokeWeight: 4,
    strokeColor: '#2563eb',
    strokeOpacity: 0.8,
    strokeStyle: 'solid'
  })
  routePolyline.setMap(map.value)
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
    await loadAllPlaces()
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
        <div class="zoom-controls">
          <button @click="zoomIn">＋</button>
          <button @click="zoomOut">－</button>
        </div>
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
            <button class="route-add-btn" @click.stop="addToRoute(place)">＋ 경로에 추가</button>
          </li>
        </ul>
      </div>
    </div>

    <div class="route-panel">
      <div class="route-header">
        <h3>경로 계산 ({{ routePoints.length }}곳)</h3>
        <button v-if="routePoints.length > 0" class="route-clear" @click="clearRoute">전체 초기화</button>
      </div>

      <div class="route-search">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="장소 이름으로 검색해서 추가 (예: 성심당)"
        />
        <ul v-if="searchResults.length > 0" class="search-results">
          <li v-for="r in searchResults" :key="r.contentid">
            <span class="sr-name">{{ r.title }}
              <span class="sr-cat">({{ CATEGORIES[r.category]?.label }})</span>
            </span>
            <button class="sr-add" @click="addToRoute(r)">＋</button>
          </li>
        </ul>
        <p v-else-if="searchKeyword.trim()" class="sr-empty">검색 결과가 없습니다.</p>
      </div>

      <ol class="route-list">
        <li v-for="(p, i) in routePoints" :key="`${p.contentid}-${i}`">
          <span class="route-role">
            {{ i === 0 ? '출발' : i === routePoints.length - 1 ? '도착' : '경유' }}
          </span>
          <span class="route-name" @click="focusPlace(p)">{{ p.title }}</span>
          <span class="route-actions">
            <button @click="moveRoutePoint(i, -1)" :disabled="i === 0">▲</button>
            <button @click="moveRoutePoint(i, 1)" :disabled="i === routePoints.length - 1">▼</button>
            <button @click="removeFromRoute(i)">✕</button>
          </span>
        </li>
      </ol>

      <div v-if="routePoints.length >= 2" class="route-summary">
        🚗 예상 소요시간: 약 {{ routeSummary.minutes }}분 (총 {{ routeSummary.km }}km)
        <p class="route-note">
          ※ 표시된 소요시간은 각 지점을 직선거리로 이은 뒤 자동차 평균 속도(40km/h)를
          기준으로 계산한 예상치입니다. 실제 도로 경로·교통 상황에 따라 실제 소요시간과는
          차이가 있을 수 있습니다.
        </p>
      </div>
      <p v-else class="route-hint">장소를 2곳 이상 추가하면 소요시간이 계산됩니다.</p>
    </div>
  </section>
</template>

<style scoped>
.map-page { display: flex; flex-direction: column; gap: 16px; }
.map-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.map-toolbar h2 { margin: 0; font-size: 24px; color: var(--sub); }
.map-toolbar p { margin: 4px 0 0; color: #587058; }
.filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
.filter-group button {
  border: 1px solid var(--border); background: white; color: var(--sub);
  border-radius: 999px; padding: 8px 12px; cursor: pointer;
}
.filter-group button.active { background: var(--sub); color: white; border-color: var(--sub); }
.legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 13px; color: #516952; }
.legend-item { display: flex; align-items: center; gap: 5px; }
.legend-item i { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.map-card { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
.map-area { position: relative; }
.zoom-controls {
  position: absolute; top: 12px; right: 12px;
  display: flex; flex-direction: column; gap: 4px; z-index: 10;
}
.zoom-controls button {
  width: 36px; height: 36px; border: 1px solid #d1d5db; background: #fff;
  border-radius: 8px; cursor: pointer; font-size: 18px; font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.zoom-controls button:hover { background: #f3f4f6; }
.map-container {
  width: 100%; min-height: 480px; border-radius: 16px;
  overflow: hidden; border: 1px solid var(--border);
}
.map-overlay {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(248, 250, 246, 0.9); border-radius: 16px; color: #374f37; font-size: 15px;
}
.map-overlay.error { background: rgba(255, 202, 40, 0.16); color: #7a5f00; }
.place-list {
  background: white; border: 1px solid var(--border); border-radius: 16px;
  padding: 16px; max-height: 480px; overflow-y: auto; box-shadow: var(--shadow);
}
.place-list h3 { margin-top: 0; margin-bottom: 12px; color: var(--sub); }
.place-list ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.place-list li {
  display: flex; flex-direction: column; gap: 4px; padding: 8px;
  border-radius: 8px; border-bottom: 1px solid #eef5eb; cursor: pointer; transition: background 0.15s;
}
.place-list li:hover { background: #f3f9f0; }
.place-list li.selected { background: rgba(255, 202, 40, 0.2); border-left: 3px solid var(--point); }
.place-list strong { font-size: 15px; color: var(--sub); }
.place-list span { color: #6a7d68; font-size: 13px; }

.route-add-btn {
  margin-top: 6px; align-self: flex-start;
  border: 1px solid #2563eb; background: #fff; color: #2563eb;
  border-radius: 6px; padding: 4px 10px; font-size: 12px; cursor: pointer;
}
.route-add-btn:hover { background: #2563eb; color: #fff; }

.route-panel { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px; }
.route-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.route-header h3 { margin: 0; font-size: 17px; color: var(--sub); }
.route-clear {
  border: 1px solid #d1d5db; background: #fff; color: #666;
  border-radius: 6px; padding: 4px 10px; font-size: 13px; cursor: pointer;
}
.route-list { list-style: none; padding: 0; margin: 0 0 12px; display: flex; flex-direction: column; gap: 6px; }
.route-list li { display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8fafc; border-radius: 8px; }
.route-role {
  font-size: 12px; font-weight: 600; color: #fff; background: #64748b;
  border-radius: 999px; padding: 2px 8px; min-width: 34px; text-align: center;
}
.route-name { flex: 1; font-size: 14px; cursor: pointer; }
.route-name:hover { color: #2563eb; text-decoration: underline; }
.route-actions { display: flex; gap: 4px; }
.route-actions button {
  width: 26px; height: 26px; border: 1px solid #d1d5db; background: #fff;
  border-radius: 6px; cursor: pointer; font-size: 12px;
}
.route-actions button:disabled { opacity: 0.3; cursor: default; }
.route-summary { padding: 12px; background: #eff6ff; border-radius: 8px; font-size: 15px; font-weight: 600; color: #1e40af; }
.route-note { margin: 8px 0 0; font-size: 12px; font-weight: 400; color: #64748b; line-height: 1.5; }
.route-hint { font-size: 13px; color: #94a3b8; }

.route-search { margin-bottom: 12px; }
.route-search input {
  width: 100%; box-sizing: border-box;
  border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 12px; font-size: 14px;
}
.search-results {
  list-style: none; padding: 0; margin: 8px 0 0;
  border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;
}
.search-results li {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; border-bottom: 1px solid #f1f5f9;
}
.search-results li:last-child { border-bottom: none; }
.sr-name { font-size: 14px; }
.sr-cat { color: #94a3b8; font-size: 12px; }
.sr-add {
  width: 28px; height: 28px; border: 1px solid #2563eb;
  background: #fff; color: #2563eb; border-radius: 6px; cursor: pointer; font-size: 15px;
}
.sr-add:hover { background: #2563eb; color: #fff; }
.sr-empty { margin: 8px 0 0; font-size: 13px; color: #94a3b8; }
</style>