/* Copertine che non si caricano: al posto della casella vuota mostra una copertina
   tipografica con il titolo. L'<img> originale resta nella pagina (nascosta), così
   carrello, preferiti e finestre di dettaglio continuano a leggerne l'indirizzo. */
(() => {
  const TARGETS = '.product-card:not(.catalog-card) .product-image img, .release-card img, .daily-manga-cover';

  function titleOf(img) {
    const alt = (img.getAttribute('alt') || '').trim();
    return alt.replace(/^(Copertina( italiana)? di|Action figure di)\s+/i, '') || 'Copertina';
  }

  function showFallback(img) {
    if (img.dataset.coverFallback) return;
    img.dataset.coverFallback = '1';
    const box = document.createElement('div');
    box.className = 'cover-fallback';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', img.getAttribute('alt') || 'Copertina non disponibile');
    const label = document.createElement('strong');
    label.textContent = titleOf(img);
    box.append(label);
    img.hidden = true;
    img.after(box);
  }

  function check(img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) showFallback(img);
  }

  // errori che arrivano dopo l'avvio dello script
  document.addEventListener('error', event => {
    const img = event.target;
    if (img instanceof HTMLImageElement && img.matches(TARGETS)) showFallback(img);
  }, true);

  // finestra di dettaglio: se la copertina non si carica, resta il pannello pulito senza testo alternativo
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLImageElement && event.target.matches('.manga-dialog-cover')) event.target.classList.remove('is-broken');
  }, true);
  document.addEventListener('error', event => {
    if (event.target instanceof HTMLImageElement && event.target.matches('.manga-dialog-cover')) event.target.classList.add('is-broken');
  }, true);

  // errori già avvenuti prima che lo script partisse
  const sweep = () => document.querySelectorAll(TARGETS).forEach(check);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sweep);
  else sweep();
  window.addEventListener('load', sweep);
})();
