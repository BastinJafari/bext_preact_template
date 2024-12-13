/* @jsx h */
import { h, render } from "preact";
import { useState } from "preact/hooks";
import OptionsButton from "./components/options_button.tsx";

function Popup() {
  const [markdown, setMarkdown] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const convertPage = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error("No active tab found");

      const response = await chrome.tabs.sendMessage(tab.id, { action: "convertToMarkdown" });
      
      if (response.success) {
        setMarkdown(response.markdown);
      } else {
        setError(response.error || "Failed to convert page");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      alert("Copied to clipboard!");
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <main style={{ padding: "1rem", minWidth: "300px" }}>
      <h1>Markdown Converter</h1>
      <button 
        onClick={convertPage}
        disabled={loading}
        style={{ marginBottom: "1rem" }}
      >
        {loading ? "Converting..." : "Convert Page to Markdown"}
      </button>
      
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      
      {markdown && (
        <div>
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
          <pre style={{ 
            maxHeight: "300px", 
            overflow: "auto", 
            marginTop: "1rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
          }}>
            {markdown}
          </pre>
        </div>
      )}
      
      <OptionsButton />
    </main>
  );
}

const mountPoint = document.getElementById("mount");

if (mountPoint) {
  render(<Popup />, mountPoint);
}
