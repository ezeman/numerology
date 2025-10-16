"use client";
import { useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Tabs } from '@/components/Tabs';
import NumerologyFormPhone from '@/components/NumerologyFormPhone';
import NumerologyFormPlate from '@/components/NumerologyFormPlate';
import ResultsSummary from '@/components/ResultsSummary';
import SaveShareExportBar from '@/components/SaveShareExportBar';
import { AnalyzePhoneResult, AnalyzePlateResult } from '@/lib/scoring';

type Mode = 'phone' | 'plate';

export default function HomePage() {
  const t = useTranslations('home');
  const [mode, setMode] = useState<Mode>('phone');
  const [phoneResult, setPhoneResult] = useState<AnalyzePhoneResult | null>(null);
  const [plateResult, setPlateResult] = useState<AnalyzePlateResult | null>(null);

  // Restore from deep link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const m = (params.get('mode') as Mode) || 'phone';
    setMode(m);
  }, []);

  const result = useMemo(() => (mode === 'phone' ? phoneResult : plateResult), [mode, phoneResult, plateResult]);

  return (
    <div className="space-y-6">
      <div className="card p-4">
        <Tabs
          tabs={[
            { id: 'phone', label: t('tabPhone') },
            { id: 'plate', label: t('tabPlate') },
          ]}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
        />
        <div className="mt-4">
          {mode === 'phone' ? (
            <NumerologyFormPhone onAnalyzed={setPhoneResult} />
          ) : (
            <NumerologyFormPlate onAnalyzed={setPlateResult} />
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <ResultsSummary result={result} mode={mode} />
          <SaveShareExportBar mode={mode} result={result} />
        </div>
      )}
    </div>
  );
}
