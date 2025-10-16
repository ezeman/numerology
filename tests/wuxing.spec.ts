import { describe, it, expect } from 'vitest';
import { tallyElements, supportiveDigitsForWeak } from '@/lib/wuxing';

describe('wuxing', () => {
  it('tally elements', () => {
    const counts = tallyElements('1234567890');
    expect(counts.Wood).toBe(2); // 1,2
    expect(counts.Fire).toBe(2); // 3,4
    expect(counts.Earth).toBe(2); // 5,6
    expect(counts.Metal).toBe(2); // 7,8
    expect(counts.Water).toBe(2); // 9,0
  });

  it('supportive digits recommend', () => {
    const counts = tallyElements('11112222');
    const rec = supportiveDigitsForWeak(counts);
    // Fire is supported by Wood; others weak so recommend Metal/Water/Earth too
    expect(rec.length).toBeGreaterThan(0);
  });
});

