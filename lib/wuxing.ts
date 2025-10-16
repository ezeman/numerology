import mapping from '@/data/wuxing.json';

export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

const digitToElement: Record<string, Element> = {} as any;
Object.entries(mapping).forEach(([el, digits]) => {
  (digits as number[]).forEach((d) => (digitToElement[String(d)] = el as Element));
});

const supportMap: Record<Element, Element> = {
  Wood: 'Water',
  Fire: 'Wood',
  Earth: 'Fire',
  Metal: 'Earth',
  Water: 'Metal',
};

export function tallyElements(digits: string) {
  const counts: Record<Element, number> = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };
  for (const d of digits) {
    const el = digitToElement[d];
    if (el) counts[el]++;
  }
  return counts;
}

export function supportiveDigitsForWeak(counts: Record<Element, number>) {
  // Find weakest element(s)
  const entries = Object.entries(counts) as [Element, number][];
  const min = Math.min(...entries.map(([, c]) => c));
  const weakest = entries.filter(([, c]) => c === min).map(([e]) => e);
  // Recommend digits of supporting elements
  const recommended = new Set<string>();
  for (const w of weakest) {
    const sup = supportMap[w];
    const digits = (mapping as any)[sup] as number[];
    digits.forEach((d) => recommended.add(String(d)));
  }
  return Array.from(recommended);
}

