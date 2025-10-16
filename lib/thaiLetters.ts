import mapData from '@/data/thaiLetterMap.json';
import { digitalRoot } from './normalize';

const letterMap: Record<string, number> = {};
for (const item of mapData.letters) {
  letterMap[item.ch] = digitalRoot(item.index);
}

export function scoreThaiLetters(text: string): { sum: number; letters: { ch: string; value: number }[] } {
  const letters = (text || '').replace(/[^\u0E00-\u0E7F]/g, '').split('');
  const details = letters.map((ch) => ({ ch, value: letterMap[ch] || 0 }));
  const sum = details.reduce((a, b) => a + b.value, 0);
  return { sum, letters: details };
}

