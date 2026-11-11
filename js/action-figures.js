'use strict';

const cards = [...document.querySelectorAll('.product-card[data-product-id]')];
const search = document.querySelector('#figures-search');
const searchStatus = document.querySelector('#figures-search-status');
const metadata = new Map(cards.map(card => {
  const price = card.querySelector('.price').textContent.trim().match(/^(\d+)(?:,(\d{2}))?\s*€$/);
  return [card.dataset.productId, {
    id: card.dataset.productId,
    title: card.querySelector('h3').textContent.trim(),
    category: card.querySelector('.product-category').textContent.trim(),
    price: price ? Number(price[1]) * 100 + Number(price[2] || 0) : 0,
    image: card.querySelector('.product-image img')?.getAttribute('src') || ''
  }];
}));
metadata.forEach(carrello.registra);

function filterFigures() {
  const query = search.value.trim().toLocaleLowerCase('it');
  let visibleCount = 0;
  for (const card of cards) {
    const searchableText = [
      card.querySelector('h3').textContent,
      card.querySelector('.product-category').textContent,
      card.dataset.creator,
      card.dataset.description
    ].join(' ').toLocaleLowerCase('it');
    const matches = !query || searchableText.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount++;
  }
  searchStatus.textContent = query
    ? `${visibleCount} ${visibleCount === 1 ? 'figure trovata' : 'figure trovate'}.`
    : '';
}

for (const card of cards) {
  const coverLink = card.querySelector('.catalog-cover-link');
  coverLink.addEventListener('click', () => {
    const cover = card.querySelector('.product-image img');
    const title = card.querySelector('h3').textContent.trim();
    const dialog = document.querySelector('#manga-dialog');
    const dialogCover = document.querySelector('#manga-dialog-cover');
    dialogCover.src = cover.getAttribute('src');
    dialogCover.alt = cover.alt;
    dialog.querySelector('.manga-dialog-content').classList.remove('no-cover');
    document.querySelector('#manga-dialog-genre').textContent = card.querySelector('.product-category').textContent;
    document.querySelector('#manga-dialog-title').textContent = title;
    document.querySelector('#manga-dialog-price').textContent = card.querySelector('.price').textContent;
    document.querySelector('#manga-dialog-description').textContent = card.dataset.description;
    document.querySelector('#manga-dialog-dimensions').textContent = card.dataset.size;
    document.querySelector('#manga-dialog-maker').textContent = card.dataset.maker;
    document.querySelector('#manga-dialog-cart-confirmation').hidden = true;
    document.querySelector('#manga-dialog-cart').dataset.productId = card.dataset.productId;
    document.querySelector('#manga-dialog-cart').setAttribute('aria-label', `Aggiungi ${title} al carrello`);
    dialog.dataset.productId = card.dataset.productId;
    dialog.showModal();
    dialog.dispatchEvent(new CustomEvent('manga:details-open', {
      detail: { productId: card.dataset.productId }
    }));
  });
}

document.querySelector('#manga-dialog-close').addEventListener('click', () => {
  document.querySelector('#manga-dialog').close();
});
document.querySelector('#manga-dialog-cart').addEventListener('click', event => {
  const product = metadata.get(event.currentTarget.dataset.productId);
  if (!product) return;
  // dalla scheda di dettaglio il messaggio compare nella scheda stessa, non nell'avviso in basso
  const result = carrello.aggiungi(product.id, { silenzioso: true });
  document.querySelector('#manga-dialog-cart-message').textContent = result.message;
  document.querySelector('#manga-dialog-cart-confirmation').hidden = false;
});
document.querySelectorAll('.product-actions .add-button').forEach(button => {
  button.addEventListener('click', () => {
    const product = metadata.get(button.closest('.product-card').dataset.productId);
    if (!product) return;
    carrello.aggiungi(product.id);
  });
});

search.addEventListener('input', filterFigures);
document.querySelector('#manga-dialog').addEventListener('click', event => {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right
    || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
});

