const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const conversation = { messages: [] };

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  conversation.messages.push({ role: 'user', text: userMessage });
  input.value = '';

  const thinkingMessage = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conversation }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server.');
    }

    const { result } = await response.json();
    if (result) {
      thinkingMessage.textContent = result;
      conversation.messages.push({ role: 'model', text: result });
    } else {
      thinkingMessage.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error(error);
    thinkingMessage.textContent = 'Sorry, no response received.';
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
