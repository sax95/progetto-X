/* CARRELLO — un solo modulo per tutte le pagine.
   Prima ogni pagina (script.js, catalogo.js, giochi.js, action-figures.js) aveva la sua copia:
   quattro renderCart, quattro letture del localStorage e id HTML diversi per pagina.

   Cosa serve nell'HTML (uguale in ogni pagina):
     #open-cart, #cart-count                      bottone e contatore nell'header
     #cart-dialog con #close-cart, #cart-items, #cart-total, #empty-cart,
       #continue-cart, #checkout-cart, #cart-checkout-status
     #notification con #notification-message, #notification-cart-link
     #manga-dialog-open-cart (facoltativo)        "Vai al carrello" nella scheda di dettaglio

   Come lo usano le pagine:
     carrello.registra({ id, title, category, price, image })   price in centesimi
     carrello.aggiungi(id, { silenzioso: true })  → { added, message }
     carrello.apri()
   Per compatibilità ascolta anche l'evento 'manga:add-to-cart' (lo usa favorites.js).

   I prezzi sono in centesimi per evitare errori di arrotondamento.

   Il carrello è salvato in localStorage, solo in questo browser.
   "Procedi all'ordine" mostra un'anteprima: nessun ordine viene inviato. */
'use strict';

window.carrello = (() => {
  const STORAGE_KEY = 'panini-demo-planet-manga-v1';
  const MAX_QUANTITY = 99;
  const $ = selector => document.querySelector(selector);

  const products = new Map();   // id → { id, title, category, price, image }
  let cart = {};                // id → quantità
  let storageWarning = '';
  let notificationTimer;

  const money = cents => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);
  const countItems = () => Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const totalPrice = () => Object.entries(cart)
    .reduce((sum, [id, quantity]) => sum + (products.get(id)?.price || 0) * quantity, 0);

  function isValidProduct(product) {
    return product && typeof product.id === 'string' && typeof product.title === 'string'
      && product.title.trim() !== '' && Number.isInteger(product.price) && product.price >= 0;
  }

  /* I dati della pagina vincono su quelli salvati; l'immagine salvata resta se la pagina non ne ha una. */
  function registra(product) {
    if (!isValidProduct(product)) return;
    const previous = products.get(product.id);
    products.set(product.id, {
      id: product.id,
      title: product.title.trim(),
      category: typeof product.category === 'string' ? product.category : 'PRODOTTO',
      price: product.price,
      image: (typeof product.image === 'string' && product.image) || previous?.image || ''
    });
  }

  function aggiornaImmagine(id, image) {
    const product = products.get(id);
    if (!product || !image || product.image === image) return;
    product.image = image;
    if (cart[id]) { save(); render(); }
  }

  // ---- salvataggio ----------------------------------------------------------
  /* { cart: {id: quantità}, products: [...] } → registra i prodotti e restituisce le quantità valide */
  function readSaved(saved) {
    if (Array.isArray(saved?.products)) {
      for (const product of saved.products) {
        if (isValidProduct(product) && !products.has(product.id)) registra(product);
      }
    }
    const quantities = {};
    if (saved?.cart && typeof saved.cart === 'object' && !Array.isArray(saved.cart)) {
      for (const [id, quantity] of Object.entries(saved.cart)) {
        if (products.has(id) && Number.isInteger(quantity) && quantity > 0 && quantity <= MAX_QUANTITY) quantities[id] = quantity;
      }
    }
    return quantities;
  }

  function readLocal() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  }

  function save() {
    try {
      // si salvano solo i prodotti nel carrello: è tutto ciò che serve alle altre pagine
      const inCart = Object.keys(cart).map(id => products.get(id)).filter(Boolean);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, products: inCart }));
      storageWarning = '';
    } catch {
      storageWarning = ' Il carrello resta disponibile solo in questa pagina perché non è stato possibile salvarlo.';
    }
  }

  // ---- interfaccia ----------------------------------------------------------
  const dialog = $('#cart-dialog');
  const list = $('#cart-items');
  const checkoutStatus = $('#cart-checkout-status');
  const notification = $('#notification');

  function notify(message, showCartLink = false) {
    if (!notification) return;
    $('#notification-message').textContent = message;
    $('#notification-cart-link').hidden = !showCartLink;
    notification.classList.add('visible');
    hideNotificationLater();
  }
  function hideNotificationLater() {
    clearTimeout(notificationTimer);
    notificationTimer = setTimeout(() => notification.classList.remove('visible'), 3500);
  }
  // Mentre il mouse o il focus sono sull'avviso, il timer si ferma:
  // "Vai al carrello" non deve sparire proprio mentre lo si sta raggiungendo.
  if (notification) {
    const hold = () => clearTimeout(notificationTimer);
    const release = () => { if (notification.classList.contains('visible')) hideNotificationLater(); };
    notification.addEventListener('pointerenter', hold);
    notification.addEventListener('focusin', hold);
    notification.addEventListener('pointerleave', release);
    notification.addEventListener('focusout', release);
  }

  function makeButton(label, ariaLabel, focusKey, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', ariaLabel);
    button.dataset.focusKey = focusKey;
    button.addEventListener('click', action);
    return button;
  }

  let lastBadgeCount = null;
  function render() {
    const count = countItems();
    const badge = $('#cart-count');
    const grew = lastBadgeCount !== null && count > lastBadgeCount; // non al caricamento della pagina
    lastBadgeCount = count;
    badge.textContent = String(count);
    badge.hidden = count === 0;
    // il numero sul carrello "salta" quando cresce: si vede dove è finito il prodotto
    if (grew && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      badge.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }],
        { duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }
    $('#open-cart').setAttribute('aria-label', `Carrello, ${count} ${count === 1 ? 'articolo' : 'articoli'}`);
    if (!dialog) return;

    const focusedKey = document.activeElement?.dataset.focusKey;
    list.replaceChildren();
    for (const [id, quantity] of Object.entries(cart)) {
      const product = products.get(id);
      if (!product) continue;

      const row = document.createElement('div');
      row.className = 'cart-row';
      const image = document.createElement('img');
      image.className = 'cart-thumbnail';
      image.alt = '';          // decorativa: il titolo è scritto subito accanto
      image.loading = 'lazy';
      image.hidden = !product.image;
      if (product.image) image.src = product.image;
      image.addEventListener('error', () => { image.hidden = true; });

      const details = document.createElement('div');
      details.className = 'cart-product-details';
      const title = document.createElement('strong');
      title.textContent = product.title;
      const subtotal = document.createElement('p');
      subtotal.textContent = `${money(product.price)} × ${quantity} = ${money(product.price * quantity)}`;

      const controls = document.createElement('div');
      controls.className = 'quantity-controls';
      const minus = makeButton('−', `Riduci quantità di ${product.title}`, `${id}-minus`, () => cambiaQuantita(id, -1));
      const amount = document.createElement('span');
      amount.className = 'quantity-value';
      amount.textContent = String(quantity);
      amount.setAttribute('aria-label', `Quantità: ${quantity}`);
      const plus = makeButton('+', `Aumenta quantità di ${product.title}`, `${id}-plus`, () => cambiaQuantita(id, 1));
      plus.disabled = quantity >= MAX_QUANTITY;
      const remove = makeButton('Rimuovi', `Rimuovi ${product.title}`, `${id}-remove`, () => cambiaQuantita(id, -quantity));

      controls.append(minus, amount, plus, remove);
      details.append(title, subtotal, controls);
      row.append(image, details);
      list.append(row);
    }
    if (count === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Il carrello è vuoto. Aggiungi un prodotto dal catalogo.';
      list.append(empty);
    }

    $('#cart-total').textContent = money(totalPrice());
    $('#empty-cart').disabled = count === 0;
    $('#checkout-cart').disabled = count === 0;
    checkoutStatus.textContent = '';
    // il bottone appena premuto è stato ricreato: rimettiamo il focus sul suo sostituto
    if (focusedKey && dialog.open) {
      const target = [...list.querySelectorAll('button')].find(button => button.dataset.focusKey === focusedKey && !button.disabled);
      (target || $('#close-cart')).focus();
    }
  }

  // ---- azioni ---------------------------------------------------------------
  function cambiaQuantita(id, delta) {
    const quantity = Math.max(0, Math.min(MAX_QUANTITY, (cart[id] || 0) + delta));
    if (quantity) cart[id] = quantity;
    else delete cart[id];
    save();
    render();
  }

  function aggiungi(id, { silenzioso = false } = {}) {
    const product = products.get(id);
    if (!product) return { added: false, message: 'Non è stato possibile aggiungere il prodotto al carrello.' };
    if ((cart[id] || 0) >= MAX_QUANTITY) {
      const message = `Limite di ${MAX_QUANTITY} copie per prodotto.`;
      if (!silenzioso) notify(message);
      return { added: false, message };
    }
    cambiaQuantita(id, 1);
    const message = `${product.title}: aggiunto al carrello.${storageWarning}`;
    if (!silenzioso) notify(message, true);
    return { added: true, message };
  }

  function apri() {
    if (!dialog) return;
    checkoutStatus.textContent = '';
    notification?.classList.remove('visible');
    if (!dialog.open) dialog.showModal();
  }

  // ---- avvio ----------------------------------------------------------------
  try {
    cart = readSaved(readLocal());
  } catch {
    storageWarning = ' Non è stato possibile leggere il carrello salvato.';
  }

  $('#open-cart').addEventListener('click', apri);
  $('#manga-dialog-open-cart')?.addEventListener('click', apri);
  $('#notification-cart-link')?.addEventListener('click', apri);
  if (dialog) {
    $('#close-cart').addEventListener('click', () => dialog.close());
    $('#continue-cart').addEventListener('click', () => dialog.close());
    $('#empty-cart').addEventListener('click', () => {
      cart = {};
      save();
      render();
      notify(`Carrello svuotato.${storageWarning}`);
    });
    $('#checkout-cart').addEventListener('click', () => {
      const count = countItems();
      checkoutStatus.textContent = `Anteprima ordine: ${count} ${count === 1 ? 'articolo' : 'articoli'}, totale ${money(totalPrice())}. `
        + `Questa è una demo: l’ordine non viene inviato e non viene richiesto alcun pagamento. Il carrello resta salvato.${storageWarning}`;
    });
    // clic sullo sfondo scuro: chiude
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  }

  // compatibilità: favorites.js chiede di aggiungere un prodotto con questo evento
  window.addEventListener('manga:add-to-cart', event => {
    const detail = event.detail || {};
    if (!detail.result || !isValidProduct(detail)) return;
    registra(detail);
    Object.assign(detail.result, aggiungi(detail.id));
  });

  // un'altra scheda ha cambiato il carrello: riallinea questa
  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    try { cart = readSaved(JSON.parse(event.newValue || '{}')); } catch { /* resta lo stato attuale */ }
    render();
  });

  if (new URLSearchParams(window.location.search).get('open') === 'cart') {
    document.addEventListener('DOMContentLoaded', apri, { once: true });
  }

  /* Le pagine registrano i loro prodotti dopo questo script: il contatore va disegnato
     quando la pagina è pronta, così i prodotti salvati e quelli della pagina sono già noti. */
  document.addEventListener('DOMContentLoaded', render, { once: true });
  render();

  return { registra, aggiornaImmagine, aggiungi, apri };
})();
