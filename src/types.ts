
export interface ChatPart {
  text: string
}

export interface ChatMessage {
  role: 'model' | 'user'
  parts: ChatPart[]
}

export interface ErrorMessage {
  code: string
  message: string
}
export const defaultChatMessage = "I'm EASY AI developed by ADONIS JR S under EASY API headed by Adonis himself.";
