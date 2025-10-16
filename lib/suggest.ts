import { supportiveDigitsForWeak, tallyElements } from './wuxing';
import { extractPairs, lookupPair } from './pairs';

export function suggestEndings(digits: string, count = 3): string[] {
  const elCounts = tallyElements(digits);
  const support = supportiveDigitsForWeak(elCounts);
  // Use positive pairs that end with supportive digits
  const pairs = extractPairs(digits);
  const positives = ['15','51','24','42','36','63','45','54','56','65','66','69','96'];
  const suggestions = new Set<string>();
  for (const d of support) {
    for (const p of positives) {
      if (p.endsWith(d)) suggestions.add(p);
      if (suggestions.size >= count) break;
    }
    if (suggestions.size >= count) break;
  }
  // Fallback to positive pairs
  for (const p of positives) {
    suggestions.add(p);
    if (suggestions.size >= count) break;
  }
  return Array.from(suggestions).slice(0, count);
}

