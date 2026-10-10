'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ALL_LOCALES,
  DEFAULT_ENABLED_LOCALES,
  flagUrl,
} from '../../lib/availableLocales';

export default function LanguageSwitcher({ currentLocale, direction = "down" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [enabledLocales, setEnabledLocales] = useState(null);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/locales');
        if (res.ok) {
          const json = await res.json();
          setEnabledLocales(json.locales);
          return;
        }
      } catch (_) {}
      setEnabledLocales(DEFAULT_ENABLED_LOCALES);
    }
    load();
  }, []);

  // Fermer le menu au clic extérieur
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = ALL_LOCALES.filter(
    (lang) =>
      !enabledLocales ||
      enabledLocales.includes(lang.code) ||
      lang.code === currentLocale
  );

  const current =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const handleChange = (newLocale) => {
    setOpen(false);
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg pl-2.5 pr-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#047857] cursor-pointer"
      >
        {current && (
          <img
            src={flagUrl(current.flagCode)}
            alt={current.label}
            width="20"
            height="15"
            className="rounded-[2px] object-cover"
          />
        )}
        <span>{current ? current.label : 'Français'}</span>
        <svg
          className={`fill-current h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute z-50 ${
            direction === "up" ? "bottom-full left-0 mb-1" : "top-full left-0 mt-1"
          } w-full min-w-[180px] max-h-64 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChange(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left cursor-pointer transition ${
                lang.code === currentLocale
                  ? 'bg-[#047857]/10 text-[#047857] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <img
                src={flagUrl(lang.flagCode)}
                alt={lang.label}
                width="20"
                height="15"
                className="rounded-[2px] object-cover shrink-0"
              />
              <span className="truncate">{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
