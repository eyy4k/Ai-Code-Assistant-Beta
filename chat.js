const OPENAI_API_KEY = "your-openai-api-key"; // Replace with your actual API key

document.getElementById("send-btn").addEventListener("click", async () => {
  let userInput = document.getElementById("chat-box").value;
  if (!userInput) return;

  // Display "thinking..." message
  document.getElementById("chat-response").innerHTML = "⏳ Thinking...";

  // Send user question to GPT-4
  let aiResponse = await askAI(userInput);

  // Show AI response
  document.getElementById("chat-response").innerHTML = `<strong>AI:</strong> ${aiResponse}`;
});

// Function to send user input to GPT-4 API
async function askAI(question) {
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
          { role: "system", content: "You are an expert AI coding assistant. Answer coding questions clearly and concisely." },
          { role: "user", content: question }
        ],
        temperature: 0.7
      })
    });

    let data = await response.json();
    return data.choices[0].message.content || "AI response failed.";
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return "❌ Error fetching AI response.";
  }
}
