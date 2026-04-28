(function () {
  const qs = (sel, root) => (root || document).querySelector(sel);

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return fallback;
    }
  }

  function getCart() {
    return safeJsonParse(localStorage.getItem('bazaar_cart'), []);
  }

  function setCart(cart) {
    localStorage.setItem('bazaar_cart', JSON.stringify(cart));
  }

  function formatMoney(value) {
    const num = Number(value);
    if (!isFinite(num)) return '$0.00';
    return '$' + num.toFixed(2);
  }

  function toast(message) {
    let host = qs('.toast');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      host.style.position = 'fixed';
      host.style.left = '18px';
      host.style.bottom = '18px';
      host.style.zIndex = '9999';
      host.style.maxWidth = 'min(520px, calc(100vw - 36px))';
      host.style.padding = '12px 14px';
      host.style.borderRadius = '12px';
      host.style.border = '1px solid rgba(202,166,74,.55)';
      host.style.background = 'linear-gradient(180deg, rgba(0,0,0,.22), rgba(0,0,0,.62))';
      host.style.boxShadow = '0 18px 40px rgba(0,0,0,.45)';
      host.style.color = 'rgba(235,225,200,.92)';
      host.style.fontFamily = '"Cinzel", serif';
      host.style.letterSpacing = '.03em';
      host.style.opacity = '0';
      host.style.transform = 'translateY(10px)';
      host.style.transition = 'opacity 180ms ease, transform 180ms ease';
      document.body.appendChild(host);
    }

    host.textContent = message;
    requestAnimationFrame(function () {
      host.style.opacity = '1';
      host.style.transform = 'translateY(0)';
    });

    clearTimeout(host.__t);
    host.__t = setTimeout(function () {
      host.style.opacity = '0';
      host.style.transform = 'translateY(10px)';
    }, 2200);
  }

  function ensureCartBadge() {
    const cartLink = qs('#cart-btn') || qs('.nav-actions a.pill[href="#carrito"]');
    if (!cartLink) return null;

    let badge = qs('.cart-badge', cartLink);
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.marginLeft = '8px';
      badge.style.minWidth = '18px';
      badge.style.height = '18px';
      badge.style.display = 'inline-flex';
      badge.style.alignItems = 'center';
      badge.style.justifyContent = 'center';
      badge.style.borderRadius = '999px';
      badge.style.padding = '0 6px';
      badge.style.fontSize = '12px';
      badge.style.lineHeight = '18px';
      badge.style.border = '1px solid rgba(202,166,74,.65)';
      badge.style.background = 'rgba(84,52,132,.55)';
      badge.style.color = 'rgba(235,225,200,.95)';
      const label = qs('span', cartLink);
      if (label) {
        label.insertAdjacentElement('afterend', badge);
      } else {
        cartLink.appendChild(badge);
      }
    }
    return badge;
  }

  function updateCartBadge() {
    const badge = ensureCartBadge();
    if (!badge) return;
    const cart = getCart();
    const count = cart.reduce(function (sum, item) {
      return sum + (item && item.qty ? item.qty : 0);
    }, 0);
    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  function placeholderDataUri(title, hue) {
    const safe = String(title || 'Monster High').slice(0, 26);
    const h = typeof hue === 'number' ? hue : 280;
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">' +
      '<defs>' +
      '<linearGradient id="g" x1="0" x2="1" y1="0" y2="1">' +
      '<stop offset="0" stop-color="hsl(' + h + ',55%,22%)"/>' +
      '<stop offset="1" stop-color="hsl(' + (h + 40) + ',55%,10%)"/>' +
      '</linearGradient>' +
      '</defs>' +
      '<rect width="900" height="600" fill="url(#g)"/>' +
      '<g fill="none" stroke="rgba(227,200,116,.55)" stroke-width="2">' +
      '<path d="M90 110h720"/>' +
      '<path d="M120 160h660"/>' +
      '<path d="M150 210h600"/>' +
      '<path d="M180 260h540"/>' +
      '</g>' +
      '<text x="50%" y="54%" text-anchor="middle" font-family="Cinzel, serif" font-size="40" letter-spacing="3" fill="rgba(235,225,200,.92)">' +
      safe.toUpperCase() +
      '</text>' +
      '<text x="50%" y="62%" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="22" fill="rgba(235,225,200,.70)">IMAGEN TEMPORAL</text>' +
      '</svg>';

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function buildDolls() {
    const characters = [
      'DRACULAURA',
      'CLAWDEEN WOLF',
      'FRANKIE STEIN',
      'LAGOONA BLUE',
      'CLEO DE NILE',
      'GHoulIA YELPS',
      'SPECTRA VONDERGEIST',
      'ABBey BOMINABLE',
      'TORALEI STRIPE',
      'ROBECCA STEAM',
      'OPERETTA',
      'NEFERA DE NILE',
      'VENUS McFLYTRAP',
      'ROCHELLE GOYLE',
      'ELISSABAT',
      'VANDALA DOUBLOONS',
      'TWYLA',
      'CATTY NOIR',
      'HOWLEEN WOLF',
      'JINAfire LONG'
    ];

    const lines = [
      'BASIC 2010',
      'SWEET 1600',
      "SCHOOL'S OUT",
      'DAWN OF THE DANCE',
      'DEAD TIRED',
      'GHOULS RULE',
      'SKULL SHORES',
      'DOT DEAD GORGEOUS',
      'SCARIS: CITY OF FRIGHTS',
      '13 WISHES',
      'FRIGHTS, CAMERA, ACTION!',
      'HAUNTED',
      'BOO YORK, BOO YORK',
      'POWER GHOULS',
      'MUSIC FESTIVAL',
      'ART CLASS',
      'WINTER GHOULS',
      'MONSTER EXCHANGE',
      'ROLLER MAZE',
      'GLOOM BEACH'
    ];

    const extras = [
      'DELUXE',
      'SIGNATURE LOOK',
      'SPECIAL EDITION',
      'COLLECTOR',
      'LIMITED RUN'
    ];

    const out = [];
    const used = new Set();
    let id = 1;

    for (let i = 0; i < lines.length && out.length < 55; i++) {
      for (let c = 0; c < characters.length && out.length < 55; c++) {
        const name = characters[c] + ' — ' + lines[i];
        if (used.has(name)) continue;
        used.add(name);

        const hue = 250 + ((i * 7 + c * 13) % 90);
        const price = Number((34.99 + ((i * 3 + c) % 18) * 2.15).toFixed(2));
        out.push({
          id: 'mh-' + String(id++).padStart(3, '0'),
          name: name,
          line: lines[i],
          character: characters[c],
          edition: extras[(i + c) % extras.length],
          year: 2010 + ((i + c) % 6),
          price: price,
          hue: hue
        });
      }
    }

    return out;
  }

  function createModal() {
    let overlay = qs('#doll-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'doll-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '9998';
    overlay.style.display = 'none';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '18px';
    overlay.style.background = 'rgba(0,0,0,.6)';
    overlay.setAttribute('aria-hidden', 'true');

    const modal = document.createElement('div');
    modal.id = 'doll-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.width = 'min(880px, calc(100vw - 36px))';
    modal.style.maxHeight = 'min(84vh, 760px)';
    modal.style.overflow = 'auto';
    modal.style.borderRadius = '16px';
    modal.style.border = '1px solid rgba(202,166,74,.60)';
    modal.style.background = 'linear-gradient(180deg, rgba(34,16,60,.92), rgba(0,0,0,.78))';
    modal.style.boxShadow = '0 26px 70px rgba(0,0,0,.55)';
    modal.style.color = 'rgba(235,225,200,.92)';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.gap = '12px';
    header.style.padding = '14px 16px';
    header.style.borderBottom = '1px solid rgba(202,166,74,.35)';

    const title = document.createElement('div');
    title.id = 'doll-modal-title';
    title.style.fontFamily = '"Cinzel", serif';
    title.style.letterSpacing = '.08em';
    title.style.color = 'rgba(235,225,200,.95)';

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'Cerrar';
    close.style.height = '34px';
    close.style.padding = '0 12px';
    close.style.borderRadius = '10px';
    close.style.border = '1px solid rgba(202,166,74,.55)';
    close.style.background = 'rgba(84,52,132,.55)';
    close.style.color = 'rgba(235,225,200,.92)';
    close.style.cursor = 'pointer';

    header.appendChild(title);
    header.appendChild(close);

    const body = document.createElement('div');
    body.id = 'doll-modal-body';
    body.style.padding = '14px 16px 16px';

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    function hide() {
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    close.addEventListener('click', hide);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display !== 'none') hide();
    });

    overlay.__hide = hide;
    return overlay;
  }

  function showDoll(doll, imageUrl) {
    const overlay = createModal();
    const title = qs('#doll-modal-title');
    const body = qs('#doll-modal-body');
    if (!overlay || !title || !body) return;

    title.textContent = doll.name;
    body.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gridTemplateColumns = 'minmax(220px, 1fr) 1.1fr';
    wrap.style.gap = '14px';
    wrap.style.alignItems = 'start';

    const img = document.createElement('img');
    img.alt = doll.name;
    img.src = imageUrl;
    img.style.width = '100%';
    img.style.height = '260px';
    img.style.objectFit = 'contain';
    img.style.borderRadius = '14px';
    img.style.border = '1px solid rgba(202,166,74,.35)';
    img.style.background = 'rgba(0,0,0,.18)';

    const meta = document.createElement('div');

    const line = document.createElement('div');
    line.textContent = 'Línea: ' + doll.line;
    line.style.opacity = '.88';

    const edition = document.createElement('div');
    edition.textContent = 'Edición: ' + doll.edition;
    edition.style.opacity = '.88';
    edition.style.marginTop = '6px';

    const year = document.createElement('div');
    year.textContent = 'Año: ' + doll.year;
    year.style.opacity = '.88';
    year.style.marginTop = '6px';

    const price = document.createElement('div');
    price.textContent = 'Precio: ' + formatMoney(doll.price);
    price.style.fontFamily = '"Cinzel", serif';
    price.style.letterSpacing = '.06em';
    price.style.color = 'rgba(235,225,200,.95)';
    price.style.marginTop = '12px';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '10px';
    actions.style.flexWrap = 'wrap';
    actions.style.marginTop = '14px';

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'add-btn';
    add.innerHTML = '<i class="fa-solid fa-cart-shopping"></i><span>Agregar</span>';

    add.addEventListener('click', function () {
      const cart = getCart();
      const existing = cart.find(function (x) {
        return x && x.name === doll.name;
      });

      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ name: doll.name, price: doll.price, qty: 1, image: imageUrl });
      }

      setCart(cart);
      updateCartBadge();
      toast('Agregado al carrito.');
    });

    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'pill';
    copy.innerHTML = '<i class="fa-regular fa-copy"></i><span>ID</span>';

    copy.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(doll.id).then(function () {
          toast('ID copiado: ' + doll.id);
        }).catch(function () {
          toast('ID: ' + doll.id);
        });
      } else {
        toast('ID: ' + doll.id);
      }
    });

    actions.appendChild(add);
    actions.appendChild(copy);

    meta.appendChild(line);
    meta.appendChild(edition);
    meta.appendChild(year);
    meta.appendChild(price);
    meta.appendChild(actions);

    wrap.appendChild(img);
    wrap.appendChild(meta);
    body.appendChild(wrap);

    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function render() {
    const grid = qs('.dolls-grid');
    const track = qs('.dolls-carousel__track');
    if (!grid || !track) return;

    const dolls = buildDolls();

    const urls = (window.DOLL_IMAGE_URLS && Array.isArray(window.DOLL_IMAGE_URLS)) ? window.DOLL_IMAGE_URLS : [];
    const assetImages = {
      'DRACULAURA': 'assets/draculaura.jpg',
      'CLAWDEEN WOLF': 'assets/clawdeen.jpg',
      'FRANKIE STEIN': 'assets/frankie.jpg',
      'LAGOONA BLUE': 'assets/lagoona.jpg',
      'CLEO DE NILE': 'assets/poster.png',
      'NEFERA DE NILE': 'assets/poster.png'
    };

    function imgFor(doll, idx) {
      const override = assetImages[doll.character];
      if (override) return override;
      const url = urls[idx];
      if (typeof url === 'string' && url.trim()) return url.trim();
      return placeholderDataUri(doll.character, doll.hue);
    }

    const carouselCount = Math.min(12, dolls.length);
    track.innerHTML = '';
    for (let i = 0; i < carouselCount; i++) {
      const doll = dolls[i];
      const a = document.createElement('button');
      a.type = 'button';
      a.className = 'dolls-carousel__item';
      a.setAttribute('data-doll', doll.id);

      const img = document.createElement('img');
      img.alt = doll.name;
      img.loading = 'lazy';
      img.src = imgFor(doll, i);

      img.addEventListener('error', function () {
        img.src = 'assets/poster.png';
      });

      const label = document.createElement('div');
      label.className = 'dolls-carousel__label';
      label.textContent = doll.character;

      a.appendChild(img);
      a.appendChild(label);
      a.addEventListener('click', function () {
        showDoll(doll, imgFor(doll, i));
      });
      track.appendChild(a);
    }

    grid.innerHTML = '';
    dolls.forEach(function (doll, idx) {
      const card = document.createElement('article');
      card.className = 'doll-card';
      card.setAttribute('data-doll', doll.id);

      const img = document.createElement('img');
      img.className = 'doll-card__img';
      img.alt = doll.name;
      img.loading = 'lazy';
      img.src = imgFor(doll, idx);
      img.addEventListener('error', function () {
        img.src = 'assets/poster.png';
      });

      const body = document.createElement('div');
      body.className = 'doll-card__body';

      const name = document.createElement('div');
      name.className = 'doll-card__name';
      name.textContent = doll.name;

      const meta = document.createElement('div');
      meta.className = 'doll-card__meta';
      meta.textContent = doll.edition + ' • ' + doll.year;

      const bottom = document.createElement('div');
      bottom.className = 'doll-card__bottom';

      const price = document.createElement('div');
      price.className = 'price';
      price.textContent = formatMoney(doll.price);

      const btn = document.createElement('button');
      btn.className = 'add-btn';
      btn.type = 'button';
      btn.innerHTML = '<i class="fa-solid fa-eye"></i><span>Ver</span>';

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        showDoll(doll, imgFor(doll, idx));
      });

      bottom.appendChild(price);
      bottom.appendChild(btn);

      body.appendChild(name);
      body.appendChild(meta);
      body.appendChild(bottom);

      card.appendChild(img);
      card.appendChild(body);

      card.addEventListener('click', function () {
        showDoll(doll, imgFor(doll, idx));
      });

      grid.appendChild(card);
    });

    let scrollIndex = 0;
    function scrollToIndex(i) {
      const viewport = qs('.dolls-carousel__viewport');
      const items = Array.prototype.slice.call(track.children);
      if (!viewport || !items.length) return;
      const clamped = Math.max(0, Math.min(i, items.length - 1));
      const target = items[clamped];
      const left = target.offsetLeft - 8;
      viewport.scrollTo({ left: left, behavior: 'smooth' });
      scrollIndex = clamped;
    }

    const prev = qs('[data-carousel="prev"]');
    const next = qs('[data-carousel="next"]');
    if (prev) prev.addEventListener('click', function () {
      scrollToIndex(scrollIndex - 1);
    });
    if (next) next.addEventListener('click', function () {
      scrollToIndex(scrollIndex + 1);
    });

    updateCartBadge();
  }

  document.addEventListener('DOMContentLoaded', render);
})();
