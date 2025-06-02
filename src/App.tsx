import React from 'react'
import ChatWidget from './components/ChatWidget'
import DemoPage from './components/DemoPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DemoPage />
      <ChatWidget />
    </div>
  )
}

export default App
