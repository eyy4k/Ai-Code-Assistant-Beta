const OPENAI_API_KEY = "your-openai-api-key"; // Replace with your actual API key

(function() {
  let originalConsoleError = console.error;

  console.error = function(...args) {
    originalConsoleError.apply(console, args);

    let errorMessage = args.join(" ");
    console.log("🔍 Detected Console Error:", errorMessage);

    // Send the error to GPT-4 for analysis
    fetchGPT4Fix(errorMessage).then(suggestion => {
      console.log("🤖 AI Suggestion:", suggestion);
      sendToDevTools(errorMessage, suggestion);
    });
  };

  // Function to call GPT-4 API for a fix
  async function fetchGPT4Fix(errorMessage) {
    try {
      let response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a coding expert. Provide fixes for JavaScript errors." },
            { role: "user", content: `How do I fix this error? ${errorMessage}` }
          ],
          temperature: 0.7
        })
      });

      let data = await response.json();
      return data.choices[0].message.content || "AI response failed.";
    } catch (error) {
      console.error("❌ Error fetching AI fix:", error);
      return "⚠️ AI couldn't process this error.";
    }
  }

  // Send AI suggestions to DevTools UI
  function sendToDevTools(error, suggestion) {
    chrome.runtime.sendMessage({
      type: "console_error_fix",
      error: error,
      suggestion: suggestion
    });
  }
})();
