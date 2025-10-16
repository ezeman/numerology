import { cookies } from 'next/headers';
import th from '@/messages/th.json';
import en from '@/messages/en.json';

export async function getMessages(): Promise<{ lang: 'th' | 'en'; messages: any }> {
  const c = cookies();
  const lang = (c.get('NEXT_LOCALE')?.value as 'th' | 'en') || 'th';
  const messages = lang === 'th' ? th : en;
  return { lang, messages };
}
