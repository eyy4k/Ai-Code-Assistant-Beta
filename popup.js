// popup.js

// Event listener for when the popup is opened
document.addEventListener('DOMContentLoaded', function() {
  const analyzeButton = document.getElementById('analyzeButton');
  const chatButton = document.getElementById('chatButton');
  const outputDiv = document.getElementById('output');

  // Analyze Code Button: When clicked, it will start code analysis
  analyzeButton.addEventListener('click', function() {
    // Trigger any functionality to analyze the current page or code.
    // You can send a message to content scripts or use the DevTools API here.
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'analyze_code' }, function(response) {
        outputDiv.innerHTML = response.message; // Show result of analysis
      });
    });
  });

  // Chat with AI Button: Open the AI chat window
  chatButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();  // Open the options or a chat interface
  });
});
