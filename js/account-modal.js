'use strict';

const accountDialog = document.querySelector('#account-dialog');

document.querySelector('[data-open-account]').addEventListener('click', () => accountDialog.showModal());
document.querySelector('[data-close-account]').addEventListener('click', () => accountDialog.close());
accountDialog.addEventListener('click', event => {
  if (event.target === accountDialog) accountDialog.close();
});
