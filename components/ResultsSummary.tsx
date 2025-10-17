"use client";
import PairChips from '@/components/PairChips';
import WuXingChart from '@/components/WuXingChart';
import { AnalyzePhoneResult, AnalyzePlateResult } from '@/lib/scoring';
import pairExplanations from '@/data/pairExplanations.json';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { reversePair, getCategoryFromMeaning, fallbackByCategory } from '@/lib/pair-utils';
export default function ResultsSummary({
  result,
  mode,
}: {
  result: AnalyzePhoneResult | AnalyzePlateResult;
  mode: 'phone' | 'plate';
}) {
  const t = useTranslations('results');
  const locale = useLocale() as 'th' | 'en';
  const [filter, setFilter] = useState<'all' | 'pos' | 'neg'>('all');

  const pairMap = useMemo(() => 
    new Map(result.pairs.map((p) => [p.pair, p] as const)),
  [result.pairs]);

  const getExplainForPair = useCallback((code: string, score: number | undefined, enLabel?: string) => {
    console.log(`[Debug] หาคำอธิบายสำหรับคู่: ${code}, ภาษา: ${locale}, ความหมาย EN: "${enLabel}"`);
    const explicit = (pairExplanations as Record<string, Record<string, string>>)[code]?.[locale] || (pairExplanations as Record<string, Record<string, string>>)[reversePair(code)]?.[locale];
    if (explicit) {
      console.log(`[Debug] พบคำอธิบายแบบเจาะจง: "${explicit}"`);
      return explicit as string;
    }
    const cat = getCategoryFromMeaning(enLabel);
    const positive = typeof score === 'number' ? score > 0 : undefined;
    const fallback = fallbackByCategory(cat, positive, locale);
    console.log(`[Debug] ไม่พบคำอธิบายเจาะจง, ใช้คำอธิบายสำรองจากหมวดหมู่ '${cat}': "${fallback}"`);
    return fallback;
  }, [locale]);

  // Build JSON for per-pair explanations (both th/en) and log to web console
  const pairsJson = useMemo(() => {
    return result.pairs.map((p) => {
      const code = p.pair;
      const rev = reversePair(code);
      const explicitTH = (pairExplanations as any)[code]?.th || (pairExplanations as any)[rev]?.th;
      const explicitEN = (pairExplanations as any)[code]?.en || (pairExplanations as any)[rev]?.en;
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
      console.groupCollapsed('[Pairs] Explanations JSON');
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
      console.log('[Pairs] Full JSON:', pairsJson);
      if (typeof window !== 'undefined') {
        (window as any).__pairs = pairsJson;
      }
      console.groupEnd();
    } catch (e) {
      // no-op
    }
  }, [pairsJson]);

  const renderWithExplain = (items: string[]) => {
    return items.map((text, i) => {
      const m = text.match(/^(\d{2}):\s*(.*)$/);
      if (!m) return <li key={i}>{text}</li>;
      const code = m[1];
      const labelFromText = m[2];
      const p = pairMap.get(code) || pairMap.get(reversePair(code));
      const label = p?.meaning?.[locale] || labelFromText;
      const explain = getExplainForPair(code, p?.score, p?.meaning?.en);
      return (
        <li key={i}>
          <div>{code}: {label}</div>
          {explain && (
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">{explain}</p>
          )}
        </li>
      );
    });
  };
  return (
    <section aria-label="results" className="grid gap-4 md:grid-cols-3">
      <div className="card p-4 space-y-3 md:col-span-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('finalGrade')}</h2>
          <span className="text-2xl font-bold">{result.summary.grade}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <h3 className="font-medium">{t('highlights')}</h3>
            <ul className="list-disc pl-5 text-sm text-green-700 dark:text-green-300">
              {renderWithExplain(result.summary.highlights)}
            </ul>
          </div>
          <div>
            <h3 className="font-medium">{t('watchouts')}</h3>
            <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300">
              {renderWithExplain(result.summary.watchouts)}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="card p-3">
            <div className="text-xs text-gray-500">{t('totalSum')}</div>
            <div className="text-xl font-semibold">{result.totals.sum}</div>
          </div>
          <div className="card p-3">
            <div className="text-xs text-gray-500">{t('digitalRoot')}</div>
            <div className="text-xl font-semibold">{result.totals.digitalRoot}</div>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">{t('pairs')}</h3>
          <PairChips pairs={result.pairs} />
        </div>

        {/* Consolidated Pair Details Section */}
        <div className="mt-4 space-y-3 border-t border-gray-200 dark:border-gray-800 pt-3">
          <div className="text-sm font-medium mb-1">{t('pairDetails')}</div>
          <div className="flex items-center gap-2 text-xs">
            <button
              className={"px-2 py-1 rounded border " + (filter==='all' ? 'bg-gray-200 dark:bg-gray-800' : 'bg-transparent')}
              onClick={() => setFilter('all')}
            >{t('filterAll')}</button>
            <button
              className={"px-2 py-1 rounded border " + (filter==='pos' ? 'bg-green-200 dark:bg-green-900' : 'bg-transparent')}
              onClick={() => setFilter('pos')}
            >{t('filterPositive')}</button>
            <button
              className={"px-2 py-1 rounded border " + (filter==='neg' ? 'bg-red-200 dark:bg-red-900' : 'bg-transparent')}
              onClick={() => setFilter('neg')}
            >{t('filterNegative')}</button>
            {/* JSON toggle removed as requested */}
          </div>
          <div className="space-y-2">
            {/* JSON block removed as requested */}
            {result.pairs
              .slice()
              .filter(p => filter==='all' ? true : filter==='pos' ? p.score>0 : p.score<0)
              .sort((a, b) => {
                const va = a.score || 0, vb = b.score || 0;
                if ((va > 0) !== (vb > 0)) return vb - va;
                if (va > 0 && vb > 0) return vb - va;
                if (va === 0 && vb !== 0) return -vb;
                if (vb === 0 && va !== 0) return va;
                return va - vb;
              })
              .map((p, idx) => {
              const explain = getExplainForPair(p.pair, p.score, p.meaning?.en);
              console.log(`[Debug] ผลลัพธ์สุดท้ายสำหรับ ${p.pair}:`, { pair: p, explanation: explain });
              const label = p.meaning?.[locale] || p.meaning?.en || '';
              const positive = p.score > 0, negative = p.score < 0;
              return (
                <div key={idx} className={"text-sm p-2 rounded-md " + (positive ? 'bg-green-50 dark:bg-green-950/20' : negative ? 'bg-red-50 dark:bg-red-950/20' : 'bg-gray-50 dark:bg-gray-900') }>
                  <div className="font-medium flex items-center gap-2">
                    {positive ? <CheckCircle size={16} className="text-green-600" /> : negative ? <AlertTriangle size={16} className="text-red-600" /> : <Info size={16} className="text-gray-600" />}
                    <span>{p.pair}: {label}</span>
                    {typeof p.score === 'number' && (
                      <span className={"ml-1 text-xs rounded px-1 py-0.5 " + (positive ? 'bg-green-100 text-green-700' : negative ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-700')}>
                        {p.score > 0 ? '+' : ''}{p.score}
                      </span>
                    )}
                  </div>
                  {explain && (
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{explain}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-lg font-semibold">{t('wuXing')}</h3>
        <WuXingChart counts={result.elements.counts} />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {result.elements.recommendation}
        </div>
      </div>

      <div className="card p-4 md:col-span-3">
        <h3 className="font-medium mb-2">{t('suggestions')}</h3>
        <div className="text-sm">
          <div className="font-medium mb-1">{t('suggestedEndings')}</div>
          <div className="flex flex-wrap gap-2">
            {result.suggestions.endings.map((s, i) => (
              <span key={i} className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
