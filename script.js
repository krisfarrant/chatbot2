/************************
 *  FRONT-END SCRIPT    *
 ************************/

// Replace with your Google Apps Script Web App URL
const WEB_APP_URL = "PASTE_YOUR_GAS_WEB_APP_URL_HERE";

function toggleChatbot() {
  const chatbotWindow = document.getElementById("chatbot-window");
  if (chatbotWindow.classList.contains("hidden")) {
    chatbotWindow.classList.remove("hidden");
  } else {
    chatbotWindow.classList.add("hidden");
  }
}

function sendMessage() {
  const userMessageElem = document.getElementById("userMessage");
  const userEmailElem = document.getElementById("userEmail");
  const orderIdElem = document.getElementById("orderId");

  const userMessage = userMessageElem.value.trim();
  const userEmail = userEmailElem.value.trim();
  const userOrderId = orderIdElem.value.trim();

  if (!userMessage) {
    alert("Please enter a message!");
    return;
  }

  // Display the user message
  displayMessage(userMessage, "user-message");

  // Clear input
  userMessageElem.value = "";

  // Prepare payload
  const payload = {
    message: userMessage,
    userEmail: userEmail,
    userOrderId: userOrderId,
    userId: generateUserId()
  };

  // Send to Google Apps Script
  fetch(WEB_APP_URL, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      // Display bot reply
      if (data && data.reply) {
        displayMessage(data.reply, "bot-message");
      } else {
        displayMessage("Sorry, something went wrong. Try again later.", "bot-message");
      }
    })
    .catch(err => {
      displayMessage("Error connecting to server.", "bot-message");
      console.error(err);
    });
}

/**
 * Display a message in the chat window
 */
function displayMessage(text, className) {
  const messagesContainer = document.getElementById("chatbot-messages");
  const msgDiv = document.createElement("div");
  msgDiv.className = className;
  msgDiv.textContent = text;
  messagesContainer.appendChild(msgDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // auto-scroll
}

/**
 * Simple user ID generator (per session)
 */
function generateUserId() {
  // For demonstration, store a userId in localStorage if not exist
  if (!localStorage.getItem("chatbotUserId")) {
    localStorage.setItem("chatbotUserId", "User_" + Math.floor(Math.random() * 1000000));
  }
  return localStorage.getItem("chatbotUserId");
}
