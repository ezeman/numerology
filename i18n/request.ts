import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Temporarily force English messages to isolate runtime error
  const chosen = 'en';
  const messages = (await import(`../messages/${chosen}.json`)).default;
  return {messages};
});
