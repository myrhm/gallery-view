import { getElementOrThrow } from './utils.js';
import { nextMedia, prevMedia } from './modal.js';
import Hammer from 'hammerjs';

export function setupSwipe(): void {
  const modal = getElementOrThrow('modal');
  const modalSwipe = new Hammer(modal);
  modalSwipe.on('swipeleft', () => nextMedia());
  modalSwipe.on('swiperight', () => prevMedia());
}
