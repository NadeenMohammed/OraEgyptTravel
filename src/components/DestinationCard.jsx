import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group h-full overflow-hidden bg-[#fbf9f4] border border-[#08152f]/10 hover:border-[#b48946]/60 hover:shadow-[0_18px_40px_rgba(8,21,47,0.12)] transition-all flex flex-col"
    >
      <Link
        to={`/tours?destination=${encodeURIComponent(destination.name)}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[#08152f]"
        aria-label={`${t('site.exploreEgypt')}: ${name}`}
      >
        <img
          src={destination.image}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08152f]/45 via-transparent to-[#08152f]/10" />
        <span className="absolute left-4 top-4 px-3 py-1.5 bg-[#08152f]/80 backdrop-blur-sm text-[#e1c58f] text-[9px] uppercase tracking-[0.18em] font-bold">
          {region}
        </span>
        <span className="absolute right-4 bottom-4 w-10 h-10 border border-white/55 text-white flex items-center justify-center group-hover:bg-[#c9a061] group-hover:border-[#c9a061] group-hover:text-[#08152f] transition-colors">
          <ArrowUpRight size={17} />
        </span>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="section-rule mb-3" />
        <h3 className="font-serif text-2xl sm:text-[1.7rem] leading-tight text-[#08152f]">
          {name}
        </h3>
        <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#9d7437] font-bold">
          {tagline}
        </p>
        <p className="mt-3 text-sm text-[#08152f]/65 line-clamp-2 leading-relaxed flex-1">
          {description || tagline}
        </p>
        <Link
          to={`/tours?destination=${encodeURIComponent(destination.name)}`}
          className="mt-5 pt-4 border-t border-[#08152f]/10 inline-flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.16em] font-bold text-[#08152f] hover:text-[#9d7437] transition-colors"
        >
          {t('site.exploreEgypt')}
          <ArrowUpRight size={16} className="text-[#b48946] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
}
