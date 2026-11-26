import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Check,
  X as XIcon,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { fetchTourBySlug, fetchTours } from '../services/api';
import { BookingInquiryForm } from '../components/BookingInquiryForm';
import { TourCard } from '../components/TourCard';
import { translated, translatedArray, useLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';
import { TOUR_CATEGORIES, TRAVEL_STYLES } from '../data/tours';

export function TourDetailPage() {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [openDay, setOpenDay] = useState(1);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setOpenDay(1);
    Promise.all([fetchTourBySlug(id), fetchTours()]).then(([found, all]) => {
      setTour(found);
      setRelated((all || []).filter((t) => t.id !== id).slice(0, 3));
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 max-w-3xl mx-auto px-5 text-center text-[#102355]/60">
        {t('site.loadingTour')}
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="pt-36 pb-24 max-w-3xl mx-auto px-5 text-center">
        <h1 className="font-serif text-3xl text-[#102355]">{t('site.itineraryNotFound')}</h1>
        <Link
          to="/tours"
          className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#102355]"
        >
          <ArrowLeft size={15} /> {t('site.backTours')}
        </Link>
      </div>
    );
  }

  const gallery = tour.gallery?.length ? tour.gallery : [tour.image];
  const title = translated(tour, 'title', language);
  const destination = translated(tour, 'destination', language);
  const category = translated(tour, 'category', language);
  const overview = translated(tour, 'overview', language);
  const travelInfo = translated(tour, 'travelInfo', language);
  const highlights = translatedArray(tour, 'highlights', language);
  const included = translatedArray(tour, 'included', language);
  const excluded = translatedArray(tour, 'excluded', language);
  const itinerary = translatedArray(tour, 'itinerary', language);
  const categoryIndex = TOUR_CATEGORIES.indexOf(category);
  const categoryLabels = t('options.categories', { returnObjects: true });
  const localizedCategory = language !== 'en' && categoryIndex >= 0 ? categoryLabels[categoryIndex] : category;
  const styleIndex = TRAVEL_STYLES.indexOf(tour.style);
  const styleLabels = t('options.styles', { returnObjects: true });
  const localizedStyle = language !== 'en' && styleIndex >= 0 ? styleLabels[styleIndex] : tour.style;
  const durationLabel = t('site.durationFormat', {
    days: tour.durationDays,
    nights: Math.max(0, tour.durationDays - 1),
  });
  const price = tour.priceDisplay === 'Tailored Quote / Price on Request'
    ? t('site.priceOnRequest')
    : tour.priceDisplay;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Link
          to="/tours"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#102355] hover:text-[#D2A058] mb-6"
        >
          <ArrowLeft size={14} /> {t('site.backToTours')}
        </Link>

        <div className="max-w-4xl">
          <span className="text-xs uppercase tracking-[0.22em] text-[#D2A058] font-semibold">
            {localizedCategory} • {localizedStyle}
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl text-[#102355] leading-tight">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-[#102355]/80 font-medium">
            <span className="inline-flex items-center gap-2">
              <Clock size={16} className="text-[#D2A058]" /> {durationLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-[#D2A058]" /> {destination}
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-12">
            <div>
              <div className="aspect-[16/10] rounded-sm overflow-hidden bg-[#0A1638]">
                <img src={gallery[activeImage]} alt={title} className="w-full h-full object-cover" />
              </div>
              {gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {gallery.map((img, idx) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActiveImage(idx)}
                      className={`aspect-[16/10] rounded-sm overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-[#D2A058]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#102355]">{t('site.journeyOverview')}</h2>
              <p className="mt-3 text-base text-[#102355]/80 leading-relaxed">{overview}</p>

              <h3 className="mt-8 font-serif text-xl text-[#102355]">{t('site.highlights')}</h3>
              <ul className="mt-4 space-y-2.5">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#102355]/80">
                    <Check size={16} className="text-[#D2A058] mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-2xl text-[#102355] mb-5">{t('site.itinerary')}</h2>
              <div className="space-y-3">
                {itinerary.map((step) => {
                  const isOpen = openDay === step.day;
                  return (
                    <div
                      key={step.day}
                      className="bg-white border border-[#D2A058]/35 rounded-sm overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenDay(isOpen ? null : step.day)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xs uppercase tracking-[0.18em] font-bold text-[#D2A058]">
                            {t('site.day')} {step.day}
                          </span>
                          <span className="font-serif text-lg text-[#102355]">{step.title}</span>
                        </div>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-2 text-sm text-[#102355]/75 leading-relaxed border-t border-[#EFE4D0]">
                          {step.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-[#D2A058]/35 rounded-sm">
                <h3 className="font-serif text-xl text-[#102355] mb-4">{t('site.included')}</h3>
                <ul className="space-y-2.5 text-sm text-[#102355]/80">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={15} className="text-[#102355] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-white border border-[#D2A058]/35 rounded-sm">
                <h3 className="font-serif text-xl text-[#102355] mb-4">{t('site.excluded')}</h3>
                <ul className="space-y-2.5 text-sm text-[#102355]/75">
                  {excluded.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <XIcon size={15} className="text-[#102355]/45 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {travelInfo && (
              <div className="p-6 bg-[#102355]/5 border border-[#102355]/20 rounded-sm flex items-start gap-3">
                <Info size={20} className="text-[#102355] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-[#102355]">{t('site.importantInfo')}</h4>
                  <p className="mt-1 text-sm text-[#102355]/75">{travelInfo}</p>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="p-6 bg-white border border-[#D2A058]/40 rounded-sm shadow-lg border-t-4 border-t-[#D2A058]">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#B88346] font-semibold">
                {t('site.privateQuote')}
              </span>
              <p className="mt-1 font-serif text-2xl text-[#102355]">{price}</p>
              <p className="mt-1 text-xs text-[#102355]/65 mb-6">
                {t('site.quoteDesc')}
              </p>
              <BookingInquiryForm tourSlug={tour.id} tourTitle={tour.title} />
            </div>
          </aside>
        </div>

        <div className="mt-24 pt-14 border-t border-[#D2A058]/30">
          <h2 className="font-serif text-3xl text-[#102355] mb-8">{t('site.relatedJourneys')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {related.map((item) => (
              <TourCard key={item.id} tour={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
