import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { OraBrandLogo } from './OraBrandLogo';
import { useTranslation } from 'react-i18next';

const NAV_ITEMS = [
  { labelKey: 'nav.destinations', to: '/destinations' },
  { labelKey: 'nav.tours', to: '/tours' },
  { labelKey: 'nav.about', to: '/about' },
  { labelKey: 'nav.blog', to: '/blog' },
  { labelKey: 'nav.faq', to: '/faq' },
  { labelKey: 'nav.contact', to: '/contact' },
];

export function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const transparentMode = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        transparentMode
          ? 'bg-gradient-to-b from-[#0A1638]/85 to-transparent py-4'
          : 'bg-white/95 backdrop-blur-md border-b border-[#D2A058]/30 py-3 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <Link to="/" aria-label="ORA TRAVEL Home">
          <OraBrandLogo variant="header" onDark={transparentMode} />
        </Link>

        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary Navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  transparentMode
                    ? isActive
                      ? 'text-[#D2A058] font-semibold'
                      : 'text-white/90 hover:text-[#D2A058]'
                    : isActive
                      ? 'text-[#D2A058] font-semibold'
                      : 'text-[#102355]/85 hover:text-[#D2A058]'
                }`
              }
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/contact"
            className="px-5 py-2.5 text-xs uppercase tracking-[0.18em] font-bold rounded-sm bg-[#D2A058] text-[#0A1638] hover:bg-[#c18f48] transition-all shadow-sm"
          >
            {t('nav.plan')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className={`lg:hidden p-2 rounded-sm ${transparentMode ? 'text-white' : 'text-[#102355]'}`}
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-[#D2A058]/30 px-6 py-6 shadow-xl overflow-hidden"
          >
            <nav className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-base py-1 border-b border-[#EFE4D0] ${
                      isActive ? 'text-[#D2A058] font-semibold' : 'text-[#102355]'
                    }`
                  }
                >
                  {t(item.labelKey)}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="mt-2 text-center px-5 py-3 text-xs uppercase tracking-[0.18em] font-bold rounded-sm bg-[#102355] text-white"
              >
                {t('nav.plan')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
