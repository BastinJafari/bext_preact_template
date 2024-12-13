/// <reference lib="dom" />
import { getSettings } from "./utilities/storage_helpers.ts";

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
  const settings = await getSettings();
  
  const jinaUrl = new URL(`https://r.jina.ai/${currentUrl}`);
  
  // Apply settings to URL parameters
  jinaUrl.searchParams.set('format', settings.responseFormat);
  if (settings.timeout) jinaUrl.searchParams.set('timeout', settings.timeout.toString());
  if (settings.streamingMode) jinaUrl.searchParams.set('stream', 'true');
  if (settings.adaptiveCrawling) jinaUrl.searchParams.set('adaptive', 'true');
  if (settings.setCookie) jinaUrl.searchParams.set('cookie', settings.setCookie);
  if (settings.proxyUrl) jinaUrl.searchParams.set('proxy', settings.proxyUrl);
  if (settings.targetSelector) jinaUrl.searchParams.set('target', settings.targetSelector);
  if (settings.waitForSelector) jinaUrl.searchParams.set('wait', settings.waitForSelector);
  
  const headers = {
    'Authorization': 'Bearer jina_431ebf610e864d9a9a551b8799d84e13OcnNjDuzeGEMKdZgW5yjSzBUgzDR',
    'X-With-Generated-Alt': settings.withGeneratedAlt.toString()
  };

  try {
    const response = await fetch(jinaUrl.toString(), { 
      headers,
      cache: settings.cacheEnabled ? 'default' : 'no-store'
    });
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
