import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, ArrowUpRight, MapPin } from 'lucide-react';
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
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      className="grain relative min-h-[94vh] lg:min-h-[92vh] bg-[#08152f] text-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.01 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.25, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={heroText('location')}
              className="w-full h-full object-cover animate-ken-burns"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08152f]/90 via-[#08152f]/60 to-[#08152f]/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08152f]/75 via-transparent to-[#08152f]/35" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-12 lg:pt-36 lg:pb-14 min-h-[94vh] lg:min-h-[92vh] flex flex-col justify-center">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-end lg:items-center">
          <div className="max-w-[960px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center gap-4">
                  <span className="h-px w-10 bg-[#c9a061]" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#e1c58f] font-bold">
                    {heroText('eyebrow')}
                  </span>
                </div>

                <h1 className="text-balance mt-7 text-[clamp(3.25rem,7.2vw,7.25rem)] leading-[0.84] font-medium tracking-[-0.035em] text-[#fbf9f4]">
                  <span className="block">{heroText('title')}</span>
                  <em className="block mt-2 text-[#d8b777] font-medium">{heroText('highlight')}</em>
                </h1>

                <p className="mt-7 text-sm sm:text-base lg:text-[17px] text-white/78 max-w-[610px] leading-[1.8]">
                  {heroText('subtitle')}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to={slide.ctaLink}
                    className="group inline-flex items-center gap-3 px-6 sm:px-7 py-4 bg-[#c9a061] text-[#08152f] text-[11px] uppercase tracking-[0.18em] font-bold hover:bg-[#dec28c] transition-colors"
                  >
                    {t('site.exploreTours')}
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="px-6 sm:px-7 py-4 border border-white/30 bg-[#08152f]/20 backdrop-blur-sm text-white text-[11px] uppercase tracking-[0.18em] font-bold hover:border-[#c9a061] hover:text-[#dec28c] transition-colors"
                  >
                    {t('site.planJourney')}
                  </Link>
                </div>

                <div className="mt-7 grid grid-cols-4 gap-3 max-w-[360px]" aria-label="Featured journeys">
                  {HERO_SLIDES.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrent(index)}
                      aria-label={`Show slide ${index + 1}: ${t(`hero.${item.id}.location`)}`}
                      aria-current={current === index ? 'true' : undefined}
                      className="group text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b777]"
                    >
                      <span className="block h-[2px] bg-white/30 overflow-hidden">
                        <span
                          className={`block h-full bg-[#d8b777] transition-[width] duration-500 ${
                            current === index ? 'w-full' : 'w-0'
                          }`}
                        />
                      </span>
                      <span className={`mt-2 hidden sm:block text-[9px] uppercase tracking-[0.12em] truncate transition-colors ${
                        current === index ? 'text-[#d8b777]' : 'text-white/55 group-hover:text-white/85'
                      }`}>
                        {t(`hero.${item.id}.location`).split(',')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.form
          onSubmit={handleQuickSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-7 lg:mt-10 bg-[#fbf9f4] text-[#102355] p-3 sm:p-4 shadow-[0_24px_80px_rgba(0,0,0,.22)] grid grid-cols-2 md:grid-cols-[1fr_1fr_auto] gap-2 items-end max-w-[700px] border-t-2 border-[#c9a061]"
        >
          <div>
            <label className="block px-3 text-[9px] uppercase tracking-[0.2em] text-[#102355]/55 font-bold mb-1">
              {t('site.destination')}
            </label>
            <select
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              className="w-full px-3 py-2.5 bg-transparent border-0 text-sm font-semibold focus:outline-none"
            >
              <option value="">{t('site.allDestinations')}</option>
              {DESTINATIONS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="border-l border-[#102355]/10">
            <label className="block px-3 text-[9px] uppercase tracking-[0.2em] text-[#102355]/55 font-bold mb-1">
              {t('site.experienceType')}
            </label>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-transparent border-0 text-sm font-semibold focus:outline-none"
            >
              {TOUR_CATEGORIES.map((c, index) => (
                <option key={c} value={c}>
                  {categoryLabels[index] || c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1">
            <button
              type="submit"
              className="w-full h-12 inline-flex items-center justify-center gap-2 px-5 bg-[#102355] text-white text-[10px] uppercase tracking-[0.18em] font-bold hover:bg-[#1d3b7a] transition-colors"
            >
              <Search size={15} className="text-[#d8b777]" /> {t('site.findJourneys')}
            </button>
          </div>
        </motion.form>

        <div className="absolute right-5 sm:right-8 lg:right-12 bottom-8 hidden md:flex items-center gap-4">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/75">
            <MapPin size={13} className="text-[#d8b777]" />
            {heroText('location')}
          </span>
          <button type="button" onClick={prevSlide} aria-label="Previous slide" className="w-10 h-10 border border-white/25 flex items-center justify-center hover:bg-white hover:text-[#08152f] transition-colors">
            <ChevronLeft size={17} />
          </button>
          <span className="text-xs tracking-[0.16em] text-white/60">0{current + 1} / 0{HERO_SLIDES.length}</span>
          <button type="button" onClick={nextSlide} aria-label="Next slide" className="w-10 h-10 bg-[#c9a061] text-[#08152f] flex items-center justify-center hover:bg-[#dec28c] transition-colors">
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
