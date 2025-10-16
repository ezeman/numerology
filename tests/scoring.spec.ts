import { describe, it, expect } from 'vitest';
import { analyzePhone, analyzePlate } from '@/lib/scoring';
import { digitalRoot } from '@/lib/normalize';

describe('scoring', () => {
  it('digital root', () => {
    expect(digitalRoot(99)).toBe(9 + 9 === 18 ? 1 + 8 : 0);
  });

  it('analyze phone basic', () => {
    const res = analyzePhone('0812345678');
    expect(res.input).toBe('0812345678'.replace(/\D/g, ''));
    expect(res.totals.digitalRoot).toBeGreaterThan(0);
    expect(res.pairs.length).toBeGreaterThan(0);
  });

  it('analyze plate basic', () => {
    const res = analyzePlate('กข 7899');
    expect(res.letters.length).toBeGreaterThan(0);
    expect(res.totals.sum).toBeGreaterThan(0);
  });
});

