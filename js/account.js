'use strict';

document.querySelectorAll('.mobile-links a').forEach(item => {
  item.addEventListener('click', () => { document.querySelector('.mobile-menu').open = false; });
});
