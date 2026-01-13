import { fetchStats } from './modules/api.js';
import { log, setMediaFiles, MediaFile } from './modules/utils.js';
import { renderGallery } from './modules/gallery.js';
import { setupModalButtons, setupCloseModalBackground } from './modules/modal.js';
import { setupSwipe } from './modules/modalSwipe.js';

export async function initApp(): Promise<void> {
  log('Initializing Media Viewer...');

  try {
    const mediaFiles = (window as any).mediaFiles as MediaFile[] | undefined;
    if (mediaFiles && Array.isArray(mediaFiles)) {
      setMediaFiles(mediaFiles);
      log(`Loaded ${mediaFiles.length} media files from template`);
    } else {
      log('No media files found in window.mediaFiles', 'warn');
    }

    await fetchStats();
    renderGallery();

    setupModalButtons();
    setupCloseModalBackground();
    setupSwipe()

    log('Rendering gallery success', 'success');

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Initialization error: ${message}`, 'error');
  }
}
