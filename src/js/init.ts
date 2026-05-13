import { setStats } from './modules/api.js';
import { log, MediaFile, Stats } from './modules/utils.js';
import { renderGallery } from './modules/gallery.js';
import { setupModalButtons, setupCloseModalBackground } from './modules/modal.js';
import { setupSwipe } from './modules/modalSwipe.js';
import { renderPagination } from './modules/pagination.js';

let currentPage = 1;
let currentLimit: number;

function initItemLimit(): void {
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
    initItemLimit();

    await loadPage(currentPage);

    log('Rendering gallery success', 'success');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Initialization error: ${message}`, 'error');
  }
}

export async function loadPage(page: number): Promise<void> {
  try {
    const response = await fetch(`/api/files?page=${page}&limit=${currentLimit}`);
    const data = await response.json();
    const files: MediaFile[] = data.items;
    const stats: Stats = data.stats;
    const totalPages: number = data.total_pages;

    currentPage = data.page;

    renderGallery(files);
    setStats(stats);
    renderPagination(currentPage, totalPages, (p) => {
      currentPage = p;
      loadPage(currentPage);
    });

  } catch (error) {
    log(`Error loading page`, 'error');
  }
}
