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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group bg-white border border-[#D2A058]/30 rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/tours/${tour.id}`} className="relative block aspect-[16/10] overflow-hidden bg-[#0A1638]">
        <img
          src={tour.image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1638]/70 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 px-3 py-1 bg-[#102355]/90 backdrop-blur-sm text-[#D2A058] text-[11px] uppercase tracking-[0.16em] font-semibold rounded-sm">
          {category}
        </span>
      </Link>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-xs text-[#102355]/75 font-medium mb-2.5">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-[#D2A058]" />
            {durationLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 truncate">
            <MapPin size={14} className="text-[#D2A058] shrink-0" />
            <span className="truncate">{destination}</span>
          </span>
        </div>

        <h3 className="font-serif text-xl text-[#102355] group-hover:text-[#B88346] transition-colors leading-snug">
          <Link to={`/tours/${tour.id}`}>{title}</Link>
        </h3>

        <p className="mt-3 text-sm text-[#102355]/70 line-clamp-2 leading-relaxed flex-1">
          {overview}
        </p>

        <div className="mt-5 pt-4 border-t border-[#EFE4D0] flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.18em] text-[#102355]/50">
              {t('site.pricing')}
            </span>
            <span className="text-xs font-semibold text-[#102355]">{tour.priceDisplay}</span>
          </div>
          <Link
            to={`/tours/${tour.id}`}
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.16em] font-bold text-[#102355] group-hover:text-[#D2A058] transition-colors"
          >
            {t('site.viewDetails')} <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
