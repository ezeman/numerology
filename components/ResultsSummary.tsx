import PairChips from '@/components/PairChips';
import WuXingChart from '@/components/WuXingChart';
import { AnalyzePhoneResult, AnalyzePlateResult } from '@/lib/scoring';
import { useTranslations, useLocale } from 'next-intl';
import pairExplains from '@/data/pairExplanations.json';

export default function ResultsSummary({
  result,
  mode,
}: {
  result: AnalyzePhoneResult | AnalyzePlateResult;
  mode: 'phone' | 'plate';
}) {
  const t = useTranslations('results');
  const locale = useLocale() as 'th' | 'en';

  const pairMap = new Map(result.pairs.map((p) => [p.pair, p] as const));

  function reversePair(code: string) {
    return code.length === 2 ? `${code[1]}${code[0]}` : code;
  }

  function getExplainForPair(code: string, label: string, score: number | undefined) {
    const explicit = (pairExplains as any)[code]?.[locale] || (pairExplains as any)[reversePair(code)]?.[locale];
    if (explicit) return explicit as string;
    // Fallback generic explanation so that all possible pairs have some details
    if (score && score > 0) {
      return locale === 'th'
        ? `${label} โดยรวมเอื้อต่อการงาน/ความสัมพันธ์ แนะนำต่อยอดจุดแข็งให้ชัด เช่น ตั้งเป้าหมายรายสัปดาห์และติดตามผล เพื่อเก็บเกี่ยวพลังของคู่เลขนี้ให้เต็มที่`
        : `${label} generally supports work/relationships. Tip: double down on the strength with weekly goals and tracking to fully leverage this pair.`;
    } else if (score && score < 0) {
      return locale === 'th'
        ? `${label} มีจุดที่ควรระวัง แนะนำจัดตาราง/งบประมาณให้ชัด และตั้งวันพักหรือรีวิวงาน เพื่อลดผลกระทบของคู่เลขนี้`
        : `${label} has caution flags. Tip: add structure (schedule/budget) and periodic reviews or rest to mitigate the pair’s downside.`;
    }
    return locale === 'th'
      ? `${label} เป็นกลาง ไม่ได้ส่งเสริมหรือถ่วงมากนัก ควรโฟกัสองค์ประกอบอื่นประกอบการตัดสินใจ`
      : `${label} is neutral; focus on other components for decisions.`;
  }

  const renderWithExplain = (items: string[]) => {
    return items.map((text, i) => {
      const m = text.match(/^(\d{2}):\s*(.*)$/);
      if (!m) return <li key={i}>{text}</li>;
      const code = m[1];
      const labelFromText = m[2];
      const p = pairMap.get(code) || pairMap.get(reversePair(code));
      const label = p?.meaning?.[locale] || labelFromText;
      const explain = getExplainForPair(code, label, p?.score);
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
            {/* Pair details directly under highlights */}
            <div className="mt-3 space-y-2">
              <div className="text-sm font-medium mb-1">{t('pairDetails')}</div>
              {result.pairs
                .filter(p => (pairExplains as any)[p.pair])
                .map((p, idx) => {
                  const explain = getExplainForPair(p.pair, p.meaning?.[locale] || '', p.score);
                  const label = p.meaning?.[locale];
                  return (
                    <div key={idx} className="text-sm">
                      <div className="font-medium">
                        {p.pair}: {label}
                        {p.score !== 0 && (
                          <span className={"ml-2 text-xs rounded px-1 " + (p.score > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                            {p.score > 0 ? '+' : ''}{p.score}
                          </span>
                        )}
                      </div>
                      {explain && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{explain}</p>
                      )}
                    </div>
                  );
                })}
            </div>
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
