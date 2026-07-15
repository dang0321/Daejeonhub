import axios from 'axios'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

// 챗봇에 넣을 데이터: 카테고리별 파일 + 넣을 개수
const DATA_SOURCES = [
  { label: '관광지', path: '/data/대전_충청권_관광지.json', limit: 40 },
  { label: '음식점', path: '/data/대전_충청권_음식점.json', limit: 40 },
  { label: '숙박',   path: '/data/대전_충청권_숙박.json',   limit: 30 },
  { label: '문화시설', path: '/data/대전_충청권_문화시설.json', limit: 25 },
  { label: '쇼핑',   path: '/data/대전_충청권_쇼핑.json',   limit: 25 }
]

// 데이터를 한 번만 불러와 캐시 (질문마다 다시 안 불러오게)
let cachedContext = null

const buildDataContext = async () => {
  if (cachedContext) return cachedContext

  const parts = []
  for (const src of DATA_SOURCES) {
    try {
      const res = await fetch(src.path)
      if (!res.ok) continue
      const data = await res.json()
      const items = (data?.items || []).slice(0, src.limit)
      const lines = items
        .map((it) => `- ${it.title} (${it.addr1 || '주소미상'})`)
        .join('\n')
      parts.push(`[${src.label}]\n${lines}`)
    } catch {
      // 파일 하나 실패해도 나머지는 진행
    }
  }
  cachedContext = parts.join('\n\n')
  return cachedContext
}

export const createChatCompletion = async (messages, model = 'gpt-5-mini') => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API Key가 설정되지 않았습니다. VITE_OPENAI_API_KEY를 확인하세요.')
  }

  const dataContext = await buildDataContext()

  const systemPrompt = `당신은 대전·충청권 여행 정보를 도와주는 친절한 가이드입니다.
아래는 실제 제공된 대전·충청권 장소 데이터입니다. 답변은 반드시 이 목록 안의 장소를 근거로 하세요.
목록에 없는 장소는 지어내지 말고, 관련 정보가 없으면 "제공된 데이터에는 해당 정보가 없습니다"라고 답하세요.

${dataContext}`

  const payloadMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.filter(Boolean)
  ]

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model,
        messages: payloadMessages,
        reasoning_effort: 'low',
        max_completion_tokens: 4000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    )
    return response.data?.choices?.[0]?.message?.content?.trim() || ''
  } catch (error) {
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      'OpenAI 요청 중 오류가 발생했습니다.'
    throw new Error(message)
  }
}

export default createChatCompletion