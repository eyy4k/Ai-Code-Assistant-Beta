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
  iframe.sandbox = "allow-scripts";  // Allow only scripts to run in the iframe
  document.body.appendChild(iframe);

  let iframeWindow = iframe.contentWindow;
  let iframeDocument = iframe.contentDocument;

  // Create a script tag to insert the JavaScript code into the iframe
  let scriptTag = iframeDocument.createElement('script');
  scriptTag.textContent = code;  // Use the input code from the sandbox

  // Append the script to the iframe's document body
  iframeDocument.body.appendChild(scriptTag);

  // Add event listener to capture any errors
  iframeWindow.onerror = function (event) {
    outputDiv.innerHTML = `❌ Error: ${event.message}`;
  };

  // If successful, display the result in the output div
  iframeWindow.onload = function () {
    try {
      let result = iframeWindow.document.body.innerText || 'Code executed without returning any output.';
      outputDiv.innerHTML = `<strong>Result:</strong> ${result}`;
    } catch (e) {
      outputDiv.innerHTML = `❌ Error: ${e.message}`;
    }
  };
});
