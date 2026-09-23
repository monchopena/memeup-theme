/*
  <meme-maker>: the personalize-your-own-meme-shirt generator
  (sections/meme-composer.liquid).

  memegen supplies the template list and PREVIEW images only. "Add to cart"
  asks the memeup API to render the real 300 DPI print file, then adds the
  line to the Shopify cart with the properties the orders/create webhook
  reads to send the order to Gelato.
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
  const PREVIEW_DEBOUNCE_MS = 350;
  const SEARCH_THRESHOLD = 12;

  // memegen path-segment escaping, https://memegen.link/#special-characters
  const encodeSegment = (text) => {
    const t = text.trim();
    if (!t) return '_';
    return t
      .replace(/_/g, '__')
      .replace(/-/g, '--')
      .replace(/ /g, '_')
      .replace(/\?/g, '~q')
      .replace(/&/g, '~a')
      .replace(/%/g, '~p')
      .replace(/#/g, '~h')
      .replace(/\//g, '~s')
      .replace(/\\/g, '~b')
      .replace(/</g, '~l')
      .replace(/>/g, '~g')
      .replace(/"/g, "''");
  };

  class MemeMaker extends HTMLElement {
    connectedCallback() {
      this.memegen = (this.dataset.memegenUrl || '').replace(/\/+$/, '');
      this.api = (this.dataset.apiUrl || '').replace(/\/+$/, '');
      this.allowed = (this.dataset.templates || '')
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean);
      try {
        this.variants = JSON.parse(this.dataset.variants || '[]');
      } catch {
        this.variants = [];
      }

      this.grid = this.querySelector('[data-templates-grid]');
      this.search = this.querySelector('[data-search]');
      this.topInput = this.querySelector('[data-top]');
      this.bottomInput = this.querySelector('[data-bottom]');
      this.preview = this.querySelector('[data-preview]');
      this.placeholder = this.querySelector('[data-placeholder]');
      this.shirt = this.querySelector('[data-shirt]');
      this.submit = this.querySelector('[data-submit]');
      this.status = this.querySelector('[data-status]');

      this.template = null;
      this.busy = false;

      const onText = () => {
        this.schedulePreview();
        this.refresh();
      };
      this.topInput.addEventListener('input', onText);
      this.bottomInput.addEventListener('input', onText);
      this.search.addEventListener('input', () => this.filterTemplates());
      this.querySelectorAll('[data-option]').forEach((input) =>
        input.addEventListener('change', () => this.refresh())
      );
      this.preview.addEventListener('load', () => this.shirt.classList.remove('is-loading'));
      this.preview.addEventListener('error', () => this.shirt.classList.remove('is-loading'));
      this.submit.addEventListener('click', () => this.addToCart());

      this.loadTemplates();
      this.refresh();
    }

    async loadTemplates() {
      try {
        const res = await fetch(`${this.memegen}/templates/`);
        if (!res.ok) throw new Error(`memegen ${res.status}`);
        let list = await res.json();
        if (this.allowed.length) {
          const byId = new Map(list.map((t) => [t.id, t]));
          list = this.allowed.map((id) => byId.get(id)).filter(Boolean);
        }
        this.renderTemplates(list);
      } catch (err) {
        console.error('meme-maker: could not load templates', err);
        this.grid.innerHTML =
          '<p class="meme-maker__status is-error">Memes are taking a nap. Refresh the page in a minute.</p>';
      }
    }

    renderTemplates(list) {
      this.grid.textContent = '';
      for (const t of list) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'meme-maker__template';
        button.dataset.id = t.id;
        button.dataset.name = (t.name || t.id).toLowerCase();
        button.setAttribute('aria-pressed', 'false');
        button.title = t.name || t.id;

        const img = document.createElement('img');
        img.src = `${this.memegen}/images/${encodeURIComponent(t.id)}.jpg?width=200`;
        img.alt = t.name || t.id;
        img.loading = 'lazy';
        img.width = 100;
        img.height = 100;
        button.append(img);

        button.addEventListener('click', () => this.selectTemplate(t, button));
        this.grid.append(button);
      }
      this.search.hidden = list.length <= SEARCH_THRESHOLD;
    }

    filterTemplates() {
      const q = this.search.value.trim().toLowerCase();
      this.grid.querySelectorAll('.meme-maker__template').forEach((button) => {
        button.hidden = q !== '' && !button.dataset.name.includes(q) && !button.dataset.id.includes(q);
      });
    }

    selectTemplate(template, button) {
      this.template = template;
      this.grid
        .querySelectorAll('.meme-maker__template')
        .forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      this.updatePreview();
      this.refresh();
      if (!this.topInput.value && !this.bottomInput.value) this.topInput.focus({ preventScroll: true });
    }

    schedulePreview() {
      clearTimeout(this.previewTimer);
      this.previewTimer = setTimeout(() => this.updatePreview(), PREVIEW_DEBOUNCE_MS);
    }

    updatePreview() {
      if (!this.template) return;
      const id = encodeURIComponent(this.template.id);
      const top = this.topInput.value;
      const bottom = this.bottomInput.value;
      const path =
        top.trim() || bottom.trim()
          ? `/images/${id}/${encodeURIComponent(encodeSegment(top))}/${encodeURIComponent(encodeSegment(bottom))}.jpg`
          : `/images/${id}.jpg`;
      const src = `${this.memegen}${path}?width=700`;
      if (this.preview.src === src) return;
      this.shirt.classList.add('is-loading');
      this.preview.src = src;
      this.preview.alt = `Preview: ${this.template.name || this.template.id}${top ? `, "${top}"` : ''}${
        bottom ? `, "${bottom}"` : ''
      }`;
      this.preview.hidden = false;
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
        // 1. Render the real print file.
        const designRes = await fetch(`${this.api}/designs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: this.template.id, topText, bottomText, size, color }),
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
