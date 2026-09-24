// =========================
// SELECT ELEMENTS
// =========================

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatArea = document.getElementById("chatArea");

const welcome = document.getElementById("welcome");
const themeToggle = document.getElementById("themeToggle");

const newChat = document.getElementById("newChat");
const clearChat = document.getElementById("clearChat");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");

const chatHistory = document.getElementById("chatHistory");

let messages = [];


// =========================
// THEME TOGGLE
// =========================

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeToggle.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", isDark ? "dark" : "light");

});


// LOAD SAVED THEME

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}


// =========================
// SEND MESSAGE
// =========================

chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const text = messageInput.value.trim();

    if (!text) return;

    addMessage(text, "user");

    messageInput.value = "";
    messageInput.style.height = "auto";

    try {

        const response = await fetch("/chat",  {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        if (data.reply) {
            addMessage(data.reply, "assistant");
        } else {
            addMessage("Sorry, AI response nahi aa rahi.", "assistant");
        }

    } catch (error) {

        console.error(error);

        addMessage(
            "Server se connection nahi ho raha. Check karo ke Saim AI server running hai.",
            "assistant"
        );

    }

});


// =========================
// ADD MESSAGE
// =========================

function addMessage(text, sender) {

    welcome.style.display = "none";

    const message = document.createElement("div");

    message.className = `message ${sender}-message`;

    const avatar = document.createElement("div");

    avatar.className = "message-avatar";

    avatar.textContent = sender === "user" ? "S" : "✦";

    const content = document.createElement("div");

    content.className = "message-content";

    content.textContent = text;

    message.appendChild(avatar);
    message.appendChild(content);

    chatArea.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;

    messages.push({
        text: text,
        sender: sender
    });

    saveMessages();

}


// =========================
// DEMO AI RESPONSE
// =========================

function showDemoResponse() {

    setTimeout(() => {

        addMessage(
            "Hello! 👋 I am your SAIM AI Assistant.\n\nThis is currently a demo response. In the next step, we will connect a real AI model to answer your questions.",
            "assistant"
        );

    }, 700);

}


// =========================
// NEW CHAT
// =========================

newChat.addEventListener("click", () => {

    messages = [];

    chatArea.innerHTML = "";

    chatArea.appendChild(welcome);

    welcome.style.display = "flex";

    saveMessages();

    messageInput.focus();

});


// =========================
// CLEAR CHAT
// =========================

clearChat.addEventListener("click", () => {

    const confirmed = confirm("Clear all chat messages?");

    if (!confirmed) return;

    messages = [];

    chatArea.innerHTML = "";

    chatArea.appendChild(welcome);

    welcome.style.display = "flex";

    saveMessages();

});


// =========================
// SUGGESTIONS
// =========================

document.querySelectorAll(".suggestion").forEach((button) => {

    button.addEventListener("click", () => {

        messageInput.value = button.textContent.trim();

        messageInput.focus();

    });

});


// =========================
// TEXTAREA AUTO RESIZE
// =========================

messageInput.addEventListener("input", () => {

    messageInput.style.height = "auto";

    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 150) + "px";

});


// =========================
// ENTER TO SEND
// =========================

messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        chatForm.requestSubmit();

    }

});


// =========================
// MOBILE MENU
// =========================

menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


// =========================
// SAVE CHAT
// =========================

function saveMessages() {

    localStorage.setItem(
        "rehanChatMessages",
        JSON.stringify(messages)
    );

}


// =========================
// LOAD CHAT
// =========================

function loadMessages() {

    const savedMessages =
        JSON.parse(localStorage.getItem("rehanChatMessages")) || [];

    messages = [];

    if (savedMessages.length === 0) return;

    savedMessages.forEach((message) => {

        addMessage(message.text, message.sender);

    });

}
const settingsPanel = document.getElementById("settingsPanel");
const closeSettings = document.getElementById("closeSettings");

settingsBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("active");
});

closeSettings.addEventListener("click", () => {
    settingsPanel.classList.remove("active");
});

// INITIALIZE

loadMessages();