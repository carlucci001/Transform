// Embeddable Chat Widget Script
(function() {
  // Configuration
  const config = window.ChatWidget || {};
  
  // Create widget container
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'chat-widget-container';
  document.body.appendChild(widgetContainer);

  // Load React app
  const script = document.createElement('script');
  script.src = config.scriptUrl || 'https://your-domain.com/chat-widget-bundle.js';
  script.async = true;
  document.head.appendChild(script);

  // Load styles
  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = config.styleUrl || 'https://your-domain.com/chat-widget-styles.css';
  document.head.appendChild(styles);

  // Initialize widget
  window.ChatWidget = {
    init: function(options) {
      // Store configuration
      window.__CHAT_WIDGET_CONFIG__ = options;
      
      // Dispatch event when ready
      window.dispatchEvent(new CustomEvent('chat-widget-ready', { detail: options }));
    },
    open: function() {
      window.dispatchEvent(new CustomEvent('chat-widget-open'));
    },
    close: function() {
      window.dispatchEvent(new CustomEvent('chat-widget-close'));
    }
  };
})();
