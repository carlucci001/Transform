import React, { useState } from 'react'
import { Upload, X, Check } from 'lucide-react'
import { ChatConfig } from '../types/chat'
import { defaultAvatars } from '../data/avatars'

interface ChatConfigurationProps {
  config: ChatConfig
  onConfigChange: (config: ChatConfig) => void
  onClose: () => void
}

const colorThemes = [
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Purple', color: '#8B5CF6' },
  { name: 'Green', color: '#10B981' },
  { name: 'Red', color: '#EF4444' },
  { name: 'Orange', color: '#F97316' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Teal', color: '#14B8A6' },
  { name: 'Indigo', color: '#6366F1' }
]

const positions = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' }
]

const ChatConfiguration: React.FC<ChatConfigurationProps> = ({ config, onConfigChange, onClose }) => {
  const [localConfig, setLocalConfig] = useState(config)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setUploadedImage(result)
        setLocalConfig({ ...localConfig, agentAvatar: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onConfigChange(localConfig)
    onClose()
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat Configuration</h3>
        </div>

        {/* Make.com Webhook URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Make.com Webhook URL
          </label>
          <input
            type="url"
            value={localConfig.makeWebhookUrl}
            onChange={(e) => setLocalConfig({ ...localConfig, makeWebhookUrl: e.target.value })}
            placeholder="https://hook.make.com/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">Enter your Make.com webhook URL to enable automated responses</p>
        </div>

        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={localConfig.agentName}
            onChange={(e) => setLocalConfig({ ...localConfig, agentName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Avatar
          </label>
          <div className="space-y-3">
            {/* Upload Custom Avatar */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2 text-gray-500" />
                <span className="text-sm text-gray-600">Upload custom avatar</span>
              </label>
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-4 gap-3">
              {uploadedImage && (
                <button
                  onClick={() => setLocalConfig({ ...localConfig, agentAvatar: uploadedImage })}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    localConfig.agentAvatar === uploadedImage ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={uploadedImage} alt="Uploaded" className="w-full h-16 object-cover" />
                  {localConfig.agentAvatar === uploadedImage && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </button>
              )}
              {defaultAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setLocalConfig({ ...localConfig, agentAvatar: avatar.url })}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                    localConfig.agentAvatar === avatar.url ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={avatar.url} alt={avatar.name} className="w-full h-16 object-cover" />
                  {localConfig.agentAvatar === avatar.url && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Color Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Theme
          </label>
          <div className="grid grid-cols-4 gap-3">
            {colorThemes.map((theme) => (
              <button
                key={theme.color}
                onClick={() => setLocalConfig({ ...localConfig, primaryColor: theme.color })}
                className={`relative h-12 rounded-lg transition-all ${
                  localConfig.primaryColor === theme.color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                }`}
                style={{ backgroundColor: theme.color }}
              >
                {localConfig.primaryColor === theme.color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Widget Position
          </label>
          <select
            value={localConfig.position}
            onChange={(e) => setLocalConfig({ ...localConfig, position: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {positions.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Configuration
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatConfiguration
