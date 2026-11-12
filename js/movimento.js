/* MOVIMENTO — comune a tutte le pagine.
   1. Pausa per le animazioni che si muovono da sole (WCAG 2.2.2): ogni bottone con
      data-toggle-marquee ferma o riavvia la fascia indicata in aria-controls.
   2. scorriFascia(): le frecce delle Novità spostano la fascia con un breve scorrimento.
   3. Bottone "torna su": compare dopo un po' di scroll, con una dissolvenza. */
'use strict';

/* Sposta di una copertina la fascia che scorre da sola (animazione CSS release-marquee).
   Le copertine scorrono in 320ms (ease-out) invece di saltare di colpo; click ravvicinati
   si sommano. Le posizioni sono "srotolate" (senza modulo) finché dura lo scorrimento.
   La usano js/script.js (home) e js/catalogo.js. */
function scorriFascia(track, direction) {
  const animation = track.getAnimations()[0];
  if (!animation) return;
  const duration = Number(animation.effect.getComputedTiming().duration);
  const gap = Number.parseFloat(getComputedStyle(track).gap);
  const cardDistance = track.querySelector('.release-card').getBoundingClientRect().width + gap;
  const cycleDistance = track.scrollWidth / 2 + gap / 2;
  const step = direction * duration * cardDistance / cycleDistance;
  const wrap = time => ((time % duration) + duration) % duration;
  const state = track.scorrimento || (track.scorrimento = { frame: 0, target: null, position: 0 });

  cancelAnimationFrame(state.frame);
  const from = state.target === null ? Number(animation.currentTime) || 0 : state.position;
  const to = (state.target ?? from) + step;
  state.target = to;
  state.position = from;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animation.currentTime = wrap(to);
    state.target = null;
    return;
  }
  const start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / 320, 1);
    state.position = from + (to - from) * (1 - Math.pow(1 - t, 3));
    animation.currentTime = wrap(state.position);
    if (t < 1) state.frame = requestAnimationFrame(tick);
    else state.target = null;
  };
  state.frame = requestAnimationFrame(tick);
}

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

  // is-fading: il bottone resta nel documento e compare/sparisce con una dissolvenza
  // (CSS, sezione 11). Senza JavaScript resta nascosto dall'attributo hidden.
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.hidden = false;
    backToTop.classList.add('is-fading');
    const update = () => backToTop.classList.toggle('is-visible', window.scrollY >= 240);
    window.addEventListener('scroll', update, { passive: true });
    backToTop.addEventListener('click', () => window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    }));
    update();
  }
})();
