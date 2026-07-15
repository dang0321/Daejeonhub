const STORAGE_KEY = 'vue3-board-items'

// 허용된 카테고리 정의 (기존 데이터 호환 및 보정을 위함)
const ALLOWED_CATEGORIES = ['관광', '맛집', '자유']

function loadBoards() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.warn('boardService: localStorage parse failed', error)
    return []
  }
}

function saveBoards(boards) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards))
}

function buildId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function formatBoardItem(item) {
  const isValidCategory = ALLOWED_CATEGORIES.includes(item.category)
  return {
    id: item.id,
    category: isValidCategory ? item.category : '자유',
    nickname: item.nickname ? item.nickname.trim() : '익명',
    title: item.title || '',
    content: item.content || '',
    password: item.password || '',
    createdAt: item.createdAt || new Date().toISOString(),
    likes: Number(item.likes) || 0,
    views: Number(item.views) || 0 // 👈 [추가] 조회수 기본값 세팅
  }
}

export function listBoards(searchTerm = '') {
  const boards = loadBoards().map(formatBoardItem)

  const normalized = searchTerm.trim().toLowerCase()

  const filtered = normalized
    ? boards.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.content.toLowerCase().includes(normalized) ||
          item.nickname.toLowerCase().includes(normalized)
        )
      })
    : boards

  return filtered
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getBoard(id) {
  const boards = loadBoards().map(formatBoardItem)
  return boards.find((item) => item.id === id) || null
}

export function createBoard({
  category,
  nickname,
  title,
  content,
  password
}) {
  const boards = loadBoards()

  const newBoard = formatBoardItem({
    id: buildId(),
    category,
    nickname: nickname.trim(),
    title: title.trim(),
    content: content.trim(),
    password: password.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    views: 0 // 👈 [추가] 신규 생성 시 조회수 0으로 설정
  })

  boards.push(newBoard)
  saveBoards(boards)

  return newBoard
}

export function updateBoard(
  id,
  {
    category,
    title,
    content
  },
  password
) {
  const boards = loadBoards()

  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const board = boards[index]

  if (board.password !== String(password)) {
    return null
  }

  const newCategory = category || board.category || '자유'
  board.category = ALLOWED_CATEGORIES.includes(newCategory) ? newCategory : '자유'
  board.title = title.trim()
  board.content = content.trim()

  saveBoards(boards)

  return board
}

export function deleteBoard(id, password) {
  const boards = loadBoards()

  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) {
    return false
  }

  const board = boards[index]

  if (board.password !== String(password)) {
    return false
  }

  boards.splice(index, 1)

  saveBoards(boards)

  return true
}

// 👈 [추가] 조회수 증가 처리 로직
export function incrementViews(id) {
  const boards = loadBoards()
  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) return null

  const board = boards[index]
  board.views = (Number(board.views) || 0) + 1

  saveBoards(boards)
  return board
}

export function toggleLike(id, isAdding) {
  const boards = loadBoards()
  const index = boards.findIndex((item) => item.id === id)

  if (index === -1) {
    return null
  }

  const board = boards[index]
  
  if (typeof board.likes !== 'number') {
    board.likes = 0
  }

  if (isAdding) {
    board.likes += 1
  } else {
    board.likes = Math.max(0, board.likes - 1)
  }

  saveBoards(boards)
  return board
}