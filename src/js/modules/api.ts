import { log, Stats, getElementOrThrow } from './utils.js';

export async function fetchStats(): Promise<Stats | null> {
  try {
    log('Fetching stats...');
    const response = await fetch('api/stats');

    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }

    const data: Stats = await response.json();

    const totalEl = getElementOrThrow('totalCount');
    const imageEl = getElementOrThrow('imageCount');
    const videoEl = getElementOrThrow('videoCount');

    totalEl.textContent = data.total.toString();
    imageEl.textContent = data.images.toString();
    videoEl.textContent = data.videos.toString();

    log('Stats loaded', 'success');
    return data;

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(`Error fetching stats: ${message}, 'error'`);
    return null;
  }
}
