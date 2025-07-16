# 🧠 Meeting-Bot Chrome Extension

A Chrome extension that records meeting audio (tab + mic), saves the recording locally and sends it to your FastAPI backend for transcription and diarization. 

&nbsp;
## 🚀 Features

1. Captures both tab and microphone audio.

2. Sends recordings to your backend for processing.
3. Supports FastAPI servers running locally (via Docker).
4. Easy-to-use popup interface.


&nbsp;
## 🛠 Installation (Developer Mode)

1. Clone this repository:
   ```bash
   git clone https://github.com/Harshs-09/meeting-bot-chrome-extension.git
   ```

2. Open Chrome and navigate to **"chrome://extensions/"** .
3. Enable Developer mode (top-right toggle).
4. Click **“Load unpacked”** and select the cloned folder.
5. The extension should now appear in your Chrome toolbar.

&nbsp;
## 🧪 How to Use
1. Visit any tab of your choice (eg., Youtube, Google Meet, etc.)

2. Click the extensions icon in your browser.
3. Select the **Meeting Audio Recorder** extension and click on **"🎬 Open Recorder".**
4. Enter your email, click **Start** and choose the tab to record.
5. Once done, click **Stop** and you can save it from the file dialog.
