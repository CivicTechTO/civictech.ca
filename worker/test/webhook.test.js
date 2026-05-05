import { describe, it, expect } from 'vitest';
import { incrementTotal, verifyStripeSignature } from '../src/webhook.js';

function makeMockKV(initialCents = null) {
  const store = initialCents !== null ? { total_cents: String(initialCents) } : {};
  return {
    store,
    get: async (key) => store[key] ?? null,
    put: async (key, value) => { store[key] = value; },
  };
}

async function makeSignature(body, timestamp, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${body}`)
  );
  return Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

describe('verifyStripeSignature', () => {
  const SECRET = 'whsec_test';
  const BODY = '{"type":"checkout.session.completed"}';

  function nowTs() {
    return String(Math.floor(Date.now() / 1000));
  }

  it('accepts a valid signature', async () => {
    const ts = nowTs();
    const sig = await makeSignature(BODY, ts, SECRET);
    expect(await verifyStripeSignature(BODY, `t=${ts},v1=${sig}`, SECRET)).toBe(true);
  });

  it('rejects a wrong signature', async () => {
    const ts = nowTs();
    expect(await verifyStripeSignature(BODY, `t=${ts},v1=${'0'.repeat(64)}`, SECRET)).toBe(false);
  });

  it('accepts when one of multiple v1 values matches (key rotation)', async () => {
    const ts = nowTs();
    const sig = await makeSignature(BODY, ts, SECRET);
    expect(await verifyStripeSignature(BODY, `t=${ts},v1=${'0'.repeat(64)},v1=${sig}`, SECRET)).toBe(true);
  });

  it('rejects when all v1 values are wrong', async () => {
    const ts = nowTs();
    expect(await verifyStripeSignature(BODY, `t=${ts},v1=${'0'.repeat(64)},v1=${'f'.repeat(64)}`, SECRET)).toBe(false);
  });

  it('rejects a tampered body', async () => {
    const ts = nowTs();
    const sig = await makeSignature(BODY, ts, SECRET);
    expect(await verifyStripeSignature('{"type":"evil"}', `t=${ts},v1=${sig}`, SECRET)).toBe(false);
  });

  it('rejects a wrong secret', async () => {
    const ts = nowTs();
    const sig = await makeSignature(BODY, ts, SECRET);
    expect(await verifyStripeSignature(BODY, `t=${ts},v1=${sig}`, 'wrong_secret')).toBe(false);
  });

  it('rejects a header with no timestamp', async () => {
    const ts = nowTs();
    const sig = await makeSignature(BODY, ts, SECRET);
    expect(await verifyStripeSignature(BODY, `v1=${sig}`, SECRET)).toBe(false);
  });

  it('rejects a header with no v1 signature', async () => {
    expect(await verifyStripeSignature(BODY, `t=${nowTs()}`, SECRET)).toBe(false);
  });

  it('rejects a timestamp older than 5 minutes', async () => {
    const staleTs = String(Math.floor(Date.now() / 1000) - 301);
    const sig = await makeSignature(BODY, staleTs, SECRET);
    expect(await verifyStripeSignature(BODY, `t=${staleTs},v1=${sig}`, SECRET)).toBe(false);
  });

  it('rejects a timestamp more than 5 minutes in the future', async () => {
    const futureTs = String(Math.floor(Date.now() / 1000) + 301);
    const sig = await makeSignature(BODY, futureTs, SECRET);
    expect(await verifyStripeSignature(BODY, `t=${futureTs},v1=${sig}`, SECRET)).toBe(false);
  });

  it('rejects a non-numeric timestamp', async () => {
    const sig = await makeSignature(BODY, 'notanumber', SECRET);
    expect(await verifyStripeSignature(BODY, `t=notanumber,v1=${sig}`, SECRET)).toBe(false);
  });

  it('handles whitespace around header fields', async () => {
    const ts = nowTs();
    const sig = await makeSignature(BODY, ts, SECRET);
    expect(await verifyStripeSignature(BODY, ` t=${ts} , v1=${sig} `, SECRET)).toBe(true);
  });

  it('rejects a malformed v1 value (odd-length hex)', async () => {
    const ts = nowTs();
    expect(await verifyStripeSignature(BODY, `t=${ts},v1=abc`, SECRET)).toBe(false);
  });

  it('rejects a malformed v1 value (non-hex characters)', async () => {
    const ts = nowTs();
    expect(await verifyStripeSignature(BODY, `t=${ts},v1=${'zz'.repeat(32)}`, SECRET)).toBe(false);
  });
});

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
