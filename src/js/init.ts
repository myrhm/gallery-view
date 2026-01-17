import { fetchStats } from './modules/api.js';
import { log, MediaFile, Stats } from './modules/utils.js';
import { renderGallery } from './modules/gallery.js';
import { setupModalButtons, setupCloseModalBackground } from './modules/modal.js';
import { setupSwipe } from './modules/modalSwipe.js';

export async function initApp(): Promise<void> {
  log('Initializing Media Viewer...');

  try {

    setupModalButtons();
    setupCloseModalBackground();
    setupSwipe();

    await loadPage(1);

    log('Rendering gallery success', 'success');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Initialization error: ${message}`, 'error');
  }
}

export async function loadPage(page: number): Promise<void> {
  try {
    const limit: number = 500;

    const response = await fetch(`/api/files?page=${page}&limit=${limit}`);
    const data = await response.json();
    const files: MediaFile[] = data.items;
    const stats: Stats = data.stats;

    renderGallery(files);
    fetchStats(stats);

  } catch (error) {
    log(`Error loading page`, 'error');
  }
}
