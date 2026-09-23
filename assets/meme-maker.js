/*
  <meme-maker>: the personalize-your-own-meme-shirt generator
  (sections/meme-composer.liquid).

  Meme images live in this theme (scripts/add-meme). The live preview is drawn
  here on a canvas with the SAME caption layout the API prints with
  (memeup-store apps/api/src/render/print-renderer.ts: layoutCaption +
  buildCaptionSvg), so what customers see is what gets printed. "Add to cart"
  asks the API to render the real 300 DPI print file from the meme's
  print-quality asset, then adds the line to the Shopify cart with the
  properties the orders/create webhook reads to send the order to Gelato.
*/
if (!customElements.get('meme-maker')) {
  // The API validates size/colour against these (packages/shared/src/design.ts).
  const SIZE_ALIASES = {
    s: 'S', small: 'S',
    m: 'M', medium: 'M',
    l: 'L', large: 'L',
    xl: 'XL', 'x-large': 'XL', 'extra large': 'XL',
    xxl: 'XXL', '2xl': 'XXL', 'xx-large': 'XXL',
  };
  const SEARCH_THRESHOLD = 12;
  const CAPTION_FONT = 'Anton';

  // Port of the API's layoutCaption(): greedy wrap + shrink-to-fit using the
  // same glyph-width approximation, so line breaks match the printed shirt.
  function layoutCaption(text, boxWidth, maxHeight, { maxFontSize, minFontSize, maxLines }) {
    const clean = text.trim().toUpperCase().replace(/\s+/g, ' ');
    if (!clean) return null;
    const words = clean.split(' ');
    const CHAR_W = 0.52;
    const LINE_H = 1.12;

    for (let fontSize = maxFontSize; fontSize >= minFontSize; fontSize -= 2) {
      const maxChars = Math.max(1, Math.floor(boxWidth / (fontSize * CHAR_W)));
      const lines = [];
      let current = '';
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length <= maxChars || !current) current = candidate;
        else {
          lines.push(current);
          current = word;
        }
      }
      if (current) lines.push(current);
      const fits =
        lines.length <= maxLines &&
        lines.every((l) => l.length <= maxChars || l.split(' ').length === 1) &&
        lines.length * fontSize * LINE_H <= maxHeight;
      if (fits) return { lines, fontSize, lineHeight: fontSize * LINE_H };
    }

    const fontSize = minFontSize;
    const maxChars = Math.max(1, Math.floor(boxWidth / (fontSize * CHAR_W)));
    const lines = [];
    for (let i = 0; i < clean.length && lines.length < maxLines; i += maxChars) {
      lines.push(clean.slice(i, i + maxChars));
    }
    return { lines, fontSize, lineHeight: fontSize * LINE_H };
  }

  // Port of the API's buildCaptionSvg() geometry, drawn onto a canvas.
  function drawMeme(ctx, image, width, height, topText, bottomText) {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    const margin = Math.round(height * 0.04);
    const maxFontSize = Math.round(width * 0.14);
    const minFontSize = Math.max(12, Math.round(width * 0.035));
    const strokeWidth = Math.max(2, Math.round(maxFontSize * 0.06));
    const opts = { maxFontSize, minFontSize, maxLines: 3 };

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';

    const paint = (layout, firstBaseline) => {
      ctx.font = `${layout.fontSize}px ${CAPTION_FONT}, Impact, sans-serif`;
      let y = firstBaseline;
      for (const line of layout.lines) {
        // paint-order: stroke fill
        ctx.strokeText(line, width / 2, y);
        ctx.fillText(line, width / 2, y);
        y += layout.lineHeight;
      }
    };

    const top = layoutCaption(topText, width - margin * 2, height * 0.42, opts);
    if (top) paint(top, margin + top.fontSize);
    const bottom = layoutCaption(bottomText, width - margin * 2, height * 0.42, opts);
    if (bottom) paint(bottom, height - margin - (bottom.lines.length - 1) * bottom.lineHeight);
  }

  class MemeMaker extends HTMLElement {
    connectedCallback() {
      this.api = (this.dataset.apiUrl || '').replace(/\/+$/, '');
      this.assetOrigin = this.dataset.assetOrigin || window.location.origin;
      this.memes = this.parse(this.dataset.memes);
      this.variants = this.parse(this.dataset.variants);

      this.grid = this.querySelector('[data-templates-grid]');
      this.search = this.querySelector('[data-search]');
      this.topInput = this.querySelector('[data-top]');
      this.bottomInput = this.querySelector('[data-bottom]');
      this.canvas = this.querySelector('[data-preview]');
      this.placeholder = this.querySelector('[data-placeholder]');
      this.shirt = this.querySelector('[data-shirt]');
      this.submit = this.querySelector('[data-submit]');
      this.status = this.querySelector('[data-status]');

      this.template = null;
      this.image = null;
      this.busy = false;

      const onText = () => {
        this.draw();
        this.refresh();
      };
      this.topInput.addEventListener('input', onText);
      this.bottomInput.addEventListener('input', onText);
      this.search.addEventListener('input', () => this.filterTemplates());
      this.querySelectorAll('[data-option]').forEach((input) =>
        input.addEventListener('change', () => this.refresh())
      );
      this.submit.addEventListener('click', () => this.addToCart());

      // Captions are drawn with Anton: redraw once it has loaded.
      document.fonts?.load(`40px ${CAPTION_FONT}`).then(() => this.draw());

      this.renderTemplates();
      this.refresh();
    }

    parse(json) {
      try {
        return JSON.parse(json || '[]');
      } catch {
        return [];
      }
    }

    absolute(url) {
      return new URL(url, this.assetOrigin).href;
    }

    renderTemplates() {
      this.grid.textContent = '';
      if (!this.memes.length) {
        this.grid.innerHTML =
          '<p class="memeup-bubble-meta">no memes yet &mdash; add some with scripts/add-meme</p>';
        return;
      }
      for (const meme of this.memes) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'meme-maker__template';
        button.dataset.id = meme.id;
        button.dataset.name = meme.name.toLowerCase();
        button.setAttribute('aria-pressed', 'false');
        button.title = meme.name;

        const img = document.createElement('img');
        img.src = meme.thumb;
        img.alt = meme.name;
        img.loading = 'lazy';
        img.width = 120;
        img.height = 120;
        button.append(img);

        button.addEventListener('click', () => this.selectTemplate(meme, button));
        this.grid.append(button);
      }
      this.search.hidden = this.memes.length <= SEARCH_THRESHOLD;
    }

    filterTemplates() {
      const q = this.search.value.trim().toLowerCase();
      this.grid.querySelectorAll('.meme-maker__template').forEach((button) => {
        button.hidden = q !== '' && !button.dataset.name.includes(q) && !button.dataset.id.includes(q);
      });
    }

    selectTemplate(meme, button) {
      this.template = meme;
      this.grid
        .querySelectorAll('.meme-maker__template')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));

      this.shirt.classList.add('is-loading');
      const image = new Image();
      image.onload = () => {
        if (this.template !== meme) return; // a newer pick won
        this.image = image;
        this.shirt.classList.remove('is-loading');
        this.draw();
      };
      image.onerror = () => {
        this.shirt.classList.remove('is-loading');
        this.setStatus("Couldn't load that meme. Try another one.", 'error');
      };
      image.src = meme.preview;

      this.refresh();
      if (!this.topInput.value && !this.bottomInput.value) this.topInput.focus({ preventScroll: true });
    }

    draw() {
      if (!this.image || !this.template) return;
      const width = this.image.naturalWidth;
      const height = this.image.naturalHeight;
      if (this.canvas.width !== width) this.canvas.width = width;
      if (this.canvas.height !== height) this.canvas.height = height;
      const top = this.topInput.value;
      const bottom = this.bottomInput.value;
      drawMeme(this.canvas.getContext('2d'), this.image, width, height, top, bottom);
      this.canvas.setAttribute(
        'aria-label',
        `Preview: ${this.template.name}${top ? `, "${top}"` : ''}${bottom ? `, "${bottom}"` : ''}`
      );
      this.canvas.hidden = false;
      this.placeholder.hidden = true;
    }

    selected(option) {
      return this.querySelector(`[data-option="${option}"]:checked`)?.value ?? null;
    }

    currentVariant() {
      const size = this.selected('size');
      const color = this.selected('color');
      return (
        this.variants.find(
          (v) => (v.size === null || v.size === size) && (v.color === null || v.color === color)
        ) || null
      );
    }

    refresh() {
      const color = this.selected('color');
      if (color) this.shirt.dataset.shirtColor = color.toLowerCase();

      const variant = this.currentVariant();
      const hasText = this.topInput.value.trim() || this.bottomInput.value.trim();
      let label = 'add to cart';
      if (!this.template) label = 'pick a meme first';
      else if (!hasText) label = 'write your caption';
      else if (!variant || !variant.available) label = 'sold out in this size/colour';

      if (!this.busy) {
        this.submit.textContent = label;
        this.submit.disabled = label !== 'add to cart';
      }
    }

    setStatus(message, kind = '') {
      this.status.textContent = message;
      this.status.className = `meme-maker__status${kind ? ` is-${kind}` : ''}`;
    }

    async addToCart() {
      const variant = this.currentVariant();
      if (this.busy || !this.template || !variant) return;

      const rawSize = variant.size ?? 'M';
      const size = SIZE_ALIASES[rawSize.trim().toLowerCase()] ?? rawSize.trim().toUpperCase();
      const color = (variant.color ?? 'white').trim().toLowerCase();
      const topText = this.topInput.value.trim();
      const bottomText = this.bottomInput.value.trim();

      this.busy = true;
      this.submit.disabled = true;
      this.submit.textContent = 'printing your meme…';
      this.setStatus('');

      try {
        // 1. Render the real print file from the meme's print-quality asset.
        const designRes = await fetch(`${this.api}/designs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: this.template.id,
            templateUrl: this.absolute(this.template.print),
            topText,
            bottomText,
            size,
            color,
          }),
        });
        const design = await designRes.json().catch(() => ({}));
        if (!designRes.ok || !design.printFileUrl) {
          console.error('meme-maker: /designs failed', designRes.status, design);
          throw new Error(
            design.error === 'unknown_template'
              ? "This meme can't be printed yet. Pick another one!"
              : "We couldn't prepare your print file. Try again in a moment."
          );
        }

        // 2. Add to the Shopify cart (same response shape Dawn's product form uses).
        this.submit.textContent = 'adding to cart…';
        const cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        const body = {
          id: variant.id,
          quantity: 1,
          properties: { templateId: this.template.id, topText, bottomText, printFileUrl: design.printFileUrl, size, color },
        };
        if (cart) {
          body.sections = cart.getSectionsToRender().map((s) => s.id);
          body.sections_url = window.location.pathname;
          cart.setActiveElement?.(this.submit);
        }
        const cartRes = await fetch(`${window.routes?.cart_add_url || '/cart/add'}.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body),
        });
        const cartData = await cartRes.json();
        if (!cartRes.ok || cartData.status) {
          console.error('meme-maker: cart add failed', cartData);
          throw new Error(cartData.description || "Couldn't add it to your cart. Try again.");
        }

        if (typeof publish === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
          publish(PUB_SUB_EVENTS.cartUpdate, { source: 'meme-maker', productVariantId: variant.id, cartData });
        }
        if (cart) {
          cart.renderContents(cartData);
          this.setStatus('in your cart! make another one?', 'ok');
        } else {
          window.location = window.routes?.cart_url || '/cart';
        }
      } catch (err) {
        this.setStatus(err.message || 'Something went wrong. Try again.', 'error');
      } finally {
        this.busy = false;
        this.refresh();
      }
    }
  }

  customElements.define('meme-maker', MemeMaker);
}
