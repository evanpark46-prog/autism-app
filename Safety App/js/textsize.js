/* ==========================================================================
   Safety Scouts — text size (zoom) control
   Scales the root font-size, which every rem-based font-size in the site
   is relative to, so headings/body/buttons all zoom together consistently.
   ========================================================================== */

const TEXT_SIZES = [87.5, 100, 115, 130, 145];
const TEXT_SIZE_DEFAULT_INDEX = 1;

function getTextSizeIndex(){
  const saved = parseInt(localStorage.getItem('safetylib_text_size_idx'), 10);
  return Number.isInteger(saved) && saved >= 0 && saved < TEXT_SIZES.length ? saved : TEXT_SIZE_DEFAULT_INDEX;
}

function setTextSizeIndex(index){
  const clamped = Math.max(0, Math.min(TEXT_SIZES.length - 1, index));
  localStorage.setItem('safetylib_text_size_idx', String(clamped));
  applyTextSize();
  return clamped;
}

function applyTextSize(){
  document.documentElement.style.fontSize = TEXT_SIZES[getTextSizeIndex()] + '%';
}

function initTextSizeSwitcher(){
  applyTextSize();
  const wrap = document.querySelector('[data-textsize-switch]');
  if (!wrap) return;
  function render(){
    const idx = getTextSizeIndex();
    wrap.innerHTML = `
      <button type="button" data-textsize-dec aria-label="${t('textsize_decrease')}" ${idx === 0 ? 'disabled' : ''}>A−</button>
      <button type="button" data-textsize-inc aria-label="${t('textsize_increase')}" ${idx === TEXT_SIZES.length - 1 ? 'disabled' : ''}>A+</button>
    `;
    wrap.querySelector('[data-textsize-dec]').addEventListener('click', () => {
      setTextSizeIndex(getTextSizeIndex() - 1);
      render();
    });
    wrap.querySelector('[data-textsize-inc]').addEventListener('click', () => {
      setTextSizeIndex(getTextSizeIndex() + 1);
      render();
    });
  }
  render();
  window.addEventListener('safetylib:langchange', render);
}
