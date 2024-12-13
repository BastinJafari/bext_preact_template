/// <reference lib="dom" />

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertToMarkdown") {
    convertToMarkdown()
      .then(markdown => sendResponse({ success: true, markdown }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async response
  }
});

async function convertToMarkdown() {
  const currentUrl = window.location.href;
  const jinaUrl = `https://r.jina.ai/${currentUrl}`;
  
  const headers = {
    'Authorization': 'Bearer jina_431ebf610e864d9a9a551b8799d84e13OcnNjDuzeGEMKdZgW5yjSzBUgzDR',
    'X-With-Generated-Alt': 'true'
  };

  try {
    const response = await fetch(jinaUrl, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const markdown = await response.text();
    return markdown;
  } catch (error) {
    console.error('Error converting to markdown:', error);
    throw error;
  }
}
