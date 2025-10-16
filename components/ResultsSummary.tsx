import PairChips from '@/components/PairChips';
import WuXingChart from '@/components/WuXingChart';
import { AnalyzePhoneResult, AnalyzePlateResult } from '@/lib/scoring';
import { useTranslations } from 'next-intl';

export default function ResultsSummary({
  result,
  mode,
}: {
  result: AnalyzePhoneResult | AnalyzePlateResult;
  mode: 'phone' | 'plate';
}) {
  const t = useTranslations('results');
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
              {result.summary.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium">{t('watchouts')}</h3>
            <ul className="list-disc pl-5 text-sm text-red-700 dark:text-red-300">
              {result.summary.watchouts.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
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
