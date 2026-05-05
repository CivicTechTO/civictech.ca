# Donation Campaign Page — Design Spec

**Date:** 2026-05-04  
**Branch:** samosas  
**Status:** Approved

---

## Overview

Add a `/donate/` page to civictech.ca that explains the 2027 food funding campaign, shows a live progress bar toward the $3,500 CAD goal, and lets visitors donate by card using Stripe Embedded Checkout — without leaving the site.

---

## Background

Civic Tech Toronto is a volunteer-run community organisation hosting ~50 weekly Tuesday meetups per year. The 2027 campaign needs to raise $3,500 CAD (~$65–$70/event) to cover food costs. No paid staff, no recurring sponsors. The site is a Jekyll 4 static site hosted on GitHub Pages.

---

## Architecture

```
civictech.ca/donate/   (Jekyll static page)
        │
        ├── GET /total ──────────────────────────────────┐
        │                                                 │
        └── POST /checkout ──────────────────────────────┤
                                                Cloudflare Worker
        ┌── POST /webhook ───────────────────────────────┤
        │                                                 │
   Stripe (payment + events)                    Cloudflare KV
                                              (running total)
```

Four components:

| Component | Responsibility |
|---|---|
| Jekyll page (`_pages/donate.html`) | Renders campaign, fetches live total, handles amount selection, mounts embedded checkout |
| Cloudflare Worker | Three endpoints: serve total, create Checkout Session, receive Stripe webhooks |
| Cloudflare KV (`DONATION_KV`) | Persists `total_cents` — single key, read/increment on each completed payment |
| Stripe | Processes card payments, fires `checkout.session.completed` webhook on success |

---

## Cloudflare Worker

**KV namespace:** `DONATION_KV`  
**Key:** `total_cents` (integer stored as string, missing key treated as 0)  
**Goal:** hardcoded as `350000` (cents) — not a runtime config value

### Endpoints

#### `GET /total`
Returns the current fundraising state.

```json
{ "raised_cents": 125000, "goal_cents": 350000 }
```

Returns `raised_cents: 0` if `total_cents` key does not exist yet.

#### `POST /checkout`
Request body:
```json
{ "amount_cents": 2500 }
```

Validation:
- `amount_cents` must be a positive integer
- Minimum: `100` ($1.00 CAD)
- Maximum: `1000000` ($10,000 CAD)

Creates a Stripe Checkout Session:
- `ui_mode: "embedded"`
- `currency: "cad"`
- `return_url: "https://civictech.ca/donate/?session_id={CHECKOUT_SESSION_ID}"`
- One line item: `"Civic Tech Toronto 2027 Donation"` at the submitted amount

Returns:
```json
{ "clientSecret": "cs_..." }
```

#### `POST /webhook`
Verifies the `Stripe-Signature` header using `STRIPE_WEBHOOK_SECRET`. On `checkout.session.completed`, reads `amount_total` from the event, adds it to the current `total_cents` in KV, and writes back. Returns `200 OK` on success; `400` on signature failure.

Stripe guarantees at-least-once delivery for signed webhooks, and the donation amounts involved make double-counting unlikely to cause material harm. No deduplication is implemented in v1.

### CORS

All three endpoints respond with:
```
Access-Control-Allow-Origin: https://civictech.ca
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Preflight `OPTIONS` requests handled explicitly.

### Environment variables (Cloudflare dashboard, never in code)

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | From Stripe dashboard after registering the webhook URL |

---

## Jekyll Page

**File:** `_pages/donate.html`  
**Permalink:** `/donate/`  
**Layout:** `page`  
**Pattern:** Follows `feedback.md` — inline `<style>`, inline `<script>`, no new layout

### Page structure (top to bottom)

1. **Campaign header** — provided by `page` layout. `title: "Support Civic Tech Toronto"`, `excerpt: "Help us feed 50 Tuesday nights in 2027."`

2. **Campaign explainer** — short prose: what Civic Tech Toronto is, what samosas fund, the $3,500 / 50-Tuesday / ~$65-per-event math

3. **Progress bar** — native HTML `<progress>` element (Pico CSS styles these). Layout:
   - Label above-left: `$X raised`
   - Label above-right: `$3,500 goal`
   - Bar below, full width
   - While fetching: indeterminate state (`<progress>` with no `value` attribute)

4. **Amount selector** — two rows:
   - Row 1 (pill buttons): `$10` / `$25` / `$50` / `Custom`
     - Selecting "Custom" reveals a number input (dollars, min 1)
   - Row 2 (outlined buttons with sublabel):
     - `Sponsor a Tuesday — $65` / sublabel: "covers food for one evening"
     - `Sponsor a month — $260` / sublabel: "covers food for four Tuesdays"

5. **Donate button** — full-width primary button, disabled until an amount is selected. Label updates live: `"Donate $25"`, `"Donate $65"`, etc.

6. **Embedded checkout mount** — `<div id="checkout">` (hidden initially). When active, the amount selector and donate button slide away; this div expands and Stripe renders into it.

7. **Thank-you state** — `<div id="thanks">` (hidden initially). Shown when `?session_id=` is present in the URL on page load. Shows: "Thank you — your donation helps keep Civic Tech Toronto running every Tuesday." The form and amount selector are hidden; the progress bar remains visible (total is still fetched so the donor can see their impact).

### JS flow

```
On load:
  if ?session_id in URL → show #thanks, hide form
  fetch(WORKER_URL + '/total') → update progress bar (always, including thank-you state)

On amount selection:
  update selected amount
  update donate button label ("Donate $X")
  enable donate button

On donate button click:
  disable button, show loading state
  POST WORKER_URL + '/checkout' with {amount_cents}
  on success: stripe.initEmbeddedCheckout({clientSecret}) → mount to #checkout
              hide amount selector + button, show #checkout
  on error: re-enable button, show inline error message
```

Stripe.js loaded from `https://js.stripe.com/v3/` via `<script>` tag in the page only (not in `base.html`).

### Secrets injected at build time

In `pages.yml`, alongside the existing `feedback_token` injection:
```yaml
- name: Inject config secrets
  run: |
    echo "feedback_token: \"$FEEDBACK_TOKEN\"" >> _config.yml
    echo "stripe_public_key: \"$STRIPE_PUBLIC_KEY\"" >> _config.yml
    echo "worker_url: \"$WORKER_URL\"" >> _config.yml
  env:
    FEEDBACK_TOKEN: ${{ secrets.FEEDBACK_TOKEN }}
    STRIPE_PUBLIC_KEY: ${{ secrets.STRIPE_PUBLIC_KEY }}
    WORKER_URL: ${{ secrets.WORKER_URL }}
```

Used in the page as `{{ site.stripe_public_key }}` and `{{ site.worker_url }}`.

### GitHub Actions secrets to add

| Secret | Description |
|---|---|
| `STRIPE_PUBLIC_KEY` | Stripe publishable key (safe to embed in page JS) |
| `WORKER_URL` | Cloudflare Worker URL (e.g. `https://ctt-donations.your-account.workers.dev`) |

---

## Stripe Setup

- No pre-created Stripe Product or Price needed — each Checkout Session uses an inline `price_data` object: `{currency: "cad", unit_amount: <amount_cents>, product_data: {name: "Civic Tech Toronto 2027 Donation"}}`
- Webhook endpoint: `POST https://<worker-url>/webhook`
- Webhook event: `checkout.session.completed` only
- Automatic email receipts: enabled by default in Stripe (no action needed)
- Currency: CAD

---

## Preset Amounts

| Button label | Amount (CAD) | Amount (cents) |
|---|---|---|
| $10 | $10.00 | 1000 |
| $25 | $25.00 | 2500 |
| $50 | $50.00 | 5000 |
| Custom | donor-entered | varies |
| Sponsor a Tuesday | $65.00 | 6500 |
| Sponsor a month | $260.00 | 26000 |

---

## What Is Not In Scope

- Recurring/monthly donations
- Donor accounts or history
- A leaderboard or donor names
- Any form of donor contact collection beyond what Stripe captures
- Admin UI for the running total (Cloudflare dashboard + Stripe dashboard serve this purpose)
- Partial refund handling (Stripe dashboard handles refunds; the KV total is not decremented)
