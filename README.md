# ChatWidget Pro - Embeddable Web Chat Interface

A beautiful, production-ready chat widget that can be embedded on any website with Make.com webhook integration.

## Features

- 🎨 **Fully Customizable**: Choose colors, avatars, position, and agent details
- 🔗 **Make.com Integration**: Connect to your Make.com webhooks for automated responses
- 📱 **Responsive Design**: Works perfectly on all devices
- 🖼️ **Custom Avatars**: Upload your own or choose from our collection
- ⚡ **Real-time Messaging**: Smooth, instant messaging experience
- 🎯 **Easy Embedding**: Simple script tag integration

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open the chat widget by clicking the blue icon in the bottom right corner

## Configuration Options

Click the settings icon in the chat header to access:

- **Make.com Webhook URL**: Enter your webhook URL for automated responses
- **Agent Name**: Customize the agent's display name
- **Agent Avatar**: Upload custom image or choose from presets
- **Color Theme**: Select from 8 beautiful color themes
- **Widget Position**: Choose corner placement (bottom-right, bottom-left, etc.)

## Embedding on Your Website

To embed the chat widget on your website, add this code:

```html
<script src="https://your-domain.com/chat-widget.js"></script>
<script>
  ChatWidget.init({
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    makeWebhookUrl: 'YOUR_WEBHOOK_URL',
    agentName: 'Support Agent',
    agentAvatar: 'https://your-avatar-url.com/avatar.jpg'
  });
</script>
```

## Make.com Integration

The widget sends POST requests to your Make.com webhook with the following payload:

```json
{
  "message": "User's message text",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "sessionId": "chat-session-1234567890"
}
```

Your Make.com scenario should return a JSON response:

```json
{
  "response": "Your automated response text"
}
```

## Building for Production

```bash
npm run build
```

This creates optimized files in the `dist` directory ready for deployment.

## License

MIT License
