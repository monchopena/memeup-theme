---
version: 1
slug: "storefront"
primary_target: "storefront"
related_targets: []
---

# Storefront surface brief

Mode: Persuade (with Operate-grade clarity required in cart/checkout-adjacent
moments). Scope: whole storefront — homepage, collection grid, standard
product page, personalized "build your own meme shirt" product page, cart and
cart drawer. All share one committed visual world.

Audience/job: young, terminally-online, impulse buyers arriving cold from
TikTok/Instagram. Job: decide this is funny/legit in seconds, then either grab
a ready-made shirt or caption their own meme, fast.

Proof/content: no real meme artwork, product photography, or logo exist yet.
Build with clearly-fake placeholder meme captions/imagery (never a real,
recognizable copyrighted meme presented as final) and label them as
placeholders for the user to replace with real memes/photography.

Constraints: two product paths must feel like one brand (ready-made vs.
personalize-your-own). The personalized PDP must reserve an obvious mount
point/section for a third-party embedded widget (out of scope to build here).
Cart/cart-drawer must legibly show custom line-item properties (template name,
top/bottom caption) for personalized orders. Standard ecommerce accessibility
(contrast, keyboard/focus, alt text) holds throughout.

## Direction contract

THESIS: memeup is not a shop with a chat widget bolted on — the entire store
IS a group chat, and buying a shirt is sending a message. This refuses the
category default of "meme graphics printed over a normal DTC shirt-shop
template," and its predictable opposite, a generic embedded chat-support
skin over an unchanged storefront.

OWN-WORLD: iMessage/WhatsApp bubble grammar as the page's structural grammar,
not a decoration. Two speaker lanes: "memeup" (left, neutral/light bubbles)
and "you" (right, one saturated hot accent color — a single committed color,
30-60% coverage on the right lane and every primary action). Product cards
are message bubbles with rounded-rect tails; timestamps and delivery
ticks (sent / delivered / read) are repurposed as freshness and stock
signals ("seen by 2.3k", "read", low-stock "typing…"/"only 3 left"). Sans
display face with real personality for bubble text and headlines (not a
system-UI default), monospace for timestamps/meta/SKU-style labels. Rounded
bubble geometry throughout — buttons, inputs, product tiles, price tags —
never sharp DTC-fashion rectangles. Screenshot-of-a-screenshot grain (subtle
noise/scan texture) keeps it from reading as a sanitized chat-commerce
template.

STORY: visitor lands mid-thread, scrolling a chat that's clearly already
"popping off" (drop announcements, sold-out call-outs, a friend's reaction)
— believes instantly this is unhinged/funny enough to screenshot. They tap a
bubble (product) to open it full-screen inside the same thread metaphor,
either "reply" (add ready-made shirt to cart) or open the personalize
composer (a literal message-compose bar where they type their own top/bottom
caption and watch a live preview render as a bubble). Cart is the running
thread of what they're about to send/buy; checkout is the thread going quiet
after the last message.

FIRST VIEWPORT: full-bleed chat thread, no traditional hero banner. Top chrome
is a slim "contact header" (memeup name/avatar + online-dot). Immediately
below, 2-4 real product bubbles are already "in the conversation," left/right
alternating, the newest (bottom) bubble mid-animation as if just delivered,
with a persistent floating compose bar pinned at the bottom of the viewport
as the primary action ("start your own meme…") sitting above the fold on
first paint.

FORM: pick card "The Group Chat" (kicker IMPECCABLE'S PICK) from the
persuade direction round, seed key 6ff25fc4 (assigned index 3 was "The
Feed"/imageboard; user locked the pick over the assignment and two other
full alternates — "The Feed" and "The Gig Poster Drop"). Raises carried
into this world: from "The Feed" (declined against this pick) — reply-chain
numbering donates SKU-as-post-ID microcopy for standard (non-chat) product
metadata; from the doujin-catalog challenger — a picked/selected product
gets a hand-drawn circle/mark, reused here as the "added to cart" state on a
bubble; from the darkroom-safelight challenger — the personalize flow's
print-file render is staged as a brief "…" typing-style delay before the
finished custom bubble "arrives," rather than an instant swap.

FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance.
