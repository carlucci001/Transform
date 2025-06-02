# ChatWidget Pro - LAMP Installation Guide

## Package Contents
- `dist/` - Production build files
- `embed-script.html` - Sample embed code
- `install-instructions.md` - This file

## Installation Steps

### 1. Upload Files to Your Web Server

Upload the entire `dist` folder to your web server. For example:
```
/var/www/html/chat-widget/
```

### 2. Set Proper Permissions

```bash
chmod -R 755 /var/www/html/chat-widget/
chown -R www-data:www-data /var/www/html/chat-widget/
```

### 3. Configure Apache (if needed)

Add to your `.htaccess` or Apache configuration:
```apache
<Directory /var/www/html/chat-widget>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
    
    # Enable CORS if needed
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</Directory>
```

### 4. Test the Installation

Visit: `https://your-domain.com/chat-widget/`

You should see the demo page with the chat widget.

## Embedding on Client Websites

### Basic Embed Code

Add this code to any website where you want the chat widget to appear:

```html
<!-- ChatWidget Pro -->
<script>
  (function() {
    // Configuration
    window.ChatWidgetConfig = {
      baseUrl: 'https://your-domain.com/chat-widget',
      position: 'bottom-right',
      primaryColor: '#3B82F6',
      makeWebhookUrl: 'https://hook.us1.make.com/7cnteymna5s1d42wvm4ncw6xm1q6cqho',
      agentName: 'Support Agent',
      agentAvatar: 'https://your-domain.com/chat-widget/agent-avatar.jpg'
    };
    
    // Load the widget
    var script = document.createElement('script');
    script.src = window.ChatWidgetConfig.baseUrl + '/assets/index.js';
    script.async = true;
    document.head.appendChild(script);
    
    var styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = window.ChatWidgetConfig.baseUrl + '/assets/index.css';
    document.head.appendChild(styles);
  })();
</script>
```

### Advanced Configuration

```html
<script>
  window.ChatWidgetConfig = {
    baseUrl: 'https://your-domain.com/chat-widget',
    position: 'bottom-right', // Options: bottom-right, bottom-left, top-right, top-left
    primaryColor: '#3B82F6',
    makeWebhookUrl: 'YOUR_MAKE_WEBHOOK_URL',
    agentName: 'John Doe',
    agentAvatar: 'https://example.com/avatar.jpg',
    // Optional: Auto-open on page load
    autoOpen: false,
    // Optional: Custom welcome message
    welcomeMessage: 'Hello! How can I help you today?'
  };
</script>
```

## Make.com Webhook Configuration

Your Make.com webhook should:

1. Accept POST requests with JSON body:
```json
{
  "message": "User's message text"
}
```

2. Return JSON response:
```json
{
  "reply": "Your automated response"
}
```

## Troubleshooting

### Widget Not Appearing
- Check browser console for errors
- Verify the baseUrl is correct
- Ensure files are accessible (no 404 errors)

### CORS Issues
- Add proper CORS headers in Apache
- Ensure the widget domain is allowed

### Webhook Not Working
- Verify webhook URL is correct
- Check Make.com scenario is active
- Test webhook independently with curl:
```bash
curl -X POST https://hook.us1.make.com/YOUR_WEBHOOK \
  -H "Content-Type: application/json" \
  -d '{"message":"Test message"}'
```

## Support

For issues or customization requests, please refer to the documentation or contact support.
