import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, HeartHandshake, Globe2 } from 'lucide-react';
import { OraBrandLogo } from '../components/OraBrandLogo';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

const PALETTE = [
  { name: 'Royal Navy', hex: '#102355' },
  { name: 'Midnight Navy', hex: '#0A1638' },
  { name: 'Solar Gold', hex: '#D2A058' },
  { name: 'Warm Bronze', hex: '#B88346' },
  { name: 'Warm Sand', hex: '#EFE4D0' },
  { name: 'Ivory Cream', hex: '#FAF8F4' },
];

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
              {t('site.aboutUs')}
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-[#102355]">
              Descubre. Viaja. Vive.
            </h1>
            <p className="mt-5 text-base text-[#102355]/80 leading-relaxed">
              {t('site.aboutIntro')}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-7">
          {[
            {
              icon: Compass,
              title: t('site.ourMission'),
              desc: t('site.missionDesc'),
            },
            {
              icon: Globe2,
              title: t('site.ourVision'),
              desc: t('site.visionDesc'),
            },
            {
              icon: HeartHandshake,
              title: t('site.travelPhilosophy'),
              desc: t('site.philosophyDesc'),
            },
          ].map((item, idx) => (
            <Reveal key={item.title} delay={idx * 0.08}>
              <div className="h-full p-8 bg-white border border-[#D2A058]/30 rounded-sm">
                <item.icon size={28} className="text-[#D2A058]" />
                <h2 className="mt-4 font-serif text-2xl text-[#102355]">{item.title}</h2>
                <p className="mt-3 text-sm text-[#102355]/75 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Official Brand Identity Showcase */}
        <Reveal>
          <div className="mt-20 p-8 sm:p-12 bg-white border border-[#D2A058]/35 rounded-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D2A058] font-semibold">
              {t('site.officialIdentity')}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#102355]">
              {t('site.brandPalette')}
            </h2>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-[#FAF8F4] border border-[#EFE4D0] rounded-sm flex items-center justify-center">
                <OraBrandLogo variant="full" />
              </div>
              <div className="p-8 bg-[#102355] rounded-sm flex items-center justify-center">
                <OraBrandLogo variant="full" onDark />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {PALETTE.map((c) => (
                <div key={c.hex} className="border border-[#EFE4D0] rounded-sm overflow-hidden">
                  <div className="h-14" style={{ backgroundColor: c.hex }} />
                  <div className="p-2.5 bg-white">
                    <p className="text-xs font-semibold text-[#102355]">{c.name}</p>
                    <p className="text-[11px] text-[#102355]/60 font-mono">{c.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-14 text-center">
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-[#102355] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#1B367A] transition-colors"
          >
            {t('site.startPlanning')}
          </Link>
        </div>
      </div>
    </div>
  );
}
