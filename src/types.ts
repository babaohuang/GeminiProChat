export interface ChatMessagePart {
  text: string;
}

export interface ChatMessage {
  role: 'model' | 'user';
  parts: ChatMessagePart[];
}

export interface ErrorMessage {
  code: string;
  message: string;
}