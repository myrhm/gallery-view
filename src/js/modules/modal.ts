import { getFilteredFiles } from './gallery.js';
import { log, getElementOrThrow, MediaFile } from './utils.js';

let modalIndex: number;
let nextBtn: HTMLElement | null;
let prevBtn: HTMLElement | null;

export function openModal(index: number): void {
  modalIndex = index;
  const modal = getElementOrThrow('modal');
  const filteredFiles = getFilteredFiles();

  if (!filteredFiles || filteredFiles.length === 0) {
    log('No files to display', 'warn');
    return;
  }

  if (modalIndex === 0) {
    prevBtn.classList.remove('hover:text-slate-50');
    prevBtn.classList.remove('active:text-slate-50');
  } else {
    prevBtn.classList.add('hover:text-slate-50');
    prevBtn.classList.add('active:text-slate-50');
  }

  if (modalIndex === filteredFiles.length) {
    nextBtn.classList.remove('hover:text-slate-50');
    nextBtn.classList.remove('active:text-slate-50');
  } else {
    nextBtn.classList.add('hover:text-slate-50');
    nextBtn.classList.add('active:text-slate-50');
  }

  const file = filteredFiles[index];
  const container = getElementOrThrow('modalMediaContainer');
  container.innerHTML = '';

  let mediaElement: HTMLElement;
  if (file.type == 'image' || file.type == 'animated_image') {
    const img = document.createElement('img');
    img.src = file.url;
    img.className = 'modal-media';
    mediaElement = img;
  } else {
    const video = document.createElement('video');
    video.src = file.url;
    video.className = 'modal-media';
    video.controls = true;
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

  // log('Modal opened', 'success');
}

export function closeModal() {
  const modal = getElementOrThrow('modal');
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

export function nextMedia() {
  const filteredFiles = getFilteredFiles();

  if (modalIndex < filteredFiles.length - 1) {
    prevBtn.classList.add('hover:text-slate-50');
    prevBtn.classList.add('active:text-slate-50');
    openModal(modalIndex + 1)
  } else {
    nextBtn.classList.remove('hover:text-slate-50');
    nextBtn.classList.remove('active:text-slate-50');
    log('last file', 'warn');
  }
}

export function prevMedia() {
  const filteredFiles = getFilteredFiles();

  if (modalIndex > 0) {
    nextBtn.classList.add('hover:text-slate-50');
    nextBtn.classList.add('active:text-slate-50');
    openModal(modalIndex - 1);
  } else {
    prevBtn.classList.remove('hover:text-slate-50');
    prevBtn.classList.remove('active:text-slate-50');
    log('first file', 'warn');
  }
}

export function setupCloseModalBackground() {
  const modal = getElementOrThrow('modal');

  modal.addEventListener('click', function(event: MouseClick) {
    if (event.target === this) {
      closeModal();
    }
  });

  log('Modal backgroun click setup success', 'success');
}

export function setupModalButtons(): void {
  try {
    const closeBtn = document.querySelector('.modal-close') as HTMLElement | null;
    nextBtn = document.querySelector('.modal-nav.next') as HTMLElement | null;
    prevBtn = document.querySelector('.modal-nav.prev') as HTMLElement | null;
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', nextMedia);
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', prevMedia);
    }
    log('Modal button setup success', 'success');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Error setting up modal buttons: ${message}`, 'error');
  }
}
