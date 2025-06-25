document.getElementById("startRecording").addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("record.html") });
});
