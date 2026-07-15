<template>
  <div class="board-page">
    <!-- 상단 '게시판' 헤더 영역: 2단 구조로 고정하여 모든 화면에서 완벽한 간격 유지 -->
    <header class="board-header">
      <!-- 1층: 타이틀과 우측 액션 버튼 -->
      <div class="header-first-row">
        <h1>게시판</h1>
        <div class="header-right">
          <button 
            v-if="!selectedBoard && !isCreating && !isEditing" 
            class="primary-button write-button" 
            type="button" 
            @click="startCreate"
          >
            글쓰기
          </button>
          <button 
            v-else 
            class="secondary-button" 
            type="button" 
            @click="clearSelection"
          >
            목록으로
          </button>
        </div>
      </div>

      <!-- 2층: 카테고리와 검색창 (상세/수정/글쓰기 상태에서도 높이와 간격을 유지하여 덜컥거림 완벽 방지) -->
      <div 
        class="header-second-row" 
        :class="{ 'hide-layout': selectedBoard || isCreating || isEditing }"
      >
        <div class="category-tabs">
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            class="category-tab-btn"
            :class="{ active: selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>

        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchTerm"
            type="search"
            placeholder="제목, 내용 또는 닉네임을 검색하세요"
            class="search-input"
          />
        </div>
      </div>
    </header>

    <!-- 1. 목록 화면 -->
    <section class="board-content" v-if="!selectedBoard && !isCreating && !isEditing">
      <section class="board-list-wrapper">
        <div v-if="filteredBoards.length === 0" class="empty-state">
          등록된 게시글이 없습니다.
        </div>

        <div v-else class="board-table-container">
          <div class="board-table-header">
            <span class="col-category">분류</span>
            <span class="col-title">제목</span>
            <span class="col-author">작성자</span>
            <span class="col-date">등록일</span>
            <span class="col-stats-like">좋아요</span>
            <span class="col-stats-view">조회수</span>
          </div>

          <ul class="board-list">
            <li
              v-for="board in pagedBoards"
              :key="board.id"
              :class="{ active: selectedBoard && selectedBoard.id === board.id }"
              @click="selectBoard(board.id)"
            >
              <div class="col-category">
                <span class="board-list-category" :class="getCategoryClass(board.category)">
                  {{ board.category }}
                </span>
              </div>
              <div class="col-title">
                <strong class="board-item-title">{{ board.title }}</strong>
              </div>
              <div class="col-author">
                <span class="board-item-author">{{ board.nickname }}</span>
              </div>
              <div class="col-date">
                <span class="board-item-meta">{{ formatDate(board.createdAt) }}</span>
              </div>
              <div class="col-stats-like">
                <span class="stat-number" :class="{ 'has-likes': board.likes > 0 }">
                  {{ board.likes || 0 }}
                </span>
              </div>
              <div class="col-stats-view">
                <span class="stat-number view-number">
                  {{ board.views || 0 }}
                </span>
              </div>
            </li>
          </ul>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="filteredBoards.length > 0" class="pagination">
          <button type="button" class="page-button" :disabled="currentPage === 1" @click="goToPage(1)">
            ««
          </button>
          <button type="button" class="page-button" :disabled="currentPage === 1" @click="currentPage -= 1">
            이전
          </button>
          <div class="page-number-group">
            <button
              v-for="page in pageNumbers"
              :key="page"
              type="button"
              class="page-number"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button type="button" class="page-button" :disabled="currentPage === totalPages" @click="currentPage += 1">
            다음
          </button>
          <button type="button" class="page-button" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">
            »»
          </button>
        </div>
      </section>
    </section>

    <!-- 2. 상세보기 화면 -->
    <section class="board-content" v-else-if="selectedBoard && !isCreating && !isEditing">
      <section class="board-detail">
        <div class="detail-card">
          <div class="detail-heading">
            <div class="detail-title-wrap">
              <span class="board-list-category detail-badge" :class="getCategoryClass(selectedBoard.category)">
                {{ selectedBoard.category }}
              </span>
              <h3 class="detail-title-text">{{ selectedBoard.title }}</h3>
            </div>
            
            <div class="detail-meta-wrap">
              <span class="detail-meta-item">
                <span class="meta-label">작성자</span>
                <span class="meta-value-author">{{ selectedBoard.nickname }}</span>
              </span>
              <span class="detail-meta-divider">|</span>
              <span class="detail-meta-item">
                <span class="meta-label">조회수</span>
                <span class="meta-value-author">{{ selectedBoard.views || 0 }}</span>
              </span>
              <span class="detail-meta-divider">|</span>
              <span class="detail-meta-item">
                <span class="meta-label">등록일</span>
                <span class="meta-value-date">{{ formatFullDate(selectedBoard.createdAt) }}</span>
              </span>
            </div>
          </div>

          <div class="detail-body">
            <p class="detail-content">{{ selectedBoard.content }}</p>
          </div>

          <!-- 하단 액션바 -->
          <div class="detail-actions">
            <button 
              type="button" 
              class="like-button" 
              :class="{ liked: isCurrentPostLiked }" 
              @click="handleLikeToggle"
            >
              <span class="like-label">좋아요</span>
              <span class="like-count">{{ selectedBoard.likes || 0 }}</span>
            </button>

            <div class="right-actions">
              <button class="secondary-button" type="button" @click="startEdit">수정</button>
              <button class="danger-button" type="button" @click="confirmDelete">삭제</button>
            </div>
          </div>
        </div>
      </section>
    </section>

    <!-- 3. 상세조회 디자인과 100% 동일하게 일치시킨 글쓰기/수정 화면 -->
    <section class="board-content" v-else>
      <form class="board-detail" @submit.prevent="submitForm">
        <div class="detail-card">
          <div class="detail-heading">
            <!-- 1) 배너 및 제목부 -->
            <div class="detail-title-wrap">
              <span class="board-list-category detail-badge editor-category-badge" :class="getCategoryClass(form.category)">
                {{ form.category }}
                <select v-model="form.category" class="editor-select-overlay">
                  <option
                    v-for="category in categories.filter(c => c !== '전체')"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </span>
              <input 
                v-model="form.title" 
                type="text" 
                required 
                maxlength="100" 
                placeholder="제목을 입력하세요"
                class="editor-title-input" 
              />
            </div>
            
            <!-- 2) 작성자 및 비밀번호부 -->
            <div class="detail-meta-wrap">
              <span class="detail-meta-item">
                <span class="meta-label">작성자</span>
                <input 
                  v-model="form.nickname" 
                  type="text" 
                  required 
                  maxlength="15" 
                  placeholder="닉네임 입력"
                  class="editor-meta-input" 
                  :disabled="isEditing"
                />
              </span>
              <span class="detail-meta-divider" v-if="isCreating">|</span>
              <span class="detail-meta-item" v-if="isCreating">
                <span class="meta-label">비밀번호</span>
                <input 
                  v-model="form.password" 
                  type="password" 
                  required 
                  maxlength="20" 
                  placeholder="비밀번호 입력"
                  class="editor-meta-input" 
                />
              </span>
            </div>
          </div>

          <!-- 본문 입력 영역 -->
          <div class="detail-body">
            <textarea 
              v-model="form.content" 
              rows="12" 
              required 
              maxlength="1000" 
              placeholder="내용을 입력하세요"
              class="editor-textarea"
            ></textarea>
          </div>

          <!-- 하단 버튼 영역 -->
          <div class="detail-actions">
            <button class="secondary-button" type="button" @click="cancelForm">취소</button>
            <button class="primary-button" type="submit">저장</button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  listBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  toggleLike,
  incrementViews
} from '../services/boardService'

const searchTerm = ref('')
const categories = ['전체', '관광', '맛집', '자유']
const selectedCategory = ref('전체')
const selectedId = ref(null)
const isCreating = ref(false)
const isEditing = ref(false)

const form = ref({
  category: '자유',
  nickname: '',
  title: '',
  content: '',
  password: ''
})

const boards = ref(listBoards())
const pageSize = 5
const currentPage = ref(1)

const userLikedPostIds = ref([])
const viewedPostIds = ref([])

onMounted(() => {
  const savedLikes = localStorage.getItem('user-liked-posts')
  if (savedLikes) {
    try {
      userLikedPostIds.value = JSON.parse(savedLikes)
    } catch (e) {
      userLikedPostIds.value = []
    }
  }

  const savedViews = sessionStorage.getItem('user-viewed-posts')
  if (savedViews) {
    try {
      viewedPostIds.value = JSON.parse(savedViews)
    } catch (e) {
      viewedPostIds.value = []
    }
  }
})

const isCurrentPostLiked = computed(() => {
  if (!selectedId.value) return false
  return userLikedPostIds.value.includes(selectedId.value)
})

const filteredBoards = computed(() => {
  const normalized = searchTerm.value.trim().toLowerCase()

  return boards.value
    .filter((item) => {
      const searchMatched =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.content.toLowerCase().includes(normalized) ||
        item.nickname.toLowerCase().includes(normalized)

      const categoryMatched =
        selectedCategory.value === '전체' ||
        item.category === selectedCategory.value

      return searchMatched && categoryMatched
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBoards.value.length / pageSize)))

const pagedBoards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredBoards.value.slice(start, start + pageSize)
})

const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i += 1) {
    pages.push(i)
  }
  return pages
})

const selectedBoard = computed(() => {
  return boards.value.find((item) => item.id === selectedId.value) || null
})

watch([searchTerm, selectedCategory], () => {
  currentPage.value = 1
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

function formatDate(value) {
  const date = new Date(value)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return diffMins <= 1 ? '방금 전' : `${diffMins}분 전`
  }
  if (date.toDateString() === now.toDateString()) {
    const hh = String(date.getHours()).padStart(2, '0')
    const mm = String(date.getMinutes()).padStart(2, '0')
    return `${hh}:${mm}`
  }
  if (diffDays === 1) {
    return '어제'
  }
  if (diffDays < 7) {
    return `${diffDays}일 전`
  }
  
  const yy = String(date.getFullYear()).slice(-2)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  
  if (date.getFullYear() === now.getFullYear()) {
    return `${mm}-${dd}`
  }
  return `${yy}-${mm}-${dd}`
}

function formatFullDate(value) {
  const date = new Date(value)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`
}

function getCategoryClass(category) {
  switch (category) {
    case '관광': return 'cat-tour'
    case '맛집': return 'cat-food'
    default: return 'cat-free'
  }
}

function refreshBoards() {
  boards.value = listBoards()
}

function selectBoard(id) {
  selectedId.value = id
  isCreating.value = false
  isEditing.value = false

  if (!viewedPostIds.value.includes(id)) {
    incrementViews(id)
    viewedPostIds.value.push(id)
    sessionStorage.setItem('user-viewed-posts', JSON.stringify(viewedPostIds.value))
    refreshBoards()
  }
}

function clearSelection() {
  selectedId.value = null
  isCreating.value = false
  isEditing.value = false
}

function startCreate() {
  selectedId.value = null
  isCreating.value = true
  isEditing.value = false

  const targetCategory = selectedCategory.value === '전체' ? '자유' : selectedCategory.value

  form.value = {
    category: targetCategory,
    nickname: '',
    title: '',
    content: '',
    password: ''
  }
}

function startEdit() {
  if (!selectedBoard.value) return

  const password = prompt('수정하려면 비밀번호를 입력하세요.')
  if (!password) return

  if (password !== selectedBoard.value.password) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  isCreating.value = false
  isEditing.value = true
  
  form.value = {
    category: selectedBoard.value.category,
    nickname: selectedBoard.value.nickname,
    title: selectedBoard.value.title,
    content: selectedBoard.value.content,
    password
  }
}

function cancelForm() {
  selectedId.value = null
  isCreating.value = false
  isEditing.value = false
  form.value = {
    category: '자유',
    nickname: '',
    title: '',
    content: '',
    password: ''
  }
}

function submitForm() {
  if (!form.value.nickname.trim()) {
    alert('닉네임을 올바르게 입력해주세요 (공백만 입력 불가).')
    return
  }

  if (isCreating.value) {
    createBoard({
      category: form.value.category,
      nickname: form.value.nickname,
      title: form.value.title,
      content: form.value.content,
      password: form.value.password
    })
    cancelForm()
    refreshBoards()
    return
  }

  if (!selectedBoard.value) {
    cancelForm()
    return
  }

  updateBoard(
    selectedBoard.value.id,
    {
      category: form.value.category,
      title: form.value.title,
      content: form.value.content
    },
    form.value.password
  )

  cancelForm()
  refreshBoards()
}

function confirmDelete() {
  if (!selectedBoard.value) return

  const password = prompt('삭제하려면 비밀번호를 입력하세요.')
  if (!password) return

  const removed = deleteBoard(selectedBoard.value.id, password)
  if (!removed) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  selectedId.value = null
  isCreating.value = false
  isEditing.value = false
  refreshBoards()
}

function handleLikeToggle() {
  if (!selectedId.value) return

  const id = selectedId.value
  const hasLiked = isCurrentPostLiked.value

  if (hasLiked) {
    userLikedPostIds.value = userLikedPostIds.value.filter(likedId => likedId !== id)
    toggleLike(id, false)
  } else {
    userLikedPostIds.value.push(id)
    toggleLike(id, true)
  }

  localStorage.setItem('user-liked-posts', JSON.stringify(userLikedPostIds.value))
  refreshBoards()
}
</script>

<style scoped>
.board-page {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 24px 28px 40px;
  min-height: 100vh; /* 화면의 최소 전체 높이를 지정하여 상하 덜컹거림 방지 */
  scrollbar-gutter: stable; /* 스크롤바 유무에 상관없이 우측 레이아웃 공간을 유지하여 좌우 덜컹거림 원천 방지 */
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
}

/* 
  헤더 영역: 2단 구조
  모든 화면에서 일정한 세로 공간을 점유하여 화면이 이동할 때 '게시판' 타이틀이 흔들리지 않습니다.
*/
.board-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 18px;
  padding: 18px 0 20px;
  border-bottom: 1px solid var(--border);
}

/* 1층: '게시판' 타이틀과 우측 글쓰기/목록으로 버튼 */
.header-first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 38px;
}

.board-header h1 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-h);
  font-family: var(--heading);
  line-height: 1;
}

.header-right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 2층: 카테고리 탭과 검색 상자 (1층 밑에 나란히 배치) */
.header-second-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 38px; /* 고정 높이 부여 */
  opacity: 1;
  visibility: visible;
  transition: opacity 0.15s ease, visibility 0.15s ease;
}

/* 상세페이지, 수정/글쓰기 페이지에서도 높이(38px)는 그대로 차지하게 하여 상하 덜컹거림 해결 */
.header-second-row.hide-layout {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  user-select: none;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 320px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: var(--sub);
  opacity: 0.6;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 38px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  font-family: var(--sans);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: var(--sub);
}

.category-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: nowrap;
}

.category-tab-btn {
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-tab-btn:hover {
  background: var(--accent-bg);
  border-color: var(--sub);
}

.category-tab-btn.active {
  background: var(--sub);
  color: var(--bg);
  border-color: var(--sub);
}

.write-button {
  flex-shrink: 0;
  padding: 10px 18px;
  font-weight: 600;
}

.board-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
}

/* --- 목록 조회 및 상세정보 최소 높이 표준화 --- */
.board-list-wrapper,
.board-detail {
  width: 100%;
  max-width: none;
  background: transparent;
  border: none;
  padding: 20px 0;
  min-height: 550px; /* 전체 컨텐츠 카드의 최소 높이를 일관되게 고정 */
}

.board-table-container {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: hidden;
}

.board-table-header,
.board-list li {
  display: grid;
  grid-template-columns: 80px 1fr 110px 100px 80px 80px;
  align-items: center;
  gap: 16px;
}

.board-table-header {
  padding: 12px 18px;
  background: var(--accent-bg);
  border-bottom: 1px solid var(--border);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
  opacity: 0.8;
}

.col-category {
  text-align: center;
}

.col-title {
  text-align: left;
  min-width: 0;
  padding-left: 8px; 
}

.col-author {
  text-align: left;
  padding-left: 4px;
}

.col-date {
  text-align: center;
}

.col-stats-like,
.col-stats-view {
  text-align: center;
}

.board-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.board-list li {
  padding: 15px 18px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background-color 0.15s ease;
  background: var(--bg);
}

.board-list li:last-child {
  border-bottom: none;
}

.board-list li:hover,
.board-list li.active {
  background: var(--accent-bg);
}

.board-item-title {
  font-size: 0.95rem;
  color: var(--text-h);
  font-family: var(--sans);
  font-weight: 500;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-number {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.8;
}

.stat-number.has-likes {
  font-weight: 600;
  color: var(--text-h);
}

.stat-number.view-number {
  opacity: 0.55;
}

.board-list-category {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.cat-free {
  background: #e6f4ea; 
  border: 1px solid #c2e7cc;
  color: #137333;
}

.cat-food {
  background: #fef7e0; 
  border: 1px solid #feebc8;
  color: #b06000;
}

.cat-tour {
  background: #feefe3;
  border: 1px solid #fddfc7;
  color: #c26410;
}

.board-item-author {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-h);
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.board-item-meta {
  color: var(--text);
  font-size: 0.82rem;
  white-space: nowrap;
  opacity: 0.55;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 14px;
  flex-wrap: wrap;
}

.page-button,
.page-number {
  padding: 8px 10px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-family: var(--sans);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background: var(--sub);
  border-color: var(--sub);
  color: var(--bg);
}

.page-number-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* --- 상세정보 카드 스타일 --- */
.detail-card {
  display: grid;
  gap: 24px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  padding: 28px 32px;
}

.detail-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border);
}

.detail-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.detail-badge {
  max-width: 64px;
  flex-shrink: 0;
}

.detail-title-text {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-h);
  line-height: 1.35;
  font-family: var(--heading);
  word-break: break-all;
}

.detail-meta-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  font-size: 0.85rem;
}

.detail-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label {
  font-weight: 400;
  color: var(--text);
  opacity: 0.55; 
}

.meta-value-author {
  font-size: 0.85rem;
  font-weight: 400;
  color: var(--text);
  opacity: 0.8; 
}

.meta-value-date {
  font-size: 0.82rem;
  font-weight: 400;
  color: var(--text);
  opacity: 0.55; 
}

.detail-meta-divider {
  color: var(--text);
  opacity: 0.3;
  font-size: 0.85rem;
  user-select: none;
}

.detail-body {
  padding: 12px 4px 24px;
  background: transparent;
  border: none;
}

.detail-content {
  min-height: 260px;
  white-space: pre-wrap;
  line-height: 1.85;
  letter-spacing: 0.01em;
  margin: 0;
  color: var(--text);
  font-size: 1.08rem;
}

.detail-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
}

.right-actions {
  display: flex;
  gap: 10px;
}

.like-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--sans);
  user-select: none;
}

.like-button:hover {
  background: var(--accent-bg);
  border-color: var(--sub);
}

.like-button.liked {
  border-color: var(--sub);
  background: var(--accent-bg);
}

.like-label {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.7;
}

.like-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
}

.primary-button,
.secondary-button,
.danger-button {
  padding: 9px 14px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-family: var(--sans);
}

.primary-button {
  background: var(--sub);
  color: var(--bg);
  border-color: var(--sub);
}

.secondary-button {
  background: var(--main);
  color: var(--sub);
}

.danger-button {
  background: rgba(255, 202, 40, 0.16);
  color: var(--sub);
  border-color: var(--point);
}

/* --- 글쓰기/수정용 커스텀 디자인 --- */
.editor-category-badge {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.editor-select-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; 
  cursor: pointer;
}

.editor-title-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-h);
  outline: none;
  padding: 0;
  font-family: var(--heading);
}

.editor-title-input::placeholder {
  color: var(--text);
  opacity: 0.25;
}

.editor-meta-input {
  border: none;
  border-bottom: 1px solid transparent;
  background: transparent;
  color: var(--text);
  font-size: 0.85rem;
  outline: none;
  width: 80px;
  padding: 0;
  font-family: var(--sans);
}

.editor-meta-input:focus {
  border-bottom-color: var(--sub); 
}

.editor-meta-input::placeholder {
  color: var(--text);
  opacity: 0.3;
}

.editor-meta-input:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.editor-textarea {
  width: 100%;
  min-height: 260px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text);
  font-size: 1.02rem;
  line-height: 1.8;
  padding: 16px;
  outline: none;
  resize: vertical;
  font-family: var(--sans);
  box-sizing: border-box;
}

.editor-textarea:focus {
  border-color: var(--sub);
}

.editor-textarea::placeholder {
  color: var(--text);
  opacity: 0.35;
}

.empty-state {
  color: var(--text);
  padding: 24px 12px;
  text-align: center;
}

@media (max-width: 900px) {
  .board-table-header {
    display: none;
  }

  .board-list li {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 16px;
  }

  .col-category, 
  .col-title, 
  .col-author, 
  .col-stats-like,
  .col-stats-view,
  .col-date {
    text-align: left;
    width: 100%;
    padding: 0;
  }

  .col-stats-like::before {
    content: "좋아요 ";
    font-size: 0.8rem;
    opacity: 0.6;
  }
  
  .col-stats-view::before {
    content: "조회수 ";
    font-size: 0.8rem;
    opacity: 0.6;
  }

  .col-date {
    display: flex;
    justify-content: flex-start;
    opacity: 0.6;
    font-size: 0.8rem;
  }

  .board-item-title {
    font-size: 1rem;
    white-space: normal;
  }

  .board-content {
    flex-direction: column;
    align-items: stretch;
  }

  /* 반응형 모바일 헤더 대응 */
  .board-header {
    flex-direction: column;
    gap: 12px;
  }

  .header-first-row {
    width: 100%;
  }

  /* 모바일 화면에서는 불필요한 고정 높이를 해제하여 유연하게 대응 */
  .header-second-row {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 10px;
    height: auto;
    min-height: auto;
  }

  .header-second-row.hide-layout {
    display: none;
  }

  .search-box {
    max-width: none;
  }

  .write-button,
  .header-right .secondary-button {
    width: auto;
  }

  .detail-card {
    padding: 20px;
  }

  .detail-heading {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 16px;
  }
  
  .detail-title-wrap {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
  }
  
  .editor-category-select,
  .editor-title-input {
    width: 100%;
  }

  .detail-meta-wrap {
    width: 100%;
    justify-content: flex-start;
    border-top: 1px dashed var(--border);
    padding-top: 12px;
    font-size: 0.8rem;
    flex-wrap: wrap; 
    gap: 8px 12px;
  }

  .detail-actions {
    flex-direction: row; 
    justify-content: space-between;
    width: 100%;
  }
}
</style>