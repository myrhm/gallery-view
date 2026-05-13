type OnPageChange = (page: number) => void;

let _onPageChange: OnPageChange | null = null;
let _currentPage = 1;
let _totalPages = 1;

function getVisibleCount(): number {
  if (window.innerWidth >= 1024) return 7;
  if (window.innerWidth >= 640) return 5;
  return 3;
}

function buildPageRange(current: number, total: number, visible: number): (number | 'ellipsis-left' | 'ellipsis-right')[] {
  // If everything fits without ellipsis, just show all
  if (total <= visible + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(visible / 2);
  let start = Math.max(2, current - half);
  let end = Math.min(total - 1, start + visible - 1);

  // Clamp when near the end
  if (end === total - 1) {
    start = Math.max(2, end - visible + 1);
  }

  const pages: (number | 'ellipsis-left' | 'ellipsis-right')[] = [1];
  if (start > 2) pages.push('ellipsis-left');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('ellipsis-right');
  pages.push(total);

  return pages;
}

function showJumpPopup(anchor: HTMLElement, total: number): void {
  document.getElementById('page-jump-popup')?.remove();

  const popup = document.createElement('div');
  popup.id = 'page-jump-popup';
  popup.className = [
    'fixed z-50 bg-white border border-gray-300 rounded-lg shadow-xl',
    'p-2 flex gap-2 items-center',
  ].join(' ');

  const input = document.createElement('input');
  input.type = 'number';
  input.min = '1';
  input.max = total.toString();
  input.placeholder = `1–${total}`;
  input.className = 'w-16 border border-indigo-300 rounded px-1 py-0.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-500';

  const btn = document.createElement('button');
  btn.textContent = 'Go';
  btn.className = 'px-2 py-0.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 transition-colors';

  popup.appendChild(input);
  popup.appendChild(btn);

  // Position above the anchor button
  const rect = anchor.getBoundingClientRect();
  popup.style.top = `${rect.top - 52}px`;
  popup.style.left = `${rect.left}px`;

  document.body.appendChild(popup);
  input.focus();
  input.select();

  const jump = () => {
    const val = parseInt(input.value);
    if (val >= 1 && val <= total) {
      popup.remove();
      _onPageChange?.(val);
    }
  };

  btn.addEventListener('click', jump);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') jump();
    if (e.key === 'Escape') popup.remove();
  });

  // Close on outside click (defer to avoid the current click triggering it)
  setTimeout(() => {
    const handler = (e: MouseEvent) => {
      if (!popup.contains(e.target as Node)) {
        popup.remove();
        document.removeEventListener('click', handler);
      }
    };
    document.addEventListener('click', handler);
  }, 0);
}

function createBtn(label: string, classes: string, onClick: (() => void) | null, disabled = false): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = classes;
  btn.disabled = disabled;
  if (onClick) btn.addEventListener('click', onClick);
  return btn;
}

export function renderPagination(current: number, total: number, onPageChange: OnPageChange): void {
  _onPageChange = onPageChange;
  _currentPage = current;
  _totalPages = total;

  const container = document.getElementById('pagination');
  if (!container) return;

  container.innerHTML = '';

  if (total <= 1) {
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');

  const baseBtn = 'px-3 py-1.5 rounded text-sm font-medium transition-colors';
  const normalBtn = `${baseBtn} text-gray-700 hover:bg-indigo-100`;
  const activeBtn = `${baseBtn} bg-indigo-600 text-white cursor-default`;
  const disabledBtn = `${baseBtn} text-gray-400 opacity-50 cursor-not-allowed`;

  const visible = getVisibleCount();
  const pages = buildPageRange(current, total, visible);

  container.appendChild(
    createBtn('←', current === 1 ? disabledBtn : normalBtn, () => onPageChange(current - 1), current === 1)
  );

  for (const p of pages) {
    if (p === 'ellipsis-left' || p === 'ellipsis-right') {
      const el = createBtn('…', `${normalBtn} cursor-pointer`, null);
      el.title = 'Jump to page';
      el.addEventListener('click', () => showJumpPopup(el, total));
      container.appendChild(el);
    } else {
      container.appendChild(
        createBtn(p.toString(), p === current ? activeBtn : normalBtn, () => onPageChange(p))
      );
    }
  }

  container.appendChild(
    createBtn('→', current === total ? disabledBtn : normalBtn, () => onPageChange(current + 1), current === total)
  );
}

// Re-render on resize so visible page count adjusts responsively
let _resizeTimer: ReturnType<typeof setTimeout> | null = null;
window.addEventListener('resize', () => {
  if (_resizeTimer) clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    if (_onPageChange && _totalPages > 1) {
      renderPagination(_currentPage, _totalPages, _onPageChange);
    }
  }, 150);
});
