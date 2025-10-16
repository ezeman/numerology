import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['th', 'en'],
  defaultLocale: 'th',
  localePrefix: 'as-needed'
});

export const config = { matcher: ['/((?!_next|.*\\..*|api).*)'] };
