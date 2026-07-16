<template>
  <div class="board-page">
    <header class="board-header">
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

    <section class="board-content list-layout" v-if="!selectedBoard && !isCreating && !isEditing">
      <section class="board-list-wrapper">
        <div v-if="filteredBoards.length === 0" class="empty-state">
          등록된 게시글이 없습니다.
        </div>

        <div v-else class="board-table-container">
          <div class="board-table-header">
            <span class="col-seq">번호</span>
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
              <div class="col-seq">
                <span class="board-item-seq">{{ board.seq }}</span>
              </div>
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
                <span class="stat-number">
                  {{ board.likes || 0 }}
                </span>
              </div>
              <div class="col-stats-view">
                <span class="stat-number">
                  {{ board.views || 0 }}
                </span>
              </div>
            </li>
          </ul>
        </div>

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

    <section class="board-content detail-layout" v-else-if="selectedBoard && !isCreating && !isEditing">
      <section class="board-detail">
        <div class="detail-card">
          <div class="detail-heading" style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
            <div class="detail-title-wrap" style="display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0;">
              <span class="board-list-category detail-badge" :class="getCategoryClass(selectedBoard.category)" style="flex-shrink: 0;">
                {{ selectedBoard.category }}
              </span>
              <h3 class="detail-title-text" style="margin: 0; font-size: 1.25rem; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; min-width: 0;">
                <span class="detail-title-seq" style="margin-right: 4px;">#{{ selectedBoard.seq }}</span>
                {{ selectedBoard.title }}
              </h3>
            </div>
            
            <div class="detail-meta-wrap" style="display: flex; justify-content: flex-end; align-items: center; gap: 8px; width: 100%; font-size: 0.875rem; color: #666;">
              <span class="detail-meta-item">
                <span class="meta-label" style="margin-right: 4px;">작성자</span>
                <span class="meta-value-author" style="font-weight: 500;">{{ selectedBoard.nickname }}</span>
              </span>
              <span class="detail-meta-divider" style="color: #ccc;">|</span>
              <span class="detail-meta-item">
                <span class="meta-label" style="margin-right: 4px;">조회수</span>
                <span class="meta-value-author">{{ selectedBoard.views || 0 }}</span>
              </span>
              <span class="detail-meta-divider" style="color: #ccc;">|</span>
              <span class="detail-meta-item">
                <span class="meta-label" style="margin-right: 4px;">등록일</span>
                <span class="meta-value-date">{{ formatFullDate(selectedBoard.createdAt) }}</span>
              </span>
            </div>
          </div>

          <div class="detail-body" style="padding: 24px 8px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin: 20px 0;">
            <p class="detail-content" style="font-size: 1.05rem; line-height: 1.75; color: #333; white-space: pre-wrap; word-break: break-word; margin: 0; letter-spacing: -0.02em;">
              {{ selectedBoard.content }}
            </p>
          </div>

          <div class="detail-actions">
            <button 
              type="button" 
              class="like-button" 
              :class="{ liked: isCurrentPostLiked }" 
              @click="handleLikeToggle"
              style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px; border: 1px solid #ddd; background-color: #fff; cursor: pointer; font-size: 0.95rem; transition: all 0.2s ease;"
            >
              <span class="like-icon" style="font-size: 1.1rem; line-height: 1;">
                {{ isCurrentPostLiked ? '💚' : '🩶' }}
              </span>
              <span class="like-label" style="font-weight: 500; color: #555;">좋아요</span>
              <span class="like-count" style="font-weight: bold; color: #333;">{{ selectedBoard.likes || 0 }}</span>
            </button>

            <div class="right-actions">
              <button class="secondary-button" type="button" @click="startEdit">수정</button>
              <button class="danger-button" type="button" @click="confirmDelete">삭제</button>
            </div>
          </div>

          <div class="comment-section">
            <h4 class="comment-section-title">댓글 {{ comments.length }}</h4>
            
            <div v-if="comments.length === 0" class="comment-empty">
              등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!
            </div>
            <div v-else class="comment-list">
              <div v-for="c in comments" :key="c.id" class="comment-item">
                <div class="comment-item-header">
                  <span class="comment-item-author">{{ c.nickname }}</span>
                  <span class="comment-item-date">{{ formatDate(c.createdAt) }}</span>
                  <button type="button" class="comment-delete-btn" @click="handleDeleteComment(c.id)">
                    삭제
                  </button>
                </div>
                <p class="comment-item-content">{{ c.content }}</p>
              </div>
            </div>

            <form class="comment-form" @submit.prevent="submitComment">
              <div class="comment-form-meta">
                <input 
                  v-model="newComment.nickname" 
                  type="text" 
                  required 
                  maxlength="15" 
                  placeholder="닉네임" 
                  class="comment-meta-input"
                />
                <input 
                  v-model="newComment.password" 
                  type="password" 
                  required 
                  maxlength="20" 
                  placeholder="비밀번호" 
                  class="comment-meta-input"
                />
              </div>
              <div class="comment-form-body">
                <textarea 
                  v-model="newComment.content" 
                  required 
                  maxlength="500" 
                  placeholder="댓글 내용을 입력해 주세요" 
                  class="comment-textarea"
                ></textarea>
                <button type="submit" class="primary-button comment-submit-btn">등록</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </section>

    <section class="board-content detail-layout" v-else>
      <form class="board-detail" @submit.prevent="submitForm">
        <div class="detail-card">
          <div class="detail-heading">
            <div class="detail-title-wrap">
              <span class="board-list-category detail-badge" :class="getCategoryClass(form.category)">
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

          <div class="detail-body">
            <textarea 
              v-model="form.content" 
              rows="15" 
              required 
              maxlength="1000" 
              placeholder="내용을 입력하세요"
              class="editor-textarea"
            ></textarea>
          </div>

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
  incrementViews,
  // [신규 추가] boardService에서 구현한 댓글 API 호출 가져오기
  getComments,
  addComment,
  deleteComment
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
const pageSize = 10 
const currentPage = ref(1)

const userLikedPostIds = ref([])
const viewedPostIds = ref([])

// [신규 추가] 댓글 데이터를 담아둘 상태 변수
const comments = ref([])
const newComment = ref({
  nickname: '',
  password: '',
  content: ''
})

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

  return boards.value.filter((item) => {
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

// [신규 추가] 특정 게시글의 댓글을 리로드하는 전용 함수
function loadComments() {
  if (!selectedId.value) return
  comments.value = getComments(selectedId.value)
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

  // [신규 추가] 상세 글을 들어갈 때 해당 글에 작성된 댓글 로드
  loadComments()
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

// [신규 추가] 댓글 등록 함수
function submitComment() {
  if (!newComment.value.nickname.trim() || !newComment.value.password.trim() || !newComment.value.content.trim()) {
    alert('닉네임, 비밀번호, 내용을 모두 작성해주세요.')
    return
  }

  addComment(selectedId.value, {
    nickname: newComment.value.nickname.trim(),
    password: newComment.value.password.trim(),
    content: newComment.value.content.trim()
  })

  // 등록 완료 후 폼 비우기 및 새로고침
  newComment.value = { nickname: '', password: '', content: '' }
  loadComments()
}

// [신규 추가] 댓글 삭제 함수
function handleDeleteComment(commentId) {
  const password = prompt('댓글을 삭제하려면 비밀번호를 입력하세요.')
  if (!password) return

  const success = deleteComment(commentId, password)
  if (!success) {
    alert('비밀번호가 일치하지 않거나 존재하지 않는 댓글입니다.')
    return
  }

  loadComments()
}
</script>

<style scoped>
.board-page {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 24px 28px 40px;
  min-height: 100vh;
  scrollbar-gutter: stable;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
}

/* 헤더 영역 */
.board-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 18px;
  padding: 18px 0 20px;
  border-bottom: 1px solid var(--border);
}

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

.header-second-row {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  height: 38px;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.15s ease, visibility 0.15s ease;
}

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

/* 레이아웃 래퍼 */
.board-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 24px;
}

.board-content.list-layout {
  max-width: 100%;
}

.board-content.detail-layout {
  max-width: 900px;
  margin: 0 auto;
}

.board-list-wrapper,
.board-detail {
  width: 100%;
  background: transparent;
  border: none;
  padding: 10px 0;
  min-height: auto;
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
  grid-template-columns: 60px 80px 1fr 110px 100px 80px 80px;
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

.col-seq { text-align: center; }
.col-category { text-align: center; }
.col-title { text-align: left; min-width: 0; padding-left: 8px; }
.col-author { text-align: left; padding-left: 4px; }
.col-date { text-align: center; }
.col-stats-like, .col-stats-view { text-align: center; }

.board-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.board-list li {
  padding: 14px 18px;
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

/* 👇 [수정된 디자인 영역] 
  카테고리, 제목 제외 모든 텍스트 요소를 투명도 80(0.8)으로 일괄 통일 
*/
.board-item-seq {
  font-size: 0.88rem;
  color: var(--text);
  opacity: 0.8; /* 👈 60% -> 80% 변경 */
  font-family: var(--sans);
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

.board-item-author {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-h);
  opacity: 0.8; /* 👈 90% -> 80% 변경 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.board-item-meta {
  color: var(--text);
  font-size: 0.82rem;
  white-space: nowrap;
  opacity: 0.8; /* 👈 55% -> 80% 변경 */
}

.stat-number {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  opacity: 0.8; /* 👈 모든 통계 수치 투명도 80% 고정 */
}

/* 카테고리 뱃지 고유 스타일 */
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

/* 페이지네이션 */
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

/* 상세정보 카드 */
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

.detail-title-seq {
  color: var(--sub);
  margin-right: 4px;
  font-weight: 500;
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
  min-height: 200px;
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

/* 글쓰기/수정 폼 */
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

/* 👇 [신규 디자인 추가 영역] 
  원래 카드 내부 분위기 및 컬러 시스템(CSS 변수)과 호환되는 댓글 고유 디자인 스타일 
*/
.comment-section {
  margin-top: 32px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
}

.comment-section-title {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-h);
  font-family: var(--heading);
}

.comment-empty {
  padding: 24px 8px;
  text-align: center;
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.55;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.comment-item {
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--border);
}

.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.comment-item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-item-author {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-h);
}

.comment-item-date {
  font-size: 0.78rem;
  color: var(--text);
  opacity: 0.55;
}

.comment-delete-btn {
  margin-left: auto;
  border: none;
  background: transparent;
  color: var(--text);
  opacity: 0.5;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px 4px;
  font-family: var(--sans);
  transition: opacity 0.2s;
}

.comment-delete-btn:hover {
  opacity: 1;
  color: var(--point, #ff1744);
}

.comment-item-content {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--text);
  white-space: pre-wrap;
}

/* 댓글 입력 폼 스타일 */
.comment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--accent-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.comment-form-meta {
  display: flex;
  gap: 10px;
}

.comment-meta-input {
  padding: 6px 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.8rem;
  outline: none;
  font-family: var(--sans);
  width: 120px;
}

.comment-meta-input:focus {
  border-color: var(--sub);
}

.comment-form-body {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.comment-textarea {
  flex: 1;
  height: 60px;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.88rem;
  line-height: 1.5;
  outline: none;
  resize: none;
  font-family: var(--sans);
}

.comment-textarea:focus {
  border-color: var(--sub);
}

.comment-submit-btn {
  padding: 0 16px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

/* 반응형 스타일 */
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

  .col-seq,
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

  .col-seq::before {
    content: "글번호 ";
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .col-stats-like::before {
    content: "좋아요 ";
    font-size: 0.8rem;
    opacity: 0.8;
  }
  
  .col-stats-view::before {
    content: "조회수 ";
    font-size: 0.8rem;
    opacity: 0.8;
  }

  .col-date {
    display: flex;
    justify-content: flex-start;
    opacity: 0.8;
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

  .board-header {
    flex-direction: column;
    gap: 12px;
  }

  .header-first-row {
    width: 100%;
  }

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

  /* 댓글 반응형 스타일 추가 */
  .comment-form-body {
    flex-direction: column;
  }

  .comment-textarea {
    height: 80px;
  }

  .comment-submit-btn {
    padding: 10px;
    text-align: center;
  }
}
</style>