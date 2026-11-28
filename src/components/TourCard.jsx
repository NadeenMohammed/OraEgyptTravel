import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { translated, useLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';
import { TOUR_CATEGORIES } from '../data/tours';

export function TourCard({ tour }) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const title = translated(tour, 'title', language);
  const overview = translated(tour, 'overview', language);
  const destination = translated(tour, 'destination', language);
  const rawCategory = translated(tour, 'category', language);
  const categoryLabels = t('options.categories', { returnObjects: true });
  const categoryIndex = TOUR_CATEGORIES.indexOf(rawCategory);
  const category = language !== 'en' && categoryIndex >= 0
    ? categoryLabels[categoryIndex]
    : rawCategory;
  const durationLabel = t('site.durationFormat', {
    days: tour.durationDays,
    nights: Math.max(0, tour.durationDays - 1),
  });
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group h-full bg-[#fbf9f4] border border-white/10 border-t-2 border-t-[#c9a061] overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_22px_46px_rgba(0,0,0,0.24)] transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/tours/${tour.id}`} className="relative block aspect-[16/11] overflow-hidden bg-[#08152f]">
        <img
          src={tour.image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08152f]/55 via-transparent to-[#08152f]/10" />
        <span className="absolute top-4 left-4 max-w-[72%] px-3 py-1.5 bg-[#08152f]/85 backdrop-blur-sm text-[#e1c58f] text-[9px] uppercase tracking-[0.16em] font-bold">
          {category}
        </span>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-[#805927] font-bold">
          <span className="inline-flex items-center gap-1.5 shrink-0">
            <Clock size={13} />
            {durationLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 min-w-0 text-[#08152f]/55">
            <MapPin size={13} className="shrink-0 text-[#b48946]" />
            <span className="truncate">{destination}</span>
          </span>
        </div>

        <h3 className="mt-4 font-serif text-2xl text-[#08152f] group-hover:text-[#805927] transition-colors leading-tight">
          <Link to={`/tours/${tour.id}`}>{title}</Link>
        </h3>

        <p className="mt-3 text-sm text-[#08152f]/65 line-clamp-2 leading-relaxed flex-1">
          {overview}
        </p>

        <div className="mt-6 px-4 py-4 bg-[#08152f] flex items-center justify-between gap-3">
          <div>
            <span className="block text-[9px] uppercase tracking-[0.18em] text-[#d8b777] font-bold">
              {t('site.pricing')}
            </span>
            <span className="mt-1 block text-[11px] leading-snug font-semibold text-white/90">{tour.priceDisplay}</span>
          </div>
          <Link
            to={`/tours/${tour.id}`}
            aria-label={`${t('site.viewDetails')}: ${title}`}
            className="shrink-0 w-9 h-9 border border-white/30 text-[#d8b777] flex items-center justify-center group-hover:bg-[#c9a061] group-hover:border-[#c9a061] group-hover:text-[#08152f] transition-colors"
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
