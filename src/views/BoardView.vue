<template>
  <div class="board-page">
    <header class="board-header">
      <h1>게시판</h1>
      <div class="board-actions" v-if="!selectedBoard">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="제목 또는 내용을 검색하세요"
          class="search-input"
        />
        <button class="primary-button" @click="openCreateModal">글쓰기</button>
      </div>
    </header>

    <section class="board-content">
      <section class="board-list-wrapper" v-if="!selectedBoard">
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
              <strong>{{ board.title }}</strong>
              <p>{{ board.content }}</p>
            </div>
            <span class="board-item-meta">{{ formatDate(board.createdAt) }}</span>
          </li>
        </ul>

        <div v-if="filteredBoards.length > 0" class="pagination">
          <button
            type="button"
            class="page-button"
            :disabled="currentPage === 1"
            @click="goToPage(1)"
          >
            ««
          </button>

          <button
            type="button"
            class="page-button"
            :disabled="currentPage === 1"
            @click="currentPage -= 1"
          >
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

          <button
            type="button"
            class="page-button"
            :disabled="currentPage === totalPages"
            @click="currentPage += 1"
          >
            다음
          </button>

          <button
            type="button"
            class="page-button"
            :disabled="currentPage === totalPages"
            @click="goToPage(totalPages)"
          >
            »»
          </button>
        </div>
      </section>

      <section class="board-detail" v-else>
        <div class="detail-toolbar">
          <button type="button" class="secondary-button" @click="clearSelection">목록으로</button>
        </div>

        <div class="detail-card">
          <div class="detail-heading">
            <div class="detail-title-wrap">
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
            <button class="secondary-button" @click="openEditModal">수정</button>
            <button class="danger-button" @click="openDeleteModal">삭제</button>
          </div>
        </div>
      </section>
    </section>

    <div class="modal-backdrop" v-if="modalOpen" @click.self="closeModal">
      <div class="modal-panel">
        <h3>{{ modalTitle }}</h3>
        <form @submit.prevent="submitForm" class="modal-form">
          <label>
            제목
            <input v-model="form.title" type="text" required maxlength="100" />
          </label>

          <label>
            내용
            <textarea v-model="form.content" rows="6" required maxlength="1000"></textarea>
          </label>

          <label>
            비밀번호
            <input v-model="form.password" type="password" required maxlength="20" />
          </label>

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeModal">취소</button>
            <button type="submit" class="primary-button">저장</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-backdrop" v-if="deleteModalOpen" @click.self="closeDeleteModal">
      <div class="modal-panel small">
        <h3>삭제 확인</h3>
        <p>삭제하려면 비밀번호를 입력하세요.</p>
        <form @submit.prevent="confirmDelete" class="modal-form">
          <label>
            비밀번호
            <input v-model="deletePassword" type="password" required maxlength="20" />
          </label>
          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeDeleteModal">취소</button>
            <button type="submit" class="danger-button">삭제</button>
          </div>
        </form>
      </div>
    </div>
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
const selectedId = ref(null)
const modalOpen = ref(false)
const deleteModalOpen = ref(false)
const modalMode = ref('create')
const form = ref({ title: '', content: '', password: '' })
const deletePassword = ref('')
const boards = ref(listBoards())
const pageSize = 5
const currentPage = ref(1)

const filteredBoards = computed(() => {
  const normalized = searchTerm.value.trim().toLowerCase()
  const items = boards.value

  const filtered = normalized
    ? items.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.content.toLowerCase().includes(normalized)
        )
      })
    : items

  return filtered
    .slice()
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

const modalTitle = computed(() =>
  modalMode.value === 'create' ? '게시글 작성' : '게시글 수정'
)

watch(searchTerm, () => {
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
}

function clearSelection() {
  selectedId.value = null
}

function openCreateModal() {
  modalMode.value = 'create'
  form.value = { title: '', content: '', password: '' }
  modalOpen.value = true
}

function openEditModal() {
  if (!selectedBoard.value) return

  modalMode.value = 'edit'
  form.value = {
    title: selectedBoard.value.title,
    content: selectedBoard.value.content,
    password: ''
  }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  form.value = { title: '', content: '', password: '' }
}

function openDeleteModal() {
  deletePassword.value = ''
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  deletePassword.value = ''
}

function submitForm() {
  if (modalMode.value === 'create') {
    createBoard({
      title: form.value.title,
      content: form.value.content,
      password: form.value.password
    })
    closeModal()
    refreshBoards()
    return
  }

  if (!selectedBoard.value) {
    closeModal()
    return
  }

  const updated = updateBoard(
    selectedBoard.value.id,
    {
      title: form.value.title,
      content: form.value.content
    },
    form.value.password
  )

  if (!updated) {
    alert('비밀번호가 일치하지 않거나 게시글을 찾을 수 없습니다.')
    return
  }

  closeModal()
  refreshBoards()
}

function confirmDelete() {
  if (!selectedBoard.value) {
    closeDeleteModal()
    return
  }

  const removed = deleteBoard(selectedBoard.value.id, deletePassword.value)
  if (!removed) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }

  closeDeleteModal()
  selectedId.value = null
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
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 12px;
  padding: 18px 0 20px;
  border-bottom: 1px solid #e5e7eb;
}

.board-header h1 {
  margin: 0;
  font-size: 1.2rem;
  color: #111827;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  min-width: 260px;
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
}

.board-content {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
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
  border-bottom: 1px solid #cbd5e1;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
  border-radius: 6px;
}

.board-list li:last-child {
  border-bottom: 1px solid #cbd5e1;
}

.board-list li:hover,
.board-list li.active {
  background: #eef2ff;
  transform: translateX(2px);
}

.board-item-main {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.board-item-main strong {
  font-size: 0.96rem;
  color: #111827;
}

.board-item-main p {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.board-item-meta {
  color: #6b7280;
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
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
}

.page-button,
.page-number {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  cursor: pointer;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-number.active {
  background: #f3f4f6;
  border-color: #cbd5e1;
}

.page-number-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.detail-toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 14px;
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
  padding-bottom: 14px;
  border-bottom: 1px solid #e5e7eb;
}

.detail-title-wrap {
  display: flex;
  flex: 1 1 auto;
  align-items: flex-end;
  min-width: 0;
}

.detail-heading h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.detail-date-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  color: #6b7280;
  flex-shrink: 0;
  padding-left: 12px;
}

.detail-date-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.detail-date {
  font-size: 0.95rem;
  color: #4b5563;
  white-space: nowrap;
}

.detail-body {
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
}

.detail-content {
  min-height: 240px;
  white-space: pre-wrap;
  line-height: 1.9;
  letter-spacing: 0.015em;
  margin: 0;
  color: #374151;
  font-size: 1rem;
}

.detail-actions,
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.primary-button,
.secondary-button,
.danger-button {
  padding: 9px 14px;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #111827;
  cursor: pointer;
}

.secondary-button {
  background: #f9fafb;
}

.danger-button {
  background: #fdf2f2;
  color: #991b1b;
  border-color: #fecaca;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
  padding: 18px;
}

.modal-panel {
  width: min(560px, 100%);
  background: white;
  border: 1px solid #e5e7eb;
  padding: 24px;
}

.modal-panel.small {
  width: min(420px, 100%);
}

.modal-form {
  display: grid;
  gap: 14px;
}

.modal-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #111827;
}

.modal-form input,
.modal-form textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
  font-size: 14px;
}

.empty-state {
  color: #6b7280;
  padding: 24px 12px;
  text-align: center;
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

  .board-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    min-width: 0;
  }
}
</style>