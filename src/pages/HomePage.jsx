import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ShieldCheck,
  Sparkles,
  Ship,
  Landmark,
  Sun,
  ArrowRight,
  MessageSquareQuote,
} from 'lucide-react';
import { fetchDestinations, fetchTours, fetchBlogPosts } from '../services/api';
import { HeroSlider } from '../components/HeroSlider';
import { TourCard } from '../components/TourCard';
import { DestinationCard } from '../components/DestinationCard';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';
import { translated } from '../i18n';

export function HomePage() {
  const { t, i18n } = useTranslation();
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchDestinations().then(setDestinations);
    fetchTours().then(setTours);
    fetchBlogPosts().then(setPosts);
  }, []);

  const featuredTours = tours.filter((t) => t.featured).slice(0, 4);
  const displayTours = featuredTours.length ? featuredTours : tours.slice(0, 4);

  return (
    <div>
      {/* 1. Professional Cinematic Hero Slider */}
      <HeroSlider />

      {/* 2. Featured Destinations */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D2A058] font-semibold">
                {t('site.iconRegions')}
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#102355]">
                {t('site.featuredDestinations')}
              </h2>
            </div>
            <Link
              to="/destinations"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#102355] hover:text-[#D2A058] transition-colors"
            >
              {t('site.viewAllDestinations')} <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.slice(0, 4).map((dest, idx) => (
            <Reveal key={dest.id} delay={idx * 0.08}>
              <DestinationCard destination={dest} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3. Signature Tours */}
      <section className="py-20 bg-white border-y border-[#D2A058]/25">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#D2A058] font-semibold">
                  {t('site.curatedItineraries')}
                </p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#102355]">
                  {t('site.signatureTours')}
                </h2>
              </div>
              <Link
                to="/tours"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#102355] hover:text-[#D2A058] transition-colors"
              >
                {t('site.browseAllTours')} <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayTours.map((tour, idx) => (
              <Reveal key={tour.id} delay={idx * 0.08}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Three Signature Pillars */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D2A058] font-semibold">
              {t('site.waysExperience')}
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#102355]">
              {t('site.threeWorlds')}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Ship,
              title: t('site.luxuryCruises'),
              desc: t('site.cruiseDesc'),
              link: '/tours?category=Nile+Cruises',
            },
            {
              icon: Landmark,
              title: t('site.culturalImmersion'),
              desc: t('site.culturalDesc'),
              link: '/tours?category=Cultural+Experiences',
            },
            {
              icon: Sun,
              title: t('site.desertAdventures'),
              desc: t('site.desertDesc'),
              link: '/tours?category=Desert+Safaris',
            },
          ].map((pillar, idx) => (
            <Reveal key={pillar.title} delay={idx * 0.1}>
              <div className="h-full p-8 bg-white border border-[#D2A058]/30 rounded-sm hover:border-[#D2A058] hover:shadow-lg transition-all flex flex-col">
                <pillar.icon size={32} className="text-[#D2A058]" />
                <h3 className="mt-5 font-serif text-2xl text-[#102355]">{pillar.title}</h3>
                <p className="mt-3 text-sm text-[#102355]/75 leading-relaxed flex-1">{pillar.desc}</p>
                <Link
                  to={pillar.link}
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-bold text-[#102355] hover:text-[#D2A058]"
                >
                  {t('site.exploreExperiences')} <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5. Why Travel With ORA TRAVEL */}
      <section className="py-20 bg-[#102355] text-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-[#D2A058] font-semibold">
                {t('site.oraStandard')}
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                {t('site.whyOra')}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: t('site.localExpertise'),
                desc: t('site.localDesc'),
              },
              {
                icon: Sparkles,
                title: t('site.tailoredPacing'),
                desc: t('site.pacingDesc'),
              },
              {
                icon: ShieldCheck,
                title: t('site.conciergeCare'),
                desc: t('site.conciergeDesc'),
              },
            ].map((item, idx) => (
              <Reveal key={item.title} delay={idx * 0.1}>
                <div className="h-full p-7 bg-white/5 border border-[#D2A058]/25 rounded-sm hover:bg-white/10 transition-colors">
                  <item.icon size={28} className="text-[#D2A058]" />
                  <h3 className="mt-4 font-serif text-xl">{item.title}</h3>
                  <p className="mt-2.5 text-sm text-white/75 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Verified Guest Reviews (Integration-Ready) */}
      <section className="py-20 bg-[#FAF8F4] border-b border-[#D2A058]/25">
        <Reveal>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <MessageSquareQuote size={34} className="mx-auto text-[#D2A058]" />
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#102355] font-semibold">
              {t('site.verifiedReflections')}
            </p>
            <h2 className="mt-2 font-serif text-3xl text-[#102355]">
              {t('site.verifiedReviews')}
            </h2>
            <p className="mt-4 text-sm text-[#102355]/70 leading-relaxed max-w-2xl mx-auto">
              {t('site.reviewDesc')}
            </p>
          </div>
        </Reveal>
      </section>

      {/* 7. Travel Journal */}
      <section className="py-20 max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#D2A058] font-semibold">
                {t('site.travelJournal')}
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl text-[#102355]">
                {t('site.storiesGuides')}
              </h2>
            </div>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#102355] hover:text-[#D2A058]"
            >
              {t('site.readArticles')} <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, idx) => (
            <Reveal key={post.id} delay={idx * 0.08}>
              <article className="h-full bg-white border border-[#D2A058]/30 rounded-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <img
                  src={post.image}
                  alt={translated(post, 'title', i18n.resolvedLanguage)}
                  loading="lazy"
                  className="w-full h-52 object-cover"
                />
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[#B88346] font-semibold">
                    {translated(post, 'category', i18n.resolvedLanguage)} • {post.readTime}
                  </span>
                  <h3 className="mt-2 font-serif text-xl text-[#102355] leading-snug">{translated(post, 'title', i18n.resolvedLanguage)}</h3>
                  <p className="mt-2.5 text-sm text-[#102355]/70 flex-1">{translated(post, 'excerpt', i18n.resolvedLanguage)}</p>
                  <Link
                    to={`/blog?article=${post.id}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-bold text-[#102355] hover:text-[#D2A058]"
                  >
                    {t('site.readArticle')} <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
