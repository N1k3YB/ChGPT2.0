let currentChat = 0;
let chatHistory = [[]];
const chatHistoryElement = document.querySelector('.chat-history');
const chatInputElement = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.chat-input button');
const chatListElement = document.querySelector('.chat-list ul');

chatInputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage(chatInputElement.value.trim());
    chatInputElement.value = '';
  }
});

sendButton.addEventListener('click', () => {
  const message = chatInputElement.value.trim();
  if (message) {
    sendMessage(message);
    chatInputElement.value = '';
  }
});

const newChatButton = document.querySelector('.new-chat');

function renderChatList() {
  chatListElement.innerHTML = '';
  for (let i = 0; i < chatHistory.length; i += 1) {
    const chatItem = document.createElement('li');
    chatItem.textContent = `Диалог ${i + 1}`;
    chatItem.addEventListener('click', () => {
      currentChat = i;
      renderChatHistory();
    });
    chatListElement.appendChild(chatItem);
  }
}

async function sendMessage(message) {
  if (chatHistory[currentChat]) {
    chatHistory[currentChat].push({ role: 'Вы', content: message });
    renderChatHistory();

    const data = { message };
    try {
      const response = await fetch('http://127.0.0.1:5000/generate_response', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const result = await response.json();
      chatHistory[currentChat].push({ role: "CGPT", content: result.response });
    } catch (error) {
      console.error('Error generating response:', error);
      let errorMessage;
      if (error.message === 'Failed to fetch') {
        errorMessage = 'Извините, произошла ошибка при подключении к серверу. Пожалуйста, проверьте свое интернет-соединение или повторите попытку позже.';
      } else {
        errorMessage = `Извините, произошла ошибка: ${error.message}`;
      }
      chatHistory[currentChat].push({ role: "CGPT", content: errorMessage });
    }

    renderChatHistory();
  }
}

function renderChatHistory() {
  chatHistoryElement.innerHTML = '';
  const currentChatHistory = chatHistory[currentChat];
  if (currentChatHistory) {
    for (const message of currentChatHistory) {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${message.role}: ${message.content}`;
      chatHistoryElement.appendChild(messageElement);
    }
  }
  chatHistoryElement.scrollTop = chatHistoryElement.scrollHeight;
}

sendButton.addEventListener('click', () => {
  const message = chatInputElement.value.trim();
  if (message) {
    sendMessage(message);
    chatInputElement.value = '';
  }
});

newChatButton.addEventListener('click', () => {
  chatHistory.push([]);
  currentChat = chatHistory.length - 1;
  renderChatHistory();
  renderChatList();
});

renderChatHistory();
renderChatList();