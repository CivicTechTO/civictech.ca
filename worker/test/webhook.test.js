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
