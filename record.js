let micPermissionGranted = false;
let isRecording = false;
let mediaRecorder;
let recordedChunks = [];
let micStream, displayStream;

const statusDiv = document.getElementById("status");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

startBtn.addEventListener("click", async () => {

  const emailInput = document.getElementById("email");
  const email = emailInput.value.trim();

  if (!email) {
    statusDiv.textContent = "❌ Please enter your email before starting.";
    emailInput.focus();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    statusDiv.textContent = "❌ Please enter a valid email address.";
    emailInput.focus();
    return;
  }

  try {
    // Always check microphone access, don't rely solely on chrome.storage.local
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micPermissionGranted = true;
    chrome.storage.local.set({ micGranted: true });
    console.log("[Meeting Recorder] 🎤 Microphone access granted");
  } catch (err) {
    console.error("[Meeting Recorder] ❌ Failed to get microphone:", err);
    micPermissionGranted = false;
    chrome.storage.local.set({ micGranted: false });
    statusDiv.textContent = "❌ Please allow microphone access before starting.";
    return;
  }

  if (isRecording) {
    statusDiv.textContent = "⚠️ Already recording.";
    return;
  }

  startBtn.disabled = true;
  stopBtn.disabled = false;
  statusDiv.textContent = "🎙️ Recording...";

  try {
    displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    });

    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const ctx = new AudioContext();
    const dest = ctx.createMediaStreamDestination();

    ctx.createMediaStreamSource(displayStream).connect(dest);
    ctx.createMediaStreamSource(micStream).connect(dest);

    const mixedStream = dest.stream;
    recordedChunks = [];

    mediaRecorder = new MediaRecorder(mixedStream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      displayStream.getTracks().forEach(t => t.stop());
      micStream.getTracks().forEach(t => t.stop());

      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "meeting_audio_" + new Date().toISOString() + ".webm";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // const formData = new FormData();
      // formData.append("files", blob, "meeting_audio.webm");
      // formData.append("email", email);

      // statusDiv.textContent = "⬆️ Uploading...";
      // try {
      //   const response = await fetch("http://localhost:9000/file/upload?source=extension", {
      //     method: "POST",
      //     body: formData
      //   });
      //   const result = await response.json();
      //   if (response.status === 200) {
      //     statusDiv.textContent = "✅ All files processed successfully.";
      //   } else if (response.status === 207) {
      //     statusDiv.textContent = "⚠️ Some files failed during processing. Check console for details.";
      //   } else if (response.status === 500) {
      //     statusDiv.textContent = "❌ All files failed to process.";
      //   } else {
      //     statusDiv.textContent = `⚠️ Unexpected status: ${response.status}`;
      //   }
      //   console.log(result['data']);
      // } catch (err) {
      //   statusDiv.textContent = "❌ Upload failed.";
      //   console.error(err);
      // }

      recordedChunks = [];
      isRecording = false;
      chrome.storage.local.set({ isRecording: false });
      startBtn.disabled = false;
      stopBtn.disabled = true;
    };

    mediaRecorder.start();
    isRecording = true;
    chrome.storage.local.set({ isRecording: true });

  } catch (err) {
    console.error("Error:", err);
    statusDiv.textContent = "❌ Error: " + err.message;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
});

stopBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    statusDiv.textContent = "⏹️ Stopping...";
  }
});
