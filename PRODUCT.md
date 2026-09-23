# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Young, internet-native, meme-culture shoppers (Gen Z / "terminally online") who
discover memeup shirts via social feeds (TikTok/Instagram) and buy on impulse.
They're buying to represent a meme/format they already find funny, or to make
someone else laugh — not conventional fashion shoppers browsing deliberately.

## Product Purpose

memeup sells meme-print t-shirts as print-on-demand merchandise, fulfilled
through Gelato. Two purchase paths exist:

1. **Ready-made** — pre-designed meme shirts, browsed and bought like a normal
   catalog.
2. **Personalize-your-own** — the buyer picks a meme template, writes their own
   top/bottom caption in the classic meme format, previews it live, and orders
   a shirt printed with their exact version.

## Positioning

Not a generic print-on-demand tee shop skinned with jokes — meme culture is the
product mechanic itself. The caption/template format is the merchandise, and a
buyer can author their own version of a meme rather than only buying someone
else's finished design. Generic "funny shirt" competitors only offer path 1.

## Operating Context

- The storefront is this repo: a Shopify theme (Liquid, forked from Dawn),
  deployed via Shopify CLI + a GitHub Actions workflow that pushes `main` to
  the live theme.
- **Ready-made products** are normal Shopify products/variants, listed and
  fulfilled automatically by Gelato's native Shopify sales-channel app.
  Standard product/collection browsing applies to these.
- **The personalized product** uses the `product.memeup-personalize`
  template, whose "Meme maker" section (`sections/meme-composer.liquid` +
  `assets/meme-maker.js`) is the whole generator, built into this theme:
  template picker, top/bottom captions, live memegen preview on a shirt
  mock-up, size/colour from the product's own variants. "Add to cart" calls
  the sibling `memeup-store` API (`POST /designs`) to render the 300 DPI print
  file, then `/cart/add.js` with line-item properties (`templateId`,
  `topText`, `bottomText`, `printFileUrl`, `size`, `color`) that the API's
  `orders/create` webhook reads to create the Gelato order.
- Because the personalized product's cart line carries custom properties, the
  cart and cart drawer need to render them legibly (template/caption), not
  just title, variant and price.

## Capabilities and Constraints

- The theme must support two distinct product-page experiences from the same
  design system: a standard PDP for ready-made shirts, and a "build your own
  meme shirt" PDP with an embedded third-party widget mount point (the widget
  itself is out of scope for this repo).
- Cart/cart-drawer line items must have room to show meme template name and
  top/bottom caption text for personalized orders.
- No confirmed product photography, meme artwork, or finished shirt mockups
  exist yet. Any meme imagery used while designing/building is placeholder and
  must read as clearly disposable/example content, never presented as a real,
  final meme or finished brand artwork.
- No stated compliance or legal-copy constraints beyond normal ecommerce
  requirements (returns, shipping, sizing info).

## Brand Commitments

Name: "memeup". No logo, color palette, typography, or other identity assets
are locked in yet — fully open for this redesign.

## Evidence on Hand

None. No real product photos, finished meme designs, logo, or brand assets
exist yet. Placeholder/example memes used during design must not imply real,
final artwork.

## Product Principles

1. The meme format is the product, not decoration — caption/template mechanics
   are first-class UI, not a bolted-on customizer.
2. Impulse-buy first — key pages must read and convert from a single
   scroll-stopping glance, since most traffic arrives cold from social feeds.
3. Loud and chaotic in surface, never in usability — checkout, cart, and the
   personalization flow stay fast and clear even as the visual language goes
   maximalist.
4. Two product paths, one coherent brand — ready-made and
   personalize-your-own must feel like the same store, not two shops bolted
   together.

## Accessibility & Inclusion

No product-specific requirement was stated; default to standard ecommerce
accessibility practice (contrast, keyboard/focus states, alt text). The
high-contrast, bold-type direction called for here is compatible with that
baseline.
