/* @jsx h */
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { getOptions, saveOptions } from "../utilities/storage_helpers.ts";
import type { OptionsData } from "../utilities/storage_helpers.ts";

export interface OptionsProps {
  default?: boolean;
  path?: string;
}

export default function Options(_props: OptionsProps) {
  const [options, setOptions] = useState<OptionsData>({
    enableImageCaptions: false,
    useStreamingMode: false,
    cacheTimeout: 3600,
  });

  useEffect(() => {
    getOptions().then((savedOptions) => {
      if (savedOptions) {
        setOptions(savedOptions);
      }
    });
  }, []);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;
    const newValue = type === "checkbox" ? checked : Number(value);
    const updatedOptions = { ...options, [name]: newValue };
    setOptions(updatedOptions);
    saveOptions(updatedOptions);
  };

  return (
    <div class="options-container">
      <h1>Options</h1>
      <div class="options-group">
        <div class="input-group">
          <label>
            <input
              type="checkbox"
              name="enableImageCaptions"
              checked={options.enableImageCaptions}
              onChange={handleChange}
            />
            Enable Image Captions
          </label>
        </div>
        <div class="input-group">
          <label>
            <input
              type="checkbox"
              name="useStreamingMode"
              checked={options.useStreamingMode}
              onChange={handleChange}
            />
            Use Streaming Mode
          </label>
        </div>
        <div class="input-group">
          <label>
            Cache Timeout (seconds):
            <input
              type="number"
              name="cacheTimeout"
              value={options.cacheTimeout}
              onChange={handleChange}
              min="0"
            />
          </label>
        </div>
      </div>
      <a href="#home">Go to home</a>
    </div>
  );
}
