export async function incrementTotal(kv, amountCents) {
  const current = await kv.get('total_cents');
  const newTotal = (current !== null ? parseInt(current, 10) : 0) + amountCents;
  await kv.put('total_cents', String(newTotal));
  return newTotal;
}

const TIMESTAMP_TOLERANCE_SECONDS = 300;

export async function verifyStripeSignature(body, header, secret) {
  if (typeof header !== 'string' || header.length === 0) return false;

  let timestamp = null;
  const signatures = [];

  for (const rawEl of header.split(',')) {
    const el = rawEl.trim();
    const eqIdx = el.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = el.slice(0, eqIdx).trim();
    const value = el.slice(eqIdx + 1).trim();
    if (value.length === 0) continue;
    if (key === 't') timestamp = value;
    if (key === 'v1') signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  const timestampSeconds = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(timestampSeconds)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds) > TIMESTAMP_TOLERANCE_SECONDS) return false;

  const signedPayload = `${timestamp}.${body}`;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signedPayloadBytes = new TextEncoder().encode(signedPayload);
  for (const sig of signatures) {
    if (sig.length === 0 || sig.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(sig)) {
      continue;
    }
    const sigBytes = new Uint8Array(sig.length / 2);
    for (let i = 0; i < sig.length; i += 2) {
      sigBytes[i / 2] = Number.parseInt(sig.slice(i, i + 2), 16);
    }
    if (await crypto.subtle.verify('HMAC', cryptoKey, sigBytes, signedPayloadBytes)) {
      return true;
    }
  }
  return false;
}
