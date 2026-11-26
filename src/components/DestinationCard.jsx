import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { translated, useLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

export function DestinationCard({ destination }) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const name = translated(destination, 'name', language);
  const region = translated(destination, 'region', language);
  const description = translated(destination, 'description', language);
  const tagline = translated(destination, 'tagline', language);
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative rounded-sm overflow-hidden bg-[#0A1638] aspect-[4/5] shadow-md hover:shadow-2xl transition-shadow"
    >
      <img
        src={destination.image}
        alt={name}
        loading="lazy"
        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1638]/95 via-[#102355]/35 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <span className="text-[11px] uppercase tracking-[0.22em] text-[#D2A058] font-semibold">
          {region}
        </span>
        <h3 className="mt-1 font-serif text-2xl">{name}</h3>
        <p className="mt-2 text-sm text-white/80 line-clamp-2 leading-relaxed">
          {description || tagline}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(destination.experiences || []).slice(0, 2).map((exp) => (
            <span
              key={exp}
              className="text-[11px] px-2.5 py-0.5 bg-white/10 backdrop-blur-sm text-[#EFE4D0] rounded-sm"
            >
              {exp}
            </span>
          ))}
        </div>
        <Link
          to={`/tours?destination=${encodeURIComponent(destination.name)}`}
          className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-[#D2A058] hover:text-white transition-colors"
        >
          {t('site.exploreEgypt')} <ArrowRight size={14} />
        </Link>
      </div>
    </motion.article>
  );
}
