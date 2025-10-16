import { normalizeDigits, digitalRoot } from './normalize';
import { extractPairs, lookupPair } from './pairs';
import { tallyElements, supportiveDigitsForWeak } from './wuxing';
import { scoreThaiLetters } from './thaiLetters';
import cfg from '@/data/config.json';
import pairsJson from '@/data/pairs.json';
import { suggestEndings } from './suggest';

export type PairResult = { pair: string; score: number; meaning?: { th?: string; en?: string } };
export type Summary = { grade: 'A' | 'B' | 'C'; highlights: string[]; watchouts: string[]; rules: string[] };
export type Elements = { counts: ReturnType<typeof tallyElements>; recommendation: string };
export type AnalyzePhoneResult = {
  input: string;
  pairs: PairResult[];
  totals: { sum: number; digitalRoot: number };
  elements: Elements;
  summary: Summary;
  suggestions: { endings: string[] };
};
export type AnalyzePlateResult = {
  input: string;
  pairs: PairResult[];
  totals: { sum: number; digitalRoot: number };
  elements: Elements;
  summary: Summary;
  suggestions: { endings: string[] };
  letters: { ch: string; value: number }[];
};

function gradeFromScore(score: number): 'A' | 'B' | 'C' {
  if (score >= 4) return 'A';
  if (score >= 0) return 'B';
  return 'C';
}

function westernRangeLabels(total: number) {
  const ranges = cfg.westernRanges;
  return ranges.filter((r) => total >= r.range[0] && total <= r.range[1]).map((r) => r.label);
}

export function analyzePhone(raw: string, dob?: string): AnalyzePhoneResult {
  const digits = normalizeDigits(raw);
  const pairs = extractPairs(digits).map((p) => {
    const info = lookupPair(p);
    const score = info?.weight ?? 0;
    return { pair: p, score, meaning: info ? { th: info.th, en: info.en } : undefined };
  });
  const sumDigits = digits.split('').reduce((a, b) => a + Number(b), 0);
  const dRoot = digitalRoot(sumDigits);
  const elCounts = tallyElements(digits);
  const supportDigits = supportiveDigitsForWeak(elCounts);
  const elementBonus = supportDigits.length >= cfg.elementBonusThreshold ? cfg.elementBonus : 0;
  const pairScore = pairs.reduce((a, b) => a + b.score, 0);
  const totalScore = pairScore + elementBonus;
  const grade = gradeFromScore(totalScore);
  const rangeLabels = westernRangeLabels(sumDigits);

  const highlights: string[] = [];
  const watchouts: string[] = [];
  pairs.forEach((p) => {
    if (p.score > 0 && p.meaning?.th) highlights.push(`${p.pair}: ${p.meaning.th}`);
    if (p.score < 0 && p.meaning?.th) watchouts.push(`${p.pair}: ${p.meaning.th}`);
  });
  rangeLabels.forEach((l) => highlights.push(l.th));

  const rules: string[] = [];
  rules.push(`PairScore=${pairScore}`);
  if (elementBonus) rules.push(`ElementBonus=+${elementBonus}`);
  rules.push(`Sum=${sumDigits} (${rangeLabels.map((l) => l.th).join(', ')})`);

  return {
    input: digits,
    pairs,
    totals: { sum: sumDigits, digitalRoot: dRoot },
    elements: { counts: elCounts, recommendation: `แนะนำเลขธาตุสนับสนุน: ${supportDigits.join(', ')}` },
    summary: { grade, highlights, watchouts, rules },
    suggestions: { endings: suggestEndings(digits) },
  };
}

export function analyzePlate(raw: string, dob?: string): AnalyzePlateResult {
  const cleaned = (raw || '').replace(/[\s-]+/g, '');
  const letters = cleaned.replace(/[^\u0E00-\u0E7F]/g, '');
  const digits = cleaned.replace(/\D+/g, '');
  const letterScore = scoreThaiLetters(letters);
  const digitSum = digits.split('').reduce((a, b) => a + Number(b), 0);
  const total = letterScore.sum + digitSum;
  const dRoot = digitalRoot(total);

  const pairDigits = extractPairs(digits).map((p) => {
    const info = lookupPair(p);
    const score = info?.weight ?? 0;
    return { pair: p, score, meaning: info ? { th: info.th, en: info.en } : undefined };
  });
  const elCounts = tallyElements(digits);
  const supportDigits = supportiveDigitsForWeak(elCounts);
  const elementBonus = supportDigits.length >= cfg.elementBonusThreshold ? cfg.elementBonus : 0;
  const pairScore = pairDigits.reduce((a, b) => a + b.score, 0);
  const totalScore = pairScore + elementBonus;
  const grade = gradeFromScore(totalScore);

  const cautionPairs = new Set(['13','31','37','73','18','81','67','76']);
  const watchFlags = extractPairs(digits).filter((p) => cautionPairs.has(p));

  const highlights: string[] = [];
  const watchouts: string[] = [];
  pairDigits.forEach((p) => {
    if (p.score > 0 && p.meaning?.th) highlights.push(`${p.pair}: ${p.meaning.th}`);
    if (p.score < 0 && p.meaning?.th) watchouts.push(`${p.pair}: ${p.meaning.th}`);
  });
  if (watchFlags.length) watchouts.push(`ระวังความเร็ว/อุบัติเหตุ: ${Array.from(new Set(watchFlags)).join(', ')}`);

  const rules: string[] = [];
  rules.push(`LetterSum=${letterScore.sum}`);
  rules.push(`DigitSum=${digitSum}`);
  rules.push(`PairScore=${pairScore}`);
  if (elementBonus) rules.push(`ElementBonus=+${elementBonus}`);

  return {
    input: raw,
    pairs: pairDigits,
    totals: { sum: total, digitalRoot: dRoot },
    elements: { counts: elCounts, recommendation: `แนะนำเลขธาตุสนับสนุน: ${supportDigits.join(', ')}` },
    summary: { grade, highlights, watchouts, rules },
    suggestions: { endings: suggestEndings(digits) },
    letters: letterScore.letters,
  };
}

