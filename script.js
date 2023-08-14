let speech = new SpeechSynthesisUtterance();

let voices = [];

let voiceSelect = document.querySelector("select");

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();

    speech.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
};

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
})

document.querySelector("button").addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value;
    window.speechSynthesis.speak(speech);
})




// Replace your existing download button event listener code with the following

// Add this code after your existing JavaScript code

document.querySelector("#downloadButton").addEventListener("click", () => {
    const audioBlob = new Blob([speechToBlob(speech.text)], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "speech_audio.wav";
    a.style.display = "none";
    
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(audioUrl);
});

// Function to convert speech text to Blob
function speechToBlob(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const audioChunks = [];

    utterance.onboundary = event => {
        if (event.name === "word") {
            audioChunks.push(event.target.voiceData);
        }
    };

    const audioRecorder = new MediaRecorder(new MediaStream());
    audioRecorder.addEventListener("dataavailable", event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    });

    utterance.voiceData = new Blob(audioChunks, { type: "audio/wav" });
    window.speechSynthesis.speak(utterance);
}

// Rest of your existing code
