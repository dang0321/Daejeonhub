<template>
  <div class="board-page">
    <header class="board-header">
      <h1>게시판</h1>
      <div class="board-actions">
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
        <div class="panel-header">
          <h2>게시글 목록</h2>
          <p class="panel-subtitle">게시글을 선택하면 상세 내용을 확인할 수 있어요.</p>
        </div>

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
            @click="currentPage -= 1"
          >
            이전
          </button>

          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>

          <button
            type="button"
            class="page-button"
            :disabled="currentPage === totalPages"
            @click="currentPage += 1"
          >
            다음
          </button>
        </div>
      </section>

      <section class="board-detail" v-else>
        <div class="detail-toolbar">
          <button type="button" class="secondary-button" @click="clearSelection">목록으로</button>
        </div>

        <div class="detail-card">
          <div class="detail-heading">
            <div>
              <p class="detail-label">게시글 상세</p>
              <h3>{{ selectedBoard.title }}</h3>
            </div>
            <span class="detail-date">{{ formatDate(selectedBoard.createdAt) }}</span>
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
import { ref, computed } from 'vue'
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

const selectedBoard = computed(() => {
  return boards.value.find((item) => item.id === selectedId.value) || null
})

const modalTitle = computed(() =>
  modalMode.value === 'create' ? '게시글 작성' : '게시글 수정'
)

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
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f7fb 100%);
  min-height: 100%;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 12px;
  padding: 20px 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

.board-header h1 {
  margin: 0;
  font-size: 1.3rem;
  color: #111827;
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  min-width: 260px;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 10px;
  background: #f9fafb;
}

.board-content {
  display: flex;
  justify-content: center;
  align-items: start;
}

.board-list-wrapper,
.board-detail {
  width: min(760px, 100%);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
  min-height: 420px;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 0.92rem;
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
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.board-list li:last-child {
  border-bottom: none;
}

.board-list li:hover,
.board-list li.active {
  background: #eef4ff;
  border-color: #dbeafe;
  transform: translateY(-1px);
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
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f3f4f6;
}

.page-button {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #111827;
  cursor: pointer;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #4b5563;
  font-size: 0.92rem;
  font-weight: 600;
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
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.detail-label {
  margin: 0 0 6px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #2563eb;
  text-transform: uppercase;
}

.detail-heading h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #111827;
}

.detail-date {
  color: #6b7280;
  font-size: 0.85rem;
  white-space: nowrap;
}

.detail-body {
  background: #f8fafc;
  border: 1px solid #edf2f7;
  border-radius: 12px;
  padding: 16px;
}

.detail-content {
  white-space: pre-wrap;
  line-height: 1.8;
  margin: 0;
  color: #374151;
}

.detail-actions,
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.primary-button,
.secondary-button,
.danger-button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-button {
  background: #2563eb;
  color: white;
}

.primary-button:hover,
.secondary-button:hover,
.danger-button:hover {
  transform: translateY(-1px);
}

.secondary-button {
  background: #e5e7eb;
  color: #111827;
}

.danger-button {
  background: #dc2626;
  color: white;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
  padding: 18px;
}

.modal-panel {
  width: min(560px, 100%);
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
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
  border-radius: 10px;
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