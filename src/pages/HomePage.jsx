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
    <div className="bg-[#f4f0e7]">
      <HeroSlider />

      <section className="editorial-grid py-20 sm:py-28">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4">
                <span className="section-rule" />
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#9d7437] font-bold">
                {t('site.iconRegions')}
                </p>
              </div>
              <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-none text-[#08152f]">
                {t('site.featuredDestinations')}
              </h2>
            </div>
            <Link
              to="/destinations"
              className="group inline-flex items-center gap-3 pb-2 border-b border-[#08152f]/30 text-[10px] uppercase tracking-[0.18em] font-bold text-[#08152f] hover:border-[#b48946] transition-colors"
            >
              {t('site.viewAllDestinations')} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {destinations.slice(0, 4).map((dest, idx) => (
            <Reveal key={dest.id} delay={idx * 0.08}>
              <DestinationCard destination={dest} />
            </Reveal>
          ))}
        </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#08152f] text-white">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#d8b777] font-bold">
                  {t('site.curatedItineraries')}
                </p>
                <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-none">
                  {t('site.signatureTours')}
                </h2>
              </div>
              <Link
                to="/tours"
                className="group inline-flex items-center gap-3 pb-2 border-b border-white/25 text-[10px] uppercase tracking-[0.18em] font-bold text-white hover:border-[#d8b777] transition-colors"
              >
                {t('site.browseAllTours')} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayTours.map((tour, idx) => (
              <Reveal key={tour.id} delay={idx * 0.08}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 max-w-[1320px] mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9d7437] font-bold">
              {t('site.waysExperience')}
            </p>
            <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-none text-[#08152f]">
              {t('site.threeWorlds')}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#08152f]/15">
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
              <div className={`h-full min-h-[280px] p-7 sm:p-8 flex flex-col ${idx > 0 ? 'md:border-l border-[#08152f]/15' : ''}`}>
                <div className="flex items-start justify-between">
                  <pillar.icon size={34} strokeWidth={1.35} className="text-[#b48946]" />
                  <span className="font-serif text-4xl text-[#08152f]/10">0{idx + 1}</span>
                </div>
                <h3 className="mt-8 font-serif text-3xl text-[#08152f]">{pillar.title}</h3>
                <p className="mt-3 text-sm text-[#08152f]/65 leading-[1.8] flex-1">{pillar.desc}</p>
                <Link
                  to={pillar.link}
                  className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-[#08152f] hover:text-[#9d7437]"
                >
                  {t('site.exploreExperiences')} <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-[#ede7da]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9d7437] font-bold">
                {t('site.oraStandard')}
              </p>
              <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-none text-[#08152f]">
                {t('site.whyOra')}
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="h-full min-h-[240px] p-8 bg-[#f8f5ef] border border-[#08152f]/10 hover:-translate-y-1 hover:shadow-xl transition-all">
                  <item.icon size={30} strokeWidth={1.35} className="text-[#b48946]" />
                  <h3 className="mt-8 font-serif text-3xl text-[#08152f]">{item.title}</h3>
                  <p className="mt-3 text-sm text-[#08152f]/65 leading-[1.8]">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#fbf9f4] border-y border-[#08152f]/10">
        <Reveal>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <MessageSquareQuote size={30} strokeWidth={1.35} className="mx-auto text-[#b48946]" />
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-[#08152f] font-bold">
              {t('site.verifiedReflections')}
            </p>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-[#08152f]">
              {t('site.verifiedReviews')}
            </h2>
            <p className="mt-4 text-sm text-[#08152f]/60 leading-relaxed max-w-2xl mx-auto">
              {t('site.reviewDesc')}
            </p>
          </div>
        </Reveal>
      </section>

      <section className="py-20 sm:py-28 max-w-[1320px] mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="grid md:grid-cols-[1fr_auto] items-end gap-6 mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#9d7437] font-bold">
                {t('site.travelJournal')}
              </p>
              <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-none text-[#08152f]">
                {t('site.storiesGuides')}
              </h2>
            </div>
            <Link
              to="/blog"
              className="group inline-flex items-center gap-3 pb-2 border-b border-[#08152f]/30 text-[10px] uppercase tracking-[0.18em] font-bold text-[#08152f] hover:border-[#b48946]"
            >
              {t('site.readArticles')} <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.slice(0, 3).map((post, idx) => (
            <Reveal key={post.id} delay={idx * 0.08}>
              <article className="h-full bg-[#fbf9f4] border border-[#08152f]/10 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all">
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
