
export interface MediaFile {
  name: string;
  type: 'image' | 'video' | 'animated_image';
  url: string;
  thumbnail_url: string;
  size: string;
  date: string;
}

export interface Stats {
  total: number;
  images: number;
  videos: number;
}

export function formatFileSize(byteSize: number): string {
  const unit = ['B', 'KB', 'MB', 'GB'];
  let size = byteSize;

  for (let unit of units) {
    if (size < 1024.0) {
      return `${size.toFixed(1)}${unit}`;
    }
    size /= 1024.0;
  }
  return `${size.toFixed(1)}TB`;
}

export function getMediaFiles(): MediaFile[] {
  return (window as any).mediaFiles || [];
}

export function setMediaFiles(files: MediaFile[]): void {
  (window as any).mediaFiles = files;
}

export function log(message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info'): void {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `[${timestamp} ${type.toUpperCase()}]`;

  switch (type) {
    case 'success':
      console.log(`%c${prefix}: ${message}`, 'color: green; font-weight: bold');
      break;
    case 'warn':
      console.warn(`%c${prefix}: ${message}`, 'color: orange; font-weight: bold');
      break;
    case 'error':
      console.error(`%c${prefix}: ${message}`, 'color: red; font-weight: bold');
      break;
    default:
      console.log(`%c${prefix}: ${message}`, 'color: blue');
  }
}

export function getElementOrThrow(id: string): HTMLElement {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element;
}

export function getElementsOrThrow(selector: string): NodeListOf<Element> {
  const element = document.querySelectorAll(selector);
  if (element.length == 0) {
    throw new Error(`No elements found with selector "${selector}"`);
  }
  return elements;
}
