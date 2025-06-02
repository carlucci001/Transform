export interface ChatConfig {
  makeWebhookUrl: string
  agentName: string
  agentAvatar: string
  primaryColor: string
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export interface Avatar {
  id: string
  name: string
  url: string
}
