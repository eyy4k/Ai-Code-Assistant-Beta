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

// Add an event listener for the "Run Code" button in the sandbox
document.getElementById('run-sandbox').addEventListener('click', () => {
  let code = document.getElementById('sandbox-code').value;
  let outputDiv = document.getElementById('sandbox-output');
  outputDiv.innerHTML = 'Running code...';

  // If you want to run the code inside an iframe to isolate it:
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';  // Hide the iframe, as it's just for running the code
  document.body.appendChild(iframe);
  
  let iframeWindow = iframe.contentWindow;

  // Try to run the code inside the iframe and display the result
  try {
    let result = iframeWindow.eval(code);  // Use eval inside the iframe for sandboxed execution
    outputDiv.innerHTML = `<strong>Result:</strong> ${result}`;
  } catch (e) {
    outputDiv.innerHTML = `❌ Error: ${e.message}`;
  }

  // Clean up: Remove the iframe after running the code
  document.body.removeChild(iframe);
});

