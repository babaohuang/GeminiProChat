import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(apiKey)

export const sendMessage = async(messages: ChatMessage[]) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const chat = model.startChat({
    history: messages.map(msg => ({
      role: msg.role,
      parts: msg.parts.map(part => part.text),
    })),
    generationConfig: {
      maxOutputTokens: 4000, // or your desired token limit
    },
  })

  const lastMessage = messages[messages.length - 1]
  const lastMessagelog = lastMessage.parts.map(part => part.text).join('')
  console.log('Sending message:', lastMessagelog)
  const result = await chat.sendMessageStream(lastMessage.parts.map(part => part.text).join(''))
  return result
}
