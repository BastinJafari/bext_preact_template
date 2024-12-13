/* @jsx h */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { getSettings, updateSettings, resetSettings } from "../utilities/storage_helpers.ts";
import type { ReaderSettings } from "../utilities/storage_helpers.ts";

export interface OptionsProps {
  default?: boolean;
  path?: string;
}

export default function Options(_props: OptionsProps) {
  const [settings, setSettings] = useState<ReaderSettings>({
    withGeneratedAlt: false,
    responseFormat: 'markdown',
    timeout: 30,
    cacheEnabled: true,
    streamingMode: false,
    adaptiveCrawling: false,
  });

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleChange = async (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const { name, type } = target;
    let value: string | number | boolean;
    
    if (type === "checkbox") {
      value = (target as HTMLInputElement).checked;
    } else if (type === "number") {
      value = Number(target.value);
    } else {
      value = target.value;
    }

    const updatedSettings = { ...settings, [name]: value };
    setSettings(updatedSettings);
    await updateSettings({ [name]: value });
  };

  const handleReset = async () => {
    await resetSettings();
    const defaultSettings = await getSettings();
    setSettings(defaultSettings);
  };

  return (
    <div class="options-container">
      <h1>Reader Settings</h1>
      <div class="options-group">
        <div class="input-group">
          <label>
            <input
              type="checkbox"
              name="withGeneratedAlt"
              checked={settings.withGeneratedAlt}
              onChange={handleChange}
            />
            Enable Image Captions
          </label>
          <p class="description">Auto-generate captions for images without alt text</p>
        </div>

        <div class="input-group">
          <label>
            <input
              type="checkbox"
              name="streamingMode"
              checked={settings.streamingMode}
              onChange={handleChange}
            />
            Use Streaming Mode
          </label>
          <p class="description">Get incremental content updates for better completeness</p>
        </div>

        <div class="input-group">
          <label>
            Response Format:
            <select
              name="responseFormat"
              value={settings.responseFormat}
              onChange={handleChange}
            >
              <option value="markdown">Markdown</option>
              <option value="html">HTML</option>
              <option value="text">Plain Text</option>
            </select>
          </label>
          <p class="description">Choose how the content should be formatted</p>
        </div>

        <div class="input-group">
          <label>
            Page Load Timeout (seconds):
            <input
              type="number"
              name="timeout"
              value={settings.timeout}
              onChange={handleChange}
              min="0"
              max="120"
            />
          </label>
          <p class="description">Maximum time to wait for page content to load</p>
        </div>

        <div class="input-group">
          <label>
            <input
              type="checkbox"
              name="cacheEnabled"
              checked={settings.cacheEnabled}
              onChange={handleChange}
            />
            Enable Caching
          </label>
          <p class="description">Cache responses for better performance (3600s lifetime)</p>
        </div>
      </div>

      <div class="actions">
        <button onClick={handleReset} class="reset-button">
          Reset to Defaults
        </button>
      </div>

      <style>{`
        .options-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .options-group {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin: 20px 0;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .description {
          color: #666;
          font-size: 0.9em;
          margin: 0;
        }
        select, input[type="number"] {
          margin-left: 10px;
          padding: 4px;
        }
        .actions {
          margin-top: 30px;
          text-align: center;
        }
        .reset-button {
          padding: 8px 16px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .reset-button:hover {
          background: #d32f2f;
        }
      `}</style>
    </div>
  );
}
