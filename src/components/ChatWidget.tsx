import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Settings, Paperclip, Smile, MoreVertical, Trash2, Download, Copy, Mail } from 'lucide-react'
import ChatConfiguration from './ChatConfiguration'
import { ChatConfig, Message } from '../types/chat'
import { defaultAvatars } from '../data/avatars'

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [showTranscriptOptions, setShowTranscriptOptions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const [config, setConfig] = useState<ChatConfig>({
    makeWebhookUrl: '',
    agentName: 'Support Agent',
    agentAvatar: defaultAvatars[0].url,
    primaryColor: '#3B82F6',
    position: 'bottom-right'
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
        setShowTranscriptOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    // Send to Make.com webhook if configured
    if (config.makeWebhookUrl) {
      try {
        console.log('Sending to webhook:', config.makeWebhookUrl)
        console.log('Payload:', { message: message })

        // ✅ ALL FOUR REQUIRED PIECES ARE HERE:
        const response = await fetch(config.makeWebhookUrl, {    // ① Full URL (from config)
          method: 'POST',                                        // ② POST method
          headers: {
            'Content-Type': 'application/json',                  // ③ JSON header
          },
          body: JSON.stringify({ message: message })             // ④ JSON body
        })

        console.log('Response status:', response.status)

        if (response.ok) {
          // Convert response to JSON
          const data = await response.json()
          console.log('Response data:', data)

          setTimeout(() => {
            // Access the reply field from the response
            const responseText = data.reply ?? 'No reply key!';
            
            const agentMessage: Message = {
              id: Date.now().toString(),
              text: responseText,
              sender: 'agent',
              timestamp: new Date()
            }
            setMessages(prev => [...prev, agentMessage])
            setIsTyping(false)
          }, 1000)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Error sending to Make.com:', error)
        setTimeout(() => {
          const agentMessage: Message = {
            id: Date.now().toString(),
            text: `Error: ${error instanceof Error ? error.message : 'Failed to connect to webhook'}`,
            sender: 'agent',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, agentMessage])
          setIsTyping(false)
        }, 1000)
      }
    } else {
      // Simulate response when no webhook is configured
      setTimeout(() => {
        const agentMessage: Message = {
          id: Date.now().toString(),
          text: 'Thanks for your message! Please configure the Make.com webhook URL in settings to enable automated responses.',
          sender: 'agent',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, agentMessage])
        setIsTyping(false)
      }, 1000)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        text: 'Chat history cleared. How can I help you today?',
        sender: 'agent',
        timestamp: new Date()
      }
    ])
    setShowMenu(false)
  }

  const generateTranscript = () => {
    const transcript = messages.map(msg => {
      const time = msg.timestamp.toLocaleString()
      const sender = msg.sender === 'user' ? 'You' : config.agentName
      return `[${time}] ${sender}: ${msg.text}`
    }).join('\n\n')

    const header = `Chat Transcript\n${new Date().toLocaleString()}\n${'='.repeat(50)}\n\n`
    return header + transcript
  }

  const handleDownloadTranscript = () => {
    const transcript = generateTranscript()
    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-transcript-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setShowMenu(false)
    setShowTranscriptOptions(false)
  }

  const handleCopyTranscript = () => {
    const transcript = generateTranscript()
    navigator.clipboard.writeText(transcript).then(() => {
      // Show success feedback
      const originalText = messages[messages.length - 1]?.text
      setMessages(prev => [...prev, {
        id: 'copy-success',
        text: 'Transcript copied to clipboard!',
        sender: 'agent',
        timestamp: new Date()
      }])
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg.id !== 'copy-success'))
      }, 3000)
    })
    setShowMenu(false)
    setShowTranscriptOptions(false)
  }

  const handleSendTranscript = async () => {
    if (!config.makeWebhookUrl) {
      setMessages(prev => [...prev, {
        id: 'send-error',
        text: 'Please configure the Make.com webhook URL in settings to send transcripts.',
        sender: 'agent',
        timestamp: new Date()
      }])
      setShowMenu(false)
      setShowTranscriptOptions(false)
      return
    }

    const transcript = generateTranscript()
    
    try {
      const response = await fetch(config.makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'transcript',
          transcript: transcript,
          timestamp: new Date().toISOString(),
          sessionId: 'chat-session-' + Date.now()
        })
      })

      if (response.ok) {
        setMessages(prev => [...prev, {
          id: 'send-success',
          text: 'Transcript sent successfully!',
          sender: 'agent',
          timestamp: new Date()
        }])
      } else {
        throw new Error('Failed to send transcript')
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: 'send-error',
        text: 'Failed to send transcript. Please try again.',
        sender: 'agent',
        timestamp: new Date()
      }])
    }
    
    setShowMenu(false)
    setShowTranscriptOptions(false)
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClasses[config.position]} z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110`}
          style={{ backgroundColor: config.primaryColor }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${positionClasses[config.position]} z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: config.primaryColor }}
          >
            <div className="flex items-center space-x-3">
              <img 
                src={config.agentAvatar} 
                alt={config.agentName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
              <div>
                <h3 className="font-semibold">{config.agentName}</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-700">
                    <button
                      onClick={handleClearChat}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Chat</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowTranscriptOptions(!showTranscriptOptions)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Download className="w-4 h-4" />
                          <span>Transcript</span>
                        </div>
                        <span className="text-xs">▶</span>
                      </button>
                      
                      {/* Transcript Submenu */}
                      {showTranscriptOptions && (
                        <div className="absolute left-full top-0 ml-1 w-40 bg-white rounded-lg shadow-lg py-2">
                          <button
                            onClick={handleDownloadTranscript}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-sm"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={handleCopyTranscript}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-sm"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                          <button
                            onClick={handleSendTranscript}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-sm"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Send via Webhook</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showConfig ? (
            <ChatConfiguration 
              config={config} 
              onConfigChange={setConfig}
              onClose={() => setShowConfig(false)}
            />
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {msg.sender === 'agent' && (
                        <img 
                          src={config.agentAvatar} 
                          alt={config.agentName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'text-white'
                            : 'bg-white text-gray-800 shadow-sm'
                        }`}
                        style={msg.sender === 'user' ? { backgroundColor: config.primaryColor } : {}}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={config.agentAvatar} 
                      alt={config.agentName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip className="w-5 h-5 text-gray-500" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 pr-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 transition-all"
                      style={{ focusRingColor: config.primaryColor }}
                    />
                    {message && (
                      <button
                        onClick={() => setMessage('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        title="Clear text"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Smile className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="p-2 text-white rounded-lg transition-all hover:opacity-90"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

export default ChatWidget
