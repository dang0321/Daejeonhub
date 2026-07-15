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

      <!-- 목록 보기 화면일 때만 표시되는 헤더 컨트롤 영역 -->
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
              placeholder="제목, 내용 또는 닉네임을 검색하세요"
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

        <div v-else class="board-table-container">
          <!-- 게시판 테이블 헤더 -->
          <div class="board-table-header">
            <span class="col-category">분류</span>
            <span class="col-title">제목</span>
            <span class="col-author">작성자</span>
            <span class="col-date">등록일</span>
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
              <span class="board-category" :class="getCategoryClass(selectedBoard.category)">
                {{ selectedBoard.category }}
              </span>
              <h3>{{ selectedBoard.title }}</h3>
            </div>
            <div class="detail-date-wrap">
              <span class="detail-author">{{ selectedBoard.nickname }}</span>
              <span class="detail-date-label">작성일</span>
              <span class="detail-date">{{ formatFullDate(selectedBoard.createdAt) }}</span>
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
          <!-- 카테고리 선택 -->
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

          <!-- 닉네임 입력란 -->
          <label class="form-field">
            <span>닉네임</span>
            <input 
              v-model="form.nickname" 
              type="text" 
              required 
              maxlength="15" 
              placeholder="닉네임을 입력해주세요 (공백 제외)"
              class="form-input" 
              :disabled="isEditing"
            />
            <small class="form-help-text" v-if="isEditing">* 작성자 닉네임은 수정할 수 없습니다.</small>
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
  nickname: '',
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

.board-table-container {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  overflow: hidden;
}

/* 📐 해결책 적용: 분류 컬럼은 80px로 원상복구하고, 제목과 닉네임의 공간을 넉넉하게 재정렬했습니다. */
.board-table-header,
.board-list li {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px;
  align-items: center;
  gap: 24px;
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

/* 📐 분류(카테고리) 영역과 제목 사이에 16px의 공간을 밀어내어 분리시킵니다. */
.col-title {
  text-align: left;
  min-width: 0;
  padding-left: 16px; 
}

.col-author {
  text-align: left;
  padding-left: 16px;
}
.col-date {
  text-align: right;
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
  font-weight: 400;
  color: var(--text);
  opacity: 0.8;
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

.detail-title-wrap .board-category {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 6px;
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
  gap: 4px;
  color: var(--text);
  flex-shrink: 0;
  padding-left: 12px;
}

.detail-author {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-h);
  margin-bottom: 2px;
}

.detail-date-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--sub);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.detail-date {
  font-size: 0.92rem;
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

.form-input:disabled {
  opacity: 0.75;
  background-color: var(--accent-bg);
  cursor: not-allowed;
}

.form-help-text {
  font-size: 0.8rem;
  color: var(--sub);
  opacity: 0.8;
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
  .col-date {
    text-align: left;
    width: 100%;
    padding: 0;
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