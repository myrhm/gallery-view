import { getMediaFiles, MediaFile, log, getElementOrThrow } from './utils.js';

type FilterType = 'all' | 'image' | 'video';

let currentFilter: FilterType = 'all';
let filteredFiles: MediaFile[] = [];

export function filterFiles(filter: FilterType): MediaFile[] {
  const allFiles = getMediaFiles();

  if (filter == 'all') {
    return allFiles;
  }

  return allFiles.filter((file: MediaFile) => file.type == filter);
}

function createMediaItems(file: MediaFile, index: number): HTMLElement {
  const item = document.createElement('div');
  item.className = 'media-item';
  item.style.borderRadius = '10px';
  item.style.overflow = 'hidden';

  let thumbnail: HTMLElement;
  if (file.type == 'image') {
    const img = document.createElement('img');
    img.src = file.url;
    img.alt = file.name;
    img.className = 'media-thumbnail';
    thumbnail = img;
  } else {
    const video = document.createElement('video');
    video.className = 'media-thumbnail';
    const source = document.createElement('source');
    source.src = file.url;
    video.appendChild(source);
    thumbnail = video;
  }

  // create file HTML element for file informatil
  const info = document.createElement('div');
  info.className = 'media-info';
  info.innerHTML = `
    <div class="media-name" title="${file.name}">${file.name}</div>
    <div class="media-meta">
      <span>${file.type.toUpperCase()}</span>
      <span>${file.size}</span>
    </div>
    <div class="media-meta mt-1 text-gray-400">
      <span>${file.date}</span>
    </div>
  `;

  item.appendChild(thumbnail);
  item.appendChild(info);

  // TODO: buat modal

  return item;
}

export function renderGallery(): void {
  const gallery = getElementOrThrow('gallery');
  const emptyState = getElementOrThrow('emptyState');

  filteredFiles = filterFiles(currentFilter);
  log(`Rendering gallery (${filteredFiles.length} files)`);

  gallery.innerHTML = '';

  if (filteredFiles.length == 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  filteredFiles.forEach((file: MediaFile, index: number) => {
    const item = createMediaItems(file, index);
    gallery.appendChild(item);
  })
}
