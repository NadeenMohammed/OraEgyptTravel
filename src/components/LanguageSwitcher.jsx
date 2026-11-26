import React from 'react';
import { ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '../i18n';

export function LanguageSwitcher() {
  const { language, setLanguage, languages, showLanguageSwitcher } = useLanguage();

  if (!showLanguageSwitcher) return null;

  return (
    <div className="fixed right-4 bottom-5 z-[60]">
      <label className="sr-only" htmlFor="floating-language-switcher">
        Website language
      </label>
      <div className="relative flex items-center rounded-full border border-[#D2A058]/70 bg-[#102355] text-white shadow-xl">
        <Languages
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 text-[#D2A058]"
        />
        <select
          id="floating-language-switcher"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="appearance-none rounded-full bg-transparent py-3 pl-10 pr-10 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#D2A058]"
        >
          {languages.map((item) => (
            <option key={item.code} value={item.code} className="bg-white text-[#102355]">
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 text-white/75"
        />
      </div>
    </div>
  );
}
