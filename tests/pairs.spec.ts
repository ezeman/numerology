import { describe, it, expect } from 'vitest';
import { lookupPair, extractPairs } from '@/lib/pairs';

describe('pairs', () => {
  it('symmetric lookup', () => {
    const a = lookupPair('56');
    const b = lookupPair('65');
    expect(a?.weight).toBe(2);
    expect(b?.weight).toBe(2);
  });

  it('extract overlapping pairs', () => {
    expect(extractPairs('081234')).toEqual(['08', '81', '12', '23', '34']);
  });
});

