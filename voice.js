const voiceBtn = document.getElementById("voiceBtn");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Voice input is not supported in this browser.");
} else {

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.innerText = "🎙️";
    });

    recognition.onresult = (event) => {

        const text = event.results[0][0].transcript;

        // Yahan apne chat input ki ID likho
        document.getElementById("messageInput").value = text;

        voiceBtn.innerText = "🎤";
    };

    recognition.onend = () => {
        voiceBtn.innerText = "🎤";
    };

    recognition.onerror = () => {
        voiceBtn.innerText = "🎤";
    };
}