import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, MapPinned, Quote, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

const FEATURES = [
  { icon: Sparkles, title: 'selectedTitle', description: 'selectedDesc', link: '/tours' },
  { icon: MapPinned, title: 'discoverTitle', description: 'discoverDesc', link: '/destinations' },
  { icon: Compass, title: 'travelTitle', description: 'travelDesc', link: '/contact' },
];

const REVIEWS = [
  { name: 'Sarah Mitchell', location: 'United Kingdom · Quad at Giza', quote: 'reviewOne' },
  { name: 'Emma Wilson', location: 'Australia · Nile Cruise', quote: 'reviewTwo' },
  { name: 'Daniel Brown', location: 'Germany · Cairo', quote: 'reviewThree' },
  { name: 'James Anderson', location: 'United States · Nile Cruise', quote: 'reviewFour' },
];

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-[#f4f0e7] pt-28 pb-24">
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-12 lg:gap-16 items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4">
                <span className="section-rule" />
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#9d7437] font-bold">
                  {t('aboutPage.eyebrow')}
                </p>
              </div>
              <h1 className="mt-6 font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.92] text-[#08152f] text-balance">
                {t('aboutPage.title')}
              </h1>
              <p className="mt-7 text-base text-[#08152f]/75 leading-[1.9]">
                {t('aboutPage.intro')}
              </p>
              <p className="mt-4 text-sm text-[#08152f]/65 leading-[1.9]">
                {t('aboutPage.mission')}
              </p>
              <Link
                to="/destinations"
                className="group mt-8 inline-flex items-center gap-3 pb-2 border-b border-[#08152f]/30 text-[10px] uppercase tracking-[0.18em] font-bold text-[#08152f] hover:border-[#9d7437] transition-colors"
              >
                {t('aboutPage.exploreEgypt')}
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="relative min-h-[440px] sm:min-h-[560px]">
              <img
                src="https://oraegypttravel.com/wp-content/uploads/2026/11/Gemini_Generated_Image_pv6tivpv6tivpv6t-2-1.jpg"
                alt={t('aboutPage.imageAlt')}
                className="absolute right-0 top-0 w-[77%] h-[82%] object-cover"
              />
              <img
                src="https://oraegypttravel.com/wp-content/uploads/2026/11/Gemini_Generated_Image_pv6tivpv6tivpv6t-3-1.jpg"
                alt={t('aboutPage.imageAltSecondary')}
                className="absolute left-0 bottom-0 w-[51%] h-[49%] object-cover border-[10px] border-[#f4f0e7] shadow-xl"
              />
              <div className="absolute bottom-8 right-0 sm:right-6 bg-[#08152f] text-[#f4f0e7] px-6 py-5 min-w-36">
                <span className="block font-serif text-3xl leading-none">{t('aboutPage.country')}</span>
                <span className="mt-2 block text-[9px] uppercase tracking-[0.24em] text-[#d8b777]">
                  {t('aboutPage.countryCaption')}
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mt-24 sm:mt-32 bg-[#08152f] text-[#fbf9f4] py-20 sm:py-24">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#d8b777] font-bold">
                {t('aboutPage.differenceEyebrow')}
              </p>
              <h2 className="mt-4 font-serif text-5xl sm:text-6xl leading-none">
                {t('aboutPage.differenceTitle')}
              </h2>
              <p className="mt-4 text-sm text-white/65">{t('aboutPage.differenceIntro')}</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 border-y border-white/15">
            {FEATURES.map(({ icon: Icon, title, description, link }, index) => (
              <Reveal key={title} delay={index * 0.08}>
                <article className={`h-full min-h-[260px] p-7 sm:p-9 ${index > 0 ? 'md:border-l border-white/15' : ''}`}>
                  <div className="flex items-start justify-between">
                    <Icon size={30} strokeWidth={1.35} className="text-[#d8b777]" />
                    <span className="font-serif text-4xl text-white/15">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 font-serif text-3xl">{t(`aboutPage.${title}`)}</h3>
                  <p className="mt-3 text-sm text-white/65 leading-[1.8]">{t(`aboutPage.${description}`)}</p>
                  <Link
                    to={link}
                    className="group mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-bold text-[#d8b777] hover:text-white transition-colors"
                  >
                    {t('aboutPage.learnMore')}
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="section-rule" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#9d7437] font-bold">
              {t('aboutPage.feedbackEyebrow')}
            </p>
          </div>
          <div className="mt-4 mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <h2 className="font-serif text-5xl sm:text-6xl leading-none text-[#08152f] max-w-2xl">
              {t('aboutPage.feedbackTitle')}
            </h2>
            <p className="max-w-md text-sm text-[#08152f]/65 leading-[1.8]">
              {t('aboutPage.feedbackIntro')}
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((review, index) => (
            <Reveal key={review.name} delay={index * 0.06}>
              <article className="h-full min-h-[260px] p-6 sm:p-7 bg-[#fbf9f4] border border-[#08152f]/10 flex flex-col">
                <Quote size={22} strokeWidth={1.4} className="text-[#b48946]" />
                <p className="mt-5 font-serif text-2xl leading-snug text-[#08152f]">
                  “{t(`aboutPage.${review.quote}`)}”
                </p>
                <div className="mt-auto pt-6">
                  <p className="text-xs font-bold text-[#08152f]">{review.name}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#08152f]/55">
                    {t(`aboutPage.${review.quote}Location`, { defaultValue: review.location })}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
