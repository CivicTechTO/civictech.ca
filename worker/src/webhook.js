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
    ['verify']
  );

  const signedPayloadBytes = new TextEncoder().encode(signedPayload);
  for (const sig of signatures) {
    const sigBytes = new Uint8Array(sig.match(/.{2}/g).map((h) => parseInt(h, 16)));
    if (await crypto.subtle.verify('HMAC', cryptoKey, sigBytes, signedPayloadBytes)) {
      return true;
    }
  }
  return false;
}
