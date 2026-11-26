import React from 'react';
import { useTranslation } from 'react-i18next';

export function LegalPage({ type = 'privacy' }) {
  const isPrivacy = type === 'privacy';
  const { t } = useTranslation();

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <p className="text-xs uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
          {t('site.legalInfo')}
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[#102355]">
          {isPrivacy ? t('site.privacyPolicy') : t('site.terms')}
        </h1>
        <div className="mt-8 space-y-5 text-sm text-[#102355]/80 leading-relaxed bg-white p-8 border border-[#D2A058]/35 rounded-sm">
          {isPrivacy ? (
            <>
              <p>
                {t('site.privacyP1')}
              </p>
              <p>
                {t('site.privacyP2')}
              </p>
            </>
          ) : (
            <>
              <p>
                {t('site.termsP1')}
              </p>
              <p>
                {t('site.termsP2')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
