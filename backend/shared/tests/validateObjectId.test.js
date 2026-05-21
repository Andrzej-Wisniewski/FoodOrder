import { describe, it, expect } from 'vitest';
import validateObjectId from '../utils/validateObjectId.js';

describe('validateObjectId', () => {
  it('returns true for valid 24-char hex ObjectId', () => {
    expect(validateObjectId('69371d3c05b9f19e119800a3')).toBe(true);
    expect(validateObjectId('000000000000000000000000')).toBe(true);
    expect(validateObjectId('ffffffffffffffffffffffff')).toBe(true);
  });

  it('returns false for too short string', () => {
    expect(validateObjectId('abc')).toBe(false);
    expect(validateObjectId('123')).toBe(false);
    expect(validateObjectId('69371d3c05b9f19e119800a')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(validateObjectId('')).toBe(false);
  });

  it('returns false for null and undefined', () => {
    expect(validateObjectId(null)).toBe(false);
    expect(validateObjectId(undefined)).toBe(false);
  });

  it('returns false for strings with invalid characters', () => {
    expect(validateObjectId('69371d3c05b9f19e119800aG')).toBe(false);
    expect(validateObjectId('69371d3c0-b9f19e119800a3')).toBe(false);
  });
});
