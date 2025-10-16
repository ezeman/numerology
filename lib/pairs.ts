import pairsData from '@/data/pairs.json';

export type PairInfo = {
  pair: string;
  th?: string;
  en?: string;
  weight: number;
};

const dict = new Map<string, PairInfo>();
pairsData.pairs.forEach((p) => {
  dict.set(p.pair, p);
});

export function lookupPair(pair: string): PairInfo | undefined {
  if (dict.has(pair)) return dict.get(pair);
  const rev = pair.split('').reverse().join('');
  return dict.get(rev);
}

export function extractPairs(digits: string): string[] {
  const arr: string[] = [];
  for (let i = 0; i < digits.length - 1; i++) {
    arr.push(digits.slice(i, i + 2));
  }
  return arr;
}

