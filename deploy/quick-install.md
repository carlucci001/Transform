# ChatWidget Pro - Quick Installation Guide

## 🚀 Quick Start (5 minutes)

### 1. Upload Files
Upload the `chatwidget-pro-deploy.zip` to your web server and extract:
```bash
cd /var/www/html
unzip chatwidget-pro-deploy.zip -d chat-widget
```

### 2. Set Permissions
```bash
chmod -R 755 chat-widget/
chown -R www-data:www-data chat-widget/
```

### 3. Test Installation
Visit: `https://your-domain.com/chat-widget/index.php`

### 4. Embed on Any Website
Add this code to your website:
```html
<script>
  (function() {
    window.ChatWidgetConfig = {
      baseUrl: 'https://your-domain.com/chat-widget',
      makeWebhookUrl: 'https://hook.us1.make.com/7cnteymna5s1d42wvm4ncw6xm1q6cqho'
    };
    
    var s = document.createElement('script');
    s.src = window.ChatWidgetConfig.baseUrl + '/dist/assets/index.js';
    document.head.appendChild(s);
  })();
</script>
```

## 📋 What's Included

- `dist/` - Production-ready widget files
- `index.php` - Installation test page
- `.htaccess` - Apache configuration
- `embed-script.html` - Example embed code
- `install-instructions.md` - Detailed instructions

## 🔧 Configuration Options

```javascript
window.ChatWidgetConfig = {
  baseUrl: 'https://your-domain.com/chat-widget',
  position: 'bottom-right',        // Widget position
  primaryColor: '#3B82F6',         // Theme color
  makeWebhookUrl: 'YOUR_WEBHOOK',  // Make.com webhook
  agentName: 'Support Agent',      // Agent display name
  agentAvatar: 'URL_TO_IMAGE'      // Agent photo (optional)
};
```

## ⚠️ Important Notes

1. **CORS Headers**: Already configured in `.htaccess`
2. **HTTPS**: Recommended for production use
3. **Make.com Webhook**: Must return `{"reply": "Your response"}`

## 🆘 Troubleshooting

**Widget not showing?**
- Check browser console (F12)
- Verify baseUrl is correct
- Ensure files are accessible

**Webhook not working?**
- Test with curl first
- Check Make.com scenario is active
- Verify response format

---
Ready to deploy! 🎉
