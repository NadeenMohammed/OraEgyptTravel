import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Compass, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '../data/destinations';
import { TOUR_CATEGORIES } from '../data/tours';
import { useTranslation } from 'react-i18next';

const HERO_SLIDES = [
  {
    id: 'giza',
    eyebrow: 'ORA TRAVEL • DESCUBRE. VIAJA. VIVE.',
    title: 'Discover Egypt.',
    highlight: 'Experience the Extraordinary.',
    subtitle:
      'Private Egyptologist-led explorations of the Great Pyramids, ancient temples, and timeless wonders crafted around your rhythm.',
    image:
      'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1920&q=85',
    location: 'Giza Plateau, Egypt',
    ctaLink: '/tours',
  },
  {
    id: 'nile',
    eyebrow: 'LUXURY NILE VOYAGES • LUXOR TO ASWAN',
    title: 'Sail the Timeless',
    highlight: 'Waters of the Nile.',
    subtitle:
      'Drift between Karnak, Edfu, and Philae aboard an intimate handcrafted wooden Dahabiya or five-star luxury Nile cruise.',
    image:
      'https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=1920&q=85',
    location: 'Aswan & Nile Valley',
    ctaLink: '/tours?category=Nile+Cruises',
  },
  {
    id: 'luxor',
    eyebrow: 'ANCIENT THEBES • OPEN-AIR MUSEUM',
    title: 'Walk Through Five',
    highlight: 'Millennia of Majesty.',
    subtitle:
      'Private sunrise access to the Valley of the Kings, colossal pillars of Karnak, and golden-hour views over Luxor Temple.',
    image:
      'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1920&q=85',
    location: 'Luxor & Valley of the Kings',
    ctaLink: '/tours?destination=Luxor',
  },
  {
    id: 'desert',
    eyebrow: 'WESTERN DESERT & RED SEA SANCTUARIES',
    title: 'Beyond the Horizon:',
    highlight: 'Desert Stars & Coral Seas.',
    subtitle:
      'From sculptural chalk monoliths in the White Desert and Siwa’s salt lakes to private Red Sea yacht charters.',
    image:
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1920&q=85',
    location: 'White Desert & Siwa Oasis',
    ctaLink: '/tours?category=Desert+Safaris',
  },
];

const SLIDE_DURATION = 6500;

export function HeroSlider() {
  const { t } = useTranslation();
  const categoryLabels = t('options.categories', { returnObjects: true });
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [searchDestination, setSearchDestination] = useState('');
  const [searchCategory, setSearchCategory] = useState('All Categories');

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [paused, nextSlide]);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchDestination) params.set('destination', searchDestination);
    if (searchCategory && searchCategory !== 'All Categories') params.set('category', searchCategory);
    navigate(`/tours?${params.toString()}`);
  };

  const slide = HERO_SLIDES[current];
  const heroText = (field) => t(`hero.${slide.id}.${field}`);

  return (
    <section
      className="relative min-h-[96vh] flex items-center bg-[#0A1638] text-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Animated Background Slides with Ken Burns zoom */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.15, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={heroText('location')}
            className="w-full h-full object-cover animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1638]/95 via-[#102355]/70 to-[#0A1638]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1638]/80 via-transparent to-[#0A1638]/40" />
        </motion.div>
      </AnimatePresence>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D2A058]/40 text-[11px] uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
                  <Sparkles size={13} />
                  <span>{heroText('eyebrow')}</span>
                </div>

                <h1 className="mt-5 font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.06] font-medium text-white">
                  {heroText('title')}
                  <br />
                  <span className="text-[#D2A058] italic font-normal">{heroText('highlight')}</span>
                </h1>

                <p className="mt-6 text-base sm:text-lg text-white/95 max-w-2xl leading-relaxed">
                  {heroText('subtitle')}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to={slide.ctaLink}
                    className="px-7 py-4 bg-[#D2A058] text-[#0A1638] text-xs uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#c18f48] transition-all shadow-lg hover:shadow-[#D2A058]/30"
                  >
                    {t('site.exploreTours')}
                  </Link>
                  <Link
                    to="/contact"
                    className="px-7 py-4 border border-white/45 bg-white/5 backdrop-blur-sm text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-white/15 transition-all"
                  >
                    {t('site.planJourney')}
                  </Link>
                  <span className="hidden sm:inline-flex items-center gap-2 text-xs text-[#EFE4D0]/90 ml-2">
                    <Compass size={15} className="text-[#D2A058]" />
                    {heroText('location')}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop Slide Controls */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-end gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D2A058] hover:text-[#0A1638] hover:border-[#D2A058] transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-11 h-11 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D2A058] hover:text-[#0A1638] hover:border-[#D2A058] transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="text-right font-mono text-xs tracking-widest text-white/70">
              <span className="text-[#D2A058] text-lg font-bold">0{current + 1}</span> / 0{HERO_SLIDES.length}
            </div>
          </div>
        </div>

        {/* Slide Indicator Bars */}
        <div className="mt-10 grid grid-cols-4 gap-3 max-w-xl">
          {HERO_SLIDES.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrent(idx)}
              className="group text-left focus:outline-none"
              aria-label={`Go to slide ${idx + 1}: ${t(`hero.${item.id}.location`)}`}
            >
              <div className="h-1 w-full bg-white/25 rounded-full overflow-hidden">
                {idx === current ? (
                  <motion.div
                    key={`${slide.id}-${paused}`}
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? '100%' : '100%' }}
                    transition={{ duration: paused ? 0.2 : SLIDE_DURATION / 1000, ease: 'linear' }}
                    className="h-full bg-[#D2A058]"
                  />
                ) : (
                  <div className={`h-full ${idx < current ? 'bg-white/60 w-full' : 'w-0'}`} />
                )}
              </div>
              <span
                className={`hidden sm:block mt-2 text-[10px] uppercase tracking-[0.16em] truncate transition-colors ${
                  idx === current ? 'text-[#D2A058] font-semibold' : 'text-white/55 group-hover:text-white/85'
                }`}
              >
                0{idx + 1}. {t(`hero.${item.id}.location`).split(',')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* Interactive Quick Search Bar */}
        <motion.form
          onSubmit={handleQuickSearch}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 bg-white/95 backdrop-blur-md text-[#102355] p-4 sm:p-5 rounded-sm shadow-2xl border-t-2 border-[#D2A058] grid grid-cols-1 md:grid-cols-12 gap-4 items-end max-w-5xl"
        >
          <div className="md:col-span-5">
            <label className="block text-[11px] uppercase tracking-[0.18em] text-[#102355]/65 font-semibold mb-1.5">
              {t('site.destination')}
            </label>
            <select
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
            >
              <option value="">{t('site.allDestinations')}</option>
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-4">
            <label className="block text-[11px] uppercase tracking-[0.18em] text-[#102355]/65 font-semibold mb-1.5">
              {t('site.experienceType')}
            </label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F4] border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
            >
              {TOUR_CATEGORIES.map((c, index) => (
                <option key={c} value={c}>
                  {categoryLabels[index] || c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#102355] text-white text-xs uppercase tracking-[0.18em] font-semibold rounded-sm hover:bg-[#1B367A] transition-colors h-[42px]"
            >
              <Search size={15} className="text-[#D2A058]" /> {t('site.findJourneys')}
            </button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
