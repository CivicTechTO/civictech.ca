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
