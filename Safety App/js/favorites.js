/* ==========================================================================
   Safety Scouts — favorites ("My Topics")
   A small localStorage-backed pin list so a learner or parent can jump
   straight back to specific topics instead of re-scanning the whole grid.
   Local-only, like everything else here.
   ========================================================================== */

const FAVORITES_KEY = 'safetylib_favorites';

function getFavorites(){
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
}

function isFavorite(id){
  return getFavorites().includes(id);
}

function toggleFavorite(id){
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx === -1) favs.push(id); else favs.splice(idx, 1);
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs)); } catch (e) { /* storage full/blocked */ }
  return idx === -1;
}
