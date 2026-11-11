'use strict';

/* RECENSIONI E VOTI — demo salvata in localStorage, solo in questo browser.
   Per scrivere una recensione o votare con le stelle bisogna aver fatto l'accesso demo. */

const ratingStorageKey = 'mangaClubRatings';
const reviewStorageKey = 'mangaClubReviews';
const reviewAuthStorageKey = 'mangaClubDemoEmail';
let ratings = {};
let reviews = {};
let ratingStorageMessage = '';
let reviewStorageMessage = '';
let isLoggedIn = false;

function readLoginState() {
  try {
    return Boolean(localStorage.getItem(reviewAuthStorageKey));
  } catch {
    return false;
  }
}

function readStorage(key, onError) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
      onError('I dati salvati non hanno un formato valido.');
      return {};
    }
    return saved;
  } catch {
    onError('I dati non possono essere letti da questo browser.');
    return {};
  }
}

function cleanRatings(source) {
  const result = {};
  for (const [productId, rating] of Object.entries(source || {})) {
    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) result[productId] = rating;
  }
  return result;
}

function cleanReviews(source) {
  const result = {};
  for (const [productId, entries] of Object.entries(source || {})) {
    if (!Array.isArray(entries)) {
      reviewStorageMessage = 'Alcune recensioni salvate non hanno un formato valido.';
      continue;
    }
    result[productId] = entries.filter(entry => entry
      && typeof entry.name === 'string'
      && typeof entry.text === 'string'
      && Number.isInteger(entry.rating)
      && entry.rating >= 1 && entry.rating <= 5
      && typeof entry.date === 'string');
  }
  return result;
}

function loadLocalData() {
  ratings = cleanRatings(readStorage(ratingStorageKey, message => { ratingStorageMessage = message; }));
  reviews = cleanReviews(readStorage(reviewStorageKey, message => { reviewStorageMessage = message; }));
}

function getReviews(productId) {
  return reviews[productId] || [];
}

function getRatingSummary(productId) {
  const entries = getReviews(productId);
  if (!entries.length) return 'Nessuna recensione';
  const average = entries.reduce((sum, entry) => sum + entry.rating, 0) / entries.length;
  return `${average.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ★ · ${entries.length} ${entries.length === 1 ? 'recensione' : 'recensioni'}`;
}

function renderCardSummary(card) {
  const productId = card.dataset.productId;
  let summary = card.querySelector('.review-summary');
  if (!summary) {
    summary = document.createElement('p');
    summary.className = 'review-summary';
    const authorOrPrice = card.querySelector('.format, .price');
    if (authorOrPrice) authorOrPrice.after(summary);
  }
  summary.textContent = getRatingSummary(productId);
}

/* ---------- Voto rapido con le stelle sulle schede ---------- */

function showStars(group, value) {
  for (const [index, button] of [...group.querySelectorAll('button')].entries()) {
    button.classList.toggle('is-filled', index < value);
    button.setAttribute('aria-pressed', String(index + 1 === value));
  }
}

function saveRating() {
  try {
    localStorage.setItem(ratingStorageKey, JSON.stringify(ratings));
    ratingStorageMessage = '';
  } catch {
    ratingStorageMessage = 'Non è stato possibile salvare la valutazione in questo browser.';
  }
}

function createRatingControl(card) {
  const title = card.querySelector('h3')?.textContent.trim();
  const productId = card.dataset.productId;
  if (!title || !productId) return;

  const ratingGroup = document.createElement('div');
  ratingGroup.className = 'review-rating';
  ratingGroup.dataset.productId = productId;
  ratingGroup.setAttribute('role', 'group');
  ratingGroup.setAttribute('aria-label', `Valuta ${title} da 1 a 5 stelle`);

  const status = document.createElement('span');
  status.className = 'review-rating-status visually-hidden';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  ratingGroup.hidden = !isLoggedIn;
  for (let value = 1; value <= 5; value++) {
    const star = document.createElement('button');
    star.type = 'button';
    star.textContent = '★';
    star.setAttribute('aria-label', `Valuta ${title}: ${value} ${value === 1 ? 'stella' : 'stelle'}`);
    star.addEventListener('click', () => {
      if (!readLoginState()) {
        updateRatingAccess();
        return;
      }
      ratings[productId] = value;
      showStars(ratingGroup, value);
      saveRating();
      status.textContent = ratingStorageMessage
        ? `Valutazione ${value} su 5 selezionata. ${ratingStorageMessage}`
        : `Valutazione ${value} su 5 stelle salvata.`;
    });
    ratingGroup.append(star);
  }
  showStars(ratingGroup, ratings[productId] || 0);

  ratingGroup.append(status);
  const authorOrPrice = card.querySelector('.format, .price');
  if (authorOrPrice) authorOrPrice.after(ratingGroup);
}

function renderRatingControls() {
  document.querySelectorAll('.review-rating[data-product-id]').forEach(group => {
    showStars(group, ratings[group.dataset.productId] || 0);
  });
}

/* ---------- Recensioni nella scheda di dettaglio ---------- */

loadLocalData();

const productCards = [...document.querySelectorAll('.product-card[data-product-id]')];
for (const card of productCards) {
  if (card.querySelector('.format, .price')) createRatingControl(card);
  renderCardSummary(card);
}

const reviewsDialog = document.querySelector('#manga-dialog');
const reviewList = document.querySelector('#manga-review-list');
const reviewSummary = document.querySelector('#manga-review-summary');
const reviewForm = document.querySelector('#manga-review-form');
const reviewStatus = document.querySelector('#manga-review-status');
const reviewDetails = document.querySelector('.manga-reviews');
const reviewAuth = document.querySelector('#manga-review-auth');
const reviewLoginButton = document.querySelector('#manga-review-login');

function updateRatingAccess() {
  isLoggedIn = readLoginState();
  document.querySelectorAll('.review-rating').forEach(group => {
    group.hidden = !isLoggedIn;
  });
  if (reviewForm && reviewAuth) {
    reviewForm.hidden = !isLoggedIn;
    reviewAuth.hidden = isLoggedIn;
  }
}

function renderReviews(productId) {
  const entries = getReviews(productId);
  reviewSummary.textContent = entries.length
    ? `Valutazione media: ${getRatingSummary(productId)}`
    : 'Non ci sono ancora recensioni. Scrivi la prima!';
  reviewList.replaceChildren();

  for (const entry of [...entries].reverse()) {
    const item = document.createElement('li');
    item.className = 'manga-review-item';
    const heading = document.createElement('div');
    heading.className = 'manga-review-heading';
    const name = document.createElement('strong');
    name.textContent = entry.name;
    const score = document.createElement('span');
    score.className = 'manga-review-score';
    score.textContent = `${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)} (${entry.rating}/5)`;
    const date = document.createElement('time');
    date.dateTime = entry.date;
    date.textContent = new Date(entry.date).toLocaleDateString('it-IT');
    const text = document.createElement('p');
    text.textContent = entry.text;
    heading.append(name, score);
    item.append(heading, date, text);
    reviewList.append(item);
  }

  reviewStatus.textContent = reviewStorageMessage;
}

function openReviews(event) {
  const productId = event.detail?.productId;
  if (!productId) return;
  reviewForm.dataset.productId = productId;
  reviewForm.reset();
  updateRatingAccess();
  document.querySelector('.manga-dialog-specs').open = false;
  reviewDetails.open = false;
  for (const input of reviewForm.querySelectorAll('input[name="rating"]')) {
    input.closest('label').classList.remove('is-selected');
  }
  renderReviews(productId);
}

function submitReview(productId, name, rating, text) {
  const entries = getReviews(productId);
  entries.push({ name, rating, text, date: new Date().toISOString() });
  reviews[productId] = entries;
  try {
    localStorage.setItem(reviewStorageKey, JSON.stringify(reviews));
  } catch {
    entries.pop();
    throw new Error('Non è stato possibile salvare la recensione in questo browser.');
  }
}

window.addEventListener('manga:auth-change', () => {
  updateRatingAccess();
  renderRatingControls();
});
window.addEventListener('storage', event => {
  if (event.key === reviewAuthStorageKey) updateRatingAccess();
});
updateRatingAccess();

if (reviewsDialog && reviewList && reviewSummary && reviewForm && reviewStatus) {
  reviewsDialog.addEventListener('manga:details-open', openReviews);
  reviewLoginButton.addEventListener('click', () => {
    document.querySelector('[data-open-account]')?.click();
  });
  updateRatingAccess();
  const reviewRatingInputs = [...reviewForm.querySelectorAll('input[name="rating"]')];
  for (const [index, input] of reviewRatingInputs.entries()) {
    input.addEventListener('change', () => {
      for (const [starIndex, radio] of reviewRatingInputs.entries()) {
        radio.closest('label').classList.toggle('is-selected', starIndex <= index);
      }
    });
  }
  reviewForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!readLoginState()) {
      updateRatingAccess();
      reviewStatus.textContent = 'Accedi al tuo account per pubblicare una recensione.';
      return;
    }
    const productId = reviewForm.dataset.productId;
    const formData = new FormData(reviewForm);
    const name = String(formData.get('name') || '').trim();
    const text = String(formData.get('review') || '').trim();
    const rating = Number(formData.get('rating'));
    if (!productId || !name || !text || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      reviewStatus.textContent = 'Inserisci il nome, una valutazione da 1 a 5 stelle e il testo della recensione.';
      return;
    }

    const submitButton = reviewForm.querySelector('[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    try {
      submitReview(productId, name, rating, text);
    } catch (error) {
      reviewStatus.textContent = error.message;
      return;
    } finally {
      if (submitButton) submitButton.disabled = false;
    }

    reviewStorageMessage = '';
    reviewForm.reset();
    for (const input of reviewRatingInputs) input.closest('label').classList.remove('is-selected');
    updateRatingAccess();
    renderReviews(productId);
    reviewDetails.open = true;
    for (const card of productCards.filter(item => item.dataset.productId === productId)) {
      renderCardSummary(card);
    }
    reviewStatus.textContent = 'Recensione pubblicata.';
  });

  if (reviewsDialog.open && reviewsDialog.dataset.productId) {
    openReviews({ detail: { productId: reviewsDialog.dataset.productId } });
  }
}
