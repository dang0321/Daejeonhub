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
  border-bottom: 1px solid var(--border);
}

.board-header h1 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--sub);
}

.board-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  min-width: 260px;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: white;
  color: var(--text);
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

.board-list li:hover,
.board-list li.active {
  background: var(--main);
  transform: translateX(2px);
}

.board-item-main strong {
  font-size: 0.96rem;
  color: var(--sub);
}

.board-item-main p {
  margin: 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.page-button,
.page-number {
  padding: 8px 10px;
  border: 1px solid var(--border);
  background: white;
  color: var(--sub);
  cursor: pointer;
}

.page-number.active {
  background: var(--sub);
  border-color: var(--sub);
  color: white;
}

.primary-button {
  background: var(--sub);
  color: white;
  border: 1px solid var(--sub);
}

.secondary-button {
  background: var(--main);
  color: var(--sub);
  border: 1px solid var(--border);
}

.danger-button {
  background: #fff8e1;
  color: #8a5f00;
  border-color: var(--point);
}

.modal-panel {
  background: white;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.modal-form input,
.modal-form textarea {
  border: 1px solid var(--border);
}

.empty-state {
  color: #6b7280;
}
</style>