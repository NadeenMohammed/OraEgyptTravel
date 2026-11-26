import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { TOUR_CATEGORIES, TRAVEL_STYLES } from '../data/tours';
import { fetchTours, fetchDestinations } from '../services/api';
import { TourCard } from '../components/TourCard';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

export function ToursPage() {
  const { t } = useTranslation();
  const categoryLabels = t('options.categories', { returnObjects: true });
  const styleLabels = t('options.styles', { returnObjects: true });
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [style, setStyle] = useState('All Styles');
  const [duration, setDuration] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    fetchTours().then(setTours);
    fetchDestinations().then(setDestinations);
  }, []);

  useEffect(() => {
    const destParam = searchParams.get('destination');
    const catParam = searchParams.get('category');
    if (destParam) setDestination(destParam);
    if (catParam) setCategory(catParam);
  }, [searchParams]);

  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        const matchesQuery =
          !query.trim() ||
          tour.title.toLowerCase().includes(query.toLowerCase()) ||
          tour.destination.toLowerCase().includes(query.toLowerCase()) ||
          tour.overview.toLowerCase().includes(query.toLowerCase());

        const matchesDestination =
          destination === 'All' ||
          (tour.destinations || []).some((d) => d.toLowerCase() === destination.toLowerCase());

        const matchesCategory = category === 'All Categories' || tour.category === category;
        const matchesStyle = style === 'All Styles' || tour.style === style;

        const matchesDuration =
          duration === 'All' ||
          (duration === 'short' && tour.durationDays <= 5) ||
          (duration === 'medium' && tour.durationDays >= 6 && tour.durationDays <= 10) ||
          (duration === 'long' && tour.durationDays > 10);

        return matchesQuery && matchesDestination && matchesCategory && matchesStyle && matchesDuration;
      })
      .sort((a, b) => {
        if (sortBy === 'shortest') return a.durationDays - b.durationDays;
        if (sortBy === 'longest') return b.durationDays - a.durationDays;
        return Number(b.featured) - Number(a.featured);
      });
  }, [tours, query, destination, category, style, duration, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setDestination('All');
    setCategory('All Categories');
    setStyle('All Styles');
    setDuration('All');
    setSortBy('featured');
    setSearchParams({});
  };

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
              {t('site.tailormadeCollection')}
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-[#102355]">
              {t('nav.tours')}
            </h1>
            <p className="mt-4 text-base text-[#102355]/75">
              {t('site.toursIntro')}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 p-6 bg-white border border-[#D2A058]/35 rounded-sm shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#102355]/45" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('site.searchTours')}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F4] border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#D2A058]/40 text-sm rounded-sm"
              >
                <option value="All">{t('site.allDestinations')}</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#D2A058]/40 text-sm rounded-sm"
              >
                {TOUR_CATEGORIES.map((c, index) => (
                  <option key={c} value={c}>
                    {categoryLabels[index] || c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#D2A058]/40 text-sm rounded-sm"
              >
                {TRAVEL_STYLES.map((s, index) => (
                  <option key={s} value={s}>
                    {styleLabels[index] || s}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAF8F4] border border-[#D2A058]/40 text-sm rounded-sm"
              >
                <option value="All">{t('site.anyDuration')}</option>
                <option value="short">{t('site.shortDuration')}</option>
                <option value="medium">{t('site.mediumDuration')}</option>
                <option value="long">{t('site.longDuration')}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#EFE4D0] text-xs">
            <div className="flex items-center gap-3 text-[#102355]/75">
              <SlidersHorizontal size={14} className="text-[#D2A058]" />
              <span>
                {t('site.showing')} <strong className="text-[#102355]">{filteredTours.length}</strong> {t('site.curatedJourneys')}
              </span>
              {(query || destination !== 'All' || category !== 'All Categories' || style !== 'All Styles' || duration !== 'All') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-[#B88346] font-semibold hover:underline"
                >
                  <X size={13} /> {t('site.clearFilters')}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#102355]/60">{t('site.sortBy')}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 bg-[#FAF8F4] border border-[#D2A058]/40 rounded-sm text-xs"
              >
                <option value="featured">{t('site.featured')}</option>
                <option value="shortest">{t('site.shortest')}</option>
                <option value="longest">{t('site.longest')}</option>
              </select>
            </div>
          </div>
        </div>

        {filteredTours.length === 0 ? (
          <div className="mt-14 p-12 text-center bg-white border border-[#D2A058]/35 rounded-sm">
            <h3 className="font-serif text-2xl text-[#102355]">{t('site.noItineraries')}</h3>
            <p className="mt-2 text-sm text-[#102355]/70">
              {t('site.broadenFilters')}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 px-5 py-2.5 bg-[#102355] text-white text-xs uppercase tracking-[0.18em] font-semibold rounded-sm"
            >
              {t('site.resetFilters')}
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredTours.map((tour, idx) => (
              <Reveal key={tour.id} delay={idx * 0.05}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
