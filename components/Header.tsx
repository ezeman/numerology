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
    // Toggle NEXT_LOCALE cookie used by next-intl middleware
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
    const current = (match ? decodeURIComponent(match[1]) : 'th') as 'th' | 'en';
    const next = current === 'en' ? 'th' : 'en';
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000`;
    window.location.reload();
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          {t('title')}
        </Link>
        <div className="flex items-center gap-2">
          <button
            aria-label={t('language')}
            className="btn-secondary"
            onClick={toggleLang}
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
