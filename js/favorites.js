'use strict';

/* PREFERITI — salvati in localStorage, solo in questo browser. */

const favoritesStorageKey = 'mangaClubFavorites';
const openFavoritesButton = document.querySelector('#open-favorites');
const favoritesCount = document.querySelector('#favorites-count');
const favoriteCards = [...document.querySelectorAll('.product-card, .catalog-card')];
const favoritesDialog = document.createElement('dialog');
favoritesDialog.id = 'favorites-dialog';
favoritesDialog.className = 'favorites-dialog';
favoritesDialog.setAttribute('aria-labelledby', 'favorites-title');
favoritesDialog.innerHTML = `
  <div class="favorites-heading">
    <h2 id="favorites-title">I tuoi preferiti</h2>
    <button class="favorites-close" type="button" aria-label="Chiudi i preferiti">×</button>
  </div>
  <p class="favorites-status" role="status" aria-live="polite"></p>
  <ul class="favorites-list"></ul>
`;
document.body.append(favoritesDialog);

const favoritesStatus = favoritesDialog.querySelector('.favorites-status');
const favoritesList = favoritesDialog.querySelector('.favorites-list');
let favorites = [];
let favoritesStorageError = '';

const isFavoriteItem = item => item && typeof item.id === 'string' && typeof item.title === 'string';

function readLocalFavorites() {
  try {
    const savedFavorites = JSON.parse(localStorage.getItem(favoritesStorageKey) || '[]');
    if (Array.isArray(savedFavorites)) return savedFavorites.filter(isFavoriteItem);
    favoritesStorageError = 'I preferiti salvati non hanno un formato valido.';
  } catch (error) {
    favoritesStorageError = 'Non è possibile leggere i preferiti salvati in questo browser.';
    console.error('Lettura dei preferiti non riuscita:', error);
  }
  return [];
}

favorites = readLocalFavorites();

function isFavorite(id) {
  return favorites.some(item => item.id === id);
}

function updateFavoriteButtons() {
  for (const card of favoriteCards) {
    const button = card.querySelector('.favorite-toggle');
    const title = card.dataset.title || card.querySelector('.product-info h3, .catalog-card-info h3').textContent.trim();
    const selected = isFavorite(card.dataset.productId);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', `${selected ? 'Rimuovi' : 'Aggiungi'} ${title} ${selected ? 'dai' : 'ai'} preferiti`);
    button.title = `${selected ? 'Rimuovi dai' : 'Aggiungi ai'} preferiti`;
  }
}

function renderFavorites() {
  favoritesCount.textContent = String(favorites.length);
  favoritesCount.hidden = favorites.length === 0;
  openFavoritesButton.setAttribute('aria-label', `Preferiti, ${favorites.length} ${favorites.length === 1 ? 'prodotto' : 'prodotti'}`);
  favoritesList.replaceChildren();

  if (favorites.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'favorites-empty';
    empty.textContent = 'Non hai ancora aggiunto prodotti ai preferiti.';
    favoritesList.append(empty);
  } else {
    for (const favorite of favorites) {
      const row = document.createElement('li');
      row.className = 'favorite-row';
      const card = favoriteCards.find(item => item.dataset.productId === favorite.id);
      const cover = card?.querySelector('.product-image img, .catalog-cover-link img');
      const image = document.createElement('img');
      image.className = 'favorite-thumbnail';
      image.alt = '';
      image.loading = 'lazy';
      const coverSource = cover?.getAttribute('src') || favorite.image || '';
      if (coverSource) image.src = coverSource;
      image.hidden = !coverSource;
      image.addEventListener('error', () => {
        image.hidden = true;
      });
      const title = document.createElement('span');
      title.textContent = favorite.title;
      const copy = document.createElement('div');
      copy.className = 'favorite-copy';
      copy.append(title);
      const actions = document.createElement('div');
      actions.className = 'favorites-actions';
      const addButton = document.createElement('button');
      addButton.type = 'button';
      addButton.className = 'favorites-add';
      addButton.textContent = 'Aggiungi al carrello';
      addButton.setAttribute('aria-label', `Aggiungi ${favorite.title} al carrello`);
      addButton.addEventListener('click', () => addFavoriteToCart(favorite));
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'favorites-remove';
      removeButton.textContent = 'Rimuovi';
      removeButton.setAttribute('aria-label', `Rimuovi ${favorite.title} dai preferiti`);
      removeButton.addEventListener('click', () => removeFavorite(favorite.id));
      actions.append(addButton, removeButton);
      row.append(image, copy, actions);
      favoritesList.append(row);
    }
  }

  const summary = favorites.length
    ? `${favorites.length} ${favorites.length === 1 ? 'prodotto salvato' : 'prodotti salvati'}.`
    : 'La lista è vuota.';
  favoritesStatus.textContent = favoritesStorageError
    ? `${summary} ${favoritesStorageError}`
    : summary;
  updateFavoriteButtons();
}

function saveFavorites() {
  try {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
    favoritesStorageError = '';
  } catch (error) {
    favoritesStorageError = 'Impossibile salvare le modifiche: i preferiti restano disponibili solo in questa pagina.';
    console.error('Salvataggio dei preferiti non riuscito:', error);
  }
}

function removeFavorite(id) {
  favorites = favorites.filter(item => item.id !== id);
  saveFavorites();
  renderFavorites();
}

function priceInCents(card) {
  const priceText = card.querySelector('.price, .catalog-price')?.textContent || '';
  const match = priceText.trim().match(/^(\d+)(?:,(\d{2}))?\s*€$/);
  return match ? Number(match[1]) * 100 + Number(match[2] || 0) : 590;
}

function addFavoriteToCart(favorite) {
  const result = {};
  const card = favoriteCards.find(item => item.dataset.productId === favorite.id);
  const detail = {
    id: favorite.id,
    title: favorite.title,
    category: favorite.category || card?.querySelector('.product-category, .catalog-label')?.textContent.trim() || 'MANGA',
    price: Number.isInteger(favorite.price) ? favorite.price : card ? priceInCents(card) : 590,
    image: card?.querySelector('.product-image img, .catalog-cover-link img')?.getAttribute('src')
      || favorite.image
      || '',
    result
  };
  window.dispatchEvent(new CustomEvent('manga:add-to-cart', { detail }));

  if (result.message) {
    favoritesStatus.textContent = result.message;
    return;
  }
  if (result.added) {
    favoritesStatus.textContent = `${favorite.title}: aggiunto al carrello.`;
  } else {
    favoritesStatus.textContent = 'Non è stato possibile aggiungere il prodotto al carrello.';
  }
}

for (const card of favoriteCards) {
  const title = card.dataset.title || card.querySelector('.product-info h3, .catalog-card-info h3').textContent.trim();
  const cover = card.querySelector('.product-image img, .catalog-cover-link img');
  cover?.addEventListener('load', () => {
    const favorite = favorites.find(item => item.id === card.dataset.productId);
    const image = cover.getAttribute('src') || cover.currentSrc;
    if (!favorite || favorite.image === image) return;
    favorite.image = image;
    saveFavorites();
    window.dispatchEvent(new CustomEvent('manga:cover-loaded', {
      detail: { id: card.dataset.productId, image: favorite.image }
    }));
    if (favoritesDialog.open) renderFavorites();
  });
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'favorite-toggle';
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></svg>';
  button.addEventListener('click', () => {
    const existing = favorites.find(item => item.id === card.dataset.productId);
    if (existing) {
      removeFavorite(existing.id);
      return;
    }

    favorites.push({
      id: card.dataset.productId,
      title,
      category: card.querySelector('.product-category, .catalog-label')?.textContent.trim() || 'MANGA',
      price: priceInCents(card),
      image: card.querySelector('.product-image img, .catalog-cover-link img')?.getAttribute('src') || ''
    });
    saveFavorites();
    renderFavorites();
  });
  card.append(button);
}

openFavoritesButton.addEventListener('click', () => {
  renderFavorites();
  favoritesDialog.showModal();
});
favoritesDialog.querySelector('.favorites-close').addEventListener('click', () => favoritesDialog.close());
favoritesDialog.addEventListener('click', event => {
  if (event.target === favoritesDialog) favoritesDialog.close();
});
window.addEventListener('storage', event => {
  if (event.key !== favoritesStorageKey) return;
  try {
    const updated = JSON.parse(event.newValue || '[]');
    if (!Array.isArray(updated)) throw new TypeError('Formato dei preferiti non valido.');
    favorites = updated.filter(item =>
      item && typeof item.id === 'string' && typeof item.title === 'string'
    );
    favoritesStorageError = '';
  } catch (error) {
    favoritesStorageError = 'Non è possibile aggiornare i preferiti da un’altra scheda.';
    console.error('Sincronizzazione dei preferiti non riuscita:', error);
  }
  renderFavorites();
});

renderFavorites();
