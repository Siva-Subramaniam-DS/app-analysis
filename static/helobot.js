// Function to handle sending the message
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    appendMessage("User", userInput);

    // Show typing indicator
    showTypingIndicator();

    fetch("/heloai", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: userInput })
    })
    .then(response => response.json())
    .then(data => {
        // Remove typing indicator
        removeTypingIndicator();

        // Append the response from HeloAI
        appendMessage("Lexi AI", data.answer);
    });

    document.getElementById("user-input").value = "";
}

// Event listener for the "Send" button click
document.getElementById("send-btn").addEventListener("click", sendMessage);

// Event listener for pressing the "Enter" key
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default action (like submitting a form)
        sendMessage();
    }
});

// Function to append a message to the chat
function appendMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("div");
    messageElement.className = sender.toLowerCase() + "-message";
    messageElement.textContent = sender + ": " + message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to show the typing indicator
function showTypingIndicator() {
    const chatBox = document.getElementById("chat-box");
    const typingElement = document.createElement("div");
    typingElement.id = "typing-indicator";
    typingElement.className = "Lexi-message";
    typingElement.textContent = "Lexi is typing...";
    chatBox.appendChild(typingElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to remove the typing indicator
function removeTypingIndicator() {
    const typingElement = document.getElementById("typing-indicator");
    if (typingElement) {
        typingElement.remove();
    }
}

function updateDateTime() {
    const now = new Date();
        const dateElement = document.getElementById('date');
        const timeElement = document.getElementById('time');

        const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
        const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

        dateElement.textContent = now.toLocaleDateString(undefined, optionsDate);
        timeElement.textContent = now.toLocaleTimeString(undefined, optionsTime);
}

updateDateTime();
setInterval(updateDateTime, 1000);