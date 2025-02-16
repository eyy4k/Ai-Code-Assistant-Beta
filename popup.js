document.getElementById('run-sandbox').addEventListener('click', () => {
  let code = document.getElementById('sandbox-code').value;
  let outputDiv = document.getElementById('sandbox-output');

  // Show a message indicating the code is being run
  outputDiv.innerHTML = 'Running code...';

  // Create an iframe to run the code in a sandboxed environment
  let iframe = document.createElement('iframe');
  iframe.style.display = 'none';  // Hide the iframe
  iframe.sandbox = "allow-scripts";  // Only allow scripts to run in the iframe
  document.body.appendChild(iframe);

  let iframeWindow = iframe.contentWindow;
  let iframeDocument = iframe.contentDocument;

  // Create a script element to insert the user code into the iframe's document
  let scriptTag = iframeDocument.createElement('script');
  scriptTag.textContent = code;  // Set the code to be executed

  // Append the script tag to the iframe's document body
  iframeDocument.body.appendChild(scriptTag);

  // Handle any errors that occur during script execution
  iframeWindow.onerror = function (errorEvent) {
    outputDiv.innerHTML = `❌ Error: ${errorEvent.message}`;
  };

  // Try to capture the result of the code execution
  iframeWindow.onload = function () {
    try {
      // Execute the code and capture the result
      // Using iframe's window object to retrieve any console.log output
      let result = iframeWindow.document.body.innerText || 'Code executed without returning any output.';
      outputDiv.innerHTML = `<strong>Result:</strong> ${result}`;
    } catch (e) {
      // Handle any exceptions during result retrieval
      outputDiv.innerHTML = `❌ Error: ${e.message}`;
    }
  };
});
