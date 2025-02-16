const OPENAI_API_KEY = "your-openai-api-key"; // Replace with your actual API key

document.getElementById("scan").addEventListener("click", async () => {
  chrome.scripting.executeScript({
    target: { allFrames: true },
    func: scanCode
  }, async (results) => {
    let issues = results[0].result || "No issues found.";
    
    // Call GPT-4 for AI-based suggestions
    let aiSuggestions = await getAISuggestions(issues);

    // Display the AI-enhanced suggestions
    document.getElementById("output").textContent = aiSuggestions;
  });
});

// Function to scan JavaScript & CSS issues
function scanCode() {
  let issues = [];

  // Example: Detect 'var' instead of 'let/const'
  document.querySelectorAll("script").forEach(script => {
    if (script.textContent.includes("var ")) {
      issues.push("⚠️ Found 'var' declarations. Use 'let' or 'const' instead.");
    }
  });

  // Example: Detect inline styles
  document.querySelectorAll("[style]").forEach(el => {
    issues.push(`⚠️ Inline style detected on <${el.tagName.toLowerCase()}> element.`);
  });

  return issues.length ? issues.join("\n") : "✅ No major issues detected.";
}

// Function to send issues to OpenAI API
async function getAISuggestions(issues) {
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
          { role: "system", content: "You are an expert code reviewer. Provide suggestions to improve the following code issues." },
          { role: "user", content: `Here are the detected issues:\n${issues}\nHow can they be improved?` }
        ],
        temperature: 0.7
      })
    });

    let data = await response.json();
    return data.choices[0].message.content || "AI analysis failed.";
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "❌ Error fetching AI suggestions.";
  }
}
