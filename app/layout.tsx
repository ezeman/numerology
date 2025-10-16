import './globals.css';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { getMessages } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Numerology Pro',
  description: 'Thai + Chinese Wu Xing + Western numerology for phone and plates',
  icons: {
    icon: '/icons/icon-192.png'
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const { lang, messages } = await getMessages();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextIntlClientProvider messages={messages} timeZone="Asia/Bangkok">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="container mx-auto max-w-5xl flex-1 px-4 py-6">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
