chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "console_error_fix") {
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML += `<br><br><strong>🛑 Console Error:</strong> ${message.error}`;
    outputDiv.innerHTML += `<br><strong>✅ AI Fix:</strong> ${message.suggestion}`;

    // Add Apply Fix button
    let applyButton = document.createElement("button");
    applyButton.textContent = "Apply Fix";
    applyButton.classList.add("apply-btn");

    // Append button and apply fix when clicked
    applyButton.addEventListener("click", () => {
      applyFix(message.suggestion);
    });

    outputDiv.appendChild(applyButton);
  }
});

// Function to apply the fix (for example, fixing a missing variable or adjusting code)
function applyFix(fix) {
  console.log("Applying fix:", fix);

  // Simple example: If AI suggests adding a missing variable
  if (fix.includes("undefined variable")) {
    let missingVariable = fix.match(/(?:undefined variable:\s*)(\w+)/);
    if (missingVariable && missingVariable[1]) {
      let varName = missingVariable[1];
      let scriptTag = document.createElement('script');
      scriptTag.textContent = `let ${varName} = 'default value';`;  // Example default value
      document.body.appendChild(scriptTag);
      alert(`Applied fix: Added missing variable '${varName}' with default value.`);
    }
  }

  // Add more complex fixes as needed, such as fixing broken functions or syntax errors
}
