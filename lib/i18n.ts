import {getLocale, getMessages as getIntlMessages} from 'next-intl/server';

export async function getMessages(): Promise<{ lang: 'th' | 'en'; messages: any }> {
  const lang = (await getLocale()) as 'th' | 'en';
  const messages = await getIntlMessages();
  return { lang, messages };
}
