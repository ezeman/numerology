import PairChips from '@/components/PairChips';
import WuXingChart from '@/components/WuXingChart';
import { AnalyzePhoneResult, AnalyzePlateResult } from '@/lib/scoring';
import { useTranslations, useLocale } from 'next-intl';
import pairExplains from '@/data/pairExplanations.json';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

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

  const pairMap = new Map(result.pairs.map((p) => [p.pair, p] as const));

  function reversePair(code: string) {
    return code.length === 2 ? `${code[1]}${code[0]}` : code;
  }

  function getCategoryFromMeaning(en?: string) {
    const s = (en || '').toLowerCase();
    if (/(charm|commerce)/.test(s)) return 'charm';
    if (/(senior|support|mentor)/.test(s)) return 'mentorship';
    if (/(powerful|influence|speech)/.test(s)) return 'influence';
    if (/(negotiation|communicat)/.test(s)) return 'communication';
    if (/(stable|balance|balanced)/.test(s)) return 'stability';
    if (/(success|opportun)/.test(s)) return 'opportunity';
    if (/(stress|fatigue|temper|clash|mood)/.test(s)) return 'emotion';
    if (/(money|overwork|budget|finance)/.test(s)) return 'finance';
    if (/(harmony|family|relationship)/.test(s)) return 'harmony';
    if (/(magnetic|attraction|brand|content)/.test(s)) return 'attraction';
    return 'other';
  }

  function fallbackByCategory(cat: string, positive: boolean | undefined) {
    if (locale === 'th') {
      switch (cat) {
        case 'charm':
        case 'communication':
          return positive
            ? 'เด่นด้านเสน่ห์/การสื่อสาร แนะนำใช้ช่องทางโซเชียล–เครือข่าย เพิ่มโอกาสปิดการขาย'
            : 'ระวังสื่อสารคลาดเคลื่อน ตั้งสรุปงาน/ประเด็นคุยล่วงหน้า ช่วยลดความเข้าใจผิด';
        case 'mentorship':
          return positive
            ? 'มีแรงหนุนจากผู้ใหญ่/ที่ปรึกษา ใช้โอกาสนี้ขอคำแนะนำ–รีวิวงาน เพื่อย่นเวลาเรียนรู้'
            : 'อาจพึ่งพาผู้ใหญ่เกินไป วางแผนพัฒนาทักษะตนเองควบคู่ ลดความเสี่ยงระยะยาว';
        case 'influence':
          return positive
            ? 'พลังอิทธิพล/การโน้มน้าวสูง ใช้ด้วยความนุ่มนวลและชัดเจน จะสร้างความไว้วางใจ'
            : 'ระวังใช้ถ้อยคำกดดัน ปรับโทนเป็นเชิงชวน–ยกเหตุผล ให้เกิดความร่วมมือ';
        case 'stability':
          return positive
            ? 'หนุนความมั่นคง–สมดุล วางแผนระยะยาว–งบประมาณชัด ทำให้ก้าวคงเส้นคงวา'
            : 'ระวังแผนสวิง จัด Weekly review/ปรับแผนเพื่อกลับสู่สมดุล';
        case 'opportunity':
          return positive
            ? 'โอกาส–การเติบโต เหมาะต่อยอดโปรเจ็กต์/ขยายตลาด ตั้งเป้าเป็นช่วงและวัดผล'
            : 'ระวังโอกาสลวง ตั้งเกณฑ์ประเมินก่อนตัดสินใจ เพื่อลดความเสี่ยง';
        case 'emotion':
          return positive
            ? 'พลังใจดี แต่รักษาโทนสื่อสารให้นุ่มนวล จะได้ผลลัพธ์ที่ดีกว่า'
            : 'เรื่องอารมณ์–ความขัดแย้ง แนะนำฝึกฟังเชิงลึก/เว้นช่วงก่อนตอบ';
        case 'finance':
          return positive
            ? 'วินัยการเงินดี ยึดงบ–ติดตามรายจ่ายต่อเนื่อง ช่วยสะสมผลลัพธ์'
            : 'เงินรั่ว/งานหนัก จัดลำดับสำคัญ–กระจายงาน และตั้งวันพัก';
        case 'harmony':
          return positive
            ? 'ความกลมเกลียว–ความสัมพันธ์ดี เหมาะงานทีม/ดูแลลูกค้า ใช้ข้อได้เปรียบนี้เชิงรุก'
            : 'ดูแลขอบเขต–การคุยคาดหวังร่วม เพื่อลดแรงเสียดทาน';
        case 'attraction':
          return positive
            ? 'แรงดึงดูด/งานแบรนด์–คอนเทนต์ไปได้ดี วางคอนเทนต์สม่ำเสมอเพิ่มการรับรู้'
            : 'วางกรอบแบรนด์–ข้อความหลักให้ชัด เพื่อลดความกระจัดกระจาย';
        default:
          return positive
            ? 'โดยรวมเอื้อต่อการงาน/ความสัมพันธ์ ต่อยอดจุดแข็งด้วยเป้าหมายรายสัปดาห์และติดตามผล'
            : 'มีจุดควรระวัง เพิ่มโครงสร้าง (ตาราง/งบประมาณ) และรีวิวเป็นช่วง ๆ เพื่อลดผลกระทบ';
      }
    } else {
      switch (cat) {
        case 'charm':
        case 'communication':
          return positive
            ? 'Strength in charm/communication; leverage social channels and networking to raise close rates.'
            : 'Mind miscommunication; prepare agendas/summaries to reduce misunderstanding.';
        case 'mentorship':
          return positive
            ? 'Backed by seniors/mentors; ask for reviews and guidance to accelerate learning.'
            : 'Beware over-relying on seniors; build self-sufficiency in parallel.';
        case 'influence':
          return positive
            ? 'Strong influence/persuasion; combine clarity with empathy to build trust.'
            : 'Avoid pressuring tone; reframe with reasons and invitations to collaborate.';
        case 'stability':
          return positive
            ? 'Supports stability/balance; keep long-term plans and budgets for steady progress.'
            : 'Avoid plan swings; weekly reviews help restore balance.';
        case 'opportunity':
          return positive
            ? 'Opportunities/growth; set phased targets and measure outcomes to scale safely.'
            : 'Beware false positives; define evaluation criteria before committing.';
        case 'emotion':
          return positive
            ? 'Good morale; keep tone gentle for better outcomes.'
            : 'Emotion/clashes; practice active listening and pause before replying.';
        case 'finance':
          return positive
            ? 'Financial discipline; stick to budgets and tracking to compound results.'
            : 'Money churn/overwork; prioritize, delegate and schedule rest.';
        case 'harmony':
          return positive
            ? 'Harmony/relationships; great for teamwork and customer care—use it proactively.'
            : 'Clarify boundaries and expectations to lower friction.';
        case 'attraction':
          return positive
            ? 'Attraction/branding/content excels; publish consistently to boost awareness.'
            : 'Clarify brand frame and core messaging to avoid dilution.';
        default:
          return positive
            ? 'Generally supportive; double down with weekly goals and tracking.'
            : 'Has caution flags; add structure (schedule/budget) and periodic reviews.';
      }
    }
  }

  function getExplainForPair(code: string, label: string, score: number | undefined, enLabel?: string) {
    const explicit = (pairExplains as any)[code]?.[locale] || (pairExplains as any)[reversePair(code)]?.[locale];
    if (explicit) return explicit as string;
    const cat = getCategoryFromMeaning(enLabel);
    const positive = typeof score === 'number' ? score > 0 : undefined;
    return fallbackByCategory(cat, positive);
  }

  const renderWithExplain = (items: string[]) => {
    return items.map((text, i) => {
      const m = text.match(/^(\d{2}):\s*(.*)$/);
      if (!m) return <li key={i}>{text}</li>;
      const code = m[1];
      const labelFromText = m[2];
      const p = pairMap.get(code) || pairMap.get(reversePair(code));
      const label = p?.meaning?.[locale] || labelFromText;
      const explain = getExplainForPair(code, label, p?.score, p?.meaning?.en);
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
            <div className="mt-3 space-y-3 border-t border-gray-200 dark:border-gray-800 pt-3">
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
              </div>
              {result.pairs
                .slice()
                .filter(p => filter==='all' ? true : filter==='pos' ? p.score>0 : p.score<0)
                .sort((a, b) => {
                  const va = a.score || 0, vb = b.score || 0;
                  // positive first (desc), then neutral, then negative
                  if ((va > 0) !== (vb > 0)) return vb - va; // true > false
                  if (va > 0 && vb > 0) return vb - va;
                  if (va === 0 && vb !== 0) return -vb; // zero before negative
                  if (vb === 0 && va !== 0) return va;  // positive already handled
                  return va - vb; // both negative -> ascending (e.g., -1, -2)
                })
                .map((p, idx) => {
                  const explain = getExplainForPair(p.pair, p.meaning?.[locale] || '', p.score, p.meaning?.en);
                  const label = p.meaning?.[locale];
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
