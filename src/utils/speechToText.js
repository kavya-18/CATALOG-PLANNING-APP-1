// src/utils/speechToText.js

export function startSpeechRecognition({ onResult, onStart, onEnd }) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Your browser does not support Speech Recognition.");
    return;
  }

  const recognition = new SpeechRecognition();

  // ---- BEST SETTINGS ---- //
  recognition.lang = "en-IN";          // Accurate for Indian English
  recognition.continuous = false;      // Prevents repeated text
  recognition.interimResults = false;  // Only final clean result
  recognition.maxAlternatives = 1;     // Reduces noise variations

  // Start/stop UI indicators
  recognition.onstart = () => {
    if (onStart) onStart();
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  // Final result only
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.trim();
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.warn("Speech error:", event.error);
  };

  // ⚡ NOISE REDUCTION USING AUDIO CONSTRAINTS
  navigator.mediaDevices.getUserMedia({
    audio: {
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true,
    }
  })
  .then(() => recognition.start())
  .catch(() => alert("Microphone access denied. Enable mic permissions."));
}
