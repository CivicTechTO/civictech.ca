# "The Living Room" Visual Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Pico CSS "Pumpkin" theme with a custom warm, human-centred design system ("The Living Room") that leads with community and impact rather than technology.

**Architecture:** Keep Pico CSS as the structural/reset base (swap to its unstyled `pico.classless.min.css`), then apply our own `living-room.css` which maps warm design tokens onto Pico's CSS variable names and adds all custom components. Template HTML is updated to support the new component classes and layout structures. The Jekyll collections, data pipeline, and `_data/` files are untouched.

**Tech Stack:** Jekyll 4, vanilla CSS (no build step), Google Fonts (Fraunces + Instrument Sans), SVG noise texture. Run `make serve` to test locally at http://localhost:4000.

---

## Verification approach

There is no automated test suite. After each task, run:

```bash
make serve
```

Then open http://localhost:4000 and verify the visual checklist listed in each task. Stop and fix before committing if something looks wrong.

---

### Task 1: Swap Pico theme & wire up new stylesheet

**Files:**
- Modify: `_layouts/base.html`
- Create: `assets/css/living-room.css`

**Step 1: Update base.html**

Replace the single Pico CDN line and the custom.css link with:

```html
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">
  <!-- Pico (structure/reset only, no color theme) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css" />
  <!-- Living Room design system -->
  <link rel="stylesheet" href="{{ site.baseurl }}/assets/css/living-room.css" />
```

Remove the old lines:
```html
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.pumpkin.min.css" />
  <link rel="stylesheet" href="{{ site.baseurl }}/assets/css/custom.css" />
```

**Step 2: Create assets/css/living-room.css with design tokens only**

```css
/* ==========================================================================
   LIVING ROOM — Design System for civictech.ca
   ==========================================================================
   TABLE OF CONTENTS
   01. Design Tokens (CSS Custom Properties)
   02. Pico Variable Overrides
   03. Base Typography
   04. Noise Texture
   ========================================================================== */

/* === 01. Design Tokens === */

:root {
  --color-ground:      #FAF5EE;
  --color-ink:         #2C1810;
  --color-surface:     #F0E8DA;
  --color-border:      #D9CCBA;
  --color-sage:        #6B8F71;
  --color-sage-dark:   #4A6650;
  --color-clay:        #B85C2C;
  --color-clay-dark:   #8F3E18;
  --color-plum:        #3D2B3D;
  --color-plum-light:  #5C3F5C;
  --color-mist:        #E8F0EA;

  --font-display: 'Fraunces', Georgia, serif;
  --font-body:    'Instrument Sans', system-ui, sans-serif;

  --radius-card:   1.25rem;
  --radius-button: 100px;
  --radius-small:  0.5rem;

  --shadow-warm: 0 4px 24px rgba(44, 24, 16, 0.08);
  --shadow-warm-lg: 0 8px 48px rgba(44, 24, 16, 0.12);
}

/* === 02. Pico Variable Overrides (Light Mode) === */

:root,
[data-theme="light"] {
  --pico-background-color:        var(--color-ground);
  --pico-color:                   var(--color-ink);
  --pico-card-background-color:   var(--color-surface);
  --pico-card-border-color:       var(--color-border);
  --pico-muted-background-color:  var(--color-surface);
  --pico-muted-border-color:      var(--color-border);
  --pico-muted-color:             #7A6255;

  --pico-primary:                    var(--color-sage);
  --pico-primary-background:         var(--color-sage);
  --pico-primary-border:             var(--color-sage);
  --pico-primary-hover-background:   var(--color-sage-dark);
  --pico-primary-hover-border:       var(--color-sage-dark);
  --pico-primary-inverse:            #ffffff;
  --pico-primary-inverse-hover:      #ffffff;

  --pico-secondary:                  var(--color-clay);
  --pico-secondary-background:       var(--color-clay);
  --pico-secondary-border:           var(--color-clay);
  --pico-secondary-hover-background: var(--color-clay-dark);
  --pico-secondary-hover-border:     var(--color-clay-dark);
  --pico-secondary-inverse:          #ffffff;

  --pico-contrast:            var(--color-plum);
  --pico-contrast-background: var(--color-plum);
  --pico-contrast-border:     var(--color-plum);
  --pico-contrast-inverse:    #ffffff;

  --pico-border-radius: var(--radius-small);
  --pico-box-shadow:    var(--shadow-warm);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-ground:  #1A1410;
    --color-ink:     #F0E8DA;
    --color-surface: #231C18;
    --color-border:  #3D3028;

    --pico-background-color:       var(--color-ground);
    --pico-color:                  var(--color-ink);
    --pico-card-background-color:  var(--color-surface);
    --pico-card-border-color:      var(--color-border);
    --pico-muted-background-color: var(--color-surface);
    --pico-muted-border-color:     var(--color-border);
    --pico-muted-color:            #A08878;
  }
}

[data-theme="dark"] {
  --color-ground:  #1A1410;
  --color-ink:     #F0E8DA;
  --color-surface: #231C18;
  --color-border:  #3D3028;

  --pico-background-color:       var(--color-ground);
  --pico-color:                  var(--color-ink);
  --pico-card-background-color:  var(--color-surface);
  --pico-card-border-color:      var(--color-border);
  --pico-muted-background-color: var(--color-surface);
  --pico-muted-border-color:     var(--color-border);
  --pico-muted-color:            #A08878;
}

/* === 03. Base Typography === */

body {
  font-family: var(--font-body);
  background-color: var(--color-ground);
  color: var(--color-ink);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 600;
}

h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-variation-settings: 'opsz' 72; }
h2 { font-size: clamp(1.5rem, 3vw, 2.25rem); font-variation-settings: 'opsz' 72; }
h3 { font-size: 1.25rem; font-variation-settings: 'opsz' 36; }

/* === 04. Noise Texture === */

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
}
```

**Step 3: Verify visually**

Run `make serve`. Open http://localhost:4000. You should see:
- Background is warm linen (`#FAF5EE`), not cold white
- Headings are in Fraunces (serif with personality)
- Body text is Instrument Sans
- Links are sage green, not orange

**Step 4: Commit**

```bash
git add _layouts/base.html assets/css/living-room.css
git commit -m "feat: wire up Living Room design token foundation"
```

---

### Task 2: Navigation overhaul

**Files:**
- Modify: `_includes/header.html`
- Modify: `assets/css/living-room.css` (append nav section)

**Step 1: Update header.html**

Replace the entire file contents with:

```html
{%- comment -%}
Usage:
  {% include header.html %}
Requirements:
  - `logo.svg` include available
  - `site.title` set in _config.yml
  - `navigation.yml` configured in _data
{%- endcomment -%}

<a href="#main-content" class="skip-link">Skip to main content</a>
<header class="site-header">
  <div class="container site-header__inner">
    <a href="{{ '/' | relative_url }}" class="site-header__logo">
      {% include logo.svg %}<span class="site-header__wordmark"><span class="wordmark-civic">Civic</span> <span class="wordmark-tech">Tech</span> <span class="wordmark-toronto">Toronto</span></span>
    </a>

    <!-- Desktop Nav -->
    <nav class="site-nav desktop-only" role="navigation" aria-label="Main navigation">
      <ul class="site-nav__list">
        {% for item in site.data.navigation.main %}
          <li><a href="{{ item.url | relative_url }}" class="site-nav__link">{{ item.label }}</a></li>
        {% endfor %}
        {% for item in site.data.navigation.utility %}
          <li>
            <a class="site-nav__cta"
              href="{{ item.url }}"
              {% if item.external %}target="_blank" rel="noopener"{% endif %}>
              {{ item.label }}{% if item.external %}<span aria-hidden="true">&nbsp;↗</span>{% endif %}
            </a>
          </li>
        {% endfor %}
      </ul>
    </nav>

    <!-- Mobile Toggle -->
    <button class="menu-toggle mobile-only" aria-controls="mobile-menu" aria-expanded="false" aria-label="Open navigation menu">
      ☰ Menu
    </button>
  </div>
</header>

<!-- Mobile Menu -->
<div id="mobile-menu" class="mobile-menu" hidden>
  <div class="mobile-menu__inner">
    <button class="close-menu" aria-label="Close menu">&times;</button>
    <nav>
      <ul>
        {% for item in site.data.navigation.main %}
          <li><a href="{{ item.url | relative_url }}">{{ item.label }}</a></li>
        {% endfor %}
        {% for item in site.data.navigation.utility %}
          <li>
            <a href="{{ item.url }}" {% if item.external %}target="_blank" rel="noopener"{% endif %}>
              {{ item.label }}{% if item.external %}<span aria-hidden="true">&nbsp;↗</span>{% endif %}
            </a>
          </li>
        {% endfor %}
      </ul>
    </nav>
    <p class="mobile-menu__tagline">Building Toronto, together.</p>
  </div>
</div>

<div id="menu-backdrop" class="menu-backdrop" hidden></div>
```

**Step 2: Append nav CSS to living-room.css**

```css
/* === 05. Navigation === */

.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  transform: translateY(-200%);
  background-color: var(--color-plum);
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 100;
  text-decoration: none;
  transition: transform 0.3s ease;
}
.skip-link:focus { transform: translateY(0); }

.site-header {
  background-color: var(--color-plum);
  position: sticky;
  top: 0;
  z-index: 50;
}

.site-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.site-header__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #fff;
}

.site-header__logo svg {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.site-header__wordmark {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  font-variation-settings: 'opsz' 36;
  color: #fff;
  letter-spacing: -0.01em;
}

.wordmark-tech {
  font-size: 0.85em;
  opacity: 0.8;
}

.site-nav__list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.site-nav__link {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-button);
  font-size: 0.9rem;
  transition: color 0.2s, background-color 0.2s;
}
.site-nav__link:hover {
  color: #fff;
  background-color: rgba(255,255,255,0.1);
}

.site-nav__cta {
  background-color: var(--color-sage);
  color: #fff;
  text-decoration: none;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-button);
  font-size: 0.9rem;
  font-weight: 600;
  transition: background-color 0.2s;
}
.site-nav__cta:hover { background-color: var(--color-sage-dark); color: #fff; }

/* Mobile nav */
.menu-toggle {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  padding: 0.4rem 1rem;
  border-radius: var(--radius-button);
  cursor: pointer;
  font-size: 0.9rem;
}

.mobile-menu {
  position: fixed;
  top: 0; right: 0;
  width: 80%; max-width: 360px;
  height: 100%;
  background-color: var(--color-plum);
  z-index: 9999;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mobile-menu__inner {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mobile-menu nav ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0;
}

.mobile-menu nav li { margin-bottom: 0.5rem; }

.mobile-menu nav a {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
  font-size: 1.25rem;
  font-family: var(--font-display);
  font-variation-settings: 'opsz' 36;
  display: block;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transition: color 0.2s;
}
.mobile-menu nav a:hover { color: #fff; }

.mobile-menu__tagline {
  margin-top: auto;
  color: rgba(255,255,255,0.4);
  font-family: var(--font-display);
  font-style: italic;
  font-variation-settings: 'opsz' 144;
  font-size: 1rem;
}

.close-menu {
  display: block;
  margin-left: auto;
  font-size: 2rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  line-height: 1;
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 9998;
}

body.menu-open { overflow: hidden; }

.mobile-only  { display: block; }
.desktop-only { display: none; }

@media (min-width: 768px) {
  .mobile-only  { display: none; }
  .desktop-only { display: flex; }
}
```

**Step 3: Verify visually**

- Header is deep plum, full-width
- "Tech" is visibly smaller/dimmer than "Civic" and "Toronto"
- Desktop nav links are white, pill hover highlight
- CTA button is sage green pill
- Mobile: hamburger button shows, tap opens full-screen plum drawer

**Step 4: Commit**

```bash
git add _includes/header.html assets/css/living-room.css
git commit -m "feat: overhaul navigation with Living Room plum header"
```

---

### Task 3: Card, badge & button components

**Files:**
- Modify: `assets/css/living-room.css` (append components section)

**Step 1: Append component CSS to living-room.css**

```css
/* === 06. Components === */

/* --- Cards --- */

.card,
.card-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-warm);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover,
.card-row:hover {
  box-shadow: var(--shadow-warm-lg);
  transform: translateY(-2px);
}

.card-body  { flex-grow: 1; }

.card-footer {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* --- Badges --- */

.badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  margin: 0.1rem;
  font-size: 0.7rem;
  font-family: var(--font-body);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: var(--radius-button);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.badge-topic {
  background-color: var(--color-mist);
  color: var(--color-sage-dark);
  border: 1px solid var(--color-sage);
}
.badge-topic:hover {
  background-color: var(--color-sage);
  color: #fff;
}

.badge-status {
  background-color: transparent;
  color: var(--color-clay);
  border: 1px solid var(--color-clay);
}
.badge-status:hover {
  background-color: var(--color-clay);
  color: #fff;
}

.badge-contributors,
.badge-format,
.badge-type {
  background-color: var(--color-surface);
  color: var(--color-ink);
  border: 1px solid var(--color-border);
}

/* --- Buttons --- */

[role="button"],
button,
input[type="submit"],
input[type="button"] {
  border-radius: var(--radius-button);
  font-family: var(--font-body);
  font-weight: 600;
  transition: background-color 0.2s, border-color 0.2s, transform 0.1s;
}

[role="button"]:active,
button:not(.close-menu):not(.menu-toggle):active {
  transform: scale(0.98);
}

a[role="button"].outline {
  border-color: var(--color-sage);
  color: var(--color-sage);
}
a[role="button"].outline:hover {
  background-color: var(--color-sage);
  color: #fff;
}

/* --- Button list --- */
.button-list {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* --- Social buttons --- */
.social-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.social-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  background-color: var(--color-surface);
  color: var(--color-ink);
  text-decoration: none;
  font-size: 0.875rem;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}
.social-button:hover {
  background-color: var(--color-sage);
  border-color: var(--color-sage);
  color: #fff;
}

/* --- Announcement bar --- */
.announcement-bar {
  border-radius: 0;
  background-color: var(--color-clay);
  color: #fff;
  padding: 0.6rem 1rem;
  text-align: center;
  font-size: 0.9rem;
}
.announcement-bar a {
  color: #fff;
  font-weight: 600;
}
```

**Step 2: Verify visually**

- Cards are warm-surface, rounded (not sharp corners), hover lifts
- Badges are pill-shaped with sage/clay colour coding
- Buttons are pill-shaped

**Step 3: Commit**

```bash
git add assets/css/living-room.css
git commit -m "feat: rebuild card, badge and button components for Living Room"
```

---

### Task 4: Homepage — hero section

**Files:**
- Modify: `_pages/index.md`
- Modify: `assets/css/living-room.css` (append homepage section)

**Step 1: Replace the hero section in index.md**

Replace the opening `<article class="grid">` block (lines 7–28) with:

```html
<section class="home-hero">
  <div class="home-hero__content">
    <h1 class="home-hero__headline">Toronto's civic community, building together.</h1>
    <p class="home-hero__sub">We bring technologists, designers, and community advocates together to work on the issues that matter.<br><strong>No tech background required.</strong></p>
    <div class="button-list">
      <a role="button" href="{{ '/projects' | relative_url }}">Find your project →</a>
      <a role="button" class="outline" href="{{ '/events' | relative_url }}">See what we're working on</a>
    </div>
  </div>
  <div class="home-hero__mosaic" aria-hidden="true">
    <img src="{{ 'assets/images/CivicTechTO-InPerson.jpg' | relative_url }}"
         alt="Community members at a Civic Tech Toronto meetup"
         class="home-hero__photo" />
  </div>
</section>
```

**Step 2: Append homepage hero CSS to living-room.css**

```css
/* === 07. Homepage === */

/* Hero */
.home-hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background-color: var(--color-plum);
  margin: 0 calc(var(--pico-spacing) * -1);
  padding: 4rem var(--pico-spacing);
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .home-hero {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    padding: 5rem var(--pico-spacing);
    align-items: center;
  }
}

.home-hero__headline {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  font-variation-settings: 'opsz' 144;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 1.25rem;
}

.home-hero__sub {
  color: rgba(255,255,255,0.85);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.home-hero__sub strong {
  color: #fff;
  font-weight: 600;
}

.home-hero__photo {
  width: 100%;
  border-radius: var(--radius-card);
  object-fit: cover;
  aspect-ratio: 4/3;
  box-shadow: var(--shadow-warm-lg);
}
```

**Step 3: Verify visually**

- Hero spans full container width with plum background
- "No tech background required." is bold white
- Photo sits right with rounded corners
- Two pill buttons: sage fill + sage outline

**Step 4: Commit**

```bash
git add _pages/index.md assets/css/living-room.css
git commit -m "feat: new homepage hero with community-forward messaging"
```

---

### Task 5: Homepage — "Come As You Are" & Voices sections

**Files:**
- Modify: `_pages/index.md`
- Modify: `assets/css/living-room.css` (append)

**Step 1: Add "Come As You Are" section to index.md**

Add after the closing `</section>` of the events section and before `<!-- === Projects Feature === -->`:

```html
<!-- === Come As You Are === -->
<section class="home-welcome">
  <div class="home-welcome__grid">
    <article class="home-welcome__card">
      <div class="home-welcome__icon" aria-hidden="true">◎</div>
      <h3>Not a developer?</h3>
      <p>We have designers, writers, researchers, and advocates who've never written a line of code.</p>
    </article>
    <article class="home-welcome__card">
      <div class="home-welcome__icon" aria-hidden="true">◎</div>
      <h3>New to Toronto?</h3>
      <p>Our community spans every neighbourhood and background.</p>
    </article>
    <article class="home-welcome__card">
      <div class="home-welcome__icon" aria-hidden="true">◎</div>
      <h3>Not sure where to start?</h3>
      <p>Show up once. You'll figure out the rest together.</p>
    </article>
  </div>
</section>
```

**Step 2: Append "Come As You Are" CSS to living-room.css**

```css
/* Come As You Are */
.home-welcome {
  background-color: var(--color-mist);
  border-radius: var(--radius-card);
  padding: 3rem 2rem;
  margin-bottom: 4rem;
}

.home-welcome__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .home-welcome__grid { grid-template-columns: 1fr 1fr 1fr; }
}

.home-welcome__card {
  background: transparent;
  padding: 0;
  box-shadow: none;
  border: none;
}

.home-welcome__card h3 {
  font-size: 1.1rem;
  color: var(--color-plum);
  margin-bottom: 0.5rem;
}

.home-welcome__card p {
  font-size: 0.95rem;
  color: var(--color-ink);
  opacity: 0.85;
  line-height: 1.6;
}

.home-welcome__icon {
  font-size: 1.5rem;
  color: var(--color-sage);
  margin-bottom: 0.75rem;
  line-height: 1;
}
```

**Step 3: Verify visually**

- Sage-mist background section with 3 columns on desktop
- No card borders, just space and type
- "Not a developer?" etc headings in plum
- Icon dots in sage green above each

**Step 4: Commit**

```bash
git add _pages/index.md assets/css/living-room.css
git commit -m "feat: add Come As You Are welcome section to homepage"
```

---

### Task 6: Homepage — layout utilities & section headings

**Files:**
- Modify: `assets/css/living-room.css` (append)

**Step 1: Append layout utilities**

```css
/* === 08. Layout Utilities === */

/* Card grids */
.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 576px)  { .card-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .card-grid { grid-template-columns: 1fr 1fr 1fr; } }

/* Custom 4-col grid */
.custom_grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

/* Main + sidebar */
.main-with-sidebar {
  display: grid;
  grid-template-areas: "main" "sidebar";
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}
.main-with-sidebar > .main-content { grid-area: main; }
.main-with-sidebar > aside         { grid-area: sidebar; }

@media (min-width: 1024px) {
  .main-with-sidebar {
    grid-template-areas: "main sidebar";
    grid-template-columns: 2fr 1fr;
  }
}

/* Row utilities */
.row-content {
  display: flex;
  gap: 1rem;
  flex-direction: row;
}
.row-content-column {
  display: flex;
  gap: 1rem;
  flex-direction: column;
}
.row-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .row-content { flex-direction: column; }
}

/* Section headings */
section > header h2,
section > h2 {
  font-family: var(--font-display);
  font-variation-settings: 'opsz' 72;
  color: var(--color-ink);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border);
  margin-bottom: 1.5rem;
}

/* Frontpage CTA link */
.frontpage-action {
  margin: 1.5rem 0 3rem;
}

/* Featured topics */
.feautured-topic-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-bottom: 1rem;
}

/* Breadcrumb */
nav[aria-label="breadcrumb"] {
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

/* Sticky headers */
header.sticky {
  position: sticky;
  top: 0;
  background: var(--color-ground);
  padding-top: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

/* Misc */
hgroup:last-child, p:last-child,
blockquote:last-child, ul:last-child,
ol:last-child, dl:last-child { margin-bottom: 0; }

dd { margin: 0; }

.ogimage {
  aspect-ratio: 1.91 / 1;
  width: 100%;
  object-fit: cover;
  border-radius: var(--radius-small);
}

aside .ogimage { margin-bottom: 1rem; }

.meetup-thumbnail {
  width: 100%;
  max-width: 345px;
  height: auto;
  background: var(--color-border);
  flex-shrink: 0;
}

/* Icons */
.iconstyle svg {
  color: inherit;
  width: 1.2rem;
  height: 1.2rem;
  display: inline-block;
  vertical-align: middle;
}

/* Mobile negative margin (card bleed) */
@media (max-width: 575px) {
  .mobilenegativemargin {
    margin: var(--pico-spacing) calc(var(--pico-spacing) * -1);
  }
}

/* Social footer links */
.social-links-footer ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding-left: 0;
}
.social-links-footer a {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
}
```

**Step 2: Verify visually**

- Card grids display correctly (1→2→3 columns at breakpoints)
- Section headings have a warm bottom border line
- Sidebar layout works on project/meetup pages

**Step 3: Commit**

```bash
git add assets/css/living-room.css
git commit -m "feat: add layout utilities and grid system for Living Room"
```

---

### Task 7: Footer overhaul

**Files:**
- Modify: `_includes/footer.html`
- Modify: `assets/css/living-room.css` (append)

**Step 1: Replace footer.html contents**

```html
{%- comment -%}
Usage: {% include footer.html %}
{%- endcomment -%}

<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      <a href="{{ '/' | relative_url }}" class="site-footer__logo">
        {% include logo.svg %}<span>{{ site.title | escape }}</span>
      </a>
      <p class="site-footer__tagline">Building Toronto, together.</p>
    </div>

    <div class="site-footer__links">
      <p><strong>Navigate</strong></p>
      <ul>
        {% for item in site.data.navigation.main %}
          <li><a href="{{ item.url | relative_url }}">{{ item.label }}</a></li>
        {% endfor %}
      </ul>
    </div>

    <div class="site-footer__connect">
      <p><strong>Connect</strong></p>
      {% include social-links-footer.html %}
    </div>
  </div>

  <div class="container site-footer__bottom">
    <nav aria-label="Theme switcher">
      <ul>
        <li><small>Theme:</small></li>
        <li><a href="#" data-theme-switcher="auto">Auto</a></li>
        <li><a href="#" data-theme-switcher="light">Light</a></li>
        <li><a href="#" data-theme-switcher="dark">Dark</a></li>
      </ul>
    </nav>
    <p><small>{{ site.description }}</small></p>
  </div>
</footer>
```

**Step 2: Append footer CSS to living-room.css**

```css
/* === 09. Footer === */

.site-footer {
  background-color: var(--color-plum);
  color: rgba(255,255,255,0.85);
  margin-top: 5rem;
  padding-top: 3rem;
  padding-bottom: 1.5rem;
}

.site-footer__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

@media (min-width: 640px) {
  .site-footer__inner { grid-template-columns: 1.5fr 1fr 1fr; }
}

.site-footer__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  text-decoration: none;
  font-family: var(--font-display);
  font-variation-settings: 'opsz' 36;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.site-footer__logo svg { width: 1.5rem; height: 1.5rem; }

.site-footer__tagline {
  font-family: var(--font-display);
  font-style: italic;
  font-variation-settings: 'opsz' 144;
  color: rgba(255,255,255,0.5);
  font-size: 1.05rem;
  margin: 0;
}

.site-footer__links strong,
.site-footer__connect strong {
  color: #fff;
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.site-footer__links ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.site-footer__links ul li { margin-bottom: 0.4rem; }

.site-footer__links a,
.site-footer__connect a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.site-footer__links a:hover,
.site-footer__connect a:hover { color: #fff; }

.site-footer__bottom {
  padding-top: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.site-footer__bottom nav ul {
  display: flex;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
}

.site-footer__bottom nav a,
.site-footer__bottom small {
  color: rgba(255,255,255,0.5);
  font-size: 0.8rem;
  text-decoration: none;
  transition: color 0.2s;
}
.site-footer__bottom nav a:hover { color: rgba(255,255,255,0.9); }
```

**Step 3: Verify visually**

- Footer is deep plum, matches nav
- Three columns: brand/tagline, navigation, social
- "Building Toronto, together." in italic Fraunces
- Theme switcher links at bottom

**Step 4: Commit**

```bash
git add _includes/footer.html assets/css/living-room.css
git commit -m "feat: overhaul footer with plum Living Room design"
```

---

### Task 8: Project layout

**Files:**
- Modify: `_layouts/project.html`
- Modify: `assets/css/living-room.css` (append)

**Step 1: Replace project.html body (keep the Liquid resolve blocks at top)**

Keep lines 1–15 (the Liquid resolving for meetups and people), then replace everything from `<nav aria-label="breadcrumb">` onward with:

```html
  <nav aria-label="breadcrumb">
    <ul>
      <li><a href="{{ site.baseurl }}/">Home</a></li>
      <li><a href="{{ site.baseurl }}/projects">Projects</a></li>
      <li>{{ page.title }}</li>
    </ul>
  </nav>

  <!-- Impact banner -->
  <header class="project-banner">
    <div class="project-banner__category">
      {% for tag in page.tags %}{% if tag contains "topic/" %}<span>{{ tag | replace: "topic/", "" | upcase }}</span>{% endif %}{% endfor %}
    </div>
    <h1 class="project-banner__title">{{ page.title }}</h1>
    {% if page.excerpt %}
      <p class="project-banner__impact">{{ page.excerpt }}</p>
    {% endif %}
  </header>

  <article>
    <div class="main-with-sidebar">
      <div class="main-content">
        <section class="project-description">
          {{ content }}
        </section>
      </div>
      <aside class="project-sidebar">
        {% if page.image %}
          <img class="ogimage" src="{{ page.image }}" alt="{{ page.title }}">
        {% endif %}

        <div class="sidebar-card">
          <h2>Project Information</h2>
          <dl>
            <dt>Status</dt>
            <dd>{% include namespaced-categories.html categories=page.categories namespaces="status" %}</dd>
          </dl>
          <dl>
            <dt>Contributors</dt>
            <dd>{% include namespaced-categories.html categories=page.categories namespaces="contributors" %}</dd>
          </dl>
          <dl>
            <dt>This project touches</dt>
            <dd>{% include tags.html tags=page.tags %}</dd>
          </dl>
          {% if page.dateActiveFirst %}
          <dl>
            <dt>Since</dt>
            <dd>{{ page.dateActiveFirst | date: "%B %Y" }}</dd>
          </dl>
          {% endif %}
          {% if page.social %}
            {% include social-links.html social=page.social %}
          {% endif %}
        </div>

        {% if resolved_people.size > 0 %}
        <div class="sidebar-card">
          <h2>Who's building this</h2>
          <ul class="contributor-list">
            {% for person in resolved_people %}
              <li><a href="{{ person.url }}">{{ person.title }}</a></li>
            {% endfor %}
          </ul>
        </div>
        {% endif %}

        <div class="project-cta-box">
          <p>Want to contribute?</p>
          <p>Show up to the next meetup and introduce yourself.</p>
          <a role="button" href="{{ '/events' | relative_url }}">See upcoming events →</a>
        </div>
      </aside>
    </div>
    <footer>
      {% include edit-link.html %}
    </footer>
  </article>

  {% if resolved_meetups.size > 0 %}
  <section class="related-articles">
    <h3>Related Meetups</h3>
    {% for meetup in resolved_meetups %}
    <article>
      <hgroup>
        <small>{{ meetup.date | date: "%B %d, %Y" }} · Meetup #{{ meetup.number }}</small>
        <h4><a href="{{ meetup.url }}">{{ meetup.topic }}</a></h4>
      </hgroup>
    </article>
    {% endfor %}
  </section>
  {% endif %}
```

**Step 2: Append project CSS**

```css
/* === 10. Project Page === */

.project-banner {
  background-color: var(--color-plum);
  color: #fff;
  padding: 3rem 2rem;
  border-radius: var(--radius-card);
  margin-bottom: 2.5rem;
}

.project-banner__category {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-sage);
  margin-bottom: 0.75rem;
}
.project-banner__category span + span::before { content: " · "; }

.project-banner__title {
  color: #fff;
  font-variation-settings: 'opsz' 72;
  margin-bottom: 1rem;
}

.project-banner__impact {
  color: rgba(255,255,255,0.8);
  font-style: italic;
  font-size: 1.15rem;
  margin: 0;
}

.sidebar-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.sidebar-card h2 {
  font-size: 1rem;
  color: var(--color-ink);
  margin-bottom: 1rem;
  font-variation-settings: 'opsz' 36;
}

.contributor-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.contributor-list li { margin-bottom: 0.4rem; }

.project-cta-box {
  background-color: var(--color-clay);
  color: #fff;
  border-radius: var(--radius-card);
  padding: 1.5rem;
  margin-top: 1rem;
}
.project-cta-box p { color: rgba(255,255,255,0.9); margin-bottom: 0.4rem; }
.project-cta-box p:first-child {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}
.project-cta-box [role="button"] {
  display: inline-block;
  margin-top: 0.75rem;
  background-color: #fff;
  color: var(--color-clay);
  padding: 0.4rem 1rem;
  border-radius: var(--radius-button);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.related-articles { margin-top: 2rem; }
.related-articles h3 {
  font-variation-settings: 'opsz' 36;
  margin-bottom: 1rem;
}
.related-articles article {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}
```

**Step 3: Verify visually**

- Project page has plum banner with impact text in italic
- Sidebar has warm surface cards
- Clay CTA box at bottom of sidebar with "Want to contribute?"

**Step 4: Commit**

```bash
git add _layouts/project.html assets/css/living-room.css
git commit -m "feat: redesign project layout with impact banner and Living Room sidebar"
```

---

### Task 9: Person layout

**Files:**
- Modify: `_layouts/person.html`
- Modify: `assets/css/living-room.css` (append)

**Step 1: Replace person.html**

Keep the Liquid resolve blocks (lines 33–75), replace all HTML from `<nav aria-label="breadcrumb">` to `</article>` with:

```html
  <nav aria-label="breadcrumb">
    <ul>
      <li><a href="{{ site.baseurl }}/">Home</a></li>
      <li><a href="{{ site.baseurl }}/people">People</a></li>
      <li>{{ page.title }}</li>
    </ul>
  </nav>

  <article class="person-article">
    <header class="person-header">
      <div class="person-header__meta">
        <h1 class="person-header__name">{{ page.title }}</h1>
        {% if page.excerpt %}
          <p class="person-header__tagline">{{ page.excerpt }}</p>
        {% endif %}
        {% if page.social %}
          {% include social-links.html social=page.social %}
        {% endif %}
      </div>
    </header>

    {% if page.description or page.content %}
    <section class="person-bio">
      {% if page.description %}
        <p class="person-bio__lead">{{ page.description }}</p>
      {% endif %}
      <div>{{ page.content }}</div>
    </section>
    {% endif %}

    {% if resolved_organizations.size > 0 %}
    <section class="person-section">
      <h2>Affiliated Organizations</h2>
      <ul>
        {% for org in resolved_organizations %}
          <li><a href="{{ org.url }}">{{ org.title }}</a></li>
        {% endfor %}
      </ul>
    </section>
    {% endif %}

    {% if resolved_projects.size > 0 %}
    <section class="person-section">
      <h2>Projects</h2>
      <div class="card-grid">
        {% for proj in resolved_projects %}
          <article class="card">
            <h3><a href="{{ proj.url }}">{{ proj.title }}</a></h3>
            {% if proj.excerpt %}<p>{{ proj.excerpt }}</p>{% endif %}
          </article>
        {% endfor %}
      </div>
    </section>
    {% endif %}

    <footer>
      {% include edit-link.html %}
    </footer>
  </article>

  {% assign all_collections = site.meetups | concat: site.projects %}
  {% include backlinks.html
    collections=all_collections
    fields="team,speakers"
    title="Mentioned In"
  %}
```

**Step 2: Append person CSS**

```css
/* === 11. Person Page === */

.person-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.person-header__name {
  font-variation-settings: 'opsz' 72;
  margin-bottom: 0.4rem;
}

.person-header__tagline {
  color: var(--color-clay);
  font-style: italic;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.person-bio__lead {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-variation-settings: 'opsz' 72;
  font-style: italic;
  line-height: 1.5;
  color: var(--color-ink);
  margin-bottom: 1rem;
}

.person-section {
  margin-top: 2rem;
}
.person-section h2 {
  font-size: 1.1rem;
  font-variation-settings: 'opsz' 36;
  margin-bottom: 1rem;
}
.person-section ul {
  list-style: disc;
  padding-left: 1.5rem;
}
.person-section li { margin-bottom: 0.4rem; }
```

**Step 3: Verify visually**

- Person name large in Fraunces, tagline in clay italic
- First description sentence in large italic Fraunces (pull-quote feel)
- Projects shown as cards, not bare list

**Step 4: Commit**

```bash
git add _layouts/person.html assets/css/living-room.css
git commit -m "feat: redesign person layout with pull-quote bio treatment"
```

---

### Task 10: Meetup layout

**Files:**
- Modify: `_layouts/meetup.html`
- Modify: `assets/css/living-room.css` (append)

**Step 1: Replace meetup.html HTML (keep Liquid resolve blocks at top)**

Keep lines 1–25 (Liquid resolving for speakers and venues), replace from `<nav aria-label="breadcrumb">` onward with:

```html
  <nav aria-label="breadcrumb">
    <ul>
      <li><a href="{{ site.baseurl }}/">Home</a></li>
      <li><a href="{{ site.baseurl }}/events/">Meetups</a></li>
      <li>Meetup #{{ page.number }}</li>
    </ul>
  </nav>

  <article class="mobilenegativemargin">
    <header class="meetup-header">
      <div class="meetup-header__text">
        <p class="meetup-header__number">Meetup #{{ page.number }}</p>
        <h1>{{ page.topic }}</h1>
        {% if resolved_speakers.size > 0 %}
          <p class="meetup-header__speakers">with
            {% for speaker in resolved_speakers %}
              {% if forloop.first and forloop.length == 1 %}{{ speaker.title }}
              {% elsif forloop.length == 2 and forloop.first %}{{ speaker.title }}
              {% elsif forloop.length == 2 and forloop.last %} and {{ speaker.title }}
              {% elsif forloop.length > 2 and forloop.first %}{{ speaker.title }},
              {% elsif forloop.length > 2 and forloop.last %} and {{ speaker.title }}
              {% elsif forloop.length > 2 %}{{ speaker.title }},
              {% endif %}
            {% endfor %}
          </p>
        {% endif %}
      </div>
      <div class="meetup-date-stamp" aria-label="{{ page.date | date: '%B %d, %Y' }}">
        <span class="meetup-date-stamp__month">{{ page.date | date: "%b" | upcase }}</span>
        <span class="meetup-date-stamp__day">{{ page.date | date: "%-d" }}</span>
        <span class="meetup-date-stamp__year">{{ page.date | date: "%Y" }}</span>
      </div>
    </header>

    <div class="main-with-sidebar">
      <div class="main-content">
        {% if page.youtubeID %}
          <section>
            <h2>Recording</h2>
            {% include embed_youtube.html youtubeID=page.youtubeID %}
          </section>
        {% endif %}

        {% if page.description %}
          <p>{{ page.description }}</p>
        {% endif %}

        {% if resolved_speakers.size > 0 %}
          <section>
            <h2>Speakers</h2>
            {% for speaker in resolved_speakers %}
              <div class="speaker-card">
                <h3><a href="{{ speaker.url }}">{{ speaker.title }}</a></h3>
                {% if speaker.description %}<p>{{ speaker.description }}</p>{% endif %}
              </div>
            {% endfor %}
          </section>
        {% endif %}

        {{ content }}
      </div>

      <aside>
        {% if page.image %}
          {% picture events /events/{{ page.image }} alt="{{ page.topic }}" class="meetup-image" %}
        {% endif %}

        <div class="sidebar-card">
          <h2>Details</h2>
          {% if page.eventUrl %}
            {% assign now = site.time %}
            {% if page.date < now %}
              <p><a href="{{ page.eventUrl }}" target="_blank" rel="noopener">Event Page</a></p>
            {% else %}
              <p><a role="button" class="outline" href="{{ page.eventUrl }}" target="_blank" rel="noopener">Registration ↗</a></p>
            {% endif %}
          {% endif %}
          <p><strong>Date:</strong> {{ page.date | date: "%B %d, %Y" }}</p>
          {% if resolved_venue.size > 0 %}
            {% for venue in resolved_venue %}
              <p><strong>Location:</strong> <a href="{{ venue.url }}">{{ venue.title }}</a></p>
            {% endfor %}
          {% endif %}
          {% include topic-tags.html tags=page.tags %}
        </div>
      </aside>
    </div>

    <footer>{% include edit-link.html %}</footer>
  </article>

  {% include backlinks.html
    collections=site.projects
    fields="team"
    title="Mentioned In"
  %}
```

**Step 2: Append meetup CSS**

```css
/* === 12. Meetup Page === */

.meetup-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--color-border);
  flex-wrap: wrap;
}

.meetup-header h1 {
  font-variation-settings: 'opsz' 72;
  margin-bottom: 0.5rem;
}

.meetup-header__number {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-clay);
  margin-bottom: 0.4rem;
}

.meetup-header__speakers {
  font-style: italic;
  color: var(--color-muted, #7A6255);
  margin: 0;
}

.meetup-date-stamp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--color-plum);
  color: #fff;
  border-radius: var(--radius-card);
  padding: 1rem 1.25rem;
  min-width: 5rem;
  flex-shrink: 0;
  line-height: 1;
  gap: 0.1rem;
}

.meetup-date-stamp__month {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  opacity: 0.7;
}

.meetup-date-stamp__day {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  font-variation-settings: 'opsz' 144;
  line-height: 1;
}

.meetup-date-stamp__year {
  font-size: 0.65rem;
  opacity: 0.6;
}

.meetup-image { margin-bottom: 1rem; border-radius: var(--radius-small); }

.speaker-card {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}
.speaker-card h3 { font-size: 1rem; margin-bottom: 0.3rem; }
```

**Step 3: Verify visually**

- Meetup page has date stamp (plum box, large day number in Fraunces) top-right
- "Meetup #247" label in clay above the title
- Sidebar card for details with warm surface

**Step 4: Commit**

```bash
git add _layouts/meetup.html assets/css/living-room.css
git commit -m "feat: redesign meetup layout with date stamp and Living Room sidebar"
```

---

### Task 11: Tag and category page styles

**Files:**
- Modify: `assets/css/living-room.css` (append)

**Step 1: Append tag/category CSS**

```css
/* === 13. Tag & Category Pages === */

.tag-collection,
.namespace-tags {
  margin-bottom: 2.5rem;
}

.tag-collection h3,
.namespace-tags h3 {
  font-size: 1rem;
  font-variation-settings: 'opsz' 36;
  color: var(--color-clay);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid var(--color-border);
}

.tag-collection ul,
.namespace-tags ul {
  list-style: disc;
  padding-left: 1.5rem;
}

.tag-collection li,
.namespace-tags li {
  margin-bottom: 0.4rem;
}

/* Resource page */
.resource-details,
.resource-tags,
.resource-body {
  margin-top: 2rem;
}

/* About page figure */
.figure-image {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.figure-image img {
  padding: 1rem;
  border-radius: var(--radius-card);
  margin-bottom: 1rem;
}
```

**Step 2: Verify visually**

Open a tag page (e.g. `/tags/topic/housing`). It should have section headings in clay with warm border separators.

**Step 3: Commit**

```bash
git add assets/css/living-room.css
git commit -m "feat: add tag, category and resource page styles"
```

---

### Task 12: Accessibility check & contrast verification

**Files:** No code changes — verification only.

**Step 1: Spot-check key colour pairings**

Verify these pass WCAG AA (4.5:1 for normal text, 3:1 for large):

| Foreground | Background | Use |
|---|---|---|
| `#2C1810` | `#FAF5EE` | Body text on ground |
| `#2C1810` | `#F0E8DA` | Body text on surface/cards |
| `#ffffff` | `#3D2B3D` | White text on plum nav/hero |
| `#ffffff` | `#6B8F71` | White text on sage buttons |
| `#ffffff` | `#B85C2C` | White text on clay badges |
| `#6B8F71` | `#FAF5EE` | Sage links on ground background |

Use https://webaim.org/resources/contrastchecker/ or a browser extension to check. If any fail, adjust the color token (darken the foreground or background) in the `:root` block of `living-room.css` before continuing.

**Step 2: Check skip link works**

Tab from the browser address bar — the skip link should appear in the top-left corner.

**Step 3: Commit any contrast fixes**

```bash
git add assets/css/living-room.css
git commit -m "fix: adjust color tokens to pass WCAG AA contrast"
```

(Skip this commit if no fixes were needed.)

---

### Task 13: Final cleanup

**Files:**
- Delete or archive: `assets/css/custom.css`

**Step 1: Confirm custom.css is fully replaced**

All rules from `custom.css` should now be covered by `living-room.css`. The old file is a full replacement, not an addition. Scan `custom.css` one more time for anything that may have been missed (look for any class names used in templates that aren't in `living-room.css`).

**Step 2: Remove the old file**

```bash
git rm assets/css/custom.css
```

**Step 3: Do a full site build and browse all major pages**

```bash
make serve
```

Check:
- `/` — homepage
- `/events/` — events list
- `/projects/` — projects list
- Any project page
- Any person page
- Any meetup page
- Any tag page (e.g. `/tags/topic/housing`)
- Mobile viewport (resize to 375px wide)
- Dark mode (toggle via footer)

Fix any visual regressions before proceeding.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: remove legacy custom.css, Living Room overhaul complete"
```

---

## Summary of files changed

| File | Action |
|---|---|
| `_layouts/base.html` | Swap Pico CDN, add Google Fonts, swap CSS link |
| `assets/css/living-room.css` | Create — full design system |
| `assets/css/custom.css` | Delete |
| `_includes/header.html` | New plum nav with wordmark |
| `_includes/footer.html` | New plum 3-column footer |
| `_pages/index.md` | New hero + Come As You Are sections |
| `_layouts/project.html` | Impact banner + sidebar cards |
| `_layouts/person.html` | Pull-quote bio + project cards |
| `_layouts/meetup.html` | Date stamp + sidebar card |

**Collections, data pipeline, `_data/`, `_scripts/`, CI workflows: untouched.**
