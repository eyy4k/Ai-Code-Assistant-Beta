document.getElementById("scan").addEventListener("click", () => {
  chrome.scripting.executeScript({
    target: { allFrames: true },
    func: scanCode
  }, (results) => {
    document.getElementById("output").textContent = results[0].result || "No issues found.";
  });
});

function scanCode() {
  let issues = [];
  
  // Example: Check for 'var' instead of 'let/const'
  document.querySelectorAll("script").forEach(script => {
    if (script.textContent.includes("var ")) {
      issues.push("⚠️ Found 'var' declarations. Use 'let' or 'const' instead.");
    }
  });

  // Example: Detect inline CSS styles
  document.querySelectorAll("[style]").forEach(el => {
    issues.push(`⚠️ Inline style detected on ${el.tagName.toLowerCase()}`);
  });

  return issues.length ? issues.join("\n") : "✅ No major issues detected.";
}
