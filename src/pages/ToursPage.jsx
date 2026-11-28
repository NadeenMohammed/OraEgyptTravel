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
    <div className="bg-[#f4f0e7] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="section-rule" />
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9d7437] font-bold">
              {t('site.tailormadeCollection')}
              </p>
            </div>
            <h1 className="mt-4 font-serif text-5xl sm:text-6xl leading-none text-[#08152f]">
              {t('nav.tours')}
            </h1>
            <p className="mt-4 text-sm sm:text-base text-[#08152f]/65 leading-relaxed">
              {t('site.toursIntro')}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[270px_minmax(0,1fr)] gap-8 items-start">
          <aside className="lg:sticky lg:top-28 p-5 sm:p-6 bg-[#fbf9f4] border border-[#08152f]/10 border-t-2 border-t-[#c9a061]">
            <div className="flex items-center gap-3 pb-5 border-b border-[#08152f]/10">
              <SlidersHorizontal size={17} className="text-[#9d7437]" />
              <h2 className="font-serif text-2xl text-[#08152f]">{t('tourFilters.title')}</h2>
            </div>

            <div className="mt-5 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#805927]/70" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('site.searchTours')}
                aria-label={t('site.searchTours')}
                className="w-full pl-10 pr-3 py-3 bg-white border border-[#08152f]/15 text-sm text-[#08152f] focus:outline-none focus:border-[#805927]"
              />
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="tour-destination" className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-[#08152f]/55 font-bold">
                  {t('site.destination')}
                </label>
                <select
                  id="tour-destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#08152f]/15 text-sm text-[#08152f] focus:outline-none focus:border-[#805927]"
                >
                  <option value="All">{t('site.allDestinations')}</option>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tour-category" className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-[#08152f]/55 font-bold">
                  {t('site.experienceType')}
                </label>
                <select
                  id="tour-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#08152f]/15 text-sm text-[#08152f] focus:outline-none focus:border-[#805927]"
                >
                  {TOUR_CATEGORIES.map((c, index) => (
                    <option key={c} value={c}>
                      {categoryLabels[index] || c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tour-style" className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-[#08152f]/55 font-bold">
                  {t('site.allStyles')}
                </label>
                <select
                  id="tour-style"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#08152f]/15 text-sm text-[#08152f] focus:outline-none focus:border-[#805927]"
                >
                  {TRAVEL_STYLES.map((s, index) => (
                    <option key={s} value={s}>
                      {styleLabels[index] || s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tour-duration" className="mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-[#08152f]/55 font-bold">
                  {t('site.anyDuration')}
                </label>
                <select
                  id="tour-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#08152f]/15 text-sm text-[#08152f] focus:outline-none focus:border-[#805927]"
                >
                  <option value="All">{t('site.anyDuration')}</option>
                  <option value="short">{t('site.shortDuration')}</option>
                  <option value="medium">{t('site.mediumDuration')}</option>
                  <option value="long">{t('site.longDuration')}</option>
                </select>
              </div>
            </div>

            {(query || destination !== 'All' || category !== 'All Categories' || style !== 'All Styles' || duration !== 'All') && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 pt-4 border-t border-[#08152f]/10 w-full inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[#805927] font-bold hover:text-[#08152f]"
              >
                <X size={14} /> {t('site.clearFilters')}
              </button>
            )}
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#08152f]/15 pb-4">
              <p className="text-xs text-[#08152f]/65">
                {t('site.showing')} <strong className="text-[#08152f]">{filteredTours.length}</strong> {t('site.curatedJourneys')}
              </p>
              <label className="flex items-center gap-2 text-xs text-[#08152f]/60">
                {t('site.sortBy')}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#fbf9f4] border border-[#08152f]/15 text-xs text-[#08152f] focus:outline-none focus:border-[#805927]"
                >
                  <option value="featured">{t('site.featured')}</option>
                  <option value="shortest">{t('site.shortest')}</option>
                  <option value="longest">{t('site.longest')}</option>
                </select>
              </label>
            </div>

            {filteredTours.length === 0 ? (
              <div className="p-10 sm:p-12 text-center bg-[#fbf9f4] border border-[#08152f]/10">
                <h3 className="font-serif text-2xl text-[#08152f]">{t('site.noItineraries')}</h3>
                <p className="mt-2 text-sm text-[#08152f]/65">
                  {t('site.broadenFilters')}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 px-5 py-2.5 bg-[#08152f] text-white text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#193261] transition-colors"
                >
                  {t('site.resetFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredTours.map((tour, idx) => (
                  <Reveal key={tour.id} delay={idx * 0.05}>
                    <TourCard tour={tour} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
