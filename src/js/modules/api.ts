import { log, Stats, getElementOrThrow } from './utils.js';

export async function setStats(stats): Promise<Stats | null> {
  try {
    log('Loading stats...');

    const data: Stats = stats;

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
