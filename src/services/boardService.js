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
  // 기존 데이터 중 카테고리가 없거나 허용되지 않은 카테고리인 경우 '자유'로 보정합니다.
  const isValidCategory = ALLOWED_CATEGORIES.includes(item.category)
  return {
    id: item.id,
    category: isValidCategory ? item.category : '자유',
    nickname: item.nickname ? item.nickname.trim() : '익명', // 3. 기존 데이터 호환 및 기본값 보정
    title: item.title || '',
    content: item.content || '',
    password: item.password || '',
    createdAt: item.createdAt || new Date().toISOString()
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
          item.nickname.toLowerCase().includes(normalized) // 닉네임 검색도 가능하도록 편의 기능 제공
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
  nickname, // 2. 닉네임 필드 저장 추가
  title,
  content,
  password
}) {
  const boards = loadBoards()

  const newBoard = formatBoardItem({
    id: buildId(),
    category,
    nickname: nickname.trim(), // 양끝 공백 제거 후 저장
    title: title.trim(),
    content: content.trim(),
    password: password.trim(),
    createdAt: new Date().toISOString()
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

  // 수정 시 지정된 카테고리가 유효하지 않으면 기존 카테고리 유지 혹은 '자유' 처리
  const newCategory = category || board.category || '자유'
  board.category = ALLOWED_CATEGORIES.includes(newCategory) ? newCategory : '자유'
  board.title = title.trim()
  board.content = content.trim()
  // 닉네임은 비회원 사칭 방지를 위해 수정 시 저장 대상에서 제외 (기존 값 자동 유지)

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