import { setStats } from './modules/api.js';
import { log, MediaFile, Stats } from './modules/utils.js';
import { renderGallery } from './modules/gallery.js';
import { setupModalButtons, setupCloseModalBackground } from './modules/modal.js';
import { setupSwipe } from './modules/modalSwipe.js';

let currentPage = 1;
let currentLimit = document.getElementById("itemLimit").value;

function initPagination(): void {
  const select = document.getElementById("itemLimit") as HTMLSelectElement;

  currentLimit = parseInt(select.value);
  select.addEventListener("change", () => {
    currentLimit = parseInt(select.value);
    currentPage = 1;
    loadPage(currentPage);
  });
}

export async function initApp(): Promise<void> {
  log('Initializing Media Viewer...');

  try {
    setupModalButtons();
    setupCloseModalBackground();
    setupSwipe();
    initPagination();

    await loadPage(currentPage);

    log('Rendering gallery success', 'success');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Initialization error: ${message}`, 'error');
  }
}

export async function loadPage(page: number): Promise<void> {
  try {
    const limit: number = currentLimit;

    const response = await fetch(`/api/files?page=${page}&limit=${limit}`);
    const data = await response.json();
    const files: MediaFile[] = data.items;
    const stats: Stats = data.stats;

    renderGallery(files);
    setStats(stats);

  } catch (error) {
    log(`Error loading page`, 'error');
  }
}
