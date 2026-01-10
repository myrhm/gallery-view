import { getFilteredFiles } from './gallery.js';
import { log, getElementOrThrow, MediaFile } from './utils.js';

export function openModal(index: number): void {
  const modal = getElementOrThrow('modal');
  const filteredFiles = getFilteredFiles();

  if (!filteredFiles || filteredFiles.length === 0) {
    log('No files to display', 'warn');
  }

  const file = filteredFiles[index];
  const container = getElementOrThrow('modalMediaContainer');
  container.innerHTML = '';

  let mediaElement: HTMLElement;
  if (file.type == 'image') {
    const img = document.createElement('img');
    img.src = file.url;
    img.className = 'modal-media';
    mediaElement = img;
  } else {
    const video = document.createElement('video');
    video.src = file.url;
    video.className = 'modal-media';
    video.control = true;
    mediaElement = video;
  }

  container.appendChild(mediaElement);

  const fileName = getElementOrThrow('modalFileName');
  const fileIndex = getElementOrThrow('modalFileIndex');
  const fileTotal = getElementOrThrow('modalFileTotal');

  fileName.textContent = file.name;
  fileIndex.textContent = (index + 1).toString();
  fileTotal.textContent = filteredFiles.length.toString();

  modal.classList.remove('hidden');

  // supaya user gak bisa scroll
  // kenapa? Karena seluruh element body di luar viewport adalah 'overflow'
  document.body.style.overflow = 'hidden';
  log('Modal opened', 'success');
}

export function closeModal() {
  const modal = getElementOrThrow('modal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

export function setupModalButtons(): void {
  try {
    const closeBtn = document.querySelector('.modal-close') as HTMLElement | null;
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Error setting up modal buttons: ${message}`, 'error');
  }
}
