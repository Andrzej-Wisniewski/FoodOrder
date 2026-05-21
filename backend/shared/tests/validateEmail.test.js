import { describe, it, expect } from 'vitest';
import validateEmail from '../utils/validateEmail.js';

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('a@b.pl')).toBe(true);
    expect(validateEmail('user@test.com')).toBe(true);
    expect(validateEmail('user.test@test.pl')).toBe(true);
  });

  it('returns false when @ is missing', () => {
    expect(validateEmail('user.test.com')).toBe(false);
    expect(validateEmail('invalid')).toBe(false);
  });

  it('returns false when domain has no dot', () => {
    expect(validateEmail('user@com')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('returns false when email contains spaces', () => {
    expect(validateEmail('user @test.com')).toBe(false);
    expect(validateEmail('user@ test.com')).toBe(false);
    expect(validateEmail('user@test. com')).toBe(false);
  });

  it('returns false for invalid formats', () => {
    expect(validateEmail('@test.com')).toBe(false);
    expect(validateEmail('user@.com')).toBe(false);
    expect(validateEmail('user@com.')).toBe(false);
  });
});
