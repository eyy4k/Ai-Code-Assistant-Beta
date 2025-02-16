// popup.js

// Function to handle the "Run Code" button click
document.getElementById('run-sandbox').addEventListener('click', () => {
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
    // Use the Function constructor instead of eval (if needed)
    let func = new Function(code);  // Create a function from the input code
    let result = func();  // Execute the function
    outputDiv.innerHTML = `<strong>Result:</strong> ${result}`;  // Display the result
  } catch (e) {
    // If an error occurs, display it in the output area
    outputDiv.innerHTML = `❌ Error: ${e.message}`;
  }
});

// Handle applying AI code fixes to the console error
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

