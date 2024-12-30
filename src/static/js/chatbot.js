// function initializeChat() {
//   // const chatWindow = document.querySelector('.chat-window');
//   // const inputField = document.querySelector('.input-area input');
//   // const sendButton = document.querySelector('.input-area button');

//   // sendButton.addEventListener('click', handleUserInput);

//   // inputField.addEventListener('keypress', function (e) {
//   //   if (e.key === 'Enter') {
//   //     handleUserInput();
//   //   }
//   // });
//   const inputField = document.querySelector('.input-area input');
//   const sendButton = document.querySelector('.send');
//   const voiceButton = document.querySelector('.voice');

//   // Variable to handle speech recognition
//   let recognition;
//   let isListening = false;

//   // Check if the browser supports SpeechRecognition
//   if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     recognition = new SpeechRecognition();
//     recognition.lang = 'en-US'; // Set language
//     recognition.interimResults = false; // Get only final results
//     recognition.continuous = false; // Stop after one result

//     // Add event listener for recognition result
//     recognition.addEventListener('result', (event) => {
//       const transcript = event.results[0][0].transcript; // Get the recognized speech text
//       inputField.value = transcript; // Display it in the input field
//     });

//     // Event listener for stopping recognition
//     recognition.addEventListener('end', () => {
//       if (isListening) {
//         isListening = false;
//         voiceButton.textContent = '🎤'; // Reset button text/icon
//       }
//     });
//   } else {
//     alert('Speech Recognition is not supported in your browser.');
//   }

//   // Function to handle voice button click
//   voiceButton.addEventListener('click', () => {
//     if (isListening) {
//       recognition.stop(); // Stop listening
//       isListening = false;
//       voiceButton.textContent = '🎤'; // Reset button text/icon
//     } else {
//       recognition.start(); // Start listening
//       isListening = true;
//       voiceButton.textContent = '🛑'; // Change button text/icon to indicate recording
//     }
//   });

//   // Function to handle user input and send it to the chatbot
//   function handleUserInput() {
//     const message = inputField.value.trim();
//     if (message) {
//       console.log('Message sent to chatbot:', message); // Replace this with your chatbot integration logic
//       inputField.value = ''; // Clear the input field
//     }
//   }

//   // Add event listeners for sending messages
//   sendButton.addEventListener('click', handleUserInput);
//   inputField.addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//       handleUserInput();
//     }
//   });
//   loadConversation(userID);
//   addDateTimeIndicator();
// }

// async function handleUserInput() {
//   const inputField = document.querySelector('.input-area input');
//   const userMessage = inputField.value.trim();
//   if (userMessage) {
//     addMessage(userMessage, true);
//     inputField.value = '';

//     addTypingIndicator();

//     try {
//       const response = await fetch(`/infer`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ input: userMessage, ID: userID }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       removeTypingIndicator();
//       addMessage(data.response);
//     } catch (error) {
//       console.error('Error:', error);
//       removeTypingIndicator();
//       addMessage('Sorry, there was an error processing your message.');
//     }
//   }
// }

// function addMessage(message, isUser = false, shouldSave = true) {
//   const chatWindow = document.querySelector('.chat-window');
//   const messageDiv = document.createElement('div');
//   messageDiv.className = isUser ? 'user-message' : 'bot-message';
//   messageDiv.innerHTML = `<p>${message}</p>`;
//   chatWindow.appendChild(messageDiv);
//   chatWindow.scrollTop = chatWindow.scrollHeight;

//   if (shouldSave && typeof userID !== 'undefined') {
//     saveConversation(userID);
//   }
// }

// function addTypingIndicator() {
//   const chatWindow = document.querySelector('.chat-window');
//   const typingDiv = document.createElement('div');
//   typingDiv.className = 'bot-message typing-indicator';
//   typingDiv.innerHTML =
//     '<div class="typing-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
//   chatWindow.appendChild(typingDiv);
//   chatWindow.scrollTop = chatWindow.scrollHeight;
// }

// function removeTypingIndicator() {
//   const typingIndicator = document.querySelector('.typing-indicator');
//   if (typingIndicator) {
//     typingIndicator.remove();
//   }
// }

// function saveConversation(user_id) {
//   const chatWindow = document.querySelector('.chat-window');
//   const messages = Array.from(chatWindow.children).map((child) => {
//     if (child.classList.contains('timestamp')) {
//       return { type: 'timestamp', text: child.textContent };
//     } else {
//       return {
//         type: 'message',
//         text: child.querySelector('p').textContent,
//         isUser: child.classList.contains('user-message'),
//       };
//     }
//   });
//   const conversationData = {
//     user_id: user_id,
//     messages: messages,
//   };
//   localStorage.setItem(
//     `chatConversation_${user_id}`,
//     JSON.stringify(conversationData)
//   );
// }

// function loadConversation(user_id) {
//   const chatWindow = document.querySelector('.chat-window');
//   const savedConversation = localStorage.getItem(`chatConversation_${user_id}`);
//   if (savedConversation) {
//     const conversationData = JSON.parse(savedConversation);
//     const messages = conversationData.messages;
//     chatWindow.innerHTML = ''; // Clear existing messages
//     messages.forEach((item) => {
//       if (item.type === 'timestamp') {
//         const dateTimeDiv = document.createElement('div');
//         dateTimeDiv.className = 'timestamp';
//         dateTimeDiv.textContent = item.text;
//         chatWindow.appendChild(dateTimeDiv);
//       } else {
//         addMessage(item.text, item.isUser, false);
//       }
//     });
//   }
// }

// function addDateTimeIndicator() {
//   const chatWindow = document.querySelector('.chat-window');
//   const dateTimeDiv = document.createElement('div');
//   dateTimeDiv.className = 'timestamp';
//   const now = new Date();
//   const options = {
//     weekday: 'short',
//     hour: '2-digit',
//     minute: '2-digit',
//   };
//   dateTimeDiv.textContent = now.toLocaleString('en-US', options);

//   const firstMessage = chatWindow.querySelector('.bot-message, .user-message');
//   if (firstMessage) {
//     firstMessage.insertAdjacentElement('afterend', dateTimeDiv);
//   } else {
//     chatWindow.appendChild(dateTimeDiv);
//   }
// }
document.addEventListener('DOMContentLoaded', function () {
  const recordButton = document.getElementById('recordButton');
  const inputField = document.querySelector('.input-area input[type="text"]');
  let isRecording = false;
  let recognition;

  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
  } else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
  } else {
    alert('Your browser does not support speech recognition.');
    return;
  }

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    inputField.value = transcript;
  };

  recognition.onerror = function (event) {
    console.error('Speech recognition error:', event.error);
  };

  recordButton.addEventListener('click', function () {
    if (isRecording) {
      recognition.stop();
      recordButton.classList.remove('recording');
      recordButton.textContent = "🎤";
    } else {
      recognition.start();
      recordButton.classList.add('recording');
      recordButton.textContent = "🛑";

    }
    isRecording = !isRecording;
  });
});

function initializeChat() {
  const chatWindow = document.querySelector('.chat-window');
  const inputField = document.querySelector('.input-area input');
  const sendButton = document.querySelector('.input-area button.send');

  sendButton.addEventListener('click', handleUserInput);

  inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  });

  loadConversation(userID);
  addDateTimeIndicator();
}

async function handleUserInput() {
  const inputField = document.querySelector('.input-area input');
  const userMessage = inputField.value.trim();
  if (userMessage) {
    addMessage(userMessage, true);
    inputField.value = '';

    addTypingIndicator();

    try {
      const response = await fetch(`/infer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userMessage, ID: userID }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      removeTypingIndicator();
      addMessage(data.response);
    } catch (error) {
      console.error('Error:', error);
      removeTypingIndicator();
      addMessage('Sorry, there was an error processing your message.');
    }
  }
}

function addMessage(message, isUser = false, shouldSave = true) {
  const chatWindow = document.querySelector('.chat-window');
  const messageDiv = document.createElement('div');
  messageDiv.className = isUser ? 'user-message' : 'bot-message';
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  if (shouldSave && typeof userID !== 'undefined') {
    saveConversation(userID);
  }
}

function addTypingIndicator() {
  const chatWindow = document.querySelector('.chat-window');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'bot-message typing-indicator';
  typingDiv.innerHTML =
    '<div class="typing-bubble"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  chatWindow.appendChild(typingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function saveConversation(user_id) {
  const chatWindow = document.querySelector('.chat-window');
  const messages = Array.from(chatWindow.children).map((child) => {
    if (child.classList.contains('timestamp')) {
      return { type: 'timestamp', text: child.textContent };
    } else {
      return {
        type: 'message',
        text: child.querySelector('p').textContent,
        isUser: child.classList.contains('user-message'),
      };
    }
  });
  const conversationData = {
    user_id: user_id,
    messages: messages,
  };
  localStorage.setItem(
    `chatConversation_${user_id}`,
    JSON.stringify(conversationData)
  );
}

function loadConversation(user_id) {
  const chatWindow = document.querySelector('.chat-window');
  const savedConversation = localStorage.getItem(`chatConversation_${user_id}`);
  if (savedConversation) {
    const conversationData = JSON.parse(savedConversation);
    const messages = conversationData.messages;
    chatWindow.innerHTML = ''; // Clear existing messages
    messages.forEach((item) => {
      if (item.type === 'timestamp') {
        const dateTimeDiv = document.createElement('div');
        dateTimeDiv.className = 'timestamp';
        dateTimeDiv.textContent = item.text;
        chatWindow.appendChild(dateTimeDiv);
      } else {
        addMessage(item.text, item.isUser, false);
      }
    });
  }
}

function addDateTimeIndicator() {
  const chatWindow = document.querySelector('.chat-window');
  const dateTimeDiv = document.createElement('div');
  dateTimeDiv.className = 'timestamp';
  const now = new Date();
  const options = {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  };
  dateTimeDiv.textContent = now.toLocaleString('en-US', options);

  const firstMessage = chatWindow.querySelector('.bot-message, .user-message');
  if (firstMessage) {
    firstMessage.insertAdjacentElement('afterend', dateTimeDiv);
  } else {
    chatWindow.appendChild(dateTimeDiv);
  }
}