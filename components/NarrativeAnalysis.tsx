"use client";
import { AnalyzePhoneResult, AnalyzePlateResult } from '@/lib/scoring';
import { supportiveDigitsForWeak } from '@/lib/wuxing';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import pairExplains from '@/data/pairExplanations.json';
import { reversePair, getCategoryFromMeaning, fallbackByCategory } from '@/lib/pair-utils';

type Props = {
  result: AnalyzePhoneResult | AnalyzePlateResult;
  mode: 'phone' | 'plate';
};

const thEl: Record<string, string> = { Wood: 'ไม้', Fire: 'ไฟ', Earth: 'ดิน', Metal: 'โลหะ', Water: 'น้ำ' };
const enEl: Record<string, string> = { Wood: 'Wood', Fire: 'Fire', Earth: 'Earth', Metal: 'Metal', Water: 'Water' };

const drMeaning = {
  th: {
    1: 'ผู้นำ, ความมั่นใจ, อีโก้สูง, ชอบตัดสินใจเอง',
    2: 'ความสัมพันธ์, การสนับสนุน, ร่วมมือประสานงาน',
    3: 'พลังและการลงมือทำ, กระตือรือร้น, เร่งรีบ',
    4: 'วางแผน, ระเบียบ, โครงสร้าง, ระบบ',
    5: 'การเปลี่ยนแปลง, ความยืดหยุ่น, ทดลองสิ่งใหม่',
    6: 'ความรับผิดชอบ, การเงิน, ครอบครัว',
    7: 'วิเคราะห์, วินัย, สมาธิ, เรียนรู้ลึก',
    8: 'อำนาจ, ความทะเยอทะยาน, ความมั่งคั่ง',
    9: 'เมตตา, จินตนาการ, เสน่ห์, งานสร้างสรรค์',
  } as Record<number, string>,
  en: {
    1: 'Leadership, confidence, strong ego, decisive',
    2: 'Relationships, support, collaboration',
    3: 'Energy and action, drive, urgency',
    4: 'Planning, order, structure, systems',
    5: 'Change, adaptability, exploration',
    6: 'Responsibility, finances, family',
    7: 'Analysis, discipline, focus, deep learning',
    8: 'Power, ambition, wealth',
    9: 'Compassion, imagination, charm, creativity',
  } as Record<number, string>,
};

export default function NarrativeAnalysis({ result, mode }: Props) {
  const locale = (useLocale() as 'th' | 'en') || 'th';
  const t = useTranslations('results');

  const gradeText = (grade: 'A' | 'B' | 'C') => {
    if (locale === 'th') {
      return grade === 'A'
        ? 'เป็นเกรดดี — เหมาะกับการเติบโตและโอกาสใหม่'
        : grade === 'B'
        ? 'เป็นเกรดกลาง — มีทั้งข้อดีและข้อควรระวัง'
        : 'เป็นเกรดปานกลาง — มีทั้งข้อดีและข้อควรระวัง';
    }
    return grade === 'A'
      ? 'Strong grade — suited for growth and new opportunities'
      : grade === 'B'
      ? 'Moderate grade — balanced with pros and cautions'
      : 'Basic grade — some strengths with key watchouts';
  };

  const pairList = result.pairs.map((p) => p.pair);
  const uniqPairs = Array.from(new Set(pairList));
  const redPairs = ['81', '18', '58'];

  const counts = result.elements.counts;
  const entries = Object.entries(counts) as [keyof typeof counts, number][];
  const max = Math.max(...entries.map(([, c]) => c));
  const min = Math.min(...entries.map(([, c]) => c));
  const dominant = entries.filter(([, c]) => c === max && c > 0).map(([k]) => (locale === 'th' ? thEl[k] : enEl[k]));
  const secondary = entries
    .filter(([, c]) => c < max && c > min)
    .map(([k]) => (locale === 'th' ? thEl[k] : enEl[k]));
  const weak = entries.filter(([, c]) => c === min).map(([k]) => (locale === 'th' ? thEl[k] : enEl[k]));

  const supportDigits = supportiveDigitsForWeak(result.elements.counts);
  const endings = result.suggestions.endings || [];

  const labelEl = (list: string[]) => (list.length ? list.join(', ') : locale === 'th' ? '—' : '—');

  const dr = result.totals.digitalRoot as number;
  const drText = drMeaning[locale][dr as 1|2|3|4|5|6|7|8|9];

  function explainForPair(code: string, score: number | undefined, enLabel?: string) {
    const explicit = (pairExplains as any)[code]?.[locale] || (pairExplains as any)[reversePair(code)]?.[locale];
    if (explicit) return explicit as string;
    const cat = getCategoryFromMeaning(enLabel);
    const positive = typeof score === 'number' ? score > 0 : undefined;
    return fallbackByCategory(cat, positive, locale);
  }

  // Mirror per-pair explanation JSON + console logs here as well
  const pairsJson = useMemo(() => {
    return result.pairs.map((p) => {
      const code = p.pair;
      const rev = reversePair(code);
      const explicitTH = (pairExplains as any)[code]?.th || (pairExplains as any)[rev]?.th;
      const explicitEN = (pairExplains as any)[code]?.en || (pairExplains as any)[rev]?.en;
      const cat = getCategoryFromMeaning(p?.meaning?.en);
      const positive = typeof p.score === 'number' ? p.score > 0 : undefined;
      const explainTH = explicitTH || fallbackByCategory(cat, positive, 'th');
      const explainEN = explicitEN || fallbackByCategory(cat, positive, 'en');
      return {
        pair: code,
        score: p.score ?? null,
        label_th: p.meaning?.th || null,
        label_en: p.meaning?.en || null,
        category: cat,
        positive,
        explanation_th: explainTH,
        explanation_en: explainEN,
        source_th: explicitTH ? 'explicit' : `fallback:${cat}`,
        source_en: explicitEN ? 'explicit' : `fallback:${cat}`,
      };
    });
  }, [result.pairs]);

  useEffect(() => {
    try {
      console.groupCollapsed('[Pairs] Explanations JSON (Narrative)');
      console.table(
        pairsJson.map(({ pair, score, category, positive, source_th, source_en }) => ({
          pair,
          score,
          category,
          positive,
          source_th,
          source_en,
        }))
      );
      console.log('[Pairs] Full JSON (Narrative):', pairsJson);
      if (typeof window !== 'undefined') {
        (window as any).__pairs = pairsJson;
      }
      console.groupEnd();
    } catch {}
  }, [pairsJson]);

  return (
    <section className="card p-4 space-y-3" aria-label="narrative">
      <div className="text-sm text-gray-500">🔢 {mode === 'phone' ? t('totalSum') : t('totalSum')}: {result.input}</div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          🎯 {t('finalGrade')}
        </div>
        <div className="text-2xl font-bold">{result.summary.grade}</div>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300">{gradeText(result.summary.grade)}</div>

      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <div className="font-medium">🌟 {t('highlights')}</div>
          <ul className="list-disc pl-5 text-sm">
            {result.summary.highlights.length
              ? result.summary.highlights.map((h, i) => <li key={i}>{h}</li>)
              : <li>{locale === 'th' ? '—' : '—'}</li>}
          </ul>
        </div>
        <div>
          <div className="font-medium">⚠️ {t('watchouts')}</div>
          <ul className="list-disc pl-5 text-sm">
            {result.summary.watchouts.length
              ? result.summary.watchouts.map((w, i) => <li key={i}>{w}</li>)
              : <li>{locale === 'th' ? '—' : '—'}</li>}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="card p-3">
          <div className="text-xs text-gray-500">🧮 {t('totalSum')}</div>
          <div className="text-xl font-semibold">{result.totals.sum}</div>
        </div>
        <div className="card p-3">
          <div className="text-xs text-gray-500">🧮 {t('digitalRoot')}</div>
          <div className="text-xl font-semibold">{dr}{drText ? (locale === 'th' ? ` → หมายถึง ${drText}` : ` → ${drText}`) : ''}</div>
        </div>
      </div>

      <div>
        <div className="font-medium">🔗 {t('pairs')}</div>
        <div className="text-sm">{uniqPairs.join(', ')}</div>
        <div className="text-xs text-gray-600 mt-1">
          {locale === 'th'
            ? `ตัวเลขที่มักให้พลังแรงและแปรผันได้ เช่น ${redPairs.join(', ')} ขึ้นกับผู้ใช้`
            : `High-variance pairs often noted: ${redPairs.join(', ')} (context-dependent)`}
        </div>
      </div>

      <div className="card p-3">
        <div className="font-medium mb-1">📝 {t('pairDetails')}</div>
        <ul className="space-y-2 text-sm">
          {result.pairs.map((p, i) => (
            <li key={i} className="">
              <div className="font-medium">
                {p.pair}: {p.meaning?.[locale] || p.meaning?.en || ''}
                {typeof p.score === 'number' && (
                  <span className={"ml-2 text-xs rounded px-1 py-0.5 " + (p.score>0 ? 'bg-green-100 text-green-700' : p.score<0 ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700')}>
                    {p.score>0?'+':''}{p.score}
                  </span>
                )}
              </div>
              <div className="text-gray-700 dark:text-gray-300">{explainForPair(p.pair, p.score, p.meaning?.en)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="text-lg font-semibold">🌏 {t('wuXing')}</div>
        <ul className="list-disc pl-5 text-sm">
          <li>{locale === 'th' ? 'ธาตุเด่นคือ' : 'Dominant'} {labelEl(dominant)}</li>
          <li>{locale === 'th' ? 'ธาตุรองคือ' : 'Secondary'} {labelEl(secondary)}</li>
          <li>{locale === 'th' ? 'ธาตุที่อ่อนคือ' : 'Weak'} {labelEl(weak)}</li>
        </ul>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <div className="font-medium">🔮 {t('suggestions')}</div>
          <div className="text-sm">
            <div className="mb-1">{t('suggestedEndings')}:</div>
            <div className="flex flex-wrap gap-2">
              {endings.slice(0, 6).map((s, i) => (
                <span key={i} className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="font-medium">{locale === 'th' ? '💡 คำแนะนำ' : '💡 Advice'}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            {locale === 'th'
              ? `เลขเสริมที่ควรใช้: ${supportDigits.join(', ')}`
              : `Supportive digits to balance weaknesses: ${supportDigits.join(', ')}`}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
        <div className="font-medium mb-1">{locale === 'th' ? '📘 สรุปภาพรวม' : '📘 Overall Summary'}</div>
        <div className="grid gap-2 md:grid-cols-2 text-sm">
          <div>
            <div><span className="font-medium">{locale === 'th' ? 'เกรดโดยรวม' : 'Overall Grade'}:</span> {result.summary.grade}</div>
            <div><span className="font-medium">{locale === 'th' ? 'เหมาะกับธาตุ' : 'Suits Elements'}:</span> {labelEl(dominant)}</div>
          </div>
          <div>
            <div><span className="font-medium">{locale === 'th' ? 'เลขเสริมที่ควรใช้' : 'Digits to Use'}:</span> {supportDigits.join(', ') || '—'}</div>
          </div>
        </div>
      </div>

      
    </section>
  );
}
