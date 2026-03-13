(function () {
  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

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
    const cartLink = qs('.nav-actions a.pill[href="#carrito"]');
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

  function buildCartModal() {
    let overlay = qs('#cart-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
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
    modal.id = 'cart-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.style.width = 'min(760px, calc(100vw - 36px))';
    modal.style.maxHeight = 'min(80vh, 720px)';
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
    title.textContent = 'CARRITO';
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
    body.id = 'cart-body';
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

  function renderCart() {
    const overlay = buildCartModal();
    const body = qs('#cart-body');
    if (!overlay || !body) return;

    const cart = getCart();
    body.innerHTML = '';

    if (!cart.length) {
      const empty = document.createElement('div');
      empty.textContent = 'Tu carrito está vacío. Agrega tesoros desde el catálogo.';
      empty.style.opacity = '.9';
      empty.style.lineHeight = '1.4';
      body.appendChild(empty);
      return;
    }

    let total = 0;
    cart.forEach(function (item, idx) {
      const row = document.createElement('div');
      row.style.display = 'grid';
      row.style.gridTemplateColumns = '52px 1fr auto';
      row.style.gap = '12px';
      row.style.alignItems = 'center';
      row.style.padding = '10px 0';
      row.style.borderBottom = '1px solid rgba(202,166,74,.25)';

      const img = document.createElement('img');
      img.alt = item.name || 'Producto';
      img.src = item.image || '';
      img.style.width = '52px';
      img.style.height = '52px';
      img.style.objectFit = 'contain';
      img.style.borderRadius = '10px';
      img.style.border = '1px solid rgba(202,166,74,.25)';
      img.style.background = 'rgba(0,0,0,.18)';

      const meta = document.createElement('div');
      const name = document.createElement('div');
      name.textContent = item.name || 'Producto';
      name.style.fontFamily = '"Cinzel", serif';
      name.style.letterSpacing = '.06em';
      name.style.fontSize = '13px';

      const sub = document.createElement('div');
      const lineTotal = (Number(item.price) || 0) * (item.qty || 1);
      total += lineTotal;
      sub.textContent = (item.qty || 1) + ' × ' + formatMoney(item.price) + ' = ' + formatMoney(lineTotal);
      sub.style.opacity = '.85';
      sub.style.marginTop = '4px';

      meta.appendChild(name);
      meta.appendChild(sub);

      const actions = document.createElement('div');
      actions.style.display = 'inline-flex';
      actions.style.alignItems = 'center';
      actions.style.gap = '8px';

      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '−';
      minus.style.width = '34px';
      minus.style.height = '34px';
      minus.style.borderRadius = '10px';
      minus.style.border = '1px solid rgba(202,166,74,.55)';
      minus.style.background = 'rgba(0,0,0,.22)';
      minus.style.color = 'rgba(235,225,200,.92)';
      minus.style.cursor = 'pointer';

      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.style.width = '34px';
      plus.style.height = '34px';
      plus.style.borderRadius = '10px';
      plus.style.border = '1px solid rgba(202,166,74,.55)';
      plus.style.background = 'rgba(84,52,132,.55)';
      plus.style.color = 'rgba(235,225,200,.92)';
      plus.style.cursor = 'pointer';

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Quitar';
      remove.style.height = '34px';
      remove.style.padding = '0 10px';
      remove.style.borderRadius = '10px';
      remove.style.border = '1px solid rgba(202,166,74,.55)';
      remove.style.background = 'rgba(0,0,0,.22)';
      remove.style.color = 'rgba(235,225,200,.92)';
      remove.style.cursor = 'pointer';

      minus.addEventListener('click', function () {
        const cartNow = getCart();
        const cur = cartNow[idx];
        if (!cur) return;
        cur.qty = Math.max(0, (cur.qty || 1) - 1);
        if (cur.qty === 0) cartNow.splice(idx, 1);
        setCart(cartNow);
        updateCartBadge();
        renderCart();
      });

      plus.addEventListener('click', function () {
        const cartNow = getCart();
        const cur = cartNow[idx];
        if (!cur) return;
        cur.qty = (cur.qty || 1) + 1;
        setCart(cartNow);
        updateCartBadge();
        renderCart();
      });

      remove.addEventListener('click', function () {
        const cartNow = getCart();
        cartNow.splice(idx, 1);
        setCart(cartNow);
        updateCartBadge();
        renderCart();
      });

      actions.appendChild(minus);
      actions.appendChild(plus);
      actions.appendChild(remove);

      row.appendChild(img);
      row.appendChild(meta);
      row.appendChild(actions);
      body.appendChild(row);
    });

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.justifyContent = 'space-between';
    footer.style.alignItems = 'center';
    footer.style.gap = '12px';
    footer.style.paddingTop = '12px';

    const totalEl = document.createElement('div');
    totalEl.textContent = 'Total: ' + formatMoney(total);
    totalEl.style.fontFamily = '"Cinzel", serif';
    totalEl.style.letterSpacing = '.06em';
    totalEl.style.color = 'rgba(235,225,200,.95)';

    const checkout = document.createElement('button');
    checkout.type = 'button';
    checkout.textContent = 'Finalizar';
    checkout.style.height = '36px';
    checkout.style.padding = '0 14px';
    checkout.style.borderRadius = '11px';
    checkout.style.border = '1px solid rgba(202,166,74,.65)';
    checkout.style.background = 'rgba(84,52,132,.65)';
    checkout.style.color = 'rgba(235,225,200,.92)';
    checkout.style.cursor = 'pointer';

    checkout.addEventListener('click', function () {
      toast('Función de pago: próximamente.');
    });

    footer.appendChild(totalEl);
    footer.appendChild(checkout);
    body.appendChild(footer);
  }

  function showCart() {
    const overlay = buildCartModal();
    if (!overlay) return;
    renderCart();
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  const cookieBtn = qs('.cookie');
  if (cookieBtn) {
    const accepted = localStorage.getItem('bazaar_cookie_hidden') === '1';
    if (accepted) cookieBtn.style.display = 'none';
    cookieBtn.addEventListener('click', function () {
      localStorage.setItem('bazaar_cookie_hidden', '1');
      cookieBtn.style.display = 'none';
      toast('Preferencias de cookies guardadas.');
    });
  }

  const subscribeForm = qs('.subscribe');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = qs('.subscribe-input', subscribeForm);
      if (input && !input.checkValidity()) {
        input.reportValidity();
        return;
      }
      if (input) input.value = '';
      toast('Suscripción registrada.');
    });
  }

  const contactForm = qs('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const nombre = qs('#nombre', contactForm);
      const correo = qs('#correo', contactForm);
      const motivo = qs('#motivo', contactForm);

      const who = nombre ? String(nombre.value || '').trim() : '';
      const mail = correo ? String(correo.value || '').trim() : '';
      const why = motivo ? String(motivo.value || '').trim() : '';

      contactForm.reset();
      toast('Mensaje enviado: ' + (who || 'Usuario') + ' (' + (mail || 'sin correo') + ') ' + (why ? '— ' + why : ''));
    });
  }

  function appendProductCard(grid, product) {
    const article = document.createElement('article');
    article.className = 'product-card';

    const tag = document.createElement('div');
    tag.className = 'product-tag';
    tag.textContent = product.tag;

    const img = document.createElement('img');
    img.className = 'product-image';
    img.alt = product.alt;
    img.src = product.image;

    const body = document.createElement('div');
    body.className = 'product-body';

    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = product.name;

    const meta = document.createElement('div');
    meta.className = 'product-meta';

    const stars = document.createElement('div');
    stars.className = 'stars';
    stars.setAttribute('aria-label', '5 de 5');
    stars.innerHTML = '<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>';

    const rating = document.createElement('div');
    rating.className = 'rating';
    rating.textContent = '(5.0)';

    meta.appendChild(stars);
    meta.appendChild(rating);

    const bottom = document.createElement('div');
    bottom.className = 'product-bottom';

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = formatMoney(product.price);

    const btn = document.createElement('button');
    btn.className = 'add-btn';
    btn.type = 'button';
    btn.innerHTML = '<i class="fa-solid fa-cart-shopping"></i><span>Agregar</span>';

    bottom.appendChild(price);
    bottom.appendChild(btn);

    body.appendChild(name);
    body.appendChild(meta);
    body.appendChild(bottom);

    article.appendChild(tag);
    article.appendChild(img);
    article.appendChild(body);
    grid.appendChild(article);
  }

  function seedMonsterHighProducts() {
    const grid = qs('.product-grid');
    if (!grid) return;
    if (grid.getAttribute('data-seeded') === '1') return;
    grid.setAttribute('data-seeded', '1');

    const characters = [
      { key: 'Draculaura', img: 'assets/draculaura.jpg' },
      { key: 'Clawdeen', img: 'assets/clawdeen.jpg' },
      { key: 'Frankie', img: 'assets/frankie.jpg' },
      { key: 'Lagoona', img: 'assets/lagoona.jpg' }
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
      '13 WISHES',
      'FRIGHTS, CAMERA, ACTION!',
      'SCARIS: CITY OF FRIGHTS',
      'POWER GHOULS',
      'HAUNTED',
      'BOO YORK, BOO YORK'
    ];

    let n = 0;
    for (let i = 0; i < lines.length; i++) {
      for (let c = 0; c < characters.length; c++) {
        n++;
        const base = 19.99 + ((i * 4 + c) % 17) * 1.25;
        appendProductCard(grid, {
          tag: 'Monster High',
          alt: 'Monster High Doll',
          image: characters[c].img,
          name: (characters[c].key + ' — ' + lines[i]).toUpperCase(),
          price: Number(base.toFixed(2))
        });
      }
    }

    while (n < 55) {
      const c = characters[n % characters.length];
      n++;
      appendProductCard(grid, {
        tag: 'Monster High',
        alt: 'Monster High Doll',
        image: c.img,
        name: (c.key + ' — COLLECTOR EDITION #' + n).toUpperCase(),
        price: Number((24.99 + (n % 11) * 1.75).toFixed(2))
      });
    }
  }

  seedMonsterHighProducts();

  qsa('.add-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const card = btn.closest('.product-card');
      const nameEl = card ? qs('.product-name', card) : null;
      const priceEl = card ? qs('.price', card) : null;
      const imgEl = card ? qs('img', card) : null;

      const name = nameEl ? nameEl.textContent.trim() : 'Producto';
      const price = priceEl ? Number(String(priceEl.textContent).replace(/[^0-9.]/g, '')) : 0;
      const image = imgEl ? imgEl.getAttribute('src') : '';

      const cart = getCart();
      const existing = cart.find(function (x) {
        return x && x.name === name;
      });
      if (existing) {
        existing.qty = (existing.qty || 1) + 1;
      } else {
        cart.push({ name: name, price: price, qty: 1, image: image });
      }
      setCart(cart);
      updateCartBadge();
      toast('Agregado al carrito.');
    });
  });

  const cartLink = qs('#cart-btn') || qs('.nav-actions a.pill[href="#carrito"]');
  if (cartLink) {
    cartLink.addEventListener('click', function (e) {
      e.preventDefault();
      showCart();
    });
  }

  const navToggle = qs('.nav-actions button.pill');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const nav = qs('.top-nav');
      if (!nav) return;
      const open = nav.classList.toggle('is-open');
      toast(open ? 'Navegación abierta.' : 'Navegación cerrada.');
    });
  }

  qsa('a.footer-link[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      toast('Sección en construcción.');
    });
  });

  updateCartBadge();
})();
