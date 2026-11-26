import React, { useEffect, useState } from 'react';
import { fetchDestinations } from '../services/api';
import { DestinationCard } from '../components/DestinationCard';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

const REGIONS = ['All Regions', 'Lower Egypt', 'Upper Egypt', 'Mediterranean', 'Red Sea', 'Western Desert'];

export function DestinationsPage() {
  const { t } = useTranslation();
  const regionLabels = t('options.regions', { returnObjects: true });
  const [destinations, setDestinations] = useState([]);
  const [region, setRegion] = useState('All Regions');

  useEffect(() => {
    fetchDestinations().then(setDestinations);
  }, []);

  const filtered =
    region === 'All Regions' ? destinations : destinations.filter((d) => d.region === region);

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
              {t('site.exploreEgypt')}
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-[#102355]">
              {t('site.destinationsHeading')}
            </h1>
            <p className="mt-4 text-base text-[#102355]/75 leading-relaxed">
              {t('site.destinationsIntro')}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {REGIONS.map((r, index) => (
            <button
              key={r}
              type="button"
              onClick={() => setRegion(r)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-semibold rounded-sm transition-colors ${
                region === r
                  ? 'bg-[#102355] text-white'
                  : 'bg-white border border-[#D2A058]/40 text-[#102355]/80 hover:border-[#102355]'
              }`}
            >
              {regionLabels[index] || r}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map((dest, idx) => (
            <Reveal key={dest.id} delay={idx * 0.05}>
              <DestinationCard destination={dest} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
