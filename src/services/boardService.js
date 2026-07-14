const STORAGE_KEY = 'vue3-board-items'

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
  return {
    id: item.id,
    title: item.title || '',
    content: item.content || '',
    password: item.password || '',
    createdAt: item.createdAt || new Date().toISOString()
  }
}

export function listBoards(searchTerm = '') {
  const boards = loadBoards()
  const normalized = searchTerm.trim().toLowerCase()

  const filtered = normalized
    ? boards.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.content.toLowerCase().includes(normalized)
        )
      })
    : boards

  return filtered
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getBoard(id) {
  const boards = loadBoards()
  return boards.find((item) => item.id === id) || null
}

export function createBoard({ title, content, password }) {
  const boards = loadBoards()
  const newBoard = formatBoardItem({
    id: buildId(),
    title: title.trim(),
    content: content.trim(),
    password: password.trim(),
    createdAt: new Date().toISOString()
  })

  boards.push(newBoard)
  saveBoards(boards)
  return newBoard
}

export function updateBoard(id, { title, content }, password) {
  const boards = loadBoards()
  const index = boards.findIndex((item) => item.id === id)
  if (index === -1) {
    return null
  }

  const board = boards[index]
  if (board.password !== String(password)) {
    return null
  }

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
