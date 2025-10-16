import './globals.css';
import type { Metadata } from 'next';
// Temporarily remove next-intl provider to bypass SSR error
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
  const { lang } = await getMessages();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="container mx-auto max-w-5xl flex-1 px-4 py-6">{children}</main>
              <Footer />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
