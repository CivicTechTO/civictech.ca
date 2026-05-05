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
  it('rejects 350001 cents (above maximum)', () => {
    expect(validateAmount(350001)).toEqual({ valid: false, error: 'Maximum donation is $3,500.00' });
  });
  it('accepts 100 cents ($1.00 — minimum)', () => {
    expect(validateAmount(100)).toEqual({ valid: true });
  });
  it('accepts 2500 cents ($25.00)', () => {
    expect(validateAmount(2500)).toEqual({ valid: true });
  });
  it('accepts 350000 cents ($3,500.00 — maximum)', () => {
    expect(validateAmount(350000)).toEqual({ valid: true });
  });
});
