"use client";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { analyzePlate, AnalyzePlateResult } from '@/lib/scoring';

const plateSchema = z.object({
  plate: z.string().min(2).refine((v) => /[\u0E00-\u0E7Fa-zA-Z0-9\s-]+/.test(v), 'plate'),
  dob: z.string().optional(),
});

export default function NumerologyFormPlate({ onAnalyzed }: { onAnalyzed: (r: AnalyzePlateResult) => void }) {
  const t = (k: string) => ({
    analyze: 'Analyze',
    plateLabel: 'License Plate'
  } as any)[k] || k;
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof plateSchema>>({
    resolver: zodResolver(plateSchema)
  });

  const onSubmit = (values: z.infer<typeof plateSchema>) => {
    const res = analyzePlate(values.plate, values.dob);
    onAnalyzed(res);
    const params = new URLSearchParams(window.location.search);
    params.set('mode', 'plate');
    params.set('n', values.plate);
    if (values.dob) params.set('dob', values.dob);
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-3" noValidate>
      <div className="sm:col-span-2">
        <label className="block text-sm mb-1" htmlFor="plate">{t('plateLabel')}</label>
        <input id="plate" className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2" placeholder="กข 7899" {...register('plate')} />
        {errors.plate && <p className="text-xs text-red-500 mt-1">{t(`errors.${errors.plate.message}` as any)}</p>}
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
