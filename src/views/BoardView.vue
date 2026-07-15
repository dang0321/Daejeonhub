<template>
  <div class="board-page">
    <header class="board-header">
      <div class="header-top">
        <h1>게시판</h1>

        <!-- 우측 끝 목록 이동 / 취소 버튼 제어 -->
        <div class="board-actions" v-if="isCreating || isEditing">
          <button class="secondary-button" type="button" @click="cancelForm">취소 · 목록으로</button>
        </div>
        <div class="board-actions" v-else-if="selectedBoard">
          <button class="secondary-button" type="button" @click="clearSelection">목록으로</button>
        </div>
      </div>

      <!-- 목록 보기 화면일 때만 표시되는 헤더 컨트롤 영역 (검색창 + 카테고리 탭 + 글쓰기 버튼) -->
      <div class="board-actions main-actions" v-if="!selectedBoard && !isCreating && !isEditing">
        <div class="search-and-category">
          <!-- 돋보기 아이콘이 들어간 검색 박스 -->
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchTerm"
              type="search"
              placeholder="제목 또는 내용을 검색하세요"
              class="search-input"
            />
          </div>

          <!-- 카테고리 선택 탭/버튼 메뉴 -->
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
        </div>

        <!-- 우측 끝 글쓰기 버튼 -->
        <button class="primary-button write-button" type="button" @click="startCreate">글쓰기</button>
      </div>
    </header>

    <!-- 1. 목록 화면 -->
    <section class="board-content" v-if="!selectedBoard && !isCreating && !isEditing">
      <section class="board-list-wrapper">
        <div v-if="filteredBoards.length === 0" class="empty-state">
          등록된 게시글이 없습니다.
        </div>

        <ul v-else class="board-list">
          <li
            v-for="board in pagedBoards"
            :key="board.id"
            :class="{ active: selectedBoard && selectedBoard.id === board.id }"
            @click="selectBoard(board.id)"
          >
            <div class="board-item-main">
              <strong>
                <span class="board-list-category">[{{ board.category }}]</span>
                {{ board.title }}
              </strong>
              <p>{{ board.content }}</p>
            </div>
            <span class="board-item-meta">{{ formatDate(board.createdAt) }}</span>
          </li>
        </ul>

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

          <button type="button" class="page-button" :disabled="currentPage === totalPages" @click="currentPage -= 1">
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
              <span class="board-category">
                {{ selectedBoard.category }}
              </span>
              <h3>{{ selectedBoard.title }}</h3>
            </div>
            <div class="detail-date-wrap">
              <span class="detail-date-label">작성일</span>
              <span class="detail-date">{{ formatDate(selectedBoard.createdAt) }}</span>
            </div>
          </div>

          <div class="detail-body">
            <p class="detail-content">{{ selectedBoard.content }}</p>
          </div>

          <div class="detail-actions">
            <button class="secondary-button" type="button" @click="startEdit">수정</button>
            <button class="danger-button" type="button" @click="confirmDelete">삭제</button>
          </div>
        </div>
      </section>
    </section>

    <!-- 3. 글쓰기 및 수정 화면 -->
    <section class="board-content" v-else>
      <form class="board-form-page" @submit.prevent="submitForm">
        <div class="form-header">
          <h2>{{ isCreating ? '글쓰기' : '수정' }}</h2>
          <button class="secondary-button" type="button" @click="cancelForm">취소 · 목록으로</button>
        </div>

        <div class="editor-card">
          <!-- 사용자가 직접 카테고리를 선택할 수 있도록 disabled를 제거했습니다 -->
          <label class="form-field">
            <span>카테고리</span>
            <select
              v-model="form.category"
              class="form-input"
            >
              <option
                v-for="category in categories.filter(c => c !== '전체')"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </label>

          <label class="form-field">
            <span>제목</span>
            <input v-model="form.title" type="text" required maxlength="100" class="form-input" />
          </label>

          <label class="form-field">
            <span>내용</span>
            <textarea v-model="form.content" rows="12" required maxlength="1000" class="form-textarea"></textarea>
          </label>

          <label class="form-field" v-if="isCreating">
            <span>비밀번호</span>
            <input v-model="form.password" type="password" required maxlength="20" class="form-input" />
          </label>

          <div class="form-actions">
            <button class="secondary-button" type="button" @click="cancelForm">취소</button>
            <button class="primary-button" type="submit">저장</button>
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  listBoards,
  createBoard,
  updateBoard,
  deleteBoard
} from '../services/boardService'

const searchTerm = ref('')
const categories = ['전체', '관광', '맛집', '자유']
const selectedCategory = ref('전체')
const selectedId = ref(null)
const isCreating = ref(false)
const isEditing = ref(false)

const form = ref({
  category: '자유',
  title: '',
  content: '',
  password: ''
})

const boards = ref(listBoards())
const pageSize = 5
const currentPage = ref(1)

const filteredBoards = computed(() => {
  const normalized = searchTerm.value.trim().toLowerCase()

  return boards.value
    .filter((item) => {
      const searchMatched =
        !normalized ||
        item.title.toLowerCase().includes(normalized) ||
        item.content.toLowerCase().includes(normalized)

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
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function refreshBoards() {
  boards.value = listBoards()
}

function selectBoard(id) {
  selectedId.value = id
  isCreating.value = false
  isEditing.value = false
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

  // [기능 추가] 글쓰기를 누를 때 현재 필터링 상태('맛집', '관광' 등)를 기본값으로 추천하되, 
  // 사용자가 변경해서 저장할 수 있도록 유연하게 적용했습니다.
  const targetCategory = selectedCategory.value === '전체' ? '자유' : selectedCategory.value

  form.value = {
    category: targetCategory,
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
  
  // 기존 게시글의 카테고리를 그대로 유지하고, 수정 화면에서도 직접 수정 가능합니다.
  form.value = {
    category: selectedBoard.value.category,
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
    title: '',
    content: '',
    password: ''
  }
}

function submitForm() {
  if (isCreating.value) {
    createBoard({
      category: form.value.category,
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
</script>

<style scoped>
.board-page {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 24px 28px 40px;
  min-height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
}

.board-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
  gap: 16px;
  padding: 18px 0 20px;
  border-bottom: 1px solid var(--border);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.board-header h1 {
  margin: 0;
  font-size: 1.4rem;
  color: var(--text-h);
  font-family: var(--heading);
  flex-shrink: 0;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 
  [검색 및 카테고리 탭 정렬] 
  검색과 탭을 한 곳에 묶고 글쓰기 버튼을 우측 끝으로 밀어냅니다.
*/
.main-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: none;
  gap: 20px;
}

.search-and-category {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

/* 돋보기 아이콘을 품은 Wrapper */
.search-box {
  position: relative;
  flex: 1;
  max-width: 320px;
  display: flex;
  align-items: center;
}

/* 돋보기 아이콘 스타일 */
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

/* 카테고리 탭 버튼 스타일 */
.category-tabs {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
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

.board-list-wrapper,
.board-detail {
  width: 100%;
  max-width: none;
  background: transparent;
  border: none;
  padding: 20px 0;
  min-height: 420px;
}

.board-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.board-list li {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border-radius: 6px;
}

.board-list li:hover,
.board-list li.active {
  background: var(--accent-bg);
  transform: translateX(2px);
}

.board-item-main {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.board-item-main strong {
  font-size: 0.96rem;
  color: var(--text-h);
  font-family: var(--heading);
  display: flex;
  align-items: center;
  gap: 6px;
}

.board-list-category {
  color: var(--sub);
  font-weight: 700;
  font-size: 0.9rem;
}

.board-item-main p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.board-item-meta {
  color: var(--text);
  font-size: 0.8rem;
  white-space: nowrap;
  margin-top: 2px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
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

.detail-card {
  display: grid;
  gap: 16px;
}

.detail-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
}

.detail-title-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 1 auto;
  min-width: 0;
  gap: 4px;
}

.detail-heading h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-h);
  line-height: 1.4;
  font-family: var(--heading);
}

.detail-date-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  color: var(--text);
  flex-shrink: 0;
  padding-left: 12px;
}

.detail-date-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--sub);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.detail-date {
  font-size: 0.95rem;
  color: var(--text);
  white-space: nowrap;
}

.detail-body {
  padding: 20px 18px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg);
}

.detail-content {
  min-height: 240px;
  white-space: pre-wrap;
  line-height: 1.9;
  letter-spacing: 0.015em;
  margin: 0;
  color: var(--text);
  font-size: 1rem;
}

.detail-actions,
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

.board-form-page {
  width: 100%;
  display: grid;
  gap: 16px;
  padding: 20px 0;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.form-header h2 {
  margin: 0;
  color: var(--text-h);
  font-family: var(--heading);
  font-size: 1.3rem;
}

.editor-card {
  width: 100%;
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.form-field {
  display: grid;
  gap: 8px;
  color: var(--text);
  font-size: 0.95rem;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  background: var(--bg);
  color: var(--text);
  font-family: var(--sans);
  box-sizing: border-box;
}

.form-textarea {
  min-height: 400px;
  resize: vertical;
}

.empty-state {
  color: var(--text);
  padding: 24px 12px;
  text-align: center;
}

.board-category {
  display: inline-block;
  padding: 2px 8px;
  margin-bottom: 6px;
  border-radius: 999px;
  background: var(--sub);
  color: var(--bg);
  font-size: 0.75rem;
  font-weight: 600;
}

@media (max-width: 900px) {
  .board-content {
    flex-direction: column;
    align-items: stretch;
  }

  .board-header {
    flex-direction: column;
    align-items: stretch;
  }

  .main-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-and-category {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: none;
  }

  .write-button {
    margin-left: 0;
    margin-top: 8px;
  }

  .search-input {
    min-width: 0;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>