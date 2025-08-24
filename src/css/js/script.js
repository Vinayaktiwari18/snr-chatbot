class SNRChatbot {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.initializeApp();
    }

    initializeApp() {
        this.createParticles();
        this.initializeSpeechRecognition();
        this.setupEventListeners();
        this.hideLoadingScreen();
        this.addWelcomeMessage();
    }

    createParticles() {
        // Create floating particles effect
        const particles = document.createElement('div');
        particles.className = 'floating-particles';
        particles.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                opacity: 0.1;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatParticle ${15 + Math.random() * 10}s infinite linear;
            `;
            particles.appendChild(particle);
        }
        
        document.body.appendChild(particles);
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
                50% { opacity: 0.15; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0.1; }
            }
        `;
        document.head.appendChild(style);
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceUI(true);
                this.addMessage("I'm listening...", 'bot');
            };
            
            this.recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                
                if (transcript) {
                    document.getElementById('messageInput').value = transcript;
                    this.processUserInput(transcript);
                }
            };
            
            this.recognition.onend = () => {
                this.stopVoiceRecognition();
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                this.stopVoiceRecognition();
                this.addMessage("Sorry, I didn't catch that. Could you try again?", 'bot');
            };
        }
    }

    setupEventListeners() {
        const voiceBtn = document.getElementById('voiceBtn');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.querySelector('.btn-send');

        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        }

        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && messageInput.value.trim() !== '') {
                    this.processUserInput(messageInput.value);
                    messageInput.value = '';
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                if (messageInput.value.trim() !== '') {
                    this.processUserInput(messageInput.value);
                    messageInput.value = '';
                }
            });
        }
    }

    toggleVoiceRecognition() {
        if (!this.recognition) {
            this.addMessage("Speech recognition is not supported in your browser", 'bot');
            return;
        }
        
        if (!this.isListening) {
            this.recognition.start();
        } else {
            this.recognition.stop();
        }
    }

    stopVoiceRecognition() {
        this.isListening = false;
        this.updateVoiceUI(false);
    }

    updateVoiceUI(listening) {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            if (listening) {
                voiceBtn.classList.add('listening');
            } else {
                voiceBtn.classList.remove('listening');
            }
        }
    }

    processUserInput(userMessage) {
        this.addMessage(userMessage, 'user');
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(userMessage.toLowerCase());
            this.addMessage(response, 'bot');
            
            if ('speechSynthesis' in window) {
                this.speakResponse(response);
            }
        }, 1000);
    }

    generateAIResponse(message) {
        const responses = {
            greeting: [
                "Hello! How can I assist you today?",
                "Hi there! What would you like to know?",
                "Hey! Ready to help with anything you need!"
            ],
            capabilities: [
                "I can help with research, writing, coding, analysis, translations, and much more!",
                "I specialize in quick information retrieval, creative writing, problem solving, and intelligent conversations."
            ],
            joke: [
                "Why don't scientists trust atoms? Because they make up everything!",
                "What do you call a fake noodle? An impasta!"
            ],
            weather: "I can help you find weather information! Just let me know your location.",
            time: `The current time is ${new Date().toLocaleTimeString()}.`,
            default: "That's interesting! I'm designed to process information quickly. How can I help you specifically?"
        };

        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
        } else if (message.includes('what can you do')) {
            return responses.capabilities[Math.floor(Math.random() * responses.capabilities.length)];
        } else if (message.includes('joke')) {
            return responses.joke[Math.floor(Math.random() * responses.joke.length)];
        } else if (message.includes('weather')) {
            return responses.weather;
        } else if (message.includes('time')) {
            return responses.time;
        } else {
            return responses.default;
        }
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = text;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = new Date().toLocaleTimeString();
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        typingDiv.id = 'typing-indicator';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    speakResponse(text) {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.volume = 1;
            speech.rate = 1.1;
            speech.pitch = 1;
            
            window.speechSynthesis.speak(speech);
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            const chatContainer = document.getElementById('chatContainer');
            
            if (loadingScreen && chatContainer) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    chatContainer.style.display = 'flex';
                }, 500);
            }
        }, 2000);
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("✨ Welcome to SNR AI! I'm your advanced AI assistant. How can I help you today?", 'bot');
        }, 500);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SNRChatbot();
});
