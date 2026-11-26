import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQS } from '../data/faqs';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

export function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0);
  const { t } = useTranslation();
  const translatedFaqs = t('faqs', { returnObjects: true });

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
            {t('site.travelerAssistance')}
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-[#102355]">
            {t('site.faqsTitle')}
          </h1>
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            const translatedItem = translatedFaqs[idx] || item;
            return (
              <div key={item.q} className="bg-white border border-[#D2A058]/35 rounded-sm">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-serif text-lg text-[#102355]">{translatedItem.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-[#102355]/75 leading-relaxed border-t border-[#EFE4D0] pt-3">
                    {translatedItem.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
