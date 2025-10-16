"use client";
import { useState } from 'react';

export default function SaveShareExportBar({
  mode,
  result,
}: {
  mode: 'phone' | 'plate';
  result: any;
}) {
  const t = (k: string) => ({
    save: 'Save',
    copyLink: 'Copy Link',
    exportPdf: 'Export PDF'
  } as any)[k] || k;
  const [saving, setSaving] = useState(false);

  const saveLocal = () => {
    setSaving(true);
    try {
      const key = 'numerology:last';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.unshift({ mode, result, at: Date.now() });
      localStorage.setItem(key, JSON.stringify(list.slice(0, 5)));
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied');
    } catch {}
  };

  const exportPdf = async () => {
    const payload = {
      title: 'Numerology Pro Report',
      inputs: { url: window.location.href },
      result,
    };
    const res = await fetch('/api/pdf', { method: 'POST', body: JSON.stringify(payload) });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'numerology.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn-secondary" onClick={saveLocal} disabled={saving}>{t('save')}</button>
      <button className="btn-secondary" onClick={copyLink}>{t('copyLink')}</button>
      <button className="btn-primary" onClick={exportPdf}>{t('exportPdf')}</button>
    </div>
  );
}
