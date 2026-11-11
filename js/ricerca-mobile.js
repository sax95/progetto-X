/* Ricerca su mobile: sotto i 700px il campo di ricerca si sposta in cima al menu,
   così l'header resta su una riga sola. Sopra i 700px torna nell'header.
   Si sposta lo stesso elemento (non una copia): id, eventi e filtri restano quelli originali.
   Senza JavaScript il campo resta nell'header, su una seconda riga (vedi CSS). */
'use strict';

(() => {
  const search = document.querySelector('.header-inner .header-search');
  const menu = document.querySelector('.mobile-menu');
  const links = menu && menu.querySelector('.mobile-links');
  if (!search || !links) return;

  // segnaposto per rimettere il campo esattamente dov'era
  const home = document.createComment('posizione della ricerca su desktop');
  search.before(home);
  const mobile = window.matchMedia('(max-width: 700px)');

  function place() {
    if (mobile.matches) {
      links.prepend(search);
      search.classList.add('is-in-menu');
      // ricerca già compilata (es. tasto Indietro): apri il menu per mostrare cosa sta filtrando
      if (search.querySelector('input').value.trim()) menu.open = true;
    } else {
      home.after(search);
      search.classList.remove('is-in-menu');
    }
  }
  mobile.addEventListener('change', place);
  place();
})();
