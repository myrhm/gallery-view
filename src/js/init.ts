import { fetchStats } from './modules/api.js';
import { log, setMediaFiles, MediaFile } from './modules/utils.js';
import { renderGallery } from './modules/gallery.js';
import { setupModalButtons, setupCloseModalBackground } from './modules/modal.js';
import { setupSwipe } from './modules/modalSwipe.js';

export async function initApp(): Promise<void> {
  log('Initializing Media Viewer...');

  try {

    setupModalButtons();
    setupCloseModalBackground();
    setupSwipe();

    await loadPage();

    log('Rendering gallery success', 'success');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Initialization error: ${message}`, 'error');
  }
}

export async function loadPage(): Promise<void> {
  try {

    const response: MediaFile[] = await fetch('/api/files');
    const files: MediaFile[] = await response.json();
    console.log(files);

    renderGallery(files);
    fetchStats();

  } catch (error) {
    log(`Error loading page`, 'error');
  }
}
