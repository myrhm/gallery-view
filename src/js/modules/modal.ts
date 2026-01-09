import { getFilteredFiles } from './gallery.js';
import { log, getElementOrThrow, MediaFile } from './utils.ts';

export function openModal(index: number): void {
  const modal = getElementOrThrow('modal');
  const filteredFiles = getFilteredFiles();

  if (!filteredFiles || filteredFiles.length === 0) {
    log('No files to display', 'warn');
  }

  const file = filteredFiles[index];
}
