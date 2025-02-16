// popup.js

// Function to handle the "Run Code" button click
document.getElementById('run-sandbox').addEventListener('click', () => {
  // Get the code input by the user
  let code = document.getElementById('sandbox-code').value;
  let outputDiv = document.getElementById('sandbox-output');
  
  // Show a message indicating that the code is being run
  outputDiv.innerHTML = 'Running code...';

  // Create an iframe to run the code in a sandboxed environment
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';  // Hide the iframe
  document.body.appendChild(iframe);
  
  let iframeWindow = iframe.contentWindow;

  try {
    // Run the code in the iframe (sandboxed environment)
    let result = iframeWindow.eval(code);  // Use eval to execute the code in the iframe
    outputDiv.innerHTML = `<strong>Result:</strong> ${result}`;  // Display the result
  } catch (e) {
    // If an error occurs, display it in the output area
    outputDiv.innerHTML = `❌ Error: ${e.message}`;
  }
});

// Listen for AI suggestions from the background script or elsewhere in the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "console_error_fix") {
    // Display the error and suggested fix
    let outputDiv = document.getElementById("output");
    outputDiv.innerHTML += `<br><br><strong>🛑 Console Error:</strong> ${message.error}`;
    outputDiv.innerHTML += `<br><strong>✅ AI Fix:</strong> ${message.suggestion}`;

    // Create the "Apply Fix" button
    let applyButton = document.createElement("button");
    applyButton.textContent = "Apply Fix";
    applyButton.classList.add("apply-btn");

    // Add event listener to apply the fix when clicked
    applyButton.addEventListener("click", () => {
      applyFix(message.suggestion);
    });

    outputDiv.appendChild(applyButton);
  }
});

// Function to apply a fix suggested by AI
function applyFix(fix) {
  console.log("Applying fix:", fix);

  // Example: If AI suggests adding a missing variable
  if (fix.includes("undefined variable")) {
    let missingVariable = fix.match(/(?:undefined variable:\s*)(\w+)/);
    if (missingVariable && missingVariable[1]) {
      let varName = missingVariable[1];
      let scriptTag = document.createElement('script');
      scriptTag.textContent = `let ${varName} = 'default value';`;  // Add default value
      document.body.appendChild(scriptTag);
      alert(`Applied fix: Added missing variable '${varName}' with default value.`);
    }
  }

  // Add other fix scenarios here as needed
}
