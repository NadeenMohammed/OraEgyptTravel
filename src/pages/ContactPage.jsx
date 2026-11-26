import React, { useEffect, useState } from 'react';
import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { BookingInquiryForm } from '../components/BookingInquiryForm';
import { fetchSiteSettings } from '../services/api';
import { Reveal } from '../components/Reveal';
import { useTranslation } from 'react-i18next';

export function ContactPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('contact'); // contact | booking
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSiteSettings().then(setSettings);
  }, []);

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#D2A058] font-semibold">
              {t('site.concierge')}
            </p>
            <h1 className="mt-2 font-serif text-4xl sm:text-5xl text-[#102355]">
              {t('site.planEgypt')}
            </h1>
            <p className="mt-4 text-base text-[#102355]/75">
              {t('site.contactIntro')}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 p-6 sm:p-8 bg-white border border-[#D2A058]/35 rounded-sm shadow-sm">
            <div className="flex gap-2 mb-6 border-b border-[#EFE4D0] pb-4">
              <button
                type="button"
                onClick={() => setTab('contact')}
                className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-bold rounded-sm transition-colors ${
                  tab === 'contact' ? 'bg-[#102355] text-white' : 'bg-[#FAF8F4] text-[#102355]/75'
                }`}
              >
                {t('site.contactForm')}
              </button>
              <button
                type="button"
                onClick={() => setTab('booking')}
                className={`px-4 py-2 text-xs uppercase tracking-[0.16em] font-bold rounded-sm transition-colors ${
                  tab === 'booking' ? 'bg-[#102355] text-white' : 'bg-[#FAF8F4] text-[#102355]/75'
                }`}
              >
                {t('site.bookingRequest')}
              </button>
            </div>

            {tab === 'contact' ? <ContactForm /> : <BookingInquiryForm />}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-[#102355] text-white rounded-sm space-y-6 border-t-4 border-[#D2A058]">
              <h3 className="font-serif text-2xl text-[#D2A058]">{t('site.directContact')}</h3>
              <p className="text-xs text-white/65">
                {t('site.contactSettings')}
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-[#D2A058] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/55">{t('site.email')}</p>
                    <p>{settings.email || 'info@oraegypttravel.com'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-[#D2A058] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/55">{t('site.phoneWhatsapp')}</p>
                    <p>{settings.phone || '+20 000 000 0000'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle size={18} className="text-[#D2A058] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/55">{t('site.whatsappConcierge')}</p>
                    {settings.whatsapp ? (
                      <a
                        href={settings.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#D2A058] underline"
                      >
                        {t('site.chatWhatsapp')}
                      </a>
                    ) : (
                      <p>{t('site.configureWhatsapp')}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#D2A058] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/55">{t('site.officeLocation')}</p>
                    <p>{settings.address || 'Cairo, Egypt'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
