import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { OraBrandLogo } from './OraBrandLogo';
import { submitNewsletterForm, fetchSiteSettings } from '../services/api';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchSiteSettings().then(setSettings);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitNewsletterForm({ email: email.trim(), source: 'footer' });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Unable to subscribe right now.');
    }
  };

  return (
    <footer className="bg-[#0A1638] text-[#FAF8F4] border-t border-[#D2A058]/25">
      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#D2A058] font-semibold">
              {t('site.newsletter')}
            </p>
            <h3 className="mt-2 font-serif text-2xl sm:text-3xl text-white">
              {t('site.newsletterTitle')}
            </h3>
            <p className="mt-2 text-sm text-white/70 max-w-lg">
              {t('site.newsletterDesc')}
            </p>
          </div>
          <div className="lg:col-span-6">
            {status === 'success' ? (
              <div className="flex items-center gap-3 p-4 rounded-sm bg-[#102355] border border-[#D2A058]/50 text-sm text-[#EFE4D0]">
                <CheckCircle2 size={20} className="text-[#D2A058] shrink-0" />
                <span>{t('site.thankSubscribe')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('common.emailPlaceholder')}
                    className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-[#D2A058] rounded-sm"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D2A058] text-[#0A1638] text-xs uppercase tracking-[0.18em] font-bold rounded-sm hover:bg-[#c18f48] transition-colors disabled:opacity-60"
                  >
                    {status === 'loading' ? t('site.saving') : t('common.subscribe')} <ArrowRight size={15} />
                  </button>
                </div>
                {status === 'error' && (
                  <p className="flex items-center gap-1.5 text-xs text-amber-300">
                    <AlertCircle size={14} /> {errorMsg}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <OraBrandLogo variant="header" onDark />
          <p className="mt-5 text-sm text-white/70 leading-relaxed">
            {t('site.bespokeDesc')}
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.22em] text-[#D2A058] font-semibold mb-4">
            {t('site.explore')}
          </h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link to="/destinations" className="hover:text-[#D2A058] transition-colors">{t('nav.destinations')}</Link></li>
            <li><Link to="/tours" className="hover:text-[#D2A058] transition-colors">{t('nav.tours')}</Link></li>
            <li><Link to="/about" className="hover:text-[#D2A058] transition-colors">{t('nav.about')} ORA TRAVEL</Link></li>
            <li><Link to="/blog" className="hover:text-[#D2A058] transition-colors">{t('site.travelJournal')}</Link></li>
            <li><Link to="/faq" className="hover:text-[#D2A058] transition-colors">{t('site.faqsTitle')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.22em] text-[#D2A058] font-semibold mb-4">
            {t('site.popularRegions')}
          </h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link to="/tours?destination=Cairo" className="hover:text-[#D2A058] transition-colors">{t('site.regionCairo')}</Link></li>
            <li><Link to="/tours?destination=Luxor" className="hover:text-[#D2A058] transition-colors">{t('site.regionLuxor')}</Link></li>
            <li><Link to="/tours?destination=Aswan" className="hover:text-[#D2A058] transition-colors">{t('site.regionAswan')}</Link></li>
            <li><Link to="/tours?destination=Siwa+Oasis" className="hover:text-[#D2A058] transition-colors">{t('site.regionSiwa')}</Link></li>
            <li><Link to="/tours?destination=Hurghada" className="hover:text-[#D2A058] transition-colors">{t('site.regionRedSea')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.22em] text-[#D2A058] font-semibold mb-4">
            {t('site.footerContact')}
          </h4>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-[#D2A058] mt-0.5 shrink-0" />
              <span>{settings.address || 'Cairo, Egypt'}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={16} className="text-[#D2A058] mt-0.5 shrink-0" />
              <span>{settings.email || 'info@oraegypttravel.com'}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone size={16} className="text-[#D2A058] mt-0.5 shrink-0" />
              <span>{settings.phone || '+20 000 000 0000'}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55">
          <p>© {new Date().getFullYear()} ORA TRAVEL. {t('site.allRights')}</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#D2A058] transition-colors">
              {t('site.privacyPolicy')}
            </Link>
            <Link to="/terms" className="hover:text-[#D2A058] transition-colors">
              {t('site.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
