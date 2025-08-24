class SNRChatbot {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        this.hideLoadingScreen();
        this.loadChatInterface();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const chatContainer = document.querySelector('.chat-container');
            
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                chatContainer.style.display = 'block';
            }, 500);
        }, 2000);
    }

    loadChatInterface() {
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.innerHTML = `
            <div class="chat-header">
                <h2>SNR Assistant</h2>
                <p>Online - Ready to help</p>
            </div>
            <div class="chat-messages">
                <div class="message bot">
                    <p>✨ Welcome to SNR AI! I'm your advanced AI assistant.</p>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message...">
                <button>Send</button>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SNRChatbot();
});
