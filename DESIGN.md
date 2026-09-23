---
name: memeup
description: A meme t-shirt storefront built as a living group chat
colors:
  acid-lime: "#C6FF3D"
  blackout-green: "#0B1F06"
  near-black: "#0C0C10"
  charcoal: "#1E1E26"
  off-white: "#F5F5F7"
  dim-gray: "#9A9AA6"
  hot-pink: "#FF5470"
  signal-green: "#3DDC59"
typography:
  display:
    fontFamily: "Bagel Fat One, ui-rounded, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Hanken Grotesk, -apple-system, BlinkMacSystemFont, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontWeight: 500
    letterSpacing: "0.02em"
  meme-caption:
    fontFamily: "Anton, Impact, sans-serif"
    fontWeight: 400
    letterSpacing: "normal"
rounded:
  bubble: "22px"
  bubble-sm: "14px"
  tail: "6px"
  pill: "999px"
  input: "24px"
spacing:
  section: "56px"
  bubble-gap: "14px"
components:
  button-primary:
    backgroundColor: "{colors.acid-lime}"
    textColor: "{colors.blackout-green}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.acid-lime}"
    textColor: "{colors.blackout-green}"
  chat-bubble-them:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.bubble}"
  chat-bubble-you:
    backgroundColor: "{colors.acid-lime}"
    textColor: "{colors.blackout-green}"
    rounded: "{rounded.bubble}"
---

# Design System: memeup

## Overview

**Creative North Star: "The Group Chat"**

memeup's storefront is not a shop with a chat bubble bolted on for support —
the entire store IS a group chat, and buying a shirt is sending a message.
Product cards are message bubbles alternating left ("memeup") and right
("you") down the page. Timestamps and delivery ticks are repurposed as
freshness and social-proof signals. The personalize-your-own-meme flow is a
literal message-compose bar. Checkout is the thread going quiet.

The world is built for impulse buyers arriving cold from TikTok/Instagram at
night — screen-bright, thumb-driven, expecting something screenshot-worthy
within the first viewport. It rejects two failure modes equally: the
sanitized minimal-DTC-fashion-site look (too clean, no personality) and
forced "random-brand" quirk — comic-sans jokes and confetti — which reads as
corporate cosplay of chaos rather than the real thing.

The accent color is acid lime, chosen because it re-appropriates the
"green bubble" stigma of SMS-vs-iMessage culture — a genuine meme/internet
in-joke — rather than reaching for a generic Gen-Z hot pink or purple.

**Key Characteristics:**
- Structure IS metaphor: bubbles, lanes, and a compose bar are the actual
  information architecture, not decoration over a standard grid.
- Dark-by-default: the "phone screen at night" scene is the justification,
  not an aesthetic default.
- One committed accent (acid lime) used sparingly and specifically — only
  for "you"/primary-action elements — never scattered as generic highlight.
- Data reads as data: timestamps, prices, and SKUs are set in monospace.

## Colors

A near-black chat surface with one loud, single-purpose accent; nothing else
competes with it.

### Primary
- **Acid Lime** (`#C6FF3D`): every primary action (buttons, add-to-cart,
  compose-bar send), the "you" speaker lane, and the cart badge. Reserved —
  never used for decoration or a second, competing accent.

### Secondary
- **Hot Pink** (`#FF5470`): sale/urgent badges only (the one place a second
  saturated color is allowed, because it needs to compete visually with the
  lime for attention on a live drop).

### Neutral
- **Near-Black** (`#0C0C10`): page background, dark by default because the
  use scene is a phone screen at night, not a category default.
- **Charcoal** (`#1E1E26`): "them" bubbles, product cards, cart items —
  every raised chat-thread surface.
- **Off-White** (`#F5F5F7`): body text, "them" bubble text.
- **Dim Gray** (`#9A9AA6`): timestamps, meta lines, muted microcopy.
- **Signal Green** (`#3DDC59`): the header's "online now" status dot only —
  deliberately distinct from the lime accent so it reads as its own signal,
  not a second brand color.

### Named Rules
**The One Lane Rule.** Acid lime marks exactly one thing: the "you"/primary
action. It never appears as a generic highlight, link color, or decorative
accent — if something needs a second color, it's hot pink (urgency) or it
stays neutral.

## Typography

**Display Font:** Bagel Fat One (with ui-rounded, system-ui fallback)
**Body Font:** Hanken Grotesk (with -apple-system fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** A chunky, rounded bubble-letter display face paired with a
clean, humane grotesk body — the chrome feels like a sticker, the reading
text stays fast and legible. Bagel Fat One is deliberately distinct from
**Anton** (Impact-style caps), which is reserved exclusively for the actual
meme captions rendered inside product artwork — the site's own chrome never
borrows the meme format's literal typography, keeping "the app" and "the
memes inside it" visually separate.

### Hierarchy
- **Display** (400, page/section headings): Bagel Fat One, used for h1–h6
  and the chat thread's own heading voice.
- **Body** (400, 1.6rem): Hanken Grotesk, all reading text and UI labels.
- **Label/Mono** (500, 1.1–1.2rem, +0.02em tracking): JetBrains Mono, for
  timestamps, "read"/"seen by" signals, SKUs, and prices — anything that
  reads as data.

### Named Rules
**The Meme-Font-Stays-In-The-Meme Rule.** Anton/Impact-style lettering never
appears in site chrome (nav, buttons, headings). It exists only inside
rendered meme artwork, where it's the product's own authentic typography,
not a design-system display face.

## Layout

Page width follows Dawn's standard container (1200px). The chat thread hero
constrains to a narrower 62rem reading column, centered, so bubbles read at
a believable messaging-app width rather than stretching edge-to-edge on
desktop. Section spacing increased from Dawn's default 0px to 56px for real
separation between the thread, the product grid, and the footer. Product
grid items alternate an 8% inline offset (odd cards inset from the end,
even cards inset from the start) so the collection grid itself reads as
alternating speaker lanes, not a uniform grid.

## Elevation & Depth

Flat-by-default surfaces (bubbles, cards) with one soft, offset shadow used
specifically for "floating" elements: product cards and the sticky compose
bar. No flat block shadows.

**Neon exception.** Acid-lime glow is reserved for the header wordmark (a lit
neon sign, `--memeup-neon-glow`, flickers on once, static under reduced
motion) and as a hover state on primary buttons and product cards. Nothing
glows at rest except the logo.

### Shadow Vocabulary
- **Card float** (`0 8px 24px rgba(0,0,0,0.2)`, via card_shadow settings):
  product cards and collection cards.
- **Compose bar lift** (`0 12px 32px rgba(0,0,0,0.35)`): the sticky
  homepage compose bar, deliberately heavier since it floats over content.

## Shapes

Every interactive surface is a bubble: large, soft corner radii (22px
cards/bubbles, 999px pills for buttons and the compose bar, 24px inputs),
each with one corner pulled in to 6px on the side nearest its "speaker" to
read as a chat-bubble tail (bottom-left for "them", bottom-right for
"you"). Nothing in this world uses sharp rectangular corners — that's the
minimal-DTC-fashion look this system explicitly refuses.

## Components

### Buttons
- **Shape:** full pill (999px radius).
- **Primary:** acid lime background, blackout-green text, bold weight, a
  hand-drawn-feeling paper-plane "send" icon on the main add-to-cart action.
- **Hover / Focus:** lifts 2px with a subtle scale-up (1.01), settles back on
  press (0.98 scale). Focus-visible ring is acid lime, offset 2px.

### Cards (product bubbles)
- **Corner Style:** 22px radius, alternating a bottom-left or accent-ring
  treatment per grid position to read as alternating speaker lanes.
- **Background:** charcoal.
- **Shadow Strategy:** card float (see Elevation).
- **Meta line:** a monospace "sent Xm ago · [signal]" line above the title
  — decorative, aria-hidden, deterministic per product id (not live data
  yet; wire to real analytics or remove once real data exists).

### Inputs / Fields
- **Style:** 24px radius, 1px low-opacity border, no shadow at rest.
- **Focus:** acid lime caret and focus-visible ring.

### The Compose Bar (signature component)
A full pill, sticky at the bottom of the viewport on the homepage hero and
(on mobile) the product page buy box — visually identical to a messaging
app's text-compose field, with a circular acid-lime "send" button standing
in for "add to cart" / "start your own meme." This is the single component
that most carries the whole metaphor and should not be diluted into a
plain button elsewhere.

### Cart / Thread
- **Style:** each line item is a full bubble (charcoal, 22px radius, 6px
  tail) rather than a table row; custom line-item properties (meme
  template, top/bottom caption) render as monospace key\:value pairs
  inside the bubble. The internal fulfillment-only `printFileUrl` property
  is filtered out of the customer-facing view.
- **Empty state:** "No messages yet" / "Back to the chat" — never the
  generic "Your cart is empty."

## Do's and Don'ts

### Do:
- **Do** keep acid lime to exactly one role (primary action / "you" lane)
  per the One Lane Rule.
- **Do** set timestamps, prices, and SKUs in JetBrains Mono.
- **Do** give every bubble-shaped element a tail (one corner at 6px) instead
  of a uniform radius.
- **Do** keep Anton/Impact-style type confined to meme artwork, never site
  chrome, per the Meme-Font-Stays-In-The-Meme Rule.

### Don't:
- **Don't** introduce a second bright accent color competing with acid lime
  outside the hot-pink urgency role.
- **Don't** use sharp rectangular corners anywhere in this system.
- **Don't** present the bubble-meta signal line (seen-by/read counts) as
  real analytics without wiring it to actual data — it's illustrative
  placeholder copy today.
- **Don't** let expressive chat-bubble styling override real product
  states (sold out, unavailable) — those stay in plain, unambiguous
  language and full contrast.
