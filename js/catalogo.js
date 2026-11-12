'use strict';

const extraSeries = [
  ['Dragon Ball', 'azione avventura'],
  ['One Piece', 'azione avventura'],
  ['My Hero Academia', 'azione supereroi'],
  ['Hunter x Hunter', 'azione avventura'],
  ['Yu degli spettri', 'azione soprannaturale'],
  ['Fullmetal Alchemist', 'azione fantasy'],
  ['Demon Slayer', 'azione soprannaturale'],
  ['Black Clover', 'azione fantasy'],
  ['Fairy Tail', 'azione fantasy'],
  ['Edens Zero', 'azione fantascienza'],
  ["Le bizzarre avventure di JoJo", 'azione soprannaturale'],
  ['Kenshin samurai vagabondo', 'azione storico'],
  ['Gintama', 'azione commedia fantascienza'],
  ['Assassination Classroom', 'azione commedia'],
  ['The Promised Neverland', 'thriller mistero'],
  ['Fire Force', 'azione soprannaturale'],
  ['Soul Eater', 'azione soprannaturale'],
  ['Toriko', 'azione avventura cucina'],
  ['World Trigger', 'azione fantascienza'],
  ['Shaman King', 'azione soprannaturale'],
  ['Reborn!', 'azione commedia'],
  ['D.Gray-man', 'azione soprannaturale'],
  ['Undead Unluck', 'azione commedia soprannaturale'],
  ['Mashle', 'azione fantasy commedia'],
  ['Ragna Crimson', 'azione fantasy'],
  ['Kagurabachi', 'azione fantasy'],
  ['Frieren - Oltre la fine del viaggio', 'fantasy avventura'],
  ['Dungeon Food', 'fantasy avventura cucina'],
  ['The Ancient Magus Bride', 'fantasy romantico'],
  ['To Your Eternity', 'fantasy dramma'],
  ['The Seven Deadly Sins', 'fantasy azione'],
  ['Magi: The Labyrinth of Magic', 'fantasy avventura'],
  ['Radiant', 'fantasy avventura'],
  ['Yona la principessa scarlatta', 'fantasy romantico'],
  ['Made in Abyss', 'fantasy avventura'],
  ['Witch Hat Atelier', 'fantasy avventura'],
  ['Land of the Lustrous', 'fantasy dramma'],
  ['Shadows House', 'mistero soprannaturale'],
  ['Blue Exorcist', 'azione soprannaturale'],
  ['Twin Star Exorcists', 'azione soprannaturale romantico'],
  ['Seraph of the End', 'azione fantasy'],
  ['The Case Study of Vanitas', 'fantasy soprannaturale'],
  ['Pandora Hearts', 'fantasy mistero'],
  ['Black Butler', 'mistero soprannaturale'],
  ['Claymore', 'azione fantasy'],
  ['Goblin Slayer', 'azione fantasy'],
  ['Record of Ragnarok', 'azione fantasy'],
  ['The Faraway Paladin', 'fantasy avventura'],
  ['The Elusive Samurai', 'azione storico'],
  ['Blue Lock', 'sport'],
  ['Haikyu!!', 'sport'],
  ['Slam Dunk', 'sport'],
  ['Kuroko no Basket', 'sport'],
  ['Eyeshield 21', 'sport commedia'],
  ['Captain Tsubasa', 'sport'],
  ['Hajime no Ippo', 'sport'],
  ['Initial D', 'sport'],
  ['MF Ghost', 'sport'],
  ['Yowamushi Pedal', 'sport'],
  ['Ao Ashi', 'sport'],
  ['Baby Steps', 'sport romantico'],
  ['Ace of Diamond', 'sport'],
  ['Real', 'sport dramma'],
  ['Ping Pong', 'sport dramma'],
  ['Medalist', 'sport dramma'],
  ['Chihayafuru', 'sport romantico'],
  ['The Prince of Tennis', 'sport'],
  ['Kengan Ashura', 'azione sport'],
  ['Hinomaru Sumo', 'sport'],
  ['Kaguya-sama: Love Is War', 'romantico commedia'],
  ['Komi Can’t Communicate', 'romantico commedia'],
  ['My Dress-Up Darling', 'romantico commedia'],
  ['Horimiya', 'romantico commedia'],
  ['Skip and Loafer', 'romantico dramma'],
  ['A Sign of Affection', 'romantico dramma'],
  ['Wotakoi: Love Is Hard for Otaku', 'romantico commedia'],
  ['Fruits Basket', 'romantico dramma soprannaturale'],
  ['Nana', 'romantico dramma'],
  ['Paradise Kiss', 'romantico dramma'],
  ['Lovely Complex', 'romantico commedia'],
  ['Boys Over Flowers', 'romantico dramma'],
  ['Ouran High School Host Club', 'romantico commedia'],
  ['Sailor Moon', 'fantasy romantico'],
  ['Cardcaptor Sakura', 'fantasy romantico'],
  ['Chobits', 'romantico fantascienza'],
  ['xxxHOLiC', 'mistero soprannaturale'],
  ['Tokyo Mew Mew', 'fantasy romantico'],
  ['The Quintessential Quintuplets', 'romantico commedia'],
  ['Rent-A-Girlfriend', 'romantico commedia'],
  ['Don’t Toy with Me, Miss Nagatoro', 'romantico commedia'],
  ['Teasing Master Takagi-san', 'romantico commedia'],
  ['Insomniacs After School', 'romantico dramma'],
  ['Blue Period', 'dramma'],
  ['March Comes in Like a Lion', 'dramma'],
  ['A Silent Voice', 'dramma'],
  ['Your Lie in April', 'dramma romantico'],
  ['Barakamon', 'commedia slice-of-life'],
  ['Silver Spoon', 'commedia slice-of-life'],
  ['Yotsuba&!', 'commedia slice-of-life'],
  ['Aria', 'fantascienza slice-of-life'],
  ['La taverna di mezzanotte', 'dramma cucina'],
  ['Chi - Casa dolce casa', 'commedia slice-of-life'],
  ['The Way of the Househusband', 'commedia'],
  ['Grand Blue', 'commedia'],
  ['Prison School', 'commedia'],
  ['Nichijou', 'commedia'],
  ['Azumanga Daioh', 'commedia slice-of-life'],
  ['Laid-Back Camp', 'slice-of-life'],
  ['Bocchi the Rock!', 'commedia slice-of-life'],
  ['Keep Your Hands Off Eizouken!', 'commedia slice-of-life'],
  ['Beastars', 'dramma'],
  ['Tokyo Revengers', 'azione dramma'],
  ['Parasyte', 'horror fantascienza'],
  ['Ajin - Demi Human', 'azione thriller'],
  ['Pluto', 'mistero fantascienza'],
  ['Monster', 'thriller mistero'],
  ['20th Century Boys', 'thriller mistero'],
  ['Billy Bat', 'thriller mistero'],
  ['Homunculus', 'horror dramma'],
  ['I Am a Hero', 'horror thriller'],
  ['The Fable', 'azione commedia'],
  ['Kingdom', 'azione storico'],
  ['Golden Kamuy', 'azione avventura storico'],
  ['The Apothecary Diaries', 'mistero storico'],
  ['Oshi no Ko', 'dramma mistero'],
  ['Akane-banashi', 'dramma'],
  ['Dorohedoro', 'azione fantasy'],
  ['Dai Dark', 'azione fantascienza'],
  ['Blame!', 'fantascienza azione'],
  ['Knights of Sidonia', 'fantascienza azione'],
  ['Ghost in the Shell', 'fantascienza azione'],
  ['Akira', 'fantascienza azione'],
  ['Planetes', 'fantascienza dramma'],
  ['Astra - Lost in Space', 'fantascienza avventura'],
  ['Space Brothers', 'fantascienza dramma'],
  ['Trigun Maximum', 'fantascienza azione'],
  ['Girls’ Last Tour', 'fantascienza slice-of-life'],
  ['Yokohama Kaidashi Kikou', 'fantascienza slice-of-life'],
  ['Drifting Dragons', 'fantasy avventura cucina'],
  ['The Full-Time Wife Escapist', 'romantico commedia'],
  ['My Love Story!!', 'romantico commedia'],
  ['Kamisama Kiss', 'romantico soprannaturale'],
  ['The Ancient Magus Bride: Supplement', 'fantasy romantico']
];

const genreNames = {
  azione: 'Azione',
  avventura: 'Avventura',
  fantasy: 'Fantasy',
  soprannaturale: 'Soprannaturale',
  thriller: 'Thriller',
  commedia: 'Commedia',
  supereroi: 'Supereroi',
  fantascienza: 'Fantascienza',
  storico: 'Storico',
  romantico: 'Romantico',
  sport: 'Sport',
  dramma: 'Dramma',
  mistero: 'Mistero',
  horror: 'Horror',
  cucina: 'Cucina',
  'slice-of-life': 'Slice of life'
};
const authorNames = {
  'Jujutsu Kaisen': 'Gege Akutami',
  'Chainsaw Man': 'Tatsuki Fujimoto',
  'Naruto il Mito': 'Masashi Kishimoto',
  Bleach: 'Tite Kubo',
  'Spy x Family': 'Tatsuya Endo',
  Dandadan: 'Yukinobu Tatsu',
  'Sakamoto Days': 'Yuto Suzuki',
  'Kaiju No. 8': 'Naoya Matsumoto',
  Berserk: 'Kentaro Miura',
  "L'attacco dei giganti": 'Hajime Isayama',
  'One-Punch Man': 'ONE (storia), Yusuke Murata (disegni)',
  'Death Note': 'Tsugumi Ohba (storia), Takeshi Obata (disegni)',
  'Vinland Saga': 'Makoto Yukimura',
  'Dragon Ball': 'Akira Toriyama',
  'One Piece': 'Eiichiro Oda',
  'My Hero Academia': 'Kohei Horikoshi',
  'Hunter x Hunter': 'Yoshihiro Togashi',
  'Yu degli spettri': 'Yoshihiro Togashi',
  'Fullmetal Alchemist': 'Hiromu Arakawa',
  'Demon Slayer': 'Koyoharu Gotouge',
  'Black Clover': 'Yuki Tabata',
  'Fairy Tail': 'Hiro Mashima',
  'Edens Zero': 'Hiro Mashima',
  "Le bizzarre avventure di JoJo": 'Hirohiko Araki',
  'Kenshin samurai vagabondo': 'Nobuhiro Watsuki',
  Gintama: 'Hideaki Sorachi',
  'Assassination Classroom': 'Yusei Matsui',
  'The Promised Neverland': 'Kaiu Shirai (storia), Posuka Demizu (disegni)',
  'Fire Force': 'Atsushi Ohkubo',
  'Soul Eater': 'Atsushi Ohkubo',
  Toriko: 'Mitsutoshi Shimabukuro'
};
const catalogPublisherNames = {
  'Jujutsu Kaisen': 'Planet Manga',
  'Chainsaw Man': 'Planet Manga',
  'Naruto il Mito': 'Planet Manga',
  Bleach: 'Planet Manga',
  'Spy x Family': 'Planet Manga',
  Dandadan: 'Planet Manga',
  'Sakamoto Days': 'Planet Manga',
  'Kaiju No. 8': 'Planet Manga',
  Berserk: 'Planet Manga',
  "L'attacco dei giganti": 'Planet Manga',
  'One-Punch Man': 'Planet Manga',
  'Death Note': 'Planet Manga',
  'Vinland Saga': 'Planet Manga',
  'Dragon Ball': 'Star Comics',
  'One Piece': 'Star Comics',
  'My Hero Academia': 'Star Comics',
  'Hunter x Hunter': 'Planet Manga',
  'Yu degli spettri': 'Planet Manga',
  'Fullmetal Alchemist': 'Planet Manga',
  'Demon Slayer': 'Star Comics',
  'Black Clover': 'Star Comics',
  'Fairy Tail': 'Star Comics',
  'Edens Zero': 'Star Comics',
  "Le bizzarre avventure di JoJo": 'Star Comics',
  'Kenshin samurai vagabondo': 'Planet Manga',
  Gintama: 'Star Comics',
  'Assassination Classroom': 'Planet Manga',
  'The Promised Neverland': 'Planet Manga',
  'Fire Force': 'Planet Manga',
  'Soul Eater': 'Planet Manga'
};
const catalogSeriesVolumes = {
  'Jujutsu Kaisen': '30 volumi (serie completa)',
  'Chainsaw Man': 'Serie in corso',
  'Naruto il Mito': '72 volumi (serie completa)',
  Bleach: '74 volumi (serie completa)',
  'Spy x Family': 'Serie in corso',
  Dandadan: 'Serie in corso',
  'Sakamoto Days': 'Serie in corso',
  'Kaiju No. 8': '16 volumi (serie completa)',
  Berserk: 'Serie in corso',
  "L'attacco dei giganti": '34 volumi (serie completa)',
  'One-Punch Man': 'Serie in corso',
  'Death Note': '12 volumi (serie completa)',
  'Vinland Saga': 'Serie in corso',
  'Dragon Ball': '42 volumi (serie completa)',
  'One Piece': 'Serie in corso',
  'My Hero Academia': '42 volumi (serie completa)',
  'Hunter x Hunter': 'Serie in corso',
  'Yu degli spettri': '19 volumi (serie completa)',
  'Fullmetal Alchemist': '27 volumi (serie completa)',
  'Demon Slayer': '23 volumi (serie completa)',
  'Black Clover': 'Serie in corso',
  'Fairy Tail': '63 volumi (serie completa)',
  'Edens Zero': '33 volumi (serie completa)',
  'Le bizzarre avventure di JoJo': 'Serie in corso',
  'Kenshin samurai vagabondo': '28 volumi (serie completa)',
  Gintama: '77 volumi (serie completa)',
  'Assassination Classroom': '21 volumi (serie completa)',
  'The Promised Neverland': '20 volumi (serie completa)',
  'Fire Force': '34 volumi (serie completa)',
  'Soul Eater': '25 volumi (serie completa)',
  Toriko: '43 volumi (serie completa)',
  'World Trigger': 'Serie in corso',
  'Shaman King': '35 volumi (serie completa)',
  'Reborn!': '42 volumi (serie completa)',
  'D.Gray-man': 'Serie in corso',
  'Undead Unluck': 'Serie in corso',
  Mashle: '18 volumi (serie completa)',
  'Ragna Crimson': 'Serie in corso',
  Kagurabachi: 'Serie in corso',
  'Frieren - Oltre la fine del viaggio': 'Serie in corso',
  'Dungeon Food': '14 volumi (serie completa)',
  'The Ancient Magus Bride': 'Serie in corso',
  'To Your Eternity': 'Serie in corso',
  'The Seven Deadly Sins': '41 volumi (serie completa)',
  'Magi: The Labyrinth of Magic': '37 volumi (serie completa)',
  Radiant: 'Serie in corso',
  'Yona la principessa scarlatta': 'Serie in corso',
  'Made in Abyss': 'Serie in corso',
  'Witch Hat Atelier': 'Serie in corso',
  'Land of the Lustrous': '13 volumi (serie completa)',
  'Shadows House': 'Serie in corso',
  'Blue Exorcist': 'Serie in corso',
  'Twin Star Exorcists': 'Serie in corso',
  'Seraph of the End': 'Serie in corso',
  'The Case Study of Vanitas': 'Serie in corso'
};

const catalogGrid = document.querySelector('.catalog-grid');
const maxCatalogSeries = 30;
const extraSeriesDescriptions = {
  'Dragon Ball': 'Bulma incontra il giovane Son Goku, che possiede una coda da scimmia e una forza straordinaria. Insieme partono alla ricerca delle sette Sfere del Drago, capaci di esaudire un desiderio, dando inizio a un viaggio pieno di avventure e incontri.',
  'One Piece': 'Monkey D. Luffy sogna di diventare il Re dei Pirati e parte per mare alla ricerca del leggendario tesoro One Piece. Grazie ai poteri del Frutto del Diavolo e con una ciurma sempre più affiatata, affronta avversari e pericoli lungo la Rotta Maggiore.',
  'My Hero Academia': 'In un mondo in cui quasi tutti possiedono un superpotere, Izuku Midoriya nasce senza Quirk ma sogna di diventare un eroe. L’incontro con All Might gli offre la possibilità di entrare alla prestigiosa scuola per eroi e imparare a usare un potere straordinario.',
  'Hunter x Hunter': 'Gon Freecss parte alla ricerca del padre diventando Hunter, un professionista autorizzato a esplorare luoghi pericolosi e affrontare missioni eccezionali. Durante l’esame incontra Killua, Kurapika e Leorio, con cui condivide prove e avventure.',
  'Yu degli spettri': 'Yusuke Urameshi, un ragazzo ribelle, muore salvando un bambino e ottiene una possibilità di tornare in vita. Diventa così un investigatore del mondo degli spiriti, incaricato di affrontare creature soprannaturali che minacciano gli esseri umani.',
  'Fullmetal Alchemist': 'Dopo aver tentato una trasmutazione proibita per riportare in vita la madre, i fratelli Edward e Alphonse Elric pagano un prezzo terribile. Si mettono in viaggio alla ricerca della Pietra Filosofale, sperando di recuperare ciò che hanno perduto.',
  'Demon Slayer': 'Dopo che un demone massacra la sua famiglia e trasforma la sorella Nezuko, Tanjiro Kamado si unisce ai cacciatori di demoni. Determinato a proteggerla e a trovare una cura, affronta un viaggio segnato da allenamenti e combattimenti.',
  'Black Clover': 'Asta e Yuno crescono insieme con lo stesso sogno: diventare Imperatore Magico. Mentre Yuno dimostra un talento eccezionale per la magia, Asta sembra esserne privo; la sua tenacia e una misteriosa anti-magia lo spingono comunque a lottare.',
  'Fairy Tail': 'La maga Lucy Heartfilia entra nella gilda Fairy Tail e si unisce a Natsu, Happy e agli altri maghi in missioni sempre più impegnative. Tra magia, rivalità e amicizia, la gilda affronta avversari e minacce che mettono alla prova il gruppo.',
  'Edens Zero': 'Shiki, cresciuto tra robot su un pianeta deserto, incontra la videoblogger Rebecca e il suo gatto Happy. Insieme partono a bordo dell’astronave Edens Zero per esplorare il cosmo e trovare la misteriosa Madre.',
  "Le bizzarre avventure di JoJo": 'La saga segue le diverse generazioni della famiglia Joestar, ognuna coinvolta in scontri contro avversari e poteri fuori dal comune. La prima parte racconta la rivalità tra Jonathan Joestar e Dio Brando nell’Inghilterra vittoriana.',
  'Kenshin samurai vagabondo': 'Nel Giappone dell’era Meiji, il vagabondo Kenshin Himura cerca di espiare il suo passato da assassino. Armato di una spada dalla lama invertita, promette di non uccidere più e protegge le persone che incontra.',
  'Gintama': 'In un Edo conquistato da invasori extraterrestri, Gintoki Sakata si guadagna da vivere accettando lavori di ogni genere. Insieme ai suoi eccentrici compagni, si ritrova coinvolto in avventure che mescolano fantascienza, combattimenti e umorismo.',
  'Assassination Classroom': 'Una creatura potentissima, responsabile della distruzione della Luna, diventa l’insegnante della classe 3-E e promette di distruggere la Terra entro un anno. I suoi studenti ricevono il compito di assassinarlo, mentre imparano da lui a credere nelle proprie capacità.',
  'The Promised Neverland': 'Emma, Norman e Ray vivono felici nell’orfanotrofio Grace Field House, finché scoprono il destino riservato ai bambini affidati alla direttrice Isabella. I tre elaborano un piano per fuggire e portare con sé gli altri orfani.',
  'Fire Force': 'Shinra Kusakabe entra nella Compagnia Speciale 8 dei pompieri, incaricata di fermare la combustione spontanea che trasforma le persone in creature di fuoco. Vuole diventare un eroe e scoprire la verità sull’incendio che ha segnato la sua infanzia.',
  'Soul Eater': 'Alla Death Weapon Meister Academy, gli studenti meister collaborano con compagni capaci di trasformarsi in armi. Maka e Soul raccolgono anime malvagie per diventare una falce della Morte, affrontando una minaccia che rischia di precipitare il mondo nella follia.',
  'Toriko': 'Nel mondo di Toriko, ingredienti rarissimi e creature formidabili attendono i Gourmet Hunter. Toriko, uno dei cacciatori più forti, viaggia alla ricerca degli ingredienti per completare il suo menu ideale, accompagnato dal cuoco Komatsu.'
};
const remainingSeriesSlots = Math.max(
  0,
  maxCatalogSeries - catalogGrid.querySelectorAll('.catalog-card').length
);

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

// serie presenti anche in home: stesso id, così carrello e preferiti non le contano due volte
const sharedProductIds = { 'Dragon Ball': 'product-9' };

extraSeries.slice(0, remainingSeriesSlots).forEach(([title, genres], index) => {
  const safeTitle = escapeHtml(title);
  const genreLabel = genres.split(' ').map(value => genreNames[value]).join(' · ');
  const searchTerms = `${title} ${genres.split(' ').map(value => genreNames[value]).join(' ')}`.toLocaleLowerCase('it');
  const description = extraSeriesDescriptions[title] || `Serie manga di ${genreLabel.toLocaleLowerCase('it')}.`;
  const editionUrl = `https://www.panini.it/shp_ita_it/catalogsearch/result/?q=${encodeURIComponent(title)}`;

  catalogGrid.insertAdjacentHTML('beforeend', `
    <article class="catalog-card" data-product-id="${sharedProductIds[title] || `catalog-extra-${index + 1}`}" data-genre="${genres}" data-search="${escapeHtml(searchTerms)}" data-description="${escapeHtml(description)}">
      <a class="catalog-cover-link" href="${editionUrl}" target="_blank" rel="noopener noreferrer" aria-label="Apri la descrizione di ${safeTitle}">
        <img alt="" loading="lazy" hidden>
        <span class="catalog-volume">VOL. 01</span>
      </a>
      <div class="catalog-card-info"><p class="catalog-label">${escapeHtml(genreLabel.toUpperCase())}</p><h3>${safeTitle}</h3><p>${escapeHtml(description)}</p><p class="catalog-price">5,90 €</p></div>
    </article>
  `);
});

const cards = [...document.querySelectorAll('.catalog-card')];
const search = document.querySelector('#catalog-search');
const genre = document.querySelector('#catalog-genre');
const status = document.querySelector('#catalog-status');
const mangaDialog = document.querySelector('#manga-dialog');
const dialogCover = document.querySelector('#manga-dialog-cover');
const dialogGenre = document.querySelector('#manga-dialog-genre');
const dialogTitle = document.querySelector('#manga-dialog-title');
const dialogDescription = document.querySelector('#manga-dialog-description');
const dialogPrice = document.querySelector('#manga-dialog-price');
const dialogDimensions = document.querySelector('#manga-dialog-dimensions');
const dialogVolumes = document.querySelector('#manga-dialog-volumes');
const dialogAuthor = document.querySelector('#manga-dialog-author');
const dialogPublisher = document.querySelector('#manga-dialog-publisher');
const dialogCartButton = document.querySelector('#manga-dialog-cart');
const dialogCartConfirmation = document.querySelector('#manga-dialog-cart-confirmation');
const dialogCartMessage = document.querySelector('#manga-dialog-cart-message');
const dialogCartLink = document.querySelector('#manga-dialog-open-cart');
for (const card of cards) {
  const coverLink = card.querySelector('.catalog-cover-link');
  const info = card.querySelector('.catalog-card-info');
  const authorLine = [...info.querySelectorAll(':scope > p')].find(paragraph => !paragraph.classList.contains('catalog-label') && !paragraph.classList.contains('catalog-price'));
  const price = info.querySelector('.catalog-price');

  card.classList.add('product-card');
  coverLink.classList.add('product-image');
  coverLink.querySelector('img').classList.add('cover-image');
  coverLink.querySelector('.catalog-volume').classList.add('badge');
  info.classList.add('product-info');
  info.querySelector('.catalog-label').classList.add('product-category');
  price.classList.add('price');
  if (authorLine) {
    authorLine.classList.add('format');
    const title = info.querySelector('h3').textContent.trim();
    authorLine.textContent = `Autore: ${authorNames[title] || 'Non indicato'}`;
  }
}

// prodotti della pagina per il carrello condiviso (js/carrello.js)
for (const card of cards) {
  const info = card.querySelector('.catalog-card-info');
  const priceMatch = info.querySelector('.catalog-price').textContent.trim().match(/^(\d+)(?:,(\d{2}))?\s*€$/);
  // nella griglia il titolo è la serie (il volume è nel bollino); carrello e preferiti usano "Serie Vol. 1", come la home
  card.dataset.title = `${info.querySelector('h3').textContent.trim()} Vol. 1`;
  carrello.registra({
    id: card.dataset.productId,
    title: card.dataset.title,
    category: info.querySelector('.catalog-label').textContent.trim(),
    price: priceMatch ? Number(priceMatch[1]) * 100 + Number(priceMatch[2] || 0) : 590,
    image: card.querySelector('.product-image img')?.getAttribute('src') || ''
  });
}

document.querySelector('#catalog-series-count').textContent = `${cards.length} SERIE`;

let activeMangaCard = null;
function openMangaDetails(card) {
  activeMangaCard = card;
  dialogCartConfirmation.hidden = true;
  mangaDialog.dataset.productId = card.dataset.productId;
  const coverLink = card.querySelector('.catalog-cover-link');
  const cover = coverLink.querySelector('img');
  const coverUrl = cover.getAttribute('src');
  const info = card.querySelector('.catalog-card-info');

  if (coverUrl) {
    dialogCover.src = coverUrl;
  } else {
    dialogCover.removeAttribute('src');
  }
  dialogCover.alt = cover.alt;
  dialogCover.hidden = !coverUrl;
  mangaDialog.querySelector('.manga-dialog-content').classList.toggle('no-cover', !coverUrl);
  dialogGenre.textContent = info.querySelector('.catalog-label').textContent;
  dialogTitle.textContent = info.querySelector('h3').textContent;
  dialogDescription.textContent = card.dataset.description;
  dialogPrice.textContent = info.querySelector('.catalog-price').textContent;
  dialogDimensions.textContent = 'Circa 11,5 × 17,5 cm';
  dialogVolumes.textContent = catalogSeriesVolumes[dialogTitle.textContent] || 'Dato non disponibile';
  dialogAuthor.textContent = authorNames[dialogTitle.textContent] || 'Non indicato';
  dialogPublisher.textContent = catalogPublisherNames[dialogTitle.textContent] || 'Da verificare';
  dialogCartButton.setAttribute('aria-label', `Aggiungi ${dialogTitle.textContent} al carrello`);
  dialogCartButton.title = `Aggiungi ${dialogTitle.textContent} al carrello`;
  mangaDialog.showModal();
  mangaDialog.dispatchEvent(new CustomEvent('manga:details-open', {
    detail: { productId: card.dataset.productId }
  }));
}

function addMangaToCart(card, fromDetails = false) {
  // dalla scheda di dettaglio il messaggio compare nella scheda stessa, non nell'avviso in basso
  const result = carrello.aggiungi(card.dataset.productId, { silenzioso: fromDetails });
  if (fromDetails) {
    dialogCartMessage.textContent = result.message;
    dialogCartLink.hidden = false;
    dialogCartConfirmation.hidden = false;
  }
}

dialogCartButton.addEventListener('click', () => {
  if (activeMangaCard) addMangaToCart(activeMangaCard, true);
});

for (const card of cards) {
  const info = card.querySelector('.catalog-card-info');
  const title = info.querySelector('h3').textContent.trim();
  info.querySelector('.catalog-linkout')?.remove();

  const actions = document.createElement('div');
  actions.className = 'product-actions';
  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'add-button';
  addButton.textContent = 'Aggiungi al carrello';
  addButton.setAttribute('aria-label', `Aggiungi ${title} al carrello`);
  addButton.addEventListener('click', () => addMangaToCart(card));
  actions.append(addButton);
  info.append(actions);

  const coverLink = card.querySelector('.catalog-cover-link');
  coverLink.addEventListener('click', event => {
    event.preventDefault();
    openMangaDetails(card);
  });
}

const coverStatus = document.querySelector('#catalog-covers-status');
const coverCacheKey = 'mangaClubOpenLibraryCovers';
const coverCacheDuration = 30 * 24 * 60 * 60 * 1000;
const localCovers = {
  'Naruto il Mito': 'img/copertine/naruto-il-mito.webp',
  Bleach: 'img/copertine/bleach.webp',
  'Kenshin samurai vagabondo': 'img/copertine/kenshin.webp',
  Gintama: 'img/copertine/gintama.webp',
  'Yu degli spettri': 'img/copertine/yu-degli-spettri.webp'
};
const coverQueue = [];
let coverCache = {};
let coverRequestRunning = false;
let coversLoaded = 0;
let coversLookedUp = 0;
let coversNotFound = 0;

cards.forEach(card => {
  const image = card.querySelector('.catalog-cover-link img');
  const title = card.querySelector('.catalog-card-info h3').textContent.trim();
  image.addEventListener('load', () => {
    carrello.aggiornaImmagine(card.dataset.productId, image.getAttribute('src') || image.currentSrc);
  });
  const coverLink = image.closest('.catalog-cover-link');
  image.alt = `Copertina di ${title} in caricamento da Open Library`;
  image.hidden = true;
  coverLink.dataset.coverState = 'loading';
  image.addEventListener('error', () => {
    if (coverLink.dataset.coverState !== 'loaded') return;
    coversLoaded--;
    delete coverCache[title];
    coverLink.dataset.coverState = 'loading';
    markCoverUnavailable(card);
    saveCoverCache();
    updateCoverStatus();
  });
});

try {
  const cached = JSON.parse(localStorage.getItem(coverCacheKey) || '{}');
  if (cached.savedAt && Date.now() - cached.savedAt < coverCacheDuration) {
    coverCache = cached.covers || {};
  }
} catch {
  coverStatus.textContent = 'Non è possibile leggere la cache locale delle copertine.';
}

function updateCoverStatus() {
  if (coversLookedUp === 0) {
    coverStatus.textContent = 'Caricamento delle copertine da Open Library, una serie alla volta.';
    return;
  }
  coverStatus.textContent = `Copertine caricate: ${coversLoaded}. Titoli senza copertina: ${coversNotFound}.`;
}

function normalizeBookTitle(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('it')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function chooseOpenLibraryCover(items, seriesTitle) {
  const normalizedSeries = normalizeBookTitle(seriesTitle);
  const seriesWords = new Set(normalizedSeries.split(' ').filter(word => word.length > 2));
  const candidates = items
    .filter(item => item.cover_i && item.title)
    .map(item => {
      const bookTitle = normalizeBookTitle(item.title);
      const bookWords = bookTitle.split(' ').filter(word => word.length > 2);
      const overlap = bookWords.filter(word => seriesWords.has(word)).length;
      const score = bookTitle === normalizedSeries ? 1
        : bookTitle.startsWith(normalizedSeries) ? 0.95
          : bookTitle.includes(normalizedSeries) ? 0.9
            : normalizedSeries.includes(bookTitle) && bookTitle.length > 4 ? 0.7
              : overlap / Math.max(seriesWords.size, 1);
      const volumeOne = /\b(vol(?:ume)?\.?\s*1|#1)\b/i.test(item.title);
      return { score: score + (volumeOne ? 0.1 : 0), coverId: item.cover_i };
    })
    .filter(candidate => candidate.score >= 0.4)
    .sort((left, right) => right.score - left.score);

  return candidates[0]?.coverId
    ? `https://covers.openlibrary.org/b/id/${candidates[0].coverId}-L.jpg`
    : '';
}

function saveCoverCache() {
  try {
    localStorage.setItem(coverCacheKey, JSON.stringify({
      savedAt: Date.now(),
      covers: coverCache
    }));
  } catch {
    coverStatus.textContent = 'Impossibile salvare la cache; le copertine restano disponibili nella pagina.';
  }
}

async function loadOpenLibraryCover(card) {
  const image = card.querySelector('.catalog-cover-link img');
  const coverLink = image.closest('.catalog-cover-link');
  const title = card.querySelector('.catalog-card-info h3').textContent.trim();
  const localCover = localCovers[title];
  const cachedCover = coverCache[title];

  if (localCover) {
    image.src = localCover;
    image.alt = `Copertina di ${title}`;
    image.hidden = false;
    coverLink.dataset.coverState = 'loaded';
    coversLoaded++;
    coversLookedUp++;
    updateCoverStatus();
    return;
  }

  if (cachedCover) {
    image.src = cachedCover;
    image.alt = `Copertina di ${title} da Open Library`;
    image.hidden = false;
    coverLink.dataset.coverState = 'loaded';
    coversLoaded++;
    coversLookedUp++;
    updateCoverStatus();
    return;
  }

  coversLookedUp++;
  updateCoverStatus();
  const query = encodeURIComponent(title);

  try {
    const response = await fetch(`https://openlibrary.org/search.json?title=${query}&limit=20&fields=title,cover_i`);
    if (!response.ok) throw new Error(`Open Library ha risposto con stato ${response.status}.`);

    const result = await response.json();
    const cover = chooseOpenLibraryCover(result.docs || [], title);
    if (cover) {
      image.src = cover;
      image.alt = `Copertina di ${title} da Open Library`;
      image.hidden = false;
      coverLink.dataset.coverState = 'loaded';
      coverCache[title] = cover;
      coversLoaded++;
      saveCoverCache();
    } else {
      markCoverUnavailable(card);
    }
  } catch (error) {
    markCoverUnavailable(card);
    console.error(`Caricamento copertina Open Library non riuscito per "${title}":`, error);
  }

  updateCoverStatus();
}

function markCoverUnavailable(card) {
  const image = card.querySelector('.catalog-cover-link img');
  const coverLink = image.closest('.catalog-cover-link');
  if (coverLink.dataset.coverState === 'loaded') return;
  if (coverLink.dataset.coverState !== 'unavailable') coversNotFound++;
  image.removeAttribute('src');
  image.alt = `Copertina di ${card.querySelector('.catalog-card-info h3').textContent.trim()} non disponibile su Open Library`;
  image.hidden = true;
  coverLink.dataset.coverState = 'unavailable';
}

async function processCoverQueue() {
  if (coverRequestRunning) return;
  coverRequestRunning = true;

  while (coverQueue.length) {
    await loadOpenLibraryCover(coverQueue.shift());
    if (coverQueue.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  coverRequestRunning = false;
}

cards.forEach(card => coverQueue.push(card));
processCoverQueue();
updateCoverStatus();

document.querySelector('#manga-dialog-close').addEventListener('click', () => mangaDialog.close());
mangaDialog.addEventListener('click', event => {
  if (event.target === mangaDialog) mangaDialog.close();
});

function filterCatalog() {
  const query = search.value.trim().toLocaleLowerCase('it');
  let visibleCount = 0;

  for (const card of cards) {
    const searchableText = [
      card.dataset.search,
      card.querySelector('h3')?.textContent,
      card.querySelector('.format')?.textContent,
      card.querySelector('.product-category')?.textContent
    ].join(' ').toLocaleLowerCase('it');
    const matchesText = searchableText.includes(query);
    const matchesGenre = !genre.value || card.dataset.genre.split(' ').includes(genre.value);
    card.hidden = !matchesText || !matchesGenre;
    if (!card.hidden) visibleCount++;
  }

  status.textContent = visibleCount
    ? `${visibleCount} ${visibleCount === 1 ? 'serie trovata' : 'serie trovate'}`
    : 'Nessuna serie trovata. Prova a modificare la ricerca o il genere.';
}

search.addEventListener('input', filterCatalog);
genre.addEventListener('change', filterCatalog);
// ricerca arrivata da un'altra pagina (es. il campo nell'header di account.html)
const requestedQuery = new URLSearchParams(window.location.search).get('q');
if (requestedQuery) {
  search.value = requestedQuery.trim();
  search.closest('.mobile-menu')?.setAttribute('open', '');   // su mobile il campo è nel menu: mostralo
}
filterCatalog();

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
// scorriFascia è in js/movimento.js, comune a home e catalogo
releasesPrevious.addEventListener('click', () => scorriFascia(releasesTrack, -1));
releasesNext.addEventListener('click', () => scorriFascia(releasesTrack, 1));
releasesTrack.querySelectorAll('.release-card:not([inert])').forEach(link => {
  link.addEventListener('click', () => {
    search.value = '';
    genre.value = '';
    filterCatalog();
  });
});

// il bottone "torna su" è gestito da js/movimento.js, comune a tutte le pagine

const requestedDetailsId = new URLSearchParams(window.location.search).get('details');
if (requestedDetailsId) {
  const requestedCard = cards.find(card => card.dataset.productId === requestedDetailsId);
  if (requestedCard) {
    search.value = '';
    genre.value = '';
    filterCatalog();
    requestAnimationFrame(() => openMangaDetails(requestedCard));
  }
}
