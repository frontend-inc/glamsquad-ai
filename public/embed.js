(function() {
  // Define the web component
  class ChatBotWidget extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isOpen = false;
      this.chatbotUrl = this.getAttribute('src') || window.location.origin || 'http://localhost:3000';
      this.width = this.getAttribute('width') || '400px';
      this.height = this.getAttribute('height') || '600px';
      this.color = this.getAttribute('color') || '#000';
    }

    connectedCallback() {
      this.render();
      this.attachEventListeners();
    }

    render() {
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          }

          .chatbot-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: ${this.color};
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .chatbot-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
          }

          .chatbot-button svg {
            width: 28px;
            height: 28px;
            transition: opacity 0.2s ease;
          }

          .chatbot-button .close-icon {
            position: absolute;
            opacity: 0;
          }

          .chatbot-button.open .chat-icon {
            opacity: 0;
          }

          .chatbot-button.open .close-icon {
            opacity: 1;
          }

          .chatbot-container {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: ${this.width};
            height: ${this.height};
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            display: none;
            flex-direction: column;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
          }

          .chatbot-container.open {
            display: flex;
            opacity: 1;
            transform: translateY(0);
          }

          .chatbot-header {
            background: ${this.color};
            color: white;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
          }

          .chatbot-title {
            font-weight: 600;
            font-size: 16px;
          }

          .close-button {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: background-color 0.2s ease;
          }

          .close-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }

          .chatbot-iframe {
            width: 100%;
            flex: 1;
            border: none;
          }

          /* Responsive styles */
          @media (max-width: 480px) {
            :host {
              bottom: 0;
              right: 0;
              left: 0;
            }

            .chatbot-container {
              width: 100vw;
              height: 100vh;
              bottom: 0;
              right: 0;
              border-radius: 0;
              max-width: none;
            }

            .chatbot-button {
              bottom: 20px;
              right: 20px;
              position: absolute;
            }
          }
        </style>

        <button class="chatbot-button" aria-label="Open chat">
          <svg class="chat-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M20.7134 8.12811L20.4668 8.69379C20.2864 9.10792 19.7136 9.10792 19.5331 8.69379L19.2866 8.12811C18.8471 7.11947 18.0555 6.31641 17.0677 5.87708L16.308 5.53922C15.8973 5.35653 15.8973 4.75881 16.308 4.57612L17.0252 4.25714C18.0384 3.80651 18.8442 2.97373 19.2761 1.93083L19.5293 1.31953C19.7058 0.893489 20.2942 0.893489 20.4706 1.31953L20.7238 1.93083C21.1558 2.97373 21.9616 3.80651 22.9748 4.25714L23.6919 4.57612C24.1027 4.75881 24.1027 5.35653 23.6919 5.53922L22.9323 5.87708C21.9445 6.31641 21.1529 7.11947 20.7134 8.12811ZM10 3H14V5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17H14C17.3137 17 20 14.3137 20 11H22C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3Z"></path>
          </svg>
          <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
          </svg>
        </button>

        <div class="chatbot-container">
          <div class="chatbot-header">
            <span class="chatbot-title">GlamSquad Assistant</span>
            <button class="close-button" aria-label="Close chat">✕</button>
          </div>
          <iframe class="chatbot-iframe" src="${this.chatbotUrl}" title="GlamSquad AI Chat"></iframe>
        </div>
      `;
    }

    attachEventListeners() {
      const button = this.shadowRoot.querySelector('.chatbot-button');
      const container = this.shadowRoot.querySelector('.chatbot-container');
      const closeButton = this.shadowRoot.querySelector('.close-button');

      button.addEventListener('click', () => {
        this.toggleChat();
      });

      closeButton.addEventListener('click', () => {
        this.closeChat();
      });

      // Handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.closeChat();
        }
      });
    }

    openChat() {
      const container = this.shadowRoot.querySelector('.chatbot-container');
      const button = this.shadowRoot.querySelector('.chatbot-button');
      const iframe = this.shadowRoot.querySelector('.chatbot-iframe');
      
      container.style.display = 'flex';
      button.classList.add('open');
      button.setAttribute('aria-label', 'Close chat');
      
      // Trigger animation
      requestAnimationFrame(() => {
        container.classList.add('open');
      });
      
      this.isOpen = true;
      this.dispatchEvent(new CustomEvent('chatbot-opened'));
      
      // Send accessToken to iframe after it loads
      if (iframe) {
        const sendAccessToken = () => {
          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            iframe.contentWindow.postMessage({
              type: 'ACCESS_TOKEN',
              accessToken: accessToken
            }, this.chatbotUrl);
          }
        };
        
        // If iframe is already loaded, send immediately
        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
          sendAccessToken();
        } else {
          // Otherwise wait for it to load
          iframe.addEventListener('load', sendAccessToken, { once: true });
        }
      }
    }

    closeChat() {
      const container = this.shadowRoot.querySelector('.chatbot-container');
      const button = this.shadowRoot.querySelector('.chatbot-button');
      
      container.classList.remove('open');
      button.classList.remove('open');
      button.setAttribute('aria-label', 'Open chat');
      
      setTimeout(() => {
        container.style.display = 'none';
      }, 300);
      
      this.isOpen = false;
      this.dispatchEvent(new CustomEvent('chatbot-closed'));
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }
  }

  // Register the custom element
  if (!customElements.get('chat-bot-widget')) {
    customElements.define('chat-bot-widget', ChatBotWidget);
  }

  // Auto-initialize if script has data-auto-init attribute
  const currentScript = document.currentScript;
  if (currentScript && currentScript.getAttribute('data-auto-init') !== 'false') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const chatbot = document.createElement('chat-bot-widget');
        document.body.appendChild(chatbot);
      });
    } else {
      const chatbot = document.createElement('chat-bot-widget');
      document.body.appendChild(chatbot);
    }
  }
})();