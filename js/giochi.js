'use strict';

const cards = [...document.querySelectorAll('.games-grid .product-card[data-product-id]')];
const search = document.querySelector('#games-search');
const searchStatus = document.querySelector('#games-search-status');
const typeFilters = [...document.querySelectorAll('[data-game-type-filter]')];
const seriesFilters = [...document.querySelectorAll('[data-game-series-filter]')];
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
let activeType = '';
let activeSeries = '';

function filterGames() {
  const normalize = value => value.toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const query = normalize(search.value.trim());
  let visibleCount = 0;
  for (const card of cards) {
    const searchable = normalize([
      card.querySelector('h3').textContent,
      card.querySelector('.product-category').textContent,
      card.querySelector('.format').textContent,
      card.dataset.description
    ].join(' '));
    const matches = (!query || searchable.includes(query))
      && (!activeType || card.dataset.type === activeType)
      && (!activeSeries || card.dataset.series === activeSeries);
    card.hidden = !matches;
    if (matches) visibleCount++;
  }
  searchStatus.textContent = query || activeType || activeSeries
    ? `${visibleCount} ${visibleCount === 1 ? 'gioco trovato' : 'giochi trovati'}.`
    : '';
}

function setActiveFilter(filters, target, attribute) {
  for (const button of filters) button.setAttribute('aria-pressed', String(button === target));
  return target.dataset[attribute] || '';
}

for (const card of cards) {
  const coverLink = card.querySelector('.catalog-cover-link');
  const cover = card.querySelector('.product-image img');
  cover.addEventListener('error', () => {
    cover.hidden = true;
    coverLink.dataset.coverState = 'unavailable';
  });
  if (!cover.complete) {
    coverLink.dataset.coverState = 'loading';
  } else if (cover.naturalWidth === 0) {
    cover.hidden = true;
    coverLink.dataset.coverState = 'unavailable';
  }
  cover.addEventListener('load', () => { delete coverLink.dataset.coverState; });

  coverLink.addEventListener('click', () => {
    const dialog = document.querySelector('#manga-dialog');
    const dialogCover = document.querySelector('#manga-dialog-cover');
    const imageAvailable = cover.complete && cover.naturalWidth > 0 && !cover.hidden;
    dialogCover.hidden = !imageAvailable;
    if (imageAvailable) {
      dialogCover.src = cover.currentSrc || cover.src;
      dialogCover.alt = cover.alt;
    }
    dialog.querySelector('.manga-dialog-content').classList.toggle('no-cover', !imageAvailable);
    document.querySelector('#manga-dialog-genre').textContent = card.querySelector('.product-category').textContent;
    document.querySelector('#manga-dialog-title').textContent = card.querySelector('h3').textContent.trim();
    document.querySelector('#manga-dialog-price').textContent = card.querySelector('.price').textContent;
    document.querySelector('#manga-dialog-description').textContent = card.dataset.description;
    document.querySelector('#games-dialog-content').textContent = card.dataset.content;
    document.querySelector('#games-dialog-players').textContent = card.dataset.players;
    document.querySelector('#games-dialog-age').textContent = card.dataset.age;
    const sourceLink = document.querySelector('#games-dialog-source');
    sourceLink.href = card.dataset.sourceUrl;
    sourceLink.textContent = card.dataset.sourceLabel;
    document.querySelector('#manga-dialog-cart-confirmation').hidden = true;
    document.querySelector('#manga-dialog-cart').dataset.productId = card.dataset.productId;
    document.querySelector('#manga-dialog-cart').setAttribute('aria-label', `Aggiungi ${card.querySelector('h3').textContent.trim()} al carrello`);
    dialog.dataset.productId = card.dataset.productId;
    dialog.showModal();
    dialog.dispatchEvent(new CustomEvent('manga:details-open', {
      detail: { productId: card.dataset.productId }
    }));
  });
}

for (const button of typeFilters) {
  button.addEventListener('click', () => {
    activeType = setActiveFilter(typeFilters, button, 'gameTypeFilter');
    filterGames();
  });
}
for (const button of seriesFilters) {
  button.addEventListener('click', () => {
    activeSeries = setActiveFilter(seriesFilters, button, 'gameSeriesFilter');
    filterGames();
  });
}
search.addEventListener('input', filterGames);
document.querySelector('#manga-dialog-close').addEventListener('click', () => document.querySelector('#manga-dialog').close());
document.querySelector('#manga-dialog-cart').addEventListener('click', event => {
  const product = metadata.get(event.currentTarget.dataset.productId);
  if (!product) return;
  // dalla scheda di dettaglio il messaggio compare nella scheda stessa, non nell'avviso in basso
  const result = carrello.aggiungi(product.id, { silenzioso: true });
  document.querySelector('#manga-dialog-cart-message').textContent = result.message;
  document.querySelector('#manga-dialog-cart-confirmation').hidden = false;
});
document.querySelectorAll('.games-grid .product-actions .add-button').forEach(button => {
  button.addEventListener('click', () => {
    const product = metadata.get(button.closest('.product-card').dataset.productId);
    if (!product) return;
    carrello.aggiungi(product.id);
  });
});
document.querySelector('#manga-dialog').addEventListener('click', event => {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right
    || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
});

