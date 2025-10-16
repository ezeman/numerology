"use client";
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzePhone, AnalyzePhoneResult } from '@/lib/scoring';
import { normalizeDigits } from '@/lib/normalize';

const schema = z.object({
  phone: z.string().transform((v) => normalizeDigits(v)).refine((v) => v.length >= 9 && v.length <= 10, 'phone'),
  dob: z.string().optional(),
});

export default function NumerologyFormPhone({ onAnalyzed }: { onAnalyzed: (r: AnalyzePhoneResult) => void }) {
  const t = useTranslations('home');
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  // Deep link restore
  
  const onSubmit = (values: z.infer<typeof schema>) => {
    const res = analyzePhone(values.phone, values.dob);
    onAnalyzed(res);
    const params = new URLSearchParams(window.location.search);
    params.set('mode', 'phone');
    params.set('n', values.phone);
    if (values.dob) params.set('dob', values.dob);
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-3" noValidate>
      <div className="sm:col-span-2">
        <label className="block text-sm mb-1" htmlFor="phone">{t('phoneLabel')}</label>
        <input id="phone" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" placeholder="0812345678" {...register('phone')} />
        {errors.phone && <p className="text-xs text-red-500 mt-1">{t(`errors.${errors.phone.message}` as any)}</p>}
      </div>
      <div>
        <label className="block text-sm mb-1" htmlFor="dob">{t('dobLabel')}</label>
        <input id="dob" type="date" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" {...register('dob')} />
      </div>
      <div className="sm:col-span-3">
        <button className="btn-primary" type="submit">{t('analyze')}</button>
      </div>
    </form>
  );
}
