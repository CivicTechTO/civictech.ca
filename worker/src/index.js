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
