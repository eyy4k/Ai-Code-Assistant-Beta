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

  // Check if the fix suggests adding a missing variable
  if (fix.includes("undefined variable")) {
    let missingVariable = fix.match(/(?:undefined variable:\s*)(\w+)/);
    if (missingVariable && missingVariable[1]) {
      let varName = missingVariable[1];

      // Check if the variable already exists before adding it
      if (typeof window[varName] === 'undefined') {
        let scriptTag = document.createElement('script');
        scriptTag.textContent = `let ${varName} = 'default value';`;  // Example default value
        document.body.appendChild(scriptTag);
        alert(`Applied fix: Added missing variable '${varName}' with default value.`);
      } else {
        alert(`Variable '${varName}' already exists. No changes applied.`);
      }
    }
  }

  // More complex fixes (broken functions, etc.) can be added here.
}


// Add an event listener for the "Run Code" button in the sandbox

document.getElementById('run-sandbox').addEventListener('click', () => {
  let code = document.getElementById('sandbox-code').value;
  let outputDiv = document.getElementById('sandbox-output');
  outputDiv.innerHTML = 'Running code...';

  // Create an iframe to isolate code execution
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';  // Hide the iframe
  document.body.appendChild(iframe);
  
  let iframeWindow = iframe.contentWindow;

  try {
    // Try running the code inside the iframe's context
    let result = iframeWindow.eval(code);
    outputDiv.innerHTML = `<strong>Result:</strong> ${result}`;
  } catch (e) {
    // Provide more context in error output
    outputDiv.innerHTML = `❌ Error: ${e.message}<br><small>Please check your code for syntax issues.</small>`;
  }

  // Clean up: Remove the iframe after running the code
  document.body.removeChild(iframe);
});

chrome.devtools.panels.create(
  "AI Code Advisor",            // Tab title in DevTools
  "icon.png",                  // Optional: Icon for the tab
  "panel.html",                // HTML file to show when the tab is selected
  function(panel) {
    // Optional: Callback after panel is created
  }
);



