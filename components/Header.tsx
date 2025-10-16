"use client";
import { Sun, Moon, Languages } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const toggleLang = () => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang') === 'en' ? 'th' : 'en';
    params.set('lang', lang);
    document.cookie = `lang=${lang}; path=/; max-age=31536000`;
    window.location.search = params.toString();
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">Numerology Pro</Link>
        <div className="flex items-center gap-2">
          <button
            aria-label="Language"
            className="btn-secondary"
            onClick={toggleLang}
          >
            <Languages size={18} />
          </button>
          <button
            aria-label="Theme"
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
