# Samosas Donation Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/donate/` page to civictech.ca with a live progress bar and inline Stripe Embedded Checkout, backed by a Cloudflare Worker that persists the running donation total in Cloudflare KV.

**Architecture:** A Cloudflare Worker handles three endpoints (`GET /total`, `POST /checkout`, `POST /webhook`). The Jekyll page fetches the live total on load and creates a Stripe Checkout Session on demand. Stripe fires a signed webhook on payment completion; the Worker increments a single KV key (`total_cents`). Secrets flow through Cloudflare Worker env vars and GitHub Actions secrets injected into `_config.yml` at build time.

**Tech Stack:** Cloudflare Workers (plain JS, no framework), Cloudflare KV, Stripe Checkout API (embedded mode + webhooks), Stripe.js v3, Jekyll 4, Vitest (unit tests for pure Worker logic)

---

## File Map

| File | Status | Responsibility |
|---|---|---|
| `worker/package.json` | Create | Wrangler + Vitest dev dependencies |
| `worker/wrangler.toml` | Create | Worker name, KV binding, compatibility date |
| `worker/vitest.config.js` | Create | Vitest config (Node environment) |
| `worker/.gitignore` | Create | Exclude `node_modules/` and `.dev.vars` |
| `worker/.dev.vars` | Create (gitignored) | Local-only Stripe secrets for `wrangler dev` |
| `worker/src/validate.js` | Create | Pure `validateAmount` function — no I/O |
| `worker/src/webhook.js` | Create | Pure `incrementTotal` + `verifyStripeSignature` |
| `worker/src/index.js` | Create | Worker fetch handler — routing only, delegates to above |
| `worker/test/validate.test.js` | Create | Unit tests for `validateAmount` |
| `worker/test/webhook.test.js` | Create | Unit tests for `incrementTotal` |
| `_pages/donate.html` | Create | Jekyll page — inline style + inline JS |
| `.github/workflows/pages.yml` | Modify | Add `STRIPE_PUBLIC_KEY` + `WORKER_URL` secret injection |

---

## Task 1: Scaffold Worker project

**Files:**
- Create: `worker/package.json`
- Create: `worker/wrangler.toml`
- Create: `worker/vitest.config.js`
- Create: `worker/.gitignore`
- Create: `worker/.dev.vars`
- Create: `worker/src/validate.js` (skeleton)
- Create: `worker/src/webhook.js` (skeleton)
- Create: `worker/src/index.js` (skeleton)
- Create: `worker/test/validate.test.js` (skeleton)
- Create: `worker/test/webhook.test.js` (skeleton)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p worker/src worker/test
```

- [ ] **Step 2: Create `worker/package.json`**

```json
{
  "name": "ctt-donations-worker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run"
  },
  "devDependencies": {
    "wrangler": "^3.0.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 3: Create `worker/wrangler.toml`**

```toml
name = "ctt-donations"
main = "src/index.js"
compatibility_date = "2024-09-23"

[[kv_namespaces]]
binding = "DONATION_KV"
id = "PLACEHOLDER"
```

The `id` will be replaced with the real KV namespace ID in Task 5.

- [ ] **Step 4: Create `worker/vitest.config.js`**

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

- [ ] **Step 5: Create `worker/.gitignore`**

```
node_modules/
.dev.vars
```

- [ ] **Step 6: Create `worker/.dev.vars`** (gitignored — never committed)

```
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_TEST_KEY
STRIPE_WEBHOOK_SECRET=whsec_placeholder
```

Fill in your Stripe **test mode** secret key from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys).

- [ ] **Step 7: Create skeleton source files**

`worker/src/validate.js`:
```javascript
export function validateAmount(amount_cents) {}
```

`worker/src/webhook.js`:
```javascript
export async function incrementTotal(kv, amountCents) {}

export async function verifyStripeSignature(body, header, secret) {}
```

`worker/src/index.js`:
```javascript
export default {
  async fetch(request, env) {
    return new Response('Not implemented', { status: 501 });
  },
};
```

`worker/test/validate.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { validateAmount } from '../src/validate.js';
```

`worker/test/webhook.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { incrementTotal } from '../src/webhook.js';
```

- [ ] **Step 8: Install dependencies**

```bash
cd worker && npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 9: Commit**

```bash
git add worker/
git commit -m "feat: scaffold Cloudflare Worker for donation campaign"
```

---

## Task 2: Implement and test `validateAmount`

**Files:**
- Modify: `worker/src/validate.js`
- Modify: `worker/test/validate.test.js`

- [ ] **Step 1: Write the failing tests**

Replace `worker/test/validate.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { validateAmount } from '../src/validate.js';

describe('validateAmount', () => {
  it('rejects a float', () => {
    expect(validateAmount(9.99)).toEqual({ valid: false, error: 'amount_cents must be an integer' });
  });
  it('rejects a string', () => {
    expect(validateAmount('2500')).toEqual({ valid: false, error: 'amount_cents must be an integer' });
  });
  it('rejects null', () => {
    expect(validateAmount(null)).toEqual({ valid: false, error: 'amount_cents must be an integer' });
  });
  it('rejects 99 cents (below minimum)', () => {
    expect(validateAmount(99)).toEqual({ valid: false, error: 'Minimum donation is $1.00' });
  });
  it('rejects 1000001 cents (above maximum)', () => {
    expect(validateAmount(1000001)).toEqual({ valid: false, error: 'Maximum donation is $10,000.00' });
  });
  it('accepts 100 cents ($1.00 — minimum)', () => {
    expect(validateAmount(100)).toEqual({ valid: true });
  });
  it('accepts 2500 cents ($25.00)', () => {
    expect(validateAmount(2500)).toEqual({ valid: true });
  });
  it('accepts 1000000 cents ($10,000.00 — maximum)', () => {
    expect(validateAmount(1000000)).toEqual({ valid: true });
  });
});
```

- [ ] **Step 2: Run tests — expect 8 failures**

```bash
cd worker && npm test
```

Expected: 8 failures (function returns `undefined`, so `toEqual` comparisons fail).

- [ ] **Step 3: Implement `validateAmount`**

Replace `worker/src/validate.js`:

```javascript
export function validateAmount(amount_cents) {
  if (!Number.isInteger(amount_cents)) {
    return { valid: false, error: 'amount_cents must be an integer' };
  }
  if (amount_cents < 100) {
    return { valid: false, error: 'Minimum donation is $1.00' };
  }
  if (amount_cents > 1000000) {
    return { valid: false, error: 'Maximum donation is $10,000.00' };
  }
  return { valid: true };
}
```

- [ ] **Step 4: Run tests — expect 8 passing**

```bash
cd worker && npm test
```

Expected: `8 passed`.

- [ ] **Step 5: Commit**

```bash
git add worker/src/validate.js worker/test/validate.test.js
git commit -m "feat: implement validateAmount with tests"
```

---

## Task 3: Implement and test `incrementTotal` and `verifyStripeSignature`

**Files:**
- Modify: `worker/src/webhook.js`
- Modify: `worker/test/webhook.test.js`

- [ ] **Step 1: Write the failing tests**

Replace `worker/test/webhook.test.js`:

```javascript
import { describe, it, expect } from 'vitest';
import { incrementTotal } from '../src/webhook.js';

function makeMockKV(initialCents = null) {
  const store = initialCents !== null ? { total_cents: String(initialCents) } : {};
  return {
    store,
    get: async (key) => store[key] ?? null,
    put: async (key, value) => { store[key] = value; },
  };
}

describe('incrementTotal', () => {
  it('adds to an existing total', async () => {
    const kv = makeMockKV(100000);
    const result = await incrementTotal(kv, 2500);
    expect(result).toBe(102500);
    expect(kv.store.total_cents).toBe('102500');
  });

  it('starts from zero when KV key is absent', async () => {
    const kv = makeMockKV();
    const result = await incrementTotal(kv, 5000);
    expect(result).toBe(5000);
    expect(kv.store.total_cents).toBe('5000');
  });

  it('handles large sponsor amounts correctly', async () => {
    const kv = makeMockKV(0);
    const result = await incrementTotal(kv, 27000);
    expect(result).toBe(27000);
    expect(kv.store.total_cents).toBe('27000');
  });
});
```

- [ ] **Step 2: Run tests — expect 3 failures**

```bash
cd worker && npm test
```

Expected: 3 failures (function returns `undefined`).

- [ ] **Step 3: Implement `incrementTotal` and `verifyStripeSignature`**

Replace `worker/src/webhook.js`:

```javascript
export async function incrementTotal(kv, amountCents) {
  const current = await kv.get('total_cents');
  const newTotal = (current !== null ? parseInt(current, 10) : 0) + amountCents;
  await kv.put('total_cents', String(newTotal));
  return newTotal;
}

export async function verifyStripeSignature(body, header, secret) {
  let timestamp = null;
  const signatures = [];

  for (const el of header.split(',')) {
    const eqIdx = el.indexOf('=');
    const key = el.slice(0, eqIdx);
    const value = el.slice(eqIdx + 1);
    if (key === 't') timestamp = value;
    if (key === 'v1') signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  const signedPayload = `${timestamp}.${body}`;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(signedPayload));
  const computed = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return signatures.includes(computed);
}
```

- [ ] **Step 4: Run tests — expect 11 passing (8 + 3)**

```bash
cd worker && npm test
```

Expected: `11 passed`.

- [ ] **Step 5: Commit**

```bash
git add worker/src/webhook.js worker/test/webhook.test.js
git commit -m "feat: implement incrementTotal and verifyStripeSignature with tests"
```

---

## Task 4: Implement Worker routing and all handlers

**Files:**
- Modify: `worker/src/index.js`

- [ ] **Step 1: Replace `worker/src/index.js` with the full implementation**

```javascript
import { validateAmount } from './validate.js';
import { incrementTotal, verifyStripeSignature } from './webhook.js';

const GOAL_CENTS = 350000;

const ALLOWED_ORIGINS = [
  'https://civictech.ca',
  'http://localhost:4000',
];

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function json(data, status, request) {
  return Response.json(data, { status, headers: corsHeaders(request) });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    if (request.method === 'GET' && url.pathname === '/total') {
      const raw = await env.DONATION_KV.get('total_cents');
      const raised_cents = raw !== null ? parseInt(raw, 10) : 0;
      return json({ raised_cents, goal_cents: GOAL_CENTS }, 200, request);
    }

    if (request.method === 'POST' && url.pathname === '/checkout') {
      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: 'Invalid JSON' }, 400, request);
      }

      const validation = validateAmount(body.amount_cents);
      if (!validation.valid) {
        return json({ error: validation.error }, 400, request);
      }

      const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          ui_mode: 'embedded',
          mode: 'payment',
          currency: 'cad',
          return_url: 'https://civictech.ca/donate/?session_id={CHECKOUT_SESSION_ID}',
          'line_items[0][price_data][currency]': 'cad',
          'line_items[0][price_data][unit_amount]': String(body.amount_cents),
          'line_items[0][price_data][product_data][name]': 'Civic Tech Toronto 2027 Donation',
          'line_items[0][quantity]': '1',
        }),
      });

      if (!stripeRes.ok) {
        const err = await stripeRes.json();
        console.error('Stripe error:', err);
        return json({ error: 'Failed to create payment session' }, 502, request);
      }

      const session = await stripeRes.json();
      return json({ clientSecret: session.client_secret }, 200, request);
    }

    if (request.method === 'POST' && url.pathname === '/webhook') {
      const body = await request.text();
      const signature = request.headers.get('Stripe-Signature');

      if (!signature) {
        return new Response('Missing Stripe-Signature header', { status: 400 });
      }

      const isValid = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
      if (!isValid) {
        return new Response('Invalid signature', { status: 400 });
      }

      const event = JSON.parse(body);
      if (event.type === 'checkout.session.completed') {
        await incrementTotal(env.DONATION_KV, event.data.object.amount_total);
      }

      return new Response('OK', { status: 200 });
    }

    return new Response('Not found', { status: 404 });
  },
};
```

Note: `ALLOWED_ORIGINS` includes `http://localhost:4000` so the Jekyll dev server can call the Worker during local testing. Production requests from `https://civictech.ca` are also allowed.

- [ ] **Step 2: Run all tests to confirm no regressions**

```bash
cd worker && npm test
```

Expected: `11 passed` (same as Task 3 — `index.js` has no unit tests, covered by integration testing in Task 5).

- [ ] **Step 3: Commit**

```bash
git add worker/src/index.js
git commit -m "feat: implement Worker routing and endpoint handlers"
```

---

## Task 5: Set up Cloudflare and test locally

A Cloudflare account is required. Create one free at cloudflare.com if needed.

**Files:**
- Modify: `worker/wrangler.toml`

- [ ] **Step 1: Authenticate Wrangler**

```bash
cd worker && npx wrangler login
```

A browser window opens — authorise Wrangler with your Cloudflare account.

- [ ] **Step 2: Create the KV namespace**

```bash
npx wrangler kv namespace create DONATION_KV
```

Expected output (IDs will differ):
```
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "DONATION_KV", id = "abc123yournamespaceId" }
```

Copy the `id` value.

- [ ] **Step 3: Update `worker/wrangler.toml` with the real KV namespace ID**

```toml
name = "ctt-donations"
main = "src/index.js"
compatibility_date = "2024-09-23"

[[kv_namespaces]]
binding = "DONATION_KV"
id = "abc123yournamespaceId"
```

Replace `abc123yournamespaceId` with the ID from Step 2.

- [ ] **Step 4: Start the local dev server**

```bash
cd worker && npm run dev
```

Expected: Worker running at `http://localhost:8787`. Leave this terminal running.

- [ ] **Step 5: Test `GET /total`** (new terminal)

```bash
curl http://localhost:8787/total
```

Expected:
```json
{"raised_cents":0,"goal_cents":350000}
```

- [ ] **Step 6: Test `POST /checkout` validation**

```bash
curl -s -X POST http://localhost:8787/checkout \
  -H "Content-Type: application/json" \
  -d '{"amount_cents": 50}' | cat
```

Expected:
```json
{"error":"Minimum donation is $1.00"}
```

- [ ] **Step 7: Test `POST /checkout` with valid amount**

```bash
curl -s -X POST http://localhost:8787/checkout \
  -H "Content-Type: application/json" \
  -d '{"amount_cents": 2500}' | cat
```

Expected: `{"clientSecret":"cs_test_..."}` (a real Stripe client secret — the Worker hits Stripe's test API using your `.dev.vars` key).

If you see a Stripe error, verify `STRIPE_SECRET_KEY` in `worker/.dev.vars` is a valid test key.

- [ ] **Step 8: Stop dev server and commit**

```bash
git add worker/wrangler.toml
git commit -m "chore: add Cloudflare KV namespace ID"
```

---

## Task 6: Deploy Worker to Cloudflare

- [ ] **Step 1: Add `STRIPE_SECRET_KEY` to Cloudflare**

```bash
cd worker && npx wrangler secret put STRIPE_SECRET_KEY
```

When prompted, paste your Stripe **test mode** secret key (`sk_test_...`). Switch to `sk_live_...` only when launching publicly.

- [ ] **Step 2: Add a placeholder `STRIPE_WEBHOOK_SECRET`**

```bash
npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

Enter `whsec_placeholder` — you will replace this with the real value in Task 7 after registering the webhook.

- [ ] **Step 3: Deploy**

```bash
cd worker && npm run deploy
```

Expected output includes the Worker URL:
```
✨  Built successfully
Published ctt-donations (x.x.x)
  https://ctt-donations.YOUR-SUBDOMAIN.workers.dev
```

Copy this URL — you'll need it for Task 7, Task 9, and Task 10.

- [ ] **Step 4: Smoke-test the deployed Worker**

```bash
curl https://ctt-donations.YOUR-SUBDOMAIN.workers.dev/total
```

Expected:
```json
{"raised_cents":0,"goal_cents":350000}
```

---

## Task 7: Configure Stripe webhook

- [ ] **Step 1: Register the webhook endpoint in Stripe Dashboard**

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **"Add endpoint"**
3. Endpoint URL: `https://ctt-donations.YOUR-SUBDOMAIN.workers.dev/webhook`
4. Events to listen to: select **`checkout.session.completed`** only
5. Click **"Add endpoint"**
6. On the endpoint detail page, click **"Reveal"** next to **Signing secret** — copy the `whsec_...` value

- [ ] **Step 2: Update `STRIPE_WEBHOOK_SECRET` in Cloudflare with the real value**

```bash
cd worker && npx wrangler secret put STRIPE_WEBHOOK_SECRET
```

Paste the `whsec_...` value from Step 1.

- [ ] **Step 3: Verify webhook with Stripe CLI**

Install the [Stripe CLI](https://docs.stripe.com/stripe-cli) if you don't have it, then in one terminal:

```bash
stripe listen --forward-to https://ctt-donations.YOUR-SUBDOMAIN.workers.dev/webhook
```

In a second terminal, trigger a test event:

```bash
stripe trigger checkout.session.completed
```

Expected in the first terminal: a line ending with `[200] POST https://ctt-donations...workers.dev/webhook`

- [ ] **Step 4: Confirm KV total incremented**

```bash
curl https://ctt-donations.YOUR-SUBDOMAIN.workers.dev/total
```

Expected: `raised_cents` is now non-zero (the test event includes a synthetic `amount_total`).

- [ ] **Step 5: Reset KV total to 0**

```bash
cd worker && npx wrangler kv key put --namespace-id=YOUR_KV_NAMESPACE_ID total_cents "0"
```

Replace `YOUR_KV_NAMESPACE_ID` with the ID from Task 5 Step 2. Confirm with another `curl /total` — `raised_cents` should be `0`.

---

## Task 8: Build the Jekyll donation page

**Files:**
- Create: `_pages/donate.html`

- [ ] **Step 1: Create `_pages/donate.html`**

```html
---
title: "Support Civic Tech Toronto"
layout: page
permalink: "/donate/"
excerpt: "Help us feed 50 Tuesday nights in 2027."
---

<style>
.donate-wrapper {
  max-width: 640px;
  margin: 0 auto;
}

/* Progress bar */
.donate-progress {
  margin-bottom: 2rem;
}
.donate-progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
}
#raised-label {
  font-weight: 600;
}
.donate-progress progress {
  width: 100%;
  height: 1.2rem;
}

/* Section labels */
.donate-section-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: var(--pico-color);
}

/* Amount sections */
.donate-amount-section {
  margin-bottom: 1.5rem;
}

/* Preset pill buttons */
.donate-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.donate-preset {
  padding: 0.5rem 1.25rem;
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: 100px;
  background: var(--pico-muted-background-color);
  color: var(--pico-color);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  width: auto;
  margin: 0;
}
.donate-preset:hover {
  border-color: var(--pico-primary);
  color: var(--pico-primary);
}
.donate-preset.is-selected {
  background: var(--pico-primary);
  border-color: var(--pico-primary);
  color: var(--pico-primary-inverse);
}

/* Custom amount input */
#custom-amount-wrapper {
  margin-bottom: 0.5rem;
}
#custom-amount-wrapper label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}
#custom-amount {
  width: 100%;
  max-width: 200px;
}

/* Sponsor cards */
.donate-sponsors {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.donate-sponsor-card {
  flex: 1;
  min-width: 160px;
}
.donate-sponsor-btn {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.85rem 1rem;
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  background: var(--pico-muted-background-color);
  color: var(--pico-color);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
  margin: 0;
}
.donate-sponsor-btn:hover {
  border-color: var(--pico-primary);
}
.donate-sponsor-btn.is-selected {
  background: var(--pico-primary);
  border-color: var(--pico-primary);
  color: var(--pico-primary-inverse);
}
.donate-sponsor-title {
  font-size: 0.875rem;
  font-weight: 600;
}
.donate-sponsor-amount {
  font-size: 1.4rem;
  font-weight: 700;
}
.donate-sponsor-label {
  font-size: 0.8rem;
  color: var(--pico-muted-color);
  text-align: center;
  margin: 0.35rem 0 0;
}

/* Primary donate CTA */
#donate-btn {
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  margin-top: 0.5rem;
}

/* Error message */
#donate-error {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: #fff5f5;
  border: 1.5px solid #c0392b;
  border-radius: var(--pico-border-radius);
}
#donate-error p {
  color: #c0392b;
  font-size: 0.9rem;
  margin: 0;
}
#donate-error a {
  color: #c0392b;
  font-weight: 600;
}

/* Thank-you state */
#thanks {
  text-align: center;
  padding: 2.5rem 2rem;
  background: var(--pico-muted-background-color);
  border: 1.5px solid var(--pico-muted-border-color);
  border-radius: var(--pico-border-radius);
  margin-top: 1.5rem;
}
#thanks p {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
}
</style>

<div class="donate-wrapper">

  <section class="donate-progress">
    <div class="donate-progress-labels">
      <span id="raised-label">Loading…</span>
      <span>$3,500 goal</span>
    </div>
    <progress id="donate-bar" max="3500"></progress>
  </section>

  <section class="donate-explainer">
    <p>Civic Tech Toronto runs free weekly meetups every Tuesday in Toronto, bringing together technologists, designers, and community advocates to build civic technology. We're completely volunteer-run with no paid staff.</p>
    <p>We need to raise <strong>$3,500 CAD</strong> to cover food (samosas — a Civic Tech Toronto tradition) across 50 Tuesday evenings in 2027. That's roughly $65 per event.</p>
    <p>Every dollar goes directly to feeding the people who show up.</p>
  </section>

  <section id="donate-form">

    <div class="donate-amount-section">
      <p class="donate-section-label">Choose an amount</p>
      <div class="donate-presets">
        <button class="donate-preset" data-amount="1000">$10</button>
        <button class="donate-preset" data-amount="2500">$25</button>
        <button class="donate-preset" data-amount="5000">$50</button>
        <button class="donate-preset" data-custom="true">Custom</button>
      </div>
      <div id="custom-amount-wrapper" hidden>
        <label for="custom-amount">Your amount (CAD $)</label>
        <input type="number" id="custom-amount" min="1" step="1" placeholder="e.g. 30">
      </div>
    </div>

    <div class="donate-amount-section">
      <p class="donate-section-label">Or sponsor specific nights</p>
      <div class="donate-sponsors">
        <div class="donate-sponsor-card">
          <button class="donate-sponsor-btn" data-amount="6500">
            <span class="donate-sponsor-title">Sponsor a Tuesday</span>
            <span class="donate-sponsor-amount">$65</span>
          </button>
          <p class="donate-sponsor-label">Covers food for one evening</p>
        </div>
        <div class="donate-sponsor-card">
          <button class="donate-sponsor-btn" data-amount="27000">
            <span class="donate-sponsor-title">Sponsor a month</span>
            <span class="donate-sponsor-amount">$270</span>
          </button>
          <p class="donate-sponsor-label">Covers food for four Tuesdays</p>
        </div>
      </div>
    </div>

    <button id="donate-btn" disabled>Select an amount to donate</button>

    <div id="donate-error" hidden>
      <p>Something went wrong. Please try again or email <a href="mailto:hi@civictech.ca">hi@civictech.ca</a>.</p>
    </div>

  </section>

  <div id="checkout" hidden></div>

  <div id="thanks" hidden>
    <p>Thank you — your donation helps keep Civic Tech Toronto running every Tuesday.</p>
  </div>

</div>

<script src="https://js.stripe.com/v3/"></script>
<script>
(function () {
  var STRIPE_PUBLIC_KEY = '{{ site.stripe_public_key }}';
  var WORKER_URL = '{{ site.worker_url }}';

  var stripe = Stripe(STRIPE_PUBLIC_KEY);
  var selectedAmountCents = null;

  var donateBar    = document.getElementById('donate-bar');
  var raisedLabel  = document.getElementById('raised-label');
  var donateForm   = document.getElementById('donate-form');
  var checkoutDiv  = document.getElementById('checkout');
  var thanksDiv    = document.getElementById('thanks');
  var donateBtn    = document.getElementById('donate-btn');
  var donateError  = document.getElementById('donate-error');
  var customWrapper = document.getElementById('custom-amount-wrapper');
  var customInput  = document.getElementById('custom-amount');

  // Show thank-you state when returning from Stripe
  if (new URLSearchParams(window.location.search).has('session_id')) {
    donateForm.hidden = true;
    thanksDiv.hidden = false;
  }

  // Always fetch and show current total (including on thank-you state)
  fetch(WORKER_URL + '/total')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var dollars = Math.floor(data.raised_cents / 100);
      raisedLabel.textContent = '$' + dollars.toLocaleString('en-CA') + ' raised';
      donateBar.value = dollars;
    })
    .catch(function () {
      raisedLabel.textContent = '$0 raised';
      donateBar.value = 0;
    });

  function clearSelections() {
    document.querySelectorAll('.donate-preset, .donate-sponsor-btn').forEach(function (b) {
      b.classList.remove('is-selected');
    });
  }

  function updateDonateBtn() {
    if (selectedAmountCents !== null && selectedAmountCents >= 100) {
      var dollars = (selectedAmountCents / 100).toLocaleString('en-CA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
      donateBtn.textContent = 'Donate $' + dollars;
      donateBtn.disabled = false;
    } else {
      donateBtn.textContent = 'Select an amount to donate';
      donateBtn.disabled = true;
    }
  }

  // Preset pill buttons
  document.querySelectorAll('.donate-preset').forEach(function (btn) {
    btn.addEventListener('click', function () {
      clearSelections();
      btn.classList.add('is-selected');
      if (btn.dataset.custom) {
        customWrapper.hidden = false;
        customInput.focus();
        selectedAmountCents = null;
      } else {
        customWrapper.hidden = true;
        selectedAmountCents = parseInt(btn.dataset.amount, 10);
      }
      updateDonateBtn();
    });
  });

  // Sponsor tier buttons
  document.querySelectorAll('.donate-sponsor-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      clearSelections();
      customWrapper.hidden = true;
      btn.classList.add('is-selected');
      selectedAmountCents = parseInt(btn.dataset.amount, 10);
      updateDonateBtn();
    });
  });

  // Custom amount input
  customInput.addEventListener('input', function () {
    var val = parseFloat(customInput.value);
    selectedAmountCents = (isFinite(val) && val >= 1) ? Math.round(val * 100) : null;
    updateDonateBtn();
  });

  // Donate button: create Checkout Session, mount embedded checkout
  donateBtn.addEventListener('click', function () {
    donateBtn.disabled = true;
    donateBtn.textContent = 'Loading…';
    donateError.hidden = true;

    fetch(WORKER_URL + '/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount_cents: selectedAmountCents }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.clientSecret) throw new Error('No client secret');
        return stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret });
      })
      .then(function (checkout) {
        donateForm.hidden = true;
        checkoutDiv.hidden = false;
        checkout.mount('#checkout');
      })
      .catch(function () {
        donateBtn.disabled = false;
        updateDonateBtn();
        donateError.hidden = false;
      });
  });
})();
</script>
```

- [ ] **Step 2: Add temporary local config values for dev testing**

Add these two lines to `_config.yml` temporarily (you will remove them before committing):

```yaml
stripe_public_key: "pk_test_REPLACE_WITH_YOUR_TEST_PUBLISHABLE_KEY"
worker_url: "http://localhost:8787"
```

- [ ] **Step 3: Start Worker dev server and Jekyll side by side**

In one terminal:
```bash
cd worker && npm run dev
```

In another terminal:
```bash
make serve
```

- [ ] **Step 4: Test the page at http://localhost:4000/donate/**

Verify:
- Progress bar shows `$0 raised` (indeterminate while fetching, then `$0 raised`)
- `$10`, `$25`, `$50`, `Custom` buttons are clickable
- Selecting `$25` makes the donate button say `"Donate $25"` and enables it
- Selecting `Custom` and typing `15` makes it say `"Donate $15"`
- Clicking `Sponsor a Tuesday` makes it say `"Donate $65"`
- Clicking `Sponsor a month` makes it say `"Donate $270"`
- Donate button is disabled until a selection is made

Do NOT click Donate yet — that flow is tested in Task 11.

- [ ] **Step 5: Remove the temporary config lines from `_config.yml`**

Delete the two lines you added in Step 2. Do not commit them — they would override the values injected by GitHub Actions.

- [ ] **Step 6: Commit**

```bash
git add _pages/donate.html
git commit -m "feat: add donation campaign page with embedded Stripe checkout"
```

---

## Task 9: Update GitHub Actions workflow

**Files:**
- Modify: `.github/workflows/pages.yml`

- [ ] **Step 1: Find and replace the secret injection step**

In `.github/workflows/pages.yml`, find:

```yaml
      - name: Inject feedback token
        run: |
          echo "feedback_token: \"$FEEDBACK_TOKEN\"" >> _config.yml
        env:
          FEEDBACK_TOKEN: ${{ secrets.FEEDBACK_TOKEN }}
```

Replace it with:

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

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/pages.yml
git commit -m "chore: inject Stripe public key and Worker URL at build time"
```

---

## Task 10: Add GitHub repository secrets and verify build

- [ ] **Step 1: Add `STRIPE_PUBLIC_KEY` secret**

1. Go to GitHub → repository → **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Name: `STRIPE_PUBLIC_KEY`
4. Value: your Stripe publishable key — `pk_test_...` (test mode) or `pk_live_...` (live). Get it from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys).
5. Click **"Add secret"**

- [ ] **Step 2: Add `WORKER_URL` secret**

1. Click **"New repository secret"**
2. Name: `WORKER_URL`
3. Value: the Cloudflare Worker URL from Task 6 Step 3 (e.g. `https://ctt-donations.YOUR-SUBDOMAIN.workers.dev`)
4. Click **"Add secret"**

- [ ] **Step 3: Push branch and verify CI build**

```bash
git push origin samosas
```

Watch the GitHub Actions run. Expected: build succeeds with no errors.

If the build fails with a missing secret error, verify the secret names match exactly: `STRIPE_PUBLIC_KEY` and `WORKER_URL` (case-sensitive).

---

## Task 11: End-to-end test with Stripe test mode

The Stripe test card is: **`4242 4242 4242 4242`**, any future expiry (e.g. `12/34`), any 3-digit CVC, any postal code.

Test against a preview deployment or the production URL — you can also test locally using `make serve` + `npm run dev` (Worker) if you didn't push to main.

- [ ] **Step 1: Test a standard donation ($25)**

1. Open `/donate/`
2. Confirm progress bar loads (`$0 raised`)
3. Click `$25` → button says `"Donate $25"`
4. Click `"Donate $25"` → Stripe embedded checkout renders inline (no redirect away from the page)
5. Enter: card `4242 4242 4242 4242`, expiry `12/34`, CVC `123`, postal code `M5V 1L9`
6. Click `"Pay $25.00"`
7. Stripe processes payment and redirects to `/donate/?session_id=cs_test_...`

Verify:
- "Thank you" message is visible
- Progress bar is still visible and now shows `$25 raised`
- Amount selector is hidden

- [ ] **Step 2: Confirm Worker KV total updated**

```bash
curl https://ctt-donations.YOUR-SUBDOMAIN.workers.dev/total
```

Expected:
```json
{"raised_cents":2500,"goal_cents":350000}
```

- [ ] **Step 3: Test the custom amount flow**

1. Navigate to `/donate/` (fresh page load — clears the `?session_id` param)
2. Click `"Custom"` → number input appears
3. Type `15` → button says `"Donate $15"`
4. Click `"Donate $15"` → complete with test card
5. Confirm redirect to thank-you state
6. Confirm `/total` returns `raised_cents: 4000` (2500 + 1500)

- [ ] **Step 4: Test the sponsor tier flow**

1. Navigate to `/donate/`
2. Click `"Sponsor a Tuesday"` → button says `"Donate $65"`
3. Click `"Donate $65"` → complete with test card
4. Confirm `/total` returns `raised_cents: 10500` (4000 + 6500)

- [ ] **Step 5: Test the error state**

Stop the Worker dev server (or, if testing against a deployed URL, temporarily point WORKER_URL at an invalid URL by editing `_config.yml` locally and rebuilding). Then:

1. Navigate to `/donate/`, select `$25`, click `"Donate $25"`
2. Confirm the error message appears: `"Something went wrong. Please try again or email hi@civictech.ca."`
3. Confirm the donate button re-enables after the error

Restore the correct `WORKER_URL` before continuing.

- [ ] **Step 6: Reset the KV total for launch**

```bash
cd worker && npx wrangler kv key put --namespace-id=YOUR_KV_NAMESPACE_ID total_cents "0"
```

Confirm with `curl /total` → `raised_cents: 0`.
