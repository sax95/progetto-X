/* Pausa per le animazioni che si muovono da sole (WCAG 2.2.2).
   Ogni bottone con data-toggle-marquee ferma o riavvia la fascia indicata in aria-controls. */
'use strict';

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-toggle-marquee]').forEach(button => {
    const track = document.getElementById(button.getAttribute('aria-controls'));
    if (!track) return;
    // Con "riduci movimento" la fascia è già ferma via CSS: il bottone non serve.
    if (reducedMotion) { button.hidden = true; return; }

    const update = () => {
      const paused = track.classList.contains('is-paused');
      button.textContent = paused ? 'Riprendi' : 'Pausa';
      button.setAttribute('aria-label', paused ? 'Riprendi: scorrimento novità' : 'Pausa: scorrimento novità');
    };
    button.addEventListener('click', () => {
      track.classList.toggle('is-paused');
      update();
    });
    update();
  });
})();
