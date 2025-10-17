"use client";
import { useTranslations } from 'next-intl';
import { Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const t = useTranslations('header');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleLang = () => {
    // Toggle via API to set cookie server-side, then redirect back
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
    const current = (match ? decodeURIComponent(match[1]) : 'th') as 'th' | 'en';
    const next = current === 'en' ? 'th' : 'en';
    const redirect = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.href = `/api/locale?lang=${next}&redirect=${encodeURIComponent(redirect)}`;
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          {t('title')}
        </Link>
        <div className="flex items-center gap-2">
          {/* Language toggle disabled and invisible as requested */}
          <button
            aria-label={t('language')}
            className="btn-secondary hidden"
            aria-hidden="true"
            disabled
            title="Language switch is disabled"
          >
            <Languages size={18} />
          </button>
          <button
            aria-label={t('theme')}
            className="btn-secondary"
            onClick={() => setTheme(mounted && theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
