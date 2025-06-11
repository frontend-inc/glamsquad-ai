(function() {
  // Define the web component
  class Chatbot extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isOpen = false;
      this.chatbotUrl = this.getAttribute('src') || window.location.origin || 'http://localhost:3000';
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
            background-color: #000;
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
          }

          .chatbot-container {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 400px;
            height: 600px;
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
            background: #000;
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H8L12 22L16 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H15.17L12 19.17L8.83 16H4V4H20V16Z" fill="white"/>
            <path d="M7 9H17V11H7V9ZM7 5H17V7H7V5Z" fill="white"/>
          </svg>
        </button>

        <div class="chatbot-container">
          <div class="chatbot-header">
            <span class="chatbot-title">GlamSquad AI Assistant</span>
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
      
      container.style.display = 'flex';
      
      // Trigger animation
      requestAnimationFrame(() => {
        container.classList.add('open');
      });
      
      this.isOpen = true;
      this.dispatchEvent(new CustomEvent('chatbot-opened'));
    }

    closeChat() {
      const container = this.shadowRoot.querySelector('.chatbot-container');
      
      container.classList.remove('open');
      
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
  if (!customElements.get('glamsquad-chatbot')) {
    customElements.define('glamsquad-chatbot', Chatbot);
  }

  // Auto-initialize if script has data-auto-init attribute
  const currentScript = document.currentScript;
  if (currentScript && currentScript.getAttribute('data-auto-init') !== 'false') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const chatbot = document.createElement('glamsquad-chatbot');
        document.body.appendChild(chatbot);
      });
    } else {
      const chatbot = document.createElement('glamsquad-chatbot');
      document.body.appendChild(chatbot);
    }
  }
})();