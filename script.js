// Replace with your actual API key
const API_KEY = 'AIzaSyBAdC-y05XKGyhd5rP_7J8XWT90h__cQyI';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    // Add icon
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('message-icon');
    const icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add(isUser ? 'fa-user' : 'fa-robot');
    iconDiv.appendChild(icon);
    
    // Add message content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('message-wrapper');
    
    // Add message content
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = message;
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.classList.add('message-timestamp');
    timestamp.textContent = formatTime();
    
    // Add message status for user messages
    if (isUser) {
        const status = document.createElement('div');
        status.classList.add('message-status');
        status.textContent = 'Sent';
        contentWrapper.appendChild(status);
    }
    
    contentWrapper.appendChild(contentDiv);
    contentWrapper.appendChild(timestamp);
    
    messageDiv.appendChild(iconDiv);
    messageDiv.appendChild(contentWrapper);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addLoadingAnimation() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message', 'loading-message');
    loadingDiv.innerHTML = `
        <div class="message-icon">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
        <div class="typing-indicator">JARVIS is typing...</div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    userInput.value = '';

    // Add loading animation
    const loadingDiv = addLoadingAnimation();

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        
        // Remove loading animation
        loadingDiv.remove();

        if (data.candidates && data.candidates[0].content) {
            let botResponse = data.candidates[0].content.parts[0].text;
            // Add JARVIS personality to the response
            botResponse = `${botResponse}\n\nAt your service, sir.`;
            addMessage(botResponse, false);
        } else {
            addMessage('I apologize, sir. I seem to be experiencing technical difficulties.', false);
        }
    } catch (error) {
        console.error('Error:', error);
        loadingDiv.remove();
        addMessage('My systems appear to be malfunctioning, sir. Shall I run a diagnostic?', false);
    }
}

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
}); 