export interface ReaderSettings {
  // Image caption settings
  withGeneratedAlt: boolean;
  
  // Response format settings
  responseFormat: 'markdown' | 'html' | 'text' | 'screenshot';
  
  // Cookie and proxy settings
  setCookie?: string;
  proxyUrl?: string;
  
  // Cache settings
  cacheEnabled: boolean;
  cacheTolerance?: number;
  
  // Content selection settings
  targetSelector?: string;
  waitForSelector?: string;
  
  // SPA and timeout settings
  timeout: number;
  streamingMode: boolean;
  
  // Search settings
  searchSites?: string[];
  
  // Crawler settings
  adaptiveCrawling: boolean;
}

const defaultSettings: ReaderSettings = {
  withGeneratedAlt: false,
  responseFormat: 'markdown',
  cacheEnabled: true,
  timeout: 30,
  streamingMode: false,
  adaptiveCrawling: false
};

// Legacy storage interface for backward compatibility
export interface StorageData {
  [key: string]: unknown;
}

export interface OptionsData {
  enableImageCaptions: boolean;
  useStreamingMode: boolean;
  cacheTimeout: number;
}

const defaultOptions: OptionsData = {
  enableImageCaptions: false,
  useStreamingMode: false,
  cacheTimeout: 3600,
};

// Legacy storage functions
export async function getStorage(): Promise<StorageData> {
  const result = await chrome.storage.sync.get(null);
  return result || {};
}

export async function updateStorage(data: StorageData): Promise<void> {
  await chrome.storage.sync.set(data);
}

export async function getOptions(): Promise<OptionsData> {
  const result = await chrome.storage.sync.get('options');
  return result.options || defaultOptions;
}

export async function saveOptions(options: OptionsData): Promise<void> {
  await chrome.storage.sync.set({ options });
}

export function addStorageListener(callback: (changes: chrome.storage.StorageChange) => void): void {
  chrome.storage.onChanged.addListener(callback);
}

// New Reader settings functions
export async function getSettings(): Promise<ReaderSettings> {
  const result = await chrome.storage.sync.get('readerSettings');
  return result.readerSettings || defaultSettings;
}

export async function updateSettings(settings: Partial<ReaderSettings>): Promise<void> {
  const currentSettings = await getSettings();
  const newSettings = { ...currentSettings, ...settings };
  await chrome.storage.sync.set({ readerSettings: newSettings });
}

export async function resetSettings(): Promise<void> {
  await chrome.storage.sync.set({ readerSettings: defaultSettings });
}