(function () {
  'use strict';

  // Formspree endpoint for the contact form — sign up at https://formspree.io,
  // create a form, and replace this with the endpoint it gives you.
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mlgyvkew';

  var work = [
    { title: 'Custom neon script', category: 'Retail', slug: 'port-neon-script' },
    { title: 'LED channel letters', category: 'Retail', slug: 'port-led-channel-letters' },
    { title: 'Illuminated pylon', category: 'Workplace', slug: 'port-illuminated-pylon' },
    { title: 'Wayfinding system', category: 'Workplace', slug: 'port-wayfinding-system' },
    { title: 'Restaurant facade', category: 'Hospitality', slug: 'port-restaurant-facade' },
    { title: 'Bar marquee sign', category: 'Hospitality', slug: 'port-bar-marquee' },
    { title: 'Storefront channel letters', category: 'Retail', slug: 'port-storefront-channel-letters' },
    { title: 'Rooftop pylon sign', category: 'Retail', slug: 'port-rooftop-pylon' },
    { title: 'Office directory sign', category: 'Workplace', slug: 'port-office-directory' },
    { title: 'Conference room signage', category: 'Workplace', slug: 'port-conference-signage' },
    { title: 'Cafe window lettering', category: 'Hospitality', slug: 'port-cafe-window' },
    { title: 'Hotel entrance sign', category: 'Hospitality', slug: 'port-hotel-entrance' },
    { title: 'Gym monument sign', category: 'Retail', slug: 'port-gym-monument' },
    { title: 'Warehouse dock signage', category: 'Workplace', slug: 'port-warehouse-dock' },
    { title: 'Bakery blade sign', category: 'Hospitality', slug: 'port-bakery-blade' },
    { title: 'Parking garage wayfinding', category: 'Workplace', slug: 'port-parking-wayfinding' },

    { title: 'Flower studio signage', category: 'Retail', slug: '1', ext: 'jpg' },
    { title: 'Restaurant sign lettering', category: 'Hospitality', slug: '2', ext: 'jpg' },
    { title: 'Boutique storefront sign', category: 'Retail', slug: '3', ext: 'jpg' },
    { title: 'Fragrance boutique sign', category: 'Retail', slug: '4', ext: 'jpg' },
    { title: 'Beauty academy sign', category: 'Workplace', slug: '5', ext: 'jpg' },
    { title: 'Hair salon signage', category: 'Retail', slug: '6', ext: 'jpg' },
    { title: 'Care facility signage', category: 'Workplace', slug: '7', ext: 'jpg' },
    { title: 'Restaurant signage', category: 'Hospitality', slug: '8', ext: 'jpg' },
    { title: 'Flower shop signage', category: 'Retail', slug: '9', ext: 'jpg' },
    { title: 'Real estate office sign', category: 'Workplace', slug: '10', ext: 'jpg' },
    { title: 'Coin karaoke signage', category: 'Hospitality', slug: '11', ext: 'jpg' },
    { title: 'Hair color studio sign', category: 'Retail', slug: '12', ext: 'jpg' }
  ];

  // crop offsets extracted from the saved image-slot state (percent, relative to center)
  var cropY = {
    'port-wayfinding-system': 22.061018510298293,
    'port-restaurant-facade': 18.862027254971593,
    'port-bar-marquee': 15.76410466974432
  };

  var categories = ['All', 'Retail', 'Workplace', 'Hospitality'];

  var accentPaletteOptions = [
    ['#ff4fd8', '#5ad4ff'],
    ['#ff8a3d', '#c86bff'],
    ['#7dffb0', '#5ad4ff'],
    ['#ffe14f', '#ff4f7d'],
    ['#5ad4ff', '#7dffb0']
  ];

  var heroMoodOptions = ['moody', 'vivid', 'minimal'];
  var cardStyleOptions = ['glass', 'solid', 'outline'];
  var headingStyleOptions = ['bold', 'editorial', 'compact'];
  var portfolioColumnsOptions = ['2', '3', '4'];

  var state = {
    activeCategory: 'All',
    accentPalette: accentPaletteOptions[0],
    heroMood: 'vivid',
    cardStyle: 'outline',
    headingStyle: 'bold',
    portfolioColumns: '4'
  };

  var heroOverlayByMood = {
    moody: 'linear-gradient(100deg, rgba(6,6,9,.92) 0%, rgba(6,6,9,.62) 40%, rgba(6,6,9,.1) 68%, rgba(6,6,9,.35) 100%)',
    vivid: function (accent1) {
      return 'linear-gradient(100deg, rgba(6,6,9,.7) 0%, rgba(6,6,9,.3) 45%, ' + accent1 + '22 75%, rgba(6,6,9,.2) 100%)';
    },
    minimal: 'linear-gradient(180deg, rgba(6,6,9,.55) 0%, rgba(6,6,9,.75) 100%)'
  };

  var heroTitleSizeByMood = {
    moody: 'clamp(52px, 9vw, 108px)/0.94',
    vivid: 'clamp(56px, 10vw, 120px)/0.9',
    minimal: 'clamp(44px, 7vw, 84px)/1.02'
  };

  var headingByStyle = {
    bold: { font: "800 34px 'Archivo',sans-serif", ls: '-0.01em', tt: 'none' },
    editorial: { font: "600 30px 'Archivo',sans-serif", ls: '.06em', tt: 'uppercase' },
    compact: { font: "700 24px 'Archivo',sans-serif", ls: '-0.02em', tt: 'none' }
  };

  function surfaceByCard(card, accent1, accent2) {
    return {
      glass: { bg: '#15151b', border: '1px solid rgba(255,255,255,.08)' },
      solid: { bg: accent1 + '14', border: 'none' },
      outline: { bg: 'transparent', border: '1.5px solid ' + accent2 + '66' }
    }[card];
  }

  function getColumnCap() {
    var w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 900) return 2;
    return 4;
  }

  // ---------- DOM refs ----------
  var $ = function (id) { return document.getElementById(id); };
  var heroOverlay = $('heroOverlay');
  var eyebrow = $('eyebrow');
  var heroTitle = $('heroTitle');
  var heroTitleAccent = $('heroTitleAccent');
  var heroPhone = $('heroPhone');
  var learnMoreBadge = $('learnMoreBadge');
  var learnMorePlus = $('learnMorePlus');
  var statCard = $('statCard');
  var statDot = $('statDot');
  var navCta = $('navCta');
  var portfolioHeading = $('portfolioHeading');
  var processHeading = $('processHeading');
  var boardHeading = $('boardHeading');
  var catFilters = $('catFilters');
  var portfolioGrid = $('portfolioGrid');
  var serviceTitle1 = $('serviceTitle1');
  var serviceTitle2 = $('serviceTitle2');
  var serviceTitle3 = $('serviceTitle3');
  var stepNum1 = $('stepNum1');
  var stepNum2 = $('stepNum2');
  var stepNum3 = $('stepNum3');
  var stepNum4 = $('stepNum4');
  var contactCard = $('contact');
  var submitBtn = $('submitBtn');
  var boardPanel = document.querySelector('.board-panel');
  var surfaceCards = [serviceTitle1.closest('.surface-card'), serviceTitle2.closest('.surface-card'), serviceTitle3.closest('.surface-card'), contactCard, boardPanel];

  function render() {
    var accent1 = state.accentPalette[0];
    var accent2 = state.accentPalette[1];
    var accentGradient = 'linear-gradient(90deg,' + accent1 + ',' + accent2 + ')';
    var mood = state.heroMood;
    var overlay = mood === 'vivid' ? heroOverlayByMood.vivid(accent1) : heroOverlayByMood[mood];
    var showHeroExtras = mood !== 'minimal';
    var surface = surfaceByCard(state.cardStyle, accent1, accent2);
    var headingDef = headingByStyle[state.headingStyle];

    heroOverlay.style.background = overlay;
    eyebrow.style.color = accent2;
    heroTitle.style.font = "900 " + heroTitleSizeByMood[mood] + " 'Archivo',sans-serif";
    heroTitleAccent.style.backgroundImage = accentGradient;
    learnMorePlus.style.color = accent1;
    heroPhone.style.color = accent1;
    statDot.style.background = accent1;
    navCta.style.background = accentGradient;
    submitBtn.style.background = accentGradient;
    boardWriteBtn.style.background = accentGradient;
    boardSubmitBtn.style.background = accentGradient;

    learnMoreBadge.hidden = !showHeroExtras;
    statCard.hidden = !showHeroExtras;

    portfolioHeading.style.font = headingDef.font;
    portfolioHeading.style.letterSpacing = headingDef.ls;
    portfolioHeading.style.textTransform = headingDef.tt;
    processHeading.style.font = headingDef.font;
    processHeading.style.letterSpacing = headingDef.ls;
    processHeading.style.textTransform = headingDef.tt;
    boardHeading.style.font = headingDef.font;
    boardHeading.style.letterSpacing = headingDef.ls;
    boardHeading.style.textTransform = headingDef.tt;

    surfaceCards.forEach(function (el) {
      el.style.background = surface.bg;
      el.style.border = surface.border;
    });

    serviceTitle1.style.color = accent1;
    serviceTitle2.style.color = accent2;
    serviceTitle3.style.color = accent1;
    stepNum1.style.color = accent1;
    stepNum2.style.color = accent2;
    stepNum3.style.color = accent1;
    stepNum4.style.color = accent2;

    var cols = Math.min(parseInt(state.portfolioColumns, 10), getColumnCap());
    portfolioGrid.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';

    renderCategoryFilters(accentGradient);
    renderPortfolioGrid();
    renderTweaksPanel();
  }

  function renderCategoryFilters(accentGradient) {
    catFilters.innerHTML = '';
    categories.forEach(function (cat) {
      var chip = document.createElement('div');
      chip.className = 'cat-chip' + (cat === state.activeCategory ? ' active' : '');
      chip.textContent = cat;
      chip.style.background = cat === state.activeCategory ? accentGradient : '';
      chip.addEventListener('click', function () {
        state.activeCategory = cat;
        render();
      });
      catFilters.appendChild(chip);
    });
  }

  function renderPortfolioGrid() {
    var filtered = state.activeCategory === 'All' ? work : work.filter(function (w) { return w.category === state.activeCategory; });
    portfolioGrid.innerHTML = '';
    filtered.forEach(function (item) {
      var cell = document.createElement('div');
      cell.className = 'portfolio-item';

      var imgWrap = document.createElement('div');
      imgWrap.className = 'portfolio-item-img-wrap';

      var img = document.createElement('img');
      img.src = 'assets/img/portfolio/' + item.slug + '.' + (item.ext || 'webp');
      img.alt = item.title;
      var y = cropY[item.slug] || 0;
      img.style.objectPosition = '50% ' + (50 + y) + '%';
      img.addEventListener('click', function () { openLightbox(img.src, item.title); });
      imgWrap.appendChild(img);

      var caption = document.createElement('div');
      caption.className = 'portfolio-item-caption';

      cell.appendChild(imgWrap);
      cell.appendChild(caption);
      portfolioGrid.appendChild(cell);
    });
  }

  // ---------- Tweaks panel ----------
  var tweaksToggle = $('tweaksToggle');
  var tweaksBody = $('tweaksBody');
  var accentSwatches = $('accentSwatches');
  var heroMoodRow = $('heroMoodRow');
  var cardStyleRow = $('cardStyleRow');
  var headingStyleRow = $('headingStyleRow');
  var portfolioColsRow = $('portfolioColsRow');

  tweaksToggle.addEventListener('click', function () {
    tweaksBody.hidden = !tweaksBody.hidden;
  });

  function buildPillRow(container, options, currentValue, onPick, label) {
    container.innerHTML = '';
    options.forEach(function (opt) {
      var pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'tweak-pill' + (opt === currentValue ? ' active' : '');
      pill.textContent = label ? label(opt) : opt;
      pill.addEventListener('click', function () {
        onPick(opt);
        render();
      });
      container.appendChild(pill);
    });
  }

  function renderTweaksPanel() {
    accentSwatches.innerHTML = '';
    accentPaletteOptions.forEach(function (pair) {
      var sw = document.createElement('button');
      sw.type = 'button';
      sw.className = 'swatch' + (pair === state.accentPalette ? ' active' : '');
      sw.style.background = 'linear-gradient(135deg,' + pair[0] + ' 50%,' + pair[1] + ' 50%)';
      sw.addEventListener('click', function () {
        state.accentPalette = pair;
        render();
      });
      accentSwatches.appendChild(sw);
    });

    buildPillRow(heroMoodRow, heroMoodOptions, state.heroMood, function (v) { state.heroMood = v; });
    buildPillRow(cardStyleRow, cardStyleOptions, state.cardStyle, function (v) { state.cardStyle = v; });
    buildPillRow(headingStyleRow, headingStyleOptions, state.headingStyle, function (v) { state.headingStyle = v; });
    buildPillRow(portfolioColsRow, portfolioColumnsOptions, state.portfolioColumns, function (v) { state.portfolioColumns = v; });
  }

  // ---------- Contact form ----------
  var contactForm = $('contactForm');
  var fieldName = $('fieldName');
  var fieldEmail = $('fieldEmail');
  var fieldMessage = $('fieldMessage');
  var formError = $('formError');
  var contactSuccess = $('contactSuccess');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = fieldName.value.trim();
    var email = fieldEmail.value.trim();
    var message = fieldMessage.value.trim();

    fieldName.classList.remove('invalid');
    fieldEmail.classList.remove('invalid');

    if (!name || !email || !message) {
      formError.textContent = 'Please fill in all fields.';
      formError.hidden = false;
      if (!name) fieldName.classList.add('invalid');
      if (!email) fieldEmail.classList.add('invalid');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formError.textContent = 'Please enter a valid email address.';
      formError.hidden = false;
      fieldEmail.classList.add('invalid');
      return;
    }

    formError.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm)
    })
      .then(function (res) {
        if (res.ok) {
          contactForm.hidden = true;
          contactSuccess.hidden = false;
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function () {
        formError.textContent = "Something went wrong sending your message — please email us directly at gon9005@naver.com.";
        formError.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request a quote';
      });
  });

  // ---------- Q&A board (private inquiry modal) ----------
  var boardWriteBtn = $('boardWriteBtn');
  var boardModal = $('boardModal');
  var boardModalClose = $('boardModalClose');
  var boardForm = $('boardForm');
  var boardTitle = $('boardTitle');
  var boardName = $('boardName');
  var boardContact = $('boardContact');
  var boardMessage = $('boardMessage');
  var boardFormError = $('boardFormError');
  var boardSuccess = $('boardSuccess');
  var boardSubmitBtn = $('boardSubmitBtn');

  function openBoardModal() { boardModal.hidden = false; }
  function closeBoardModal() { boardModal.hidden = true; }

  boardWriteBtn.addEventListener('click', openBoardModal);
  boardModalClose.addEventListener('click', closeBoardModal);
  boardModal.addEventListener('click', function (e) {
    if (e.target === boardModal) closeBoardModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !boardModal.hidden) closeBoardModal();
  });

  boardForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var title = boardTitle.value.trim();
    var name = boardName.value.trim();
    var contact = boardContact.value.trim();
    var message = boardMessage.value.trim();

    [boardTitle, boardName, boardContact, boardMessage].forEach(function (el) {
      el.classList.remove('invalid');
    });

    if (!title || !name || !contact || !message) {
      boardFormError.textContent = '모든 항목을 입력해주세요.';
      boardFormError.hidden = false;
      if (!title) boardTitle.classList.add('invalid');
      if (!name) boardName.classList.add('invalid');
      if (!contact) boardContact.classList.add('invalid');
      if (!message) boardMessage.classList.add('invalid');
      return;
    }

    boardFormError.hidden = true;
    boardSubmitBtn.disabled = true;
    boardSubmitBtn.textContent = '등록 중…';

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(boardForm)
    })
      .then(function (res) {
        if (res.ok) {
          boardForm.hidden = true;
          boardSuccess.hidden = false;
          if (window.SignCraftBoard) {
            window.SignCraftBoard.addEntry(title, name);
          }
        } else {
          throw new Error('Board submission failed');
        }
      })
      .catch(function () {
        boardFormError.textContent = '문의 등록 중 오류가 발생했습니다 — 010.2258.2700으로 직접 연락 부탁드립니다.';
        boardFormError.hidden = false;
      })
      .finally(function () {
        boardSubmitBtn.disabled = false;
        boardSubmitBtn.textContent = '등록하기';
      });
  });

  // ---------- Lightbox ----------
  var lightbox = $('lightbox');
  var lightboxImg = $('lightboxImg');
  var lightboxClose = $('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  // ---------- Mobile nav ----------
  var navToggle = $('navToggle');
  var navLinks = $('navLinks');

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---------- Responsive re-render ----------
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 120);
  });

  // collapse the tweaks panel by default on small screens so it doesn't cover content
  if (window.innerWidth < 768) {
    tweaksBody.hidden = true;
  }

  // design tweak panel is an internal review tool, not for public visitors —
  // only show it when explicitly requested via ?tweaks=1
  var tweaksPanel = $('tweaksPanel');
  var showTweaks = /(^|[?&])tweaks=1(&|$)/.test(window.location.search);
  if (!showTweaks) {
    tweaksPanel.style.display = 'none';
  }

  render();
})();
