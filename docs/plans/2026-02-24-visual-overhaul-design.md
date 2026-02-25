# Visual Overhaul Design: "The Living Room"

**Date:** 2026-02-24
**Status:** Approved, ready for implementation planning

---

## Design Thesis

Lead with people and impact, not technology. The site should feel like a community gathering you'd want to show your non-technical friends — warm, human, story-forward, visually democratic. The word "Tech" should feel like a footnote to the actual mission.

This direction responds directly to a core community insight: the "Tech" and "hack night" framing has historically been intimidating, and the real hook is *what projects do for the community*. The redesign makes that the headline.

---

## Design System

### Color Tokens

| Token | Value | Use |
|---|---|---|
| `--color-ground` | `#FAF5EE` | Page background — warm linen |
| `--color-ink` | `#2C1810` | Body text — warm near-black |
| `--color-surface` | `#F0E8DA` | Cards, panels |
| `--color-border` | `#D9CCBA` | Dividers, outlines |
| `--color-sage` | `#6B8F71` | Primary actions, links, accents |
| `--color-sage-dark` | `#4A6650` | Hover states |
| `--color-clay` | `#B85C2C` | Secondary accent, emphasis, badges |
| `--color-plum` | `#3D2B3D` | Nav, hero overlays, deep contrast moments |
| `--color-mist` | `#E8F0EA` | Subtle sage-tinted callout backgrounds |

**Dark mode:** ground flips to `#1A1410`, surface to `#231C18`. Warmth carries through.

### Typography

**Display font:** [Fraunces](https://fonts.google.com/specimen/Fraunces) — variable optical-size serif. Warm, quirky, nothing like a tech company. Load from Google Fonts.

**Body font:** [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) — neutral, readable, friendly. Not Inter.

| Role | Font | Size | Weight/Style |
|---|---|---|---|
| Page hero | Fraunces | `clamp(3rem, 8vw, 6rem)` | 700, opsz 144 |
| Section heading | Fraunces | `clamp(1.75rem, 4vw, 2.75rem)` | 600, opsz 72 |
| Card title | Fraunces | `1.25rem` | 500, opsz 36 |
| Body | Instrument Sans | `1.0625rem` | 400 |
| Label/badge | Instrument Sans | `0.75rem` | 600, uppercase, tracked |
| Pull quote | Fraunces | `1.5rem` | 400 italic, opsz 144 |

### Shape & Spacing

- Base unit: `0.5rem` (8px)
- Cards: `border-radius: 1.25rem`
- Buttons: `border-radius: 100px` (pill)
- Card padding: `2rem` (generous, not cramped)
- Shadows: warm-tinted — `box-shadow: 0 4px 24px rgba(44, 24, 16, 0.08)`
- Subtle paper texture on `--color-ground` via SVG noise at ~3% opacity

---

## Homepage

**Structural shift:** Current homepage leads with upcoming events. New homepage leads with the community itself — people, stories, impact. Events become evidence of community, not the headline.

### Section 1 — "The Welcome" (full-viewport hero)

- `--color-plum` background with warm grain texture
- Right 2/3: portrait mosaic of ~9 community members (rounded squares, slightly overlapping, warm vignette)
- Left 1/3: headline + CTA

**Headline (Fraunces, 6rem, white):**
```
Toronto's civic
community,
building together.
```

**Subline (Instrument Sans, 1.1rem, warm white):**
```
We bring technologists, designers, and community advocates
together to work on the issues that matter.
No tech background required.
```

Two pill buttons: `Find your project →` (sage fill), `See what we're working on` (white outline).

### Section 2 — "What We're Actually Doing"

3-column editorial spread of featured projects. Each card:
- Impact category in clay, small caps: `HOUSING` / `TRANSIT` / `OPEN DATA`
- Project name in Fraunces at 1.5rem
- One human-impact sentence (not a tech description)
- Contributor count badge
- No tech stack mentioned

### Section 3 — "Voices"

Full-width horizontal pull-quote strip in `--color-mist`. Fades through 3 community member quotes. Attribution: name, neighbourhood, tenure in community.

### Section 4 — "Come As You Are"

Three article cards addressing the three hesitations from community feedback:

| Card 1 | Card 2 | Card 3 |
|---|---|---|
| "Not a developer?" | "New to Toronto?" | "Not sure where to start?" |
| We have designers, writers, researchers, and advocates who've never written a line of code. | Our community spans every neighbourhood and background. | Show up once. You'll figure out the rest together. |

Clay line icon above each. No jargon.

### Section 5 — Events Grid

Events now appear after community context is established. Cards feature:
- Date large in Fraunces, calendar tear-off style
- Event name
- Format badge (In-person / Online)
- "Add to calendar" link

### Footer

Deep plum background. Three columns: navigation, social links (Mastodon `rel=me` preserved), short community statement in Fraunces italic.

---

## Project Page

### Hero

Full-width impact banner in `--color-plum`:
- Project name in Fraunces at 4rem
- Human-impact sentence in warm white italic below

### Body Layout (magazine spread)

**Left column (2/3):** Prose description → project timeline as journal entries → photos with warm captions

**Right column (1/3):**
- "Who's building this" — contributor avatar cluster, links to person pages
- Status badge: `ACTIVE` (sage) or `LOOKING FOR HELP` (clay — this is a CTA)
- Tags prefixed with "This project touches:" framing
- Organisation links

**Bottom CTA:** Warm clay callout — "Want to contribute? Show up to the next meetup and introduce yourself." Links to next event.

---

## Person Page

- Large portrait in warm rounded square, left-aligned
- Name in Fraunces at 2.5rem, neighbourhood and community tenure alongside
- Social links as icon+label pairs
- Bio: first sentence in Fraunces pull-quote treatment, remainder in Instrument Sans
- "What [Name] is working on" — compact project cards leading with impact line
- "Where you'll find them" — attendance history as warm dot timeline grouped by year

---

## Event (Meetup) Page

- Date displayed as large calendar stamp (Fraunces, plum bg, white text), overlapping hero
- Title and description lead
- "Who's been coming" — avatar collage from past attendees at this venue/series
- Past events: "What happened" retrospective frame with masonry photo layout
- Venue card at bottom: static map, address, transit notes. Surface colour, rounded corners.

---

## Navigation

- Background: `--color-plum`, full width, not transparent
- Wordmark: "Civic Tech Toronto" in Fraunces, white — "Civic" and "Toronto" typographically larger than "Tech"
- Nav links: Instrument Sans, white, sage underline draws in from left on hover
- Mobile: full-screen plum drawer, large tap targets, community statement at drawer bottom

---

## Tag / Category Pages

Redesigned as topic landing pages:
- Short human description of what the tag means in community context
- Project/event grid below
- Sage callout with contributor invitation if tag is active

---

## Implementation Notes

- Replace Pico CSS CDN with a custom CSS file built on these design tokens
- Add Fraunces and Instrument Sans from Google Fonts (swap display for performance)
- Paper texture: generate a small SVG noise pattern, reference as CSS background-image
- Portrait mosaic on homepage: pull from `archives/images/` via jekyll_picture_tag
- All accessibility requirements maintained: skip links, semantic landmarks, colour contrast (verify sage and clay against ground and plum backgrounds)
- Dark mode: update CSS custom properties under `prefers-color-scheme: dark`
- Existing Jekyll collections, layouts, and data pipeline unchanged — this is a presentation layer overhaul only
