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
    views: Number(item.views) || 0
  }
}

/**
 * 게시글 목록 조회 (가상 번호 매핑 추가)
 */
export function listBoards(searchTerm = '') {
  // 1. 전체 데이터를 불러와 포맷팅합니다.
  const boards = loadBoards().map(formatBoardItem)

  // 2. 오래된 순(생성일 기준)으로 정렬하여 DB의 행 번호(1번부터 시작)처럼 기준을 잡습니다.
  //    (만약 생성일이 같다면 순서가 바뀔 수 있으므로 slice() 상태 그대로 사용하거나 오름차순 정렬)
  const sortedByOldest = boards.slice().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  
  // 3. 모든 글에 생성일 기준의 고유한 가상 번호(seq)를 부여합니다.
  const boardsWithSeq = sortedByOldest.map((item, index) => ({
    ...item,
    seq: index + 1 // 1부터 시작하는 순차적인 번호
  }))

  // 4. 검색어 필터링을 진행합니다.
  const normalized = searchTerm.trim().toLowerCase()
  const filtered = normalized
    ? boardsWithSeq.filter((item) => {
        return (
          item.title.toLowerCase().includes(normalized) ||
          item.content.toLowerCase().includes(normalized) ||
          item.nickname.toLowerCase().includes(normalized)
        )
      })
    : boardsWithSeq

  // 5. 최종 사용자에게 보여줄 때는 최신글이 위로 오도록 내림차순 정렬하여 반환합니다.
  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * 단일 게시글 상세 조회 (가상 번호 추가)
 */
export function getBoard(id) {
  // 상세 페이지나 다른 곳에서도 번호가 필요할 수 있으므로 listBoards의 로직을 활용합니다.
  const boards = listBoards() 
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
    views: 0
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