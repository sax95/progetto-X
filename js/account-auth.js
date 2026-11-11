'use strict';

/*
 * Accesso demo dalla finestra "Accedi" e dalla pagina account.html.
 * Non c'è un server: la sessione è salvata in localStorage, solo in questo browser.
 *
 * Ogni cambio di accesso lancia l'evento 'manga:auth-change':
 * carrello, preferiti e recensioni lo ascoltano per aggiornarsi.
 */

const demoEmail = 'demo@example.test';
const demoPassword = 'manga123';
const demoSessionKey = 'mangaClubDemoEmail';
const loginForms = document.querySelectorAll('[data-account-login]');

function showStatus(form, message) {
  const status = form.querySelector('.account-form-status');
  status.hidden = false;
  status.textContent = message;
}

function updateAccountUi(email) {
  const isLoggedIn = Boolean(email);
  window.dispatchEvent(new CustomEvent('manga:auth-change', {
    detail: { isLoggedIn, email: email || '' }
  }));
  const accountBanner = document.querySelector('[data-account-banner]');

  if (accountBanner) {
    accountBanner.textContent = isLoggedIn
      ? 'MANGA CLUB · SESSIONE DEMO ATTIVA'
      : 'MANGA CLUB · ACCOUNT DIMOSTRATIVO';
  }

  document.querySelectorAll('[data-open-account]').forEach(button => {
    button.classList.toggle('is-account-active', isLoggedIn);
    button.title = isLoggedIn ? `Account connesso: ${email}` : 'Apri account';
    button.setAttribute('aria-label', isLoggedIn ? `Account connesso: ${email}` : 'Apri account');
  });

  document.querySelectorAll('.account-demo-note, .account-register-prompt').forEach(element => {
    element.hidden = isLoggedIn;
  });

  loginForms.forEach(form => {
    const panel = form.closest('.account-panel');
    const eyebrow = panel && panel.querySelector('.eyebrow');
    const heading = panel && panel.querySelector('h2');
    const emailInput = form.querySelector('[name="email"]');
    const passwordInput = form.querySelector('[name="password"]');
    const emailLabel = Array.from(form.querySelectorAll('label')).find(label => label.htmlFor === emailInput.id);
    const passwordLabel = Array.from(form.querySelectorAll('label')).find(label => label.htmlFor === passwordInput.id);
    const submitButton = form.querySelector('[type="submit"]');
    const logoutButton = form.querySelector('[data-account-logout]');

    if (eyebrow) eyebrow.hidden = isLoggedIn;
    if (heading) heading.textContent = isLoggedIn ? 'Account connesso' : 'Accedi';
    if (emailLabel) emailLabel.hidden = isLoggedIn;
    emailInput.hidden = isLoggedIn;
    if (passwordLabel) passwordLabel.hidden = isLoggedIn;
    passwordInput.hidden = isLoggedIn;
    submitButton.hidden = isLoggedIn;
    logoutButton.hidden = !isLoggedIn;

    if (isLoggedIn) {
      passwordInput.value = '';
      showStatus(form, `Hai effettuato l’accesso come ${email}.`);
    } else {
      emailInput.value = demoEmail;
      passwordInput.value = demoPassword;
      const status = form.querySelector('.account-form-status');
      status.hidden = true;
      status.textContent = '';
    }
  });
}

function readDemoSession() {
  try {
    return localStorage.getItem(demoSessionKey) || '';
  } catch {
    loginForms.forEach(form => showStatus(form, 'Il browser non consente di leggere la sessione demo.'));
    return '';
  }
}

/* ---------- Avvio ---------- */

const activeEmail = readDemoSession();
if (activeEmail) updateAccountUi(activeEmail);

/* ---------- Accedi / Esci ---------- */

loginForms.forEach(form => {
  const logoutButton = form.querySelector('[data-account-logout]');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const email = form.querySelector('[name="email"]').value.trim().toLowerCase();
    const password = form.querySelector('[name="password"]').value;

    if (email !== demoEmail || password !== demoPassword) {
      showStatus(form, 'Credenziali non valide. Usa demo@example.test e manga123.');
      return;
    }

    try {
      localStorage.setItem(demoSessionKey, demoEmail);
      updateAccountUi(demoEmail);
    } catch {
      showStatus(form, 'Accesso non completato: il browser non consente di salvare la sessione demo.');
    }
  });

  logoutButton.addEventListener('click', () => {
    try {
      localStorage.removeItem(demoSessionKey);
      updateAccountUi('');
      showStatus(form, 'Sessione demo terminata.');
    } catch {
      showStatus(form, 'Impossibile terminare la sessione: il browser non consente di modificarla.');
    }
  });
});

/* Un'altra scheda ha fatto accesso o uscita. */
window.addEventListener('storage', event => {
  if (event.key === demoSessionKey) updateAccountUi(event.newValue || '');
});
