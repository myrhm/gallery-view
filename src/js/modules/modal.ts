import { getFilteredFiles } from './gallery.js';
import { log, getElementOrThrow, MediaFile } from './utils.js';

export function openModal(index: number): void {
  const modal = getElementOrThrow('modal');
  const filteredFiles = getFilteredFiles();

  if (!filteredFiles || filteredFiles.length === 0) {
    log('No files to display', 'warn');
  }

  const file = filteredFiles[index];
}

export function closeModal() {
  const modal = getElementOrThrow('modal');
  modal.classList.add('hidden');
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
