import React from 'react'
import { MessageSquare, Zap, Palette, Upload, Globe, Code } from 'lucide-react'

const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">ChatWidget Pro</h1>
            </div>
            <nav className="flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#integration" className="text-gray-600 hover:text-gray-900">Integration</a>
              <a href="#demo" className="text-gray-600 hover:text-gray-900">Demo</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Beautiful Chat Widget for Your Website
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Seamlessly integrate with Make.com webhooks and customize every aspect of your chat experience
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-lg font-semibold mb-4">Try the chat widget in the bottom right corner!</h3>
            <p className="text-gray-600">Click the blue chat icon to open the widget and explore the configuration options.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Make.com Integration</h4>
              <p className="text-gray-600">Connect to your Make.com webhooks for automated responses and workflow triggers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fully Customizable</h4>
              <p className="text-gray-600">Choose colors, avatars, position, and agent details to match your brand</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Custom Avatars</h4>
              <p className="text-gray-600">Upload your own avatar or choose from our curated collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section id="integration" className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Easy Integration</h3>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Code className="w-6 h-6 text-blue-600 mr-3" />
              <h4 className="text-xl font-semibold">Embed Code</h4>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{`<!-- Add this to your website -->
<script src="https://your-domain.com/chat-widget.js"></script>
<script>
  ChatWidget.init({
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    makeWebhookUrl: 'YOUR_WEBHOOK_URL'
  });
</script>`}</code>
            </pre>
            <div className="mt-6 flex items-start">
              <Globe className="w-5 h-5 text-green-600 mr-2 mt-1" />
              <div>
                <p className="text-sm text-gray-600">
                  The widget automatically adapts to your website's design and is fully responsive across all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400">
            ChatWidget Pro - Enhance your customer communication
          </p>
        </div>
      </footer>
    </div>
  )
}

export default DemoPage
