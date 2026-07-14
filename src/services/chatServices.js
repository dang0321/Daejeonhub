import axios from 'axios'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export const createChatCompletion = async (messages, model = 'gpt-4o-mini') => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API Key가 설정되지 않았습니다. VITE_OPENAI_API_KEY를 확인하세요.')
  }

  const payloadMessages = [
    {
      role: 'system',
      content: '당신은 대전·충청권 여행 정보를 도와주는 친절한 AI 가이드입니다.'
    },
    ...messages.filter(Boolean)
  ]

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model,
        messages: payloadMessages,
        temperature: 0.7,
        max_tokens: 500
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