/* HOME — carosello, novità, selezione e scheda di dettaglio.
   Il carrello è in js/carrello.js: qui si registrano solo i prodotti della pagina. */
'use strict';

const cards = [...document.querySelectorAll('.product-card')];
function priceInCents(text) {
  const match = text.trim().match(/^(\d+)(?:,(\d{2}))?\s*€$/);
  if (!match) throw new Error(`Prezzo non valido nella scheda prodotto: "${text}".`);
  return Number(match[1]) * 100 + Number(match[2] || 0);
}

const products = cards.map(card => ({
  id: card.dataset.productId,
  title: card.querySelector('h3').textContent,
  category: card.querySelector('.product-category').textContent,
  price: priceInCents(card.querySelector('.price').textContent),
  image: card.querySelector('.cover-image')?.getAttribute('src') || '',
  card
}));
products.forEach(carrello.registra);

const mangaDescriptions = {
  'product-1': 'Yuji Itadori entra nel mondo dell’occulto quando ingerisce un potente oggetto maledetto. Da quel momento condivide il proprio corpo con Ryomen Sukuna e si unisce agli stregoni della scuola di Tokyo.',
  'product-2': 'Per ripagare i debiti del padre, Denji lavora come cacciatore di demoni insieme a Pochita. Un incontro lo trasforma in Chainsaw Man e cambia per sempre la sua vita.',
  'product-3': 'Naruto sogna di diventare Hokage e conquistare il rispetto del villaggio. Il suo viaggio è fatto di allenamenti, amicizie e sfide sempre più difficili.',
  'product-4': 'Ichigo Kurosaki vede i fantasmi, ma la sua vita cambia quando incontra una shinigami e scopre il mondo degli spiriti e delle anime perdute.',
  'product-5': 'Una spia, un’assassina e una telepate formano una famiglia fuori dal comune, tra missioni segrete e situazioni quotidiane imprevedibili.',
  'product-6': 'Momo e Okarun si confrontano con alieni, yokai e fenomeni inspiegabili in un’avventura ricca di azione e sorprese.',
  'product-7': 'Taro Sakamoto, ex sicario leggendario, ha lasciato il mondo criminale per una vita tranquilla. Il suo passato, però, non ha intenzione di lasciarlo in pace.',
  'product-8': 'Kafka Hibino sogna di entrare nella Forza di Difesa contro i kaiju. Una trasformazione inaspettata gli offre una seconda possibilità di realizzare il suo obiettivo.',
  'product-9': 'Son Goku parte alla ricerca delle sette Sfere del Drago. Un’avventura leggendaria tra incontri, arti marziali e avversari sempre più forti.'
};
const mangaVolumes = {
  'product-1': '30 volumi (serie completa)',
  'product-2': 'Serie in corso',
  'product-3': '72 volumi (serie completa)',
  'product-4': '74 volumi (serie completa)',
  'product-5': 'Serie in corso',
  'product-6': 'Serie in corso',
  'product-7': 'Serie in corso',
  'product-8': '16 volumi (serie completa)',
  'product-9': '42 volumi (serie completa)'
};

const mangaDialog = document.querySelector('#manga-dialog');
const dialogCover = document.querySelector('#manga-dialog-cover');
const dialogGenre = document.querySelector('#manga-dialog-genre');
const dialogTitle = document.querySelector('#manga-dialog-title');
const dialogPrice = document.querySelector('#manga-dialog-price');
const dialogDescription = document.querySelector('#manga-dialog-description');
const dialogDimensions = document.querySelector('#manga-dialog-dimensions');
const dialogVolumes = document.querySelector('#manga-dialog-volumes');
const dialogAuthor = document.querySelector('#manga-dialog-author');
const dialogPublisher = document.querySelector('#manga-dialog-publisher');
const dialogCartButton = document.querySelector('#manga-dialog-cart');
const dialogCartConfirmation = document.querySelector('#manga-dialog-cart-confirmation');
const dialogCartMessage = document.querySelector('#manga-dialog-cart-message');
const dialogCartLink = document.querySelector('#manga-dialog-open-cart');
let activeMangaProduct = null;

function openMangaDetails(product) {
  activeMangaProduct = product;
  dialogCartConfirmation.hidden = true;
  const image = product.card.querySelector('.cover-image');
  dialogCover.src = image.currentSrc || image.src;
  dialogCover.alt = image.alt;
  dialogCover.hidden = !dialogCover.src;
  mangaDialog.querySelector('.manga-dialog-content').classList.toggle('no-cover', !dialogCover.src);
  dialogGenre.textContent = product.category;
  dialogTitle.textContent = product.title;
  dialogPrice.textContent = product.card.querySelector('.price').textContent;
  dialogDescription.textContent = mangaDescriptions[product.id] || 'Scopri questa serie manga della selezione Manga Club.';
  dialogDimensions.textContent = 'Circa 11,5 × 17,5 cm';
  dialogVolumes.textContent = mangaVolumes[product.id] || 'Dato non disponibile';
  dialogAuthor.textContent = product.card.querySelector('.format').textContent.replace(/^Autore:\s*/, '');
  dialogPublisher.textContent = product.category;
  mangaDialog.showModal();
  mangaDialog.dispatchEvent(new CustomEvent('manga:details-open', {
    detail: { productId: product.id }
  }));
}

function addProductToCart(product, fromDetails = false) {
  // dalla scheda di dettaglio il messaggio compare nella scheda stessa, non nell'avviso in basso
  const result = carrello.aggiungi(product.id, { silenzioso: fromDetails });
  if (fromDetails) {
    dialogCartMessage.textContent = result.message;
    dialogCartLink.hidden = false;
    dialogCartConfirmation.hidden = false;
  }
}

// Inserisce i comandi dentro le schede già presenti nell'HTML.
for (const product of products) {
  const actions = document.createElement('div');
  actions.className = 'product-actions';
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'add-button';
  addButton.textContent = 'Aggiungi al carrello';
  addButton.addEventListener('click', () => addProductToCart(product));
  actions.append(addButton);
  product.card.querySelector('.product-info').append(actions);

  const cover = product.card.querySelector('.product-image');
  cover.setAttribute('role', 'button');
  cover.setAttribute('tabindex', '0');
  cover.setAttribute('aria-label', `Apri i dettagli di ${product.title}`);
  cover.addEventListener('click', () => openMangaDetails(product));
  cover.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openMangaDetails(product);
    }
  });
}

dialogCartButton.addEventListener('click', () => {
  if (activeMangaProduct) addProductToCart(activeMangaProduct, true);
});
document.querySelector('#manga-dialog-close').addEventListener('click', () => mangaDialog.close());
mangaDialog.addEventListener('click', event => {
  if (event.target === mangaDialog) mangaDialog.close();
});

// La ricerca filtra per titolo o categoria.
const search = document.querySelector('#search');
function filterProducts() {
  const query = search.value.trim().toLocaleLowerCase('it');
  let count = 0;
  for (const product of products) {
    const matches = `${product.title} ${product.category}`.toLocaleLowerCase('it').includes(query);
    product.card.hidden = !matches;
    if (matches) count++;
  }
  const status = document.querySelector('#results-status');
  status.hidden = false;
  status.textContent = count ? `${count} prodotti trovati` : 'Nessun prodotto trovato. Prova a cambiare ricerca o filtri.';
}
search.addEventListener('input', filterProducts);

// I link alle schede ripristinano la ricerca per rendere visibile la destinazione.
document.querySelectorAll('a[href^="#product-"]').forEach(link => {
  link.addEventListener('click', () => {
    search.value = '';
    filterProducts();
  });
});
document.querySelectorAll('.mobile-links a').forEach(link => {
  link.addEventListener('click', () => { document.querySelector('.mobile-menu').open = false; });
});

const releasesTrack = document.querySelector('#releases-track');
const releasesPrevious = document.querySelector('#releases-prev');
const releasesNext = document.querySelector('#releases-next');
for (const card of [...releasesTrack.querySelectorAll('.release-card')]) {
  const clone = card.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  clone.setAttribute('inert', '');
  clone.querySelector('img').setAttribute('alt', '');
  releasesTrack.append(clone);
}
function scrollReleases(direction) {
  const animation = releasesTrack.getAnimations()[0];
  if (!animation) return;
  const duration = Number(animation.effect.getComputedTiming().duration);
  const gap = Number.parseFloat(getComputedStyle(releasesTrack).gap);
  const cardDistance = releasesTrack.querySelector('.release-card').getBoundingClientRect().width + gap;
  const cycleDistance = releasesTrack.scrollWidth / 2 + gap / 2;
  const currentTime = Number(animation.currentTime) || 0;
  animation.currentTime = (currentTime + direction * duration * cardDistance / cycleDistance + duration) % duration;
}
releasesPrevious.addEventListener('click', () => scrollReleases(-1));
releasesNext.addEventListener('click', () => scrollReleases(1));

const promoTrack = document.querySelector('#promo-track');
const promoCarousel = document.querySelector('.promo-carousel');
const promoSlides = [...promoTrack.querySelectorAll('.promo-slide:not(.promo-clone)')];
const allPromoSlides = [...promoTrack.querySelectorAll('.promo-slide')];
const promoPrevious = document.querySelector('#promo-prev');
const promoNext = document.querySelector('#promo-next');
const promoDots = [...document.querySelectorAll('.promo-dot')];
let activePromoIndex = 0;
let promoScrollTimer;

function updatePromoControls() {
  promoDots.forEach((dot, index) => {
    if (index === activePromoIndex) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
}

function scrollToPromo(index, behavior = 'smooth') {
  const slide = allPromoSlides[index];
  promoTrack.scrollTo({
    left: promoTrack.scrollLeft + slide.getBoundingClientRect().left - promoTrack.getBoundingClientRect().left,
    behavior
  });
}

function finishPromoScroll(targetIndex) {
  clearTimeout(promoScrollTimer);
  if (targetIndex === 0) {
    activePromoIndex = promoSlides.length - 1;
    scrollToPromo(promoSlides.length, 'auto');
  } else if (targetIndex === allPromoSlides.length - 1) {
    activePromoIndex = 0;
    scrollToPromo(1, 'auto');
  } else {
    activePromoIndex = targetIndex - 1;
  }
  updatePromoControls();
}

function showPromo(index) {
  activePromoIndex = (index + promoSlides.length) % promoSlides.length;
  updatePromoControls();
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const slideIndex = index < 0
    ? 0
    : index >= promoSlides.length
      ? allPromoSlides.length - 1
      : activePromoIndex + 1;
  scrollToPromo(slideIndex, behavior);
}

promoPrevious.addEventListener('click', () => showPromo(activePromoIndex - 1));
promoNext.addEventListener('click', () => showPromo(activePromoIndex + 1));
promoDots.forEach((dot, index) => dot.addEventListener('click', () => showPromo(index)));
promoTrack.addEventListener('scroll', () => {
  clearTimeout(promoScrollTimer);
  promoScrollTimer = setTimeout(() => {
    const trackLeft = promoTrack.getBoundingClientRect().left;
    const targetIndex = allPromoSlides.reduce((closestIndex, slide, index) => {
      const closestDistance = Math.abs(allPromoSlides[closestIndex].getBoundingClientRect().left - trackLeft);
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
    finishPromoScroll(targetIndex);
  }, 180);
}, { passive: true });
promoTrack.addEventListener('scrollend', () => {
  clearTimeout(promoScrollTimer);
  const trackLeft = promoTrack.getBoundingClientRect().left;
  const targetIndex = allPromoSlides.reduce((closestIndex, slide, index) => {
    const closestDistance = Math.abs(allPromoSlides[closestIndex].getBoundingClientRect().left - trackLeft);
    const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);
    return distance < closestDistance ? index : closestIndex;
  }, 0);
  finishPromoScroll(targetIndex);
});
/* Su iPhone la barra di Safari che compare e sparisce lancia 'resize' cambiando solo l'altezza:
   riallinea il carosello solo se cambia davvero la larghezza, altrimenti salta a metà animazione. */
let promoTrackWidth = promoTrack.clientWidth;
window.addEventListener('resize', () => {
  if (promoTrack.clientWidth === promoTrackWidth) return;
  promoTrackWidth = promoTrack.clientWidth;
  scrollToPromo(activePromoIndex + 1, 'auto');
});
scrollToPromo(1, 'auto');
updatePromoControls();

const promoAutoplayDelay = 5000;
let promoAutoplayTimer;
// La pausa scelta dall'utente vince su hover, focus e cambio scheda (WCAG 2.2.2).
let promoPausedByUser = false;
const promoPause = document.querySelector('#promo-pause');
function startPromoAutoplay() {
  clearInterval(promoAutoplayTimer);
  if (promoPausedByUser || window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) return;
  promoAutoplayTimer = setInterval(() => showPromo(activePromoIndex + 1), promoAutoplayDelay);
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  promoPause.hidden = true;
} else {
  promoPause.addEventListener('click', () => {
    promoPausedByUser = !promoPausedByUser;
    promoPause.textContent = promoPausedByUser ? '▶' : '❚❚';
    promoPause.title = promoPausedByUser ? 'Riprendi' : 'Pausa';
    promoPause.setAttribute('aria-label', promoPausedByUser ? 'Riprendi: scorrimento automatico' : 'Pausa: scorrimento automatico');
    startPromoAutoplay();
  });
}
promoCarousel.addEventListener('pointerenter', () => clearInterval(promoAutoplayTimer));
promoCarousel.addEventListener('pointerleave', startPromoAutoplay);
promoCarousel.addEventListener('focusin', () => clearInterval(promoAutoplayTimer));
promoCarousel.addEventListener('focusout', startPromoAutoplay);
document.addEventListener('visibilitychange', startPromoAutoplay);
startPromoAutoplay();

const backToTop = document.querySelector('.back-to-top');
function updateBackToTop() {
  backToTop.hidden = window.scrollY < 240;
}
window.addEventListener('scroll', updateBackToTop, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({
  top: 0,
  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}));
updateBackToTop();
