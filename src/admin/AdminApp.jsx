import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck2,
  Mail,
  Users,
  Compass,
  MapPin,
  FileText,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Download,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Send,
  ArrowRight,
  Clock3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  adminApi,
  fetchTours,
  fetchDestinations,
  fetchBlogPosts,
  fetchSiteSettings,
  getAdminToken,
  setAdminToken,
  uploadAdminImage,
} from '../services/api';
import { OraBrandLogo } from '../components/OraBrandLogo';
import { useLanguage } from '../i18n';
import './admin.css';

const STATUS_BADGE = {
  NEW: 'bg-amber-100 text-amber-800 border-amber-300',
  CONTACTED: 'bg-blue-100 text-blue-800 border-blue-300',
  QUOTED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  CONFIRMED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  READ: 'bg-blue-100 text-blue-800 border-blue-300',
  REPLIED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  ARCHIVED: 'bg-slate-100 text-slate-600 border-slate-300',
};

function exportCsv(filename, rows) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(','),
    ...rows.map((row) =>
      keys
        .map((k) => `"${String(row[k] ?? '').replace(/"/g, '""')}"`)
        .join(',')
    ),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminApp() {
  const {
    language,
    setLanguage,
    languages,
    setLanguages,
    setShowLanguageSwitcher,
  } = useLanguage();
  const [admin, setAdmin] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('admin@oraegypttravel.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [tours, setTours] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [posts, setPosts] = useState([]);
  const [settings, setSettings] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    instagram: '',
    facebook: '',
    showLanguageSwitcher: true,
  });
  const [toast, setToast] = useState('');
  const [submissionDetail, setSubmissionDetail] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [translationModal, setTranslationModal] = useState(null);
  const [newLanguageCode, setNewLanguageCode] = useState('');
  const [newLanguageLabel, setNewLanguageLabel] = useState('');

  // Modal/form states for Tours, Destinations, Blog
  const [tourForm, setTourForm] = useState(null);
  const [destForm, setDestForm] = useState(null);
  const [blogForm, setBlogForm] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  };

  const loadAll = useCallback(async () => {
    try {
      const [st, bk, ct, sub, tr, ds, bl, cfg] = await Promise.all([
        adminApi.stats(),
        adminApi.getBookings(),
        adminApi.getContacts(),
        adminApi.getSubscribers(),
        fetchTours(),
        fetchDestinations(),
        fetchBlogPosts(),
        fetchSiteSettings(),
      ]);
      setStats(st);
      setBookings(bk);
      setContacts(ct);
      setSubscribers(sub);
      setTours(tr);
      setDestinations(ds);
      setPosts(bl);
      setSettings((prev) => ({
        ...prev,
        ...cfg,
        showLanguageSwitcher:
          cfg.showLanguageSwitcher === undefined
            ? prev.showLanguageSwitcher
            : cfg.showLanguageSwitcher !== 'false' && cfg.showLanguageSwitcher !== false,
      }));
      if (cfg.languages) {
        try {
          setLanguages(JSON.parse(cfg.languages));
        } catch {
          showToast('Saved language settings are invalid JSON');
        }
      }
      if (cfg.showLanguageSwitcher !== undefined) {
        setShowLanguageSwitcher(cfg.showLanguageSwitcher !== 'false' && cfg.showLanguageSwitcher !== false);
      }
    } catch (err) {
      showToast(err.message || 'Failed to refresh dashboard data');
    }
  }, []);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    adminApi
      .me()
      .then((res) => {
        setAdmin(res.admin);
        loadAll();
      })
      .catch(() => {
        setAdminToken('');
        setAdmin(null);
      })
      .finally(() => setCheckingAuth(false));
  }, [loadAll]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await adminApi.login(loginEmail, loginPassword);
      setAdminToken(res.token);
      setAdmin(res.admin);
      await loadAll();
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdmin(null);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#08152f] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-white/75">
          <span className="h-2 w-2 rounded-full bg-[#c9a061] animate-pulse" />
          Verifying admin session...
        </div>
      </div>
    );
  }

  // ================= STANDALONE LOGIN SCREEN =================
  if (!admin) {
    return (
      <div className="admin-login relative min-h-screen overflow-hidden bg-[#08152f] text-[#fbf9f4]">
        <img
          src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1920&q=85"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08152f]/95 via-[#08152f]/78 to-[#08152f]/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08152f]/80 via-transparent to-[#08152f]/40" />
        <div className="editorial-grid absolute inset-0 opacity-30" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 sm:px-8 lg:px-14">
          <header className="flex items-center justify-between gap-4 py-5 sm:py-7">
            <OraBrandLogo variant="header" onDark />
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.14em] font-bold text-white/70 hover:text-[#e3c58f] transition-colors"
            >
              Return to the journey <ArrowRight size={14} />
            </Link>
          </header>

          <main className="flex flex-1 items-center py-7 sm:py-10 lg:py-12">
            <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)] xl:gap-20">
              <section className="max-w-2xl">
                <p className="flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#e1c58f] font-bold">
                  <span className="h-px w-9 bg-[#c9a061]" />
                  Behind every remarkable journey
                </p>
                <h1 className="mt-6 font-serif text-[clamp(3.2rem,6.6vw,6.8rem)] leading-[0.88] font-medium tracking-[-0.035em] text-balance">
                  Egypt is our story.
                  <em className="mt-2 block font-medium text-[#d8b777]">You help tell it.</em>
                </h1>
                <p className="mt-6 max-w-lg text-sm sm:text-base leading-[1.8] text-white/72">
                  Step into the ORA workspace to shape thoughtful itineraries, welcome new guests, and bring Egypt closer to the world.
                </p>

                <div className="journey-route mt-10 max-w-[470px] border-t border-[#c9a061]/45 pt-5">
                  <div className="mb-4 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] font-bold text-white/50">
                    <span>A journey, thoughtfully curated</span>
                    <span className="text-[#d8b777]">ORA / 01</span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-5">
                    {['Cairo', 'Luxor', 'Aswan'].map((city, index) => (
                      <React.Fragment key={city}>
                        {index > 0 && <span className="h-px flex-1 bg-gradient-to-r from-[#c9a061]/70 to-white/20" />}
                        <span className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.16em] font-semibold text-white/85">
                          <span className="h-2 w-2 rounded-full border border-[#e1c58f] bg-[#c9a061] shadow-[0_0_14px_rgba(201,160,97,0.65)]" />
                          {city}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </section>

              <section className="flex justify-center lg:justify-end">
                <div className="login-paper relative w-full max-w-[470px] overflow-hidden rounded-[4px_34px_4px_34px] border border-[#d9c99f]/70 px-7 py-8 text-[#08152f] shadow-[0_28px_90px_rgba(0,0,0,0.32)] sm:px-10 sm:py-10">
                  <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border border-[#c9a061]/20" />
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#c9a061]/20" />

                  <div className="relative flex items-start justify-between gap-4 border-b border-[#d8ccb4] pb-5">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.24em] font-bold text-[#9b7541]">Private collection</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#6d6a5e]">ORA / Team access</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a061]/60 text-[#b3874e]">
                      <Compass size={23} strokeWidth={1.4} />
                    </div>
                  </div>

                  <div className="relative mt-7">
                    <h2 className="font-serif text-3xl sm:text-[2.15rem] leading-tight text-[#102355]">Welcome back.</h2>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6d6a5e]">
                      Pick up where you left off, creating journeys worth remembering.
                    </p>
                  </div>

                  {loginError && (
                    <div role="alert" className="relative mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="relative mt-7 space-y-5">
                    <div>
                      <label htmlFor="admin-email" className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-[#33475d] font-bold">
                        <span>Email address</span>
                        <span className="text-[#b3874e]">01</span>
                      </label>
                      <input
                        id="admin-email"
                        type="email"
                        required
                        autoComplete="username"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full border border-[#d8ccb4] bg-[#fffdf8]/75 px-4 py-3.5 text-sm text-[#102355] placeholder:text-[#9b978c] focus:border-[#b3874e] focus:outline-none focus:ring-2 focus:ring-[#c9a061]/15"
                      />
                    </div>
                    <div>
                      <label htmlFor="admin-password" className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-[#33475d] font-bold">
                        <span>Password</span>
                        <span className="text-[#b3874e]">02</span>
                      </label>
                      <div className="relative">
                        <input
                          id="admin-password"
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          autoComplete="current-password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full border border-[#d8ccb4] bg-[#fffdf8]/75 px-4 py-3.5 pr-12 text-sm text-[#102355] placeholder:text-[#9b978c] focus:border-[#b3874e] focus:outline-none focus:ring-2 focus:ring-[#c9a061]/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((visible) => !visible)}
                          aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#8b887e] hover:text-[#102355]"
                        >
                          {showLoginPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="group mt-2 inline-flex w-full items-center justify-between border border-[#c9a061] bg-[#102355] px-5 py-4 text-[11px] uppercase tracking-[0.16em] font-bold text-[#fbf9f4] transition-colors hover:bg-[#183466] disabled:opacity-60"
                    >
                      <span>{loginLoading ? 'Opening your workspace…' : 'Enter the workspace'}</span>
                      {!loginLoading && <ArrowRight size={17} className="text-[#d8b777] transition-transform group-hover:translate-x-1" />}
                    </button>
                  </form>

                  <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-[#d8ccb4] pt-4 text-[9px] uppercase tracking-[0.1em] text-[#777366]">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#a47b3f]" />
                      Authorized team only
                    </span>
                    <span>Secure access</span>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/15 py-4 text-[9px] uppercase tracking-[0.16em] text-white/45">
            <span>© {new Date().getFullYear()} ORA Egypt Travel</span>
            <span>Curated in Cairo · Made for the love of Egypt</span>
          </footer>
        </div>
      </div>
    );
  }

  // ================= HANDLERS FOR CRUD =================
  const saveTour = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...tourForm,
        durationDays: Number(tourForm.durationDays) || 1,
        destinations: tourForm.destinationsText.split(',').map((s) => s.trim()).filter(Boolean),
        highlights: tourForm.highlightsText.split('\n').map((s) => s.trim()).filter(Boolean),
        included: tourForm.includedText.split('\n').map((s) => s.trim()).filter(Boolean),
        excluded: tourForm.excludedText.split('\n').map((s) => s.trim()).filter(Boolean),
        gallery: (tourForm.galleryText || '').split('\n').map((s) => s.trim()).filter(Boolean),
        translations: (() => { try { return JSON.parse(tourForm.translationsText || '{}'); } catch { return {}; } })(),
      };
      if (tourForm.dbId) {
        await adminApi.updateTour(tourForm.dbId, payload);
        showToast('Tour updated successfully');
      } else {
        await adminApi.createTour(payload);
        showToast('New tour created');
      }
      setTourForm(null);
      loadAll();
    } catch (err) {
      showToast(err.message);
    }
  };

  const saveDestination = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...destForm,
        experiences: destForm.experiencesText.split(',').map((s) => s.trim()).filter(Boolean),
        translations: (() => { try { return JSON.parse(destForm.translationsText || '{}'); } catch { return {}; } })(),
      };
      if (destForm.dbId) {
        await adminApi.updateDestination(destForm.dbId, payload);
        showToast('Destination updated');
      } else {
        await adminApi.createDestination(payload);
        showToast('New destination added');
      }
      setDestForm(null);
      loadAll();
    } catch (err) {
      showToast(err.message);
    }
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...blogForm,
        content: blogForm.contentText.split('\n\n').map((s) => s.trim()).filter(Boolean),
        translations: (() => { try { return JSON.parse(blogForm.translationsText || '{}'); } catch { return {}; } })(),
      };
      if (blogForm.dbId) {
        await adminApi.updateBlog(blogForm.dbId, payload);
        showToast('Article updated');
      } else {
        await adminApi.createBlog(payload);
        showToast('New article published');
      }
      setBlogForm(null);
      loadAll();
    } catch (err) {
      showToast(err.message);
    }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      const saved = await adminApi.updateSettings({
        ...settings,
        languages: JSON.stringify(languages),
        showLanguageSwitcher: String(
          settings.showLanguageSwitcher !== false && settings.showLanguageSwitcher !== 'false'
        ),
      });
      const nextLanguages = (() => {
        try {
          return JSON.parse(saved.languages);
        } catch {
          return languages;
        }
      })();
      setLanguages(nextLanguages);
      localStorage.setItem('ora_languages', JSON.stringify(nextLanguages));
      const showSwitcher = saved.showLanguageSwitcher !== 'false' && saved.showLanguageSwitcher !== false;
      setShowLanguageSwitcher(showSwitcher);
      localStorage.setItem('ora_show_language_switcher', String(showSwitcher));
      showToast('Site settings saved to database');
    } catch (err) {
      showToast(err.message);
    }
  };

  const addLanguage = () => {
    const code = newLanguageCode.trim();
    const label = newLanguageLabel.trim();
    if (!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(code)) {
      showToast('Use a valid language code, such as de or pt-BR');
      return;
    }
    if (!label) {
      showToast('Enter a language display name');
      return;
    }
    if (languages.some((language) => language.code.toLowerCase() === code.toLowerCase())) {
      showToast('That language is already available');
      return;
    }
    setLanguages([...languages, { code, label }]);
    setNewLanguageCode('');
    setNewLanguageLabel('');
    showToast('Language added. Save site settings to publish it.');
  };

  const removeLanguage = (code) => {
    const nextLanguages = languages.filter((item) => item.code !== code);
    setLanguages(nextLanguages);
    if (language === code) setLanguage('en');
    showToast('Language removed. Save site settings to publish the change.');
  };

  const openTranslationModal = (type, form) => {
    let translations = {};
    try {
      translations = JSON.parse(form.translationsText || '{}');
    } catch {
      translations = {};
    }

    const language = languages.some((item) => item.code === 'ar')
      ? 'ar'
      : languages[0]?.code || 'en';
    const existing = translations[language] || {};
    const fields = type === 'tour'
      ? [
          { key: 'title', label: 'Tour Title', value: existing.title || '', multiline: false },
          { key: 'destination', label: 'Destination', value: existing.destination || '', multiline: false },
          { key: 'category', label: 'Tour Type / Category', value: existing.category || '', multiline: false },
          { key: 'overview', label: 'Overview', value: existing.overview || '', multiline: true },
          { key: 'highlights', label: 'Highlights (one per line)', value: (existing.highlights || []).join('\n'), multiline: true },
          { key: 'included', label: 'Included (one per line)', value: (existing.included || []).join('\n'), multiline: true },
          { key: 'excluded', label: 'Excluded (one per line)', value: (existing.excluded || []).join('\n'), multiline: true },
          { key: 'travelInfo', label: 'Travel Information', value: existing.travelInfo || '', multiline: true },
        ]
      : type === 'destination'
        ? [
            { key: 'name', label: 'Destination Name', value: existing.name || '', multiline: false },
            { key: 'region', label: 'Region', value: existing.region || '', multiline: false },
            { key: 'tagline', label: 'Tagline', value: existing.tagline || '', multiline: false },
            { key: 'description', label: 'Description', value: existing.description || '', multiline: true },
            { key: 'experiences', label: 'Experiences (one per line)', value: (existing.experiences || []).join('\n'), multiline: true },
          ]
        : [
            { key: 'title', label: 'Article Title', value: existing.title || '', multiline: false },
            { key: 'category', label: 'Category', value: existing.category || '', multiline: false },
            { key: 'excerpt', label: 'Excerpt', value: existing.excerpt || '', multiline: true },
            { key: 'content', label: 'Article Content (paragraph per block)', value: (existing.content || []).join('\n\n'), multiline: true },
          ];

    setTranslationModal({ type, form, language, translations, fields });
  };

  const changeTranslationLanguage = (language) => {
    if (!translationModal) return;
    const current = {};
    translationModal.fields.forEach((field) => {
      if (['highlights', 'included', 'excluded', 'experiences'].includes(field.key)) {
        current[field.key] = field.value.split('\n').map((value) => value.trim()).filter(Boolean);
      } else if (field.key === 'content') {
        current[field.key] = field.value.split('\n\n').map((value) => value.trim()).filter(Boolean);
      } else {
        current[field.key] = field.value;
      }
    });
    const translations = {
      ...translationModal.translations,
      [translationModal.language]: current,
    };
    const existing = translations[language] || {};
    const type = translationModal.type;
    const template = openTranslationFields(type, existing);
    setTranslationModal({ ...translationModal, language, translations, fields: template });
  };

  const openTranslationFields = (type, existing) => type === 'tour'
    ? [
        { key: 'title', label: 'Tour Title', value: existing.title || '', multiline: false },
        { key: 'destination', label: 'Destination', value: existing.destination || '', multiline: false },
        { key: 'category', label: 'Tour Type / Category', value: existing.category || '', multiline: false },
        { key: 'overview', label: 'Overview', value: existing.overview || '', multiline: true },
        { key: 'highlights', label: 'Highlights (one per line)', value: (existing.highlights || []).join('\n'), multiline: true },
        { key: 'included', label: 'Included (one per line)', value: (existing.included || []).join('\n'), multiline: true },
        { key: 'excluded', label: 'Excluded (one per line)', value: (existing.excluded || []).join('\n'), multiline: true },
        { key: 'travelInfo', label: 'Travel Information', value: existing.travelInfo || '', multiline: true },
      ]
    : type === 'destination'
      ? [
          { key: 'name', label: 'Destination Name', value: existing.name || '', multiline: false },
          { key: 'region', label: 'Region', value: existing.region || '', multiline: false },
          { key: 'tagline', label: 'Tagline', value: existing.tagline || '', multiline: false },
          { key: 'description', label: 'Description', value: existing.description || '', multiline: true },
          { key: 'experiences', label: 'Experiences (one per line)', value: (existing.experiences || []).join('\n'), multiline: true },
        ]
      : [
          { key: 'title', label: 'Article Title', value: existing.title || '', multiline: false },
          { key: 'category', label: 'Category', value: existing.category || '', multiline: false },
          { key: 'excerpt', label: 'Excerpt', value: existing.excerpt || '', multiline: true },
          { key: 'content', label: 'Article Content (paragraph per block)', value: (existing.content || []).join('\n\n'), multiline: true },
        ];

  const saveTranslationModal = () => {
    if (!translationModal) return;
    const translated = {};
    translationModal.fields.forEach((field) => {
      if (['highlights', 'included', 'excluded', 'experiences'].includes(field.key)) {
        translated[field.key] = field.value.split('\n').map((value) => value.trim()).filter(Boolean);
      } else if (field.key === 'content') {
        translated[field.key] = field.value.split('\n\n').map((value) => value.trim()).filter(Boolean);
      } else {
        translated[field.key] = field.value;
      }
    });

    const translations = {
      ...translationModal.translations,
      [translationModal.language]: translated,
    };
    const serialized = JSON.stringify(translations, null, 2);

    if (translationModal.type === 'tour') setTourForm({ ...tourForm, translationsText: serialized });
    if (translationModal.type === 'destination') setDestForm({ ...destForm, translationsText: serialized });
    if (translationModal.type === 'blog') setBlogForm({ ...blogForm, translationsText: serialized });
    setTranslationModal(null);
    showToast('Translation saved');
  };

  const NAV = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Booking Inquiries', icon: CalendarCheck2, badge: stats?.counts?.newBookings },
    { id: 'contacts', label: 'Contact Messages', icon: Mail, badge: stats?.counts?.newContacts },
    { id: 'subscribers', label: 'Newsletter', icon: Users, badge: stats?.counts?.subscribers },
    { id: 'tours', label: 'Tours Manager', icon: Compass },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'blog', label: 'Travel Journal', icon: FileText },
    { id: 'settings', label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="admin-console min-h-screen bg-[#f3f6f8] flex flex-col lg:flex-row text-[#17344d]">
      {/* Standalone Sidebar */}
      <aside className="admin-sidebar w-full lg:w-[272px] lg:min-h-screen lg:h-screen lg:sticky lg:top-0 bg-[#0b2947] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <OraBrandLogo variant="header" onDark />
          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#e2b45f] font-bold">
            Admin Control Panel
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-x-auto lg:overflow-y-auto lg:overflow-x-hidden flex lg:flex-col gap-1">
          <p className="hidden lg:block px-3 pb-2 pt-1 text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Workspace
          </p>
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`relative flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-[13px] transition-all whitespace-nowrap ${
                tab === item.id
                  ? 'bg-white/10 text-white font-semibold shadow-inner'
                  : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              {tab === item.id && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#e2b45f]" />}
              <span className="inline-flex items-center gap-2.5">
                <item.icon size={17} className={tab === item.id ? 'text-[#e2b45f]' : 'text-white/55'} />
                {item.label}
              </span>
              {item.badge > 0 && (
                <span
                  className={`text-[10px] min-w-5 text-center px-1.5 py-0.5 rounded-full font-bold ${
                    tab === item.id ? 'bg-[#e2b45f] text-[#0b2947]' : 'bg-white/10 text-white/75'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs bg-white/[0.07] hover:bg-white/[0.12] rounded-xl text-white/80 transition-colors"
          >
            <ExternalLink size={14} /> View Live Website
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-white/55 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={14} /> Sign Out ({admin.email})
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="admin-topbar bg-white/95 border-b border-[#e7edf1] px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#b47b28] font-bold">ORA MANAGEMENT</p>
            <h1 className="mt-1 font-serif text-2xl text-[#17344d]">
              {NAV.find((n) => n.id === tab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {toast && (
              <span role="status" className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-2 rounded-xl">
                <CheckCircle2 size={14} /> {toast}
              </span>
            )}
            <button
              type="button"
              onClick={loadAll}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={14} /> Refresh
            </button>
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <span className="h-9 w-9 rounded-full bg-[#e8f0f3] text-[#17344d] flex items-center justify-center text-xs font-bold">
                {(admin.email || 'A').slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-[160px] truncate text-xs font-semibold text-[#17344d]">{admin.email}</span>
            </div>
          </div>
        </header>

        <main className="admin-content p-5 sm:p-8 flex-1 overflow-y-auto">
          {/* ================= OVERVIEW TAB ================= */}
          {tab === 'overview' && (
            <div className="space-y-7 max-w-[1500px] mx-auto">
              <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0d3450] via-[#154661] to-[#0c2947] px-6 py-7 sm:px-9 sm:py-8 text-white shadow-[0_16px_38px_rgba(11,41,71,0.16)]">
                <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
                <div className="absolute -right-1 top-4 h-44 w-44 rounded-full border border-white/10" />
                <div className="absolute right-16 -bottom-28 h-56 w-56 rounded-full bg-[#e2b45f]/10 blur-2xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#e9bd70]">
                      <Sparkles size={14} /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl leading-tight">
                      Welcome back, {admin.email?.split('@')[0] || 'Admin'}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/70">
                      Here’s what’s happening across your Egypt travel experience today.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab('tours')}
                    className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#e2b45f] px-5 py-3 text-xs font-bold text-[#14334c] shadow-lg shadow-black/10 hover:bg-[#efc879] transition-colors"
                  >
                    <Plus size={16} /> Manage Tours
                  </button>
                </div>
              </section>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[
                  { label: 'Total Tours', value: stats?.counts?.tours ?? tours.length, sub: `${stats?.counts?.destinations ?? destinations.length} destinations`, icon: Compass, tone: 'bg-[#edf4f7] text-[#2d6d86]' },
                  { label: 'Total Bookings', value: stats?.counts?.bookings ?? bookings.length, sub: 'All guest requests', icon: CalendarCheck2, tone: 'bg-[#f3effa] text-[#7657a1]' },
                  { label: 'Pending Bookings', value: stats?.counts?.newBookings ?? 0, sub: 'Awaiting your response', icon: Clock3, tone: 'bg-[#fff4e5] text-[#b47b28]' },
                  { label: 'Total Inquiries', value: stats?.counts?.contacts ?? contacts.length, sub: `${stats?.counts?.newContacts ?? 0} new messages`, icon: Mail, tone: 'bg-[#eaf5ef] text-[#438568]' },
                  { label: 'Published Blogs', value: posts.length, sub: 'Travel journal articles', icon: FileText, tone: 'bg-[#f8eef0] text-[#a75d71]' },
                  { label: 'Unread Alerts', value: (stats?.counts?.newBookings ?? 0) + (stats?.counts?.newContacts ?? 0), sub: 'Bookings & messages', icon: Users, tone: 'bg-[#eef1f7] text-[#546a92]' },
                ].map((card) => (
                  <div key={card.label} className="rounded-2xl border border-[#e6edf0] bg-white p-5 shadow-[0_4px_18px_rgba(20,50,70,0.035)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(20,50,70,0.08)]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.13em] text-slate-500 font-bold">{card.label}</p>
                        <p className="mt-3 font-serif text-3xl font-semibold text-[#17344d]">{card.value}</p>
                      </div>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                        <card.icon size={19} />
                      </span>
                    </div>
                    <p className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.8fr)] gap-5">
                <section className="min-w-0 rounded-2xl border border-[#e6edf0] bg-white p-5 sm:p-6 shadow-[0_4px_18px_rgba(20,50,70,0.035)]">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl text-[#17344d]">Recent Bookings</h2>
                      <p className="mt-1 text-xs text-slate-500">The latest guest requests across your tours.</p>
                    </div>
                    <button type="button" onClick={() => setTab('bookings')} className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold text-[#31758b] hover:text-[#17344d]">
                      View all <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-xs">
                      <thead>
                        <tr className="border-y border-slate-100 text-[9px] uppercase tracking-[0.12em] text-slate-400">
                          <th className="py-3 pr-3 font-bold">Guest</th>
                          <th className="py-3 px-3 font-bold">Tour / Trip</th>
                          <th className="py-3 px-3 font-bold">Travel Date</th>
                          <th className="py-3 pl-3 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {((stats?.recentBookings?.length ? stats.recentBookings : bookings).slice(0, 4)).map((booking) => (
                          <tr key={booking.id} className="hover:bg-[#f8fafb]">
                            <td className="py-3.5 pr-3">
                              <p className="font-semibold text-[#17344d]">{booking.fullName}</p>
                              <p className="mt-1 text-[10px] text-slate-400">{booking.email}</p>
                            </td>
                            <td className="px-3 py-3.5 text-slate-600">{booking.tourTitle || 'Custom Journey'}</td>
                            <td className="px-3 py-3.5 text-slate-500">{booking.travelDate || 'Flexible'}</td>
                            <td className="py-3.5 pl-3">
                              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-bold ${STATUS_BADGE[booking.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {(!stats?.recentBookings?.length && !bookings.length) && (
                          <tr>
                            <td colSpan="4" className="py-10 text-center text-sm text-slate-400">No booking requests yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#e6edf0] bg-white p-5 sm:p-6 shadow-[0_4px_18px_rgba(20,50,70,0.035)]">
                  <div className="mb-5">
                    <h2 className="font-serif text-xl text-[#17344d]">Quick Actions</h2>
                    <p className="mt-1 text-xs text-slate-500">Jump straight into your daily tasks.</p>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Manage bookings', helper: 'Review guest requests', icon: CalendarCheck2, target: 'bookings', tone: 'bg-[#eef4f7] text-[#34748a]' },
                      { label: 'Manage tours', helper: 'Edit itineraries & pricing', icon: Compass, target: 'tours', tone: 'bg-[#fff5e8] text-[#b47b28]' },
                      { label: 'Update destinations', helper: 'Refresh destination pages', icon: MapPin, target: 'destinations', tone: 'bg-[#edf5f0] text-[#438568]' },
                      { label: 'Edit travel journal', helper: 'Publish stories & guides', icon: FileText, target: 'blog', tone: 'bg-[#f8eff1] text-[#a75d71]' },
                    ].map((action) => (
                      <button
                        key={action.target}
                        type="button"
                        onClick={() => setTab(action.target)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:border-[#d7e3e8] hover:bg-[#fbfcfc] transition-colors"
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.tone}`}>
                          <action.icon size={17} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-[#17344d]">{action.label}</span>
                          <span className="mt-1 block text-[10px] text-slate-400">{action.helper}</span>
                        </span>
                        <ArrowRight size={15} className="text-slate-300 group-hover:translate-x-0.5 group-hover:text-[#31758b] transition-all" />
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* ================= BOOKINGS TAB ================= */}
          {tab === 'bookings' && (
            <div className="bg-white border border-slate-200 rounded-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <p className="text-sm text-slate-600">All booking form submissions from Tour Details and Contact pages.</p>
                <button
                  type="button"
                  onClick={() => exportCsv('ora-bookings.csv', bookings)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#102355] text-white text-xs font-semibold rounded-sm"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-y">
                    <tr>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Tour / Trip</th>
                      <th className="py-3 px-3">Date & Guests</th>
                      <th className="py-3 px-3">Notes</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <p className="font-semibold">{b.fullName}</p>
                          <p className="text-xs text-slate-500">{b.email}</p>
                          {b.phone && <p className="text-xs text-slate-500">{b.phone}</p>}
                        </td>
                        <td className="py-3 px-3">{b.tourTitle || 'Custom Inquiry'}</td>
                        <td className="py-3 px-3 text-xs">
                          <p>{b.travelDate || 'Flexible'}</p>
                          <p className="text-slate-500">{b.guests} Guests</p>
                        </td>
                        <td className="py-3 px-3 max-w-xs text-xs text-slate-600">{b.notes}</td>
                        <td className="py-3 px-3">
                          <select
                            value={b.status}
                            onChange={async (e) => {
                              await adminApi.updateBooking(b.id, { status: e.target.value });
                              showToast('Booking status updated');
                              loadAll();
                            }}
                            className="text-xs border rounded-sm px-2 py-1 bg-white"
                          >
                            {['NEW', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'ARCHIVED'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => { setSubmissionDetail({ type: 'contact', data: c }); setReplyDraft(c.replyMessage || ''); }}
                            className="text-[#102355] hover:text-[#D2A058] p-1 mr-1"
                            title="View details and reply"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSubmissionDetail({ type: 'booking', data: b }); setReplyDraft(b.replyMessage || ''); }}
                            className="text-[#102355] hover:text-[#D2A058] p-1 mr-1"
                            title="View details and reply"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm('Delete this booking inquiry?')) return;
                              await adminApi.deleteBooking(b.id);
                              showToast('Booking deleted');
                              loadAll();
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= CONTACT MESSAGES TAB ================= */}
          {tab === 'contacts' && (
            <div className="bg-white border border-slate-200 rounded-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <p className="text-sm text-slate-600">All Contact Us form submissions stored in Prisma.</p>
                <button
                  type="button"
                  onClick={() => exportCsv('ora-contact-messages.csv', contacts)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#102355] text-white text-xs font-semibold rounded-sm"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-y">
                    <tr>
                      <th className="py-3 px-3">Sender</th>
                      <th className="py-3 px-3">Subject</th>
                      <th className="py-3 px-3">Message</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {contacts.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 px-3">
                          <p className="font-semibold">{c.fullName}</p>
                          <p className="text-xs text-slate-500">{c.email}</p>
                          {c.phone && <p className="text-xs text-slate-500">{c.phone}</p>}
                        </td>
                        <td className="py-3 px-3 text-xs font-medium">{c.subject}</td>
                        <td className="py-3 px-3 max-w-md text-xs text-slate-600">{c.message}</td>
                        <td className="py-3 px-3">
                          <select
                            value={c.status}
                            onChange={async (e) => {
                              await adminApi.updateContact(c.id, { status: e.target.value });
                              showToast('Message status updated');
                              loadAll();
                            }}
                            className="text-xs border rounded-sm px-2 py-1 bg-white"
                          >
                            {['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={async () => {
                              if (!window.confirm('Delete this message?')) return;
                              await adminApi.deleteContact(c.id);
                              showToast('Message deleted');
                              loadAll();
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= NEWSLETTER TAB ================= */}
          {tab === 'subscribers' && (
            <div className="bg-white border border-slate-200 rounded-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <p className="text-sm text-slate-600">All newsletter subscriptions captured across the website.</p>
                <button
                  type="button"
                  onClick={() => exportCsv('ora-newsletter.csv', subscribers)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#102355] text-white text-xs font-semibold rounded-sm"
                >
                  <Download size={14} /> Export CSV
                </button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-y">
                  <tr>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Source</th>
                    <th className="py-3 px-3">Subscribed At</th>
                    <th className="py-3 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subscribers.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 px-3 font-medium">{s.email}</td>
                      <td className="py-3 px-3 text-xs text-slate-500">{s.source}</td>
                      <td className="py-3 px-3 text-xs text-slate-500">
                        {new Date(s.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={async () => {
                            await adminApi.deleteSubscriber(s.id);
                            showToast('Subscriber removed');
                            loadAll();
                          }}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ================= TOURS MANAGER TAB ================= */}
          {tab === 'tours' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setTourForm({
                      title: '',
                      destination: '',
                      destinationsText: 'Cairo, Giza',
                      durationDays: 5,
                      durationLabel: '5 Days / 4 Nights',
                      category: 'Luxury Egypt Tours',
                      style: 'Luxury',
                      priceDisplay: 'Tailored Quote / Price on Request',
                      featured: false,
                      image: '',
                      galleryText: '',
                      translationsText: '{}',
                      overview: '',
                      highlightsText: '',
                      includedText: '',
                      excludedText: '',
                      travelInfo: '',
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#102355] text-white text-xs uppercase tracking-[0.16em] font-bold rounded-sm"
                >
                  <Plus size={15} /> Add New Tour
                </button>
              </div>

              {tourForm && (
                <form onSubmit={saveTour} className="bg-white p-6 border border-[#D2A058] rounded-sm space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-xl text-[#102355]">
                      {tourForm.dbId ? 'Edit Tour' : 'Create New Tour'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => openTranslationModal('tour', tourForm)}
                      className="px-4 py-2 border border-[#D2A058] text-[#102355] text-xs font-bold uppercase rounded-sm"
                    >
                      Add / Edit Translation
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Tour Title"
                      value={tourForm.title}
                      onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      required
                      placeholder="Destination Display (e.g. Cairo, Luxor & Aswan)"
                      value={tourForm.destination}
                      onChange={(e) => setTourForm({ ...tourForm, destination: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Destinations Filter Tags (comma-separated)"
                      value={tourForm.destinationsText}
                      onChange={(e) => setTourForm({ ...tourForm, destinationsText: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Duration Label (e.g. 7 Days / 6 Nights)"
                      value={tourForm.durationLabel}
                      onChange={(e) => setTourForm({ ...tourForm, durationLabel: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Duration Days"
                      value={tourForm.durationDays}
                      onChange={(e) => setTourForm({ ...tourForm, durationDays: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Category (e.g. Nile Cruises)"
                      value={tourForm.category}
                      onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Price Display"
                      value={tourForm.priceDisplay}
                      onChange={(e) => setTourForm({ ...tourForm, priceDisplay: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Cover Image URL"
                      value={tourForm.image}
                      onChange={(e) => setTourForm({ ...tourForm, image: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="px-3 py-2 border border-dashed border-[#D2A058] rounded-sm text-sm cursor-pointer">
                      Upload Cover Image
                      <input
                        type="file"
                        accept="image/*"
                        className="block mt-2 w-full text-xs"
                        onChange={async (e) => {
                          if (!e.target.files?.[0]) return;
                          try {
                            const url = await uploadAdminImage(e.target.files[0]);
                            setTourForm({ ...tourForm, image: url });
                            showToast('Cover image uploaded');
                          } catch (err) { showToast(err.message); }
                        }}
                      />
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Gallery image URLs (one per line)"
                      value={tourForm.galleryText}
                      onChange={(e) => setTourForm({ ...tourForm, galleryText: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                  </div>
                  <label className="block px-3 py-2 border border-dashed border-[#D2A058] rounded-sm text-sm cursor-pointer">
                    Add Images to Gallery
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="block mt-2 w-full text-xs"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        try {
                          const urls = [];
                          for (const file of files) urls.push(await uploadAdminImage(file));
                          setTourForm({
                            ...tourForm,
                            galleryText: [...(tourForm.galleryText || '').split('\n').map((v) => v.trim()).filter(Boolean), ...urls].join('\n'),
                          });
                          showToast(`${urls.length} gallery image(s) uploaded`);
                        } catch (err) { showToast(err.message); }
                      }}
                    />
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Overview"
                    value={tourForm.overview}
                    onChange={(e) => setTourForm({ ...tourForm, overview: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm"
                  />
                  <textarea
                    rows={5}
                    placeholder={'Translations JSON, e.g. {"ar":{"title":"...","overview":"...","highlights":["..."]},"fr":{"title":"..."}}'}
                    value={tourForm.translationsText || '{}'}
                    onChange={(e) => setTourForm({ ...tourForm, translationsText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm font-mono"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <textarea
                      rows={4}
                      placeholder="Highlights (one per line)"
                      value={tourForm.highlightsText}
                      onChange={(e) => setTourForm({ ...tourForm, highlightsText: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <textarea
                      rows={4}
                      placeholder="Included (one per line)"
                      value={tourForm.includedText}
                      onChange={(e) => setTourForm({ ...tourForm, includedText: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <textarea
                      rows={4}
                      placeholder="Excluded (one per line)"
                      value={tourForm.excludedText}
                      onChange={(e) => setTourForm({ ...tourForm, excludedText: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={tourForm.featured}
                      onChange={(e) => setTourForm({ ...tourForm, featured: e.target.checked })}
                    />
                    Feature on Homepage
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="px-5 py-2 bg-[#102355] text-white text-xs font-bold uppercase rounded-sm">
                      Save Tour
                    </button>
                    <button type="button" onClick={() => setTourForm(null)} className="px-5 py-2 border text-xs rounded-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tours.map((t) => (
                      <tr key={t.dbId || t.id}>
                        <td className="py-3 px-4 font-semibold">{t.title}</td>
                        <td className="py-3 px-4 text-xs">{t.category}</td>
                        <td className="py-3 px-4 text-xs">{t.durationLabel}</td>
                        <td className="py-3 px-4 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setTourForm({
                                ...t,
                                destinationsText: (t.destinations || []).join(', '),
                                highlightsText: (t.highlights || []).join('\n'),
                                includedText: (t.included || []).join('\n'),
                                excludedText: (t.excluded || []).join('\n'),
                                galleryText: (t.gallery || []).join('\n'),
                                translationsText: JSON.stringify(t.translations || {}, null, 2),
                              })
                            }
                            className="text-blue-600 p-1"
                          >
                            <Pencil size={15} />
                          </button>
                          {t.dbId && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!window.confirm('Delete this tour?')) return;
                                await adminApi.deleteTour(t.dbId);
                                showToast('Tour deleted');
                                loadAll();
                              }}
                              className="text-red-600 p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= DESTINATIONS MANAGER TAB ================= */}
          {tab === 'destinations' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setDestForm({
                      name: '',
                      region: 'Upper Egypt',
                      tagline: '',
                      description: '',
                      image: '',
                      translationsText: '{}',
                      experiencesText: '',
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#102355] text-white text-xs uppercase tracking-[0.16em] font-bold rounded-sm"
                >
                  <Plus size={15} /> Add Destination
                </button>
              </div>

              {destForm && (
                <form onSubmit={saveDestination} className="bg-white p-6 border border-[#D2A058] rounded-sm space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openTranslationModal('destination', destForm)}
                      className="px-4 py-2 border border-[#D2A058] text-[#102355] text-xs font-bold uppercase rounded-sm"
                    >
                      Add / Edit Translation
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Destination Name"
                      value={destForm.name}
                      onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Region (e.g. Upper Egypt, Red Sea)"
                      value={destForm.region}
                      onChange={(e) => setDestForm({ ...destForm, region: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Tagline"
                      value={destForm.tagline}
                      onChange={(e) => setDestForm({ ...destForm, tagline: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Image URL"
                      value={destForm.image}
                      onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                  </div>
                  <label className="block px-3 py-2 border border-dashed border-[#D2A058] rounded-sm text-sm cursor-pointer">
                    Upload Destination Image
                    <input type="file" accept="image/*" className="block mt-2 w-full text-xs" onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      try { setDestForm({ ...destForm, image: await uploadAdminImage(e.target.files[0]) }); showToast('Destination image uploaded'); }
                      catch (err) { showToast(err.message); }
                    }} />
                  </label>
                  <input
                    placeholder="Experiences (comma-separated)"
                    value={destForm.experiencesText}
                    onChange={(e) => setDestForm({ ...destForm, experiencesText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm"
                  />
                  <textarea
                    rows={3}
                    placeholder="Description"
                    value={destForm.description}
                    onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm"
                  />
                  <textarea
                    rows={4}
                    placeholder={'Translations JSON, e.g. {"ar":{"name":"...","description":"..."},"fr":{"name":"..."}}'}
                    value={destForm.translationsText || '{}'}
                    onChange={(e) => setDestForm({ ...destForm, translationsText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm font-mono"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="px-5 py-2 bg-[#102355] text-white text-xs font-bold uppercase rounded-sm">
                      Save Destination
                    </button>
                    <button type="button" onClick={() => setDestForm(null)} className="px-5 py-2 border text-xs rounded-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                    <tr>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4">Region</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {destinations.map((d) => (
                      <tr key={d.dbId || d.id}>
                        <td className="py-3 px-4 font-semibold">{d.name}</td>
                        <td className="py-3 px-4 text-xs">{d.region}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setDestForm({
                                ...d,
                                experiencesText: (d.experiences || []).join(', '),
                                translationsText: JSON.stringify(d.translations || {}, null, 2),
                              })
                            }
                            className="text-blue-600 p-1"
                          >
                            <Pencil size={15} />
                          </button>
                          {d.dbId && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!window.confirm('Delete destination?')) return;
                                await adminApi.deleteDestination(d.dbId);
                                showToast('Destination deleted');
                                loadAll();
                              }}
                              className="text-red-600 p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= BLOG MANAGER TAB ================= */}
          {tab === 'blog' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setBlogForm({
                      title: '',
                      category: 'Travel Planning',
                      readTime: '5 min read',
                      image: '',
                      translationsText: '{}',
                      excerpt: '',
                      contentText: '',
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#102355] text-white text-xs uppercase tracking-[0.16em] font-bold rounded-sm"
                >
                  <Plus size={15} /> New Article
                </button>
              </div>

              {blogForm && (
                <form onSubmit={saveBlog} className="bg-white p-6 border border-[#D2A058] rounded-sm space-y-4">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openTranslationModal('blog', blogForm)}
                      className="px-4 py-2 border border-[#D2A058] text-[#102355] text-xs font-bold uppercase rounded-sm"
                    >
                      Add / Edit Translation
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="Article Title"
                      value={blogForm.title}
                      onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Category"
                      value={blogForm.category}
                      onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Read Time (e.g. 6 min read)"
                      value={blogForm.readTime}
                      onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                    <input
                      placeholder="Cover Image URL"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                      className="px-3 py-2 border rounded-sm text-sm"
                    />
                  </div>
                  <label className="block px-3 py-2 border border-dashed border-[#D2A058] rounded-sm text-sm cursor-pointer">
                    Upload Article Cover
                    <input type="file" accept="image/*" className="block mt-2 w-full text-xs" onChange={async (e) => {
                      if (!e.target.files?.[0]) return;
                      try { setBlogForm({ ...blogForm, image: await uploadAdminImage(e.target.files[0]) }); showToast('Article cover uploaded'); }
                      catch (err) { showToast(err.message); }
                    }} />
                  </label>
                  <input
                    placeholder="Short Excerpt"
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm"
                  />
                  <textarea
                    rows={4}
                    placeholder={'Translations JSON, e.g. {"ar":{"title":"...","excerpt":"...","content":["..."]},"fr":{"title":"..."}}'}
                    value={blogForm.translationsText || '{}'}
                    onChange={(e) => setBlogForm({ ...blogForm, translationsText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm font-mono"
                  />
                  <textarea
                    rows={6}
                    placeholder="Article paragraphs (separate paragraphs with an empty line)"
                    value={blogForm.contentText}
                    onChange={(e) => setBlogForm({ ...blogForm, contentText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-sm text-sm"
                  />
                  <div className="flex gap-3">
                    <button type="submit" className="px-5 py-2 bg-[#102355] text-white text-xs font-bold uppercase rounded-sm">
                      Publish Article
                    </button>
                    <button type="button" onClick={() => setBlogForm(null)} className="px-5 py-2 border text-xs rounded-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                    <tr>
                      <th className="py-3 px-4">Article Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {posts.map((p) => (
                      <tr key={p.dbId || p.id}>
                        <td className="py-3 px-4 font-semibold">{p.title}</td>
                        <td className="py-3 px-4 text-xs">{p.category}</td>
                        <td className="py-3 px-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setBlogForm({
                                ...p,
                                contentText: (p.content || []).join('\n\n'),
                                translationsText: JSON.stringify(p.translations || {}, null, 2),
                              })
                            }
                            className="text-blue-600 p-1"
                          >
                            <Pencil size={15} />
                          </button>
                          {p.dbId && (
                            <button
                              type="button"
                              onClick={async () => {
                                if (!window.confirm('Delete article?')) return;
                                await adminApi.deleteBlog(p.dbId);
                                showToast('Article deleted');
                                loadAll();
                              }}
                              className="text-red-600 p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= SITE SETTINGS TAB ================= */}
          {tab === 'settings' && (
            <form onSubmit={saveSettings} className="max-w-2xl bg-white p-8 border border-slate-200 rounded-sm space-y-4">
              <h2 className="font-serif text-2xl text-[#102355]">Business Contact & Social Links</h2>
              <p className="text-xs text-slate-500">
                Changes saved here automatically update the Footer and Contact Us page.
              </p>
              {[
                { key: 'email', label: 'Verified Business Email' },
                { key: 'phone', label: 'Verified Phone Number' },
                { key: 'whatsapp', label: 'WhatsApp Link (https://wa.me/...)' },
                { key: 'address', label: 'Office Address' },
                { key: 'instagram', label: 'Instagram URL' },
                { key: 'facebook', label: 'Facebook URL' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs uppercase tracking-[0.14em] text-slate-600 font-semibold mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={settings[field.key] || ''}
                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-sm text-sm"
                  />
                </div>
              ))}
              <section className="pt-6 mt-6 border-t border-slate-200 space-y-4">
                <div>
                  <h3 className="font-serif text-xl text-[#102355]">Website Languages</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add or remove languages here. English is required as the fallback language. Removed languages disappear from the switcher and translation editor; existing content translations are kept.
                  </p>
                </div>
                <label className="flex items-center gap-3 text-sm text-[#102355]">
                  <input
                    type="checkbox"
                    checked={settings.showLanguageSwitcher !== false && settings.showLanguageSwitcher !== 'false'}
                    onChange={(event) =>
                      setSettings({ ...settings, showLanguageSwitcher: event.target.checked })
                    }
                    className="h-4 w-4 accent-[#102355]"
                  />
                  Show floating language switcher on the website
                </label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((language) => (
                    <span key={language.code} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-sm text-xs">
                      <strong>{language.label}</strong>
                      <span className="text-slate-500">{language.code}</span>
                      {language.code !== 'en' && (
                        <button
                          type="button"
                          onClick={() => removeLanguage(language.code)}
                          className="text-red-600 hover:text-red-800 font-bold"
                          aria-label={`Remove ${language.label}`}
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
                  <input
                    value={newLanguageLabel}
                    onChange={(e) => setNewLanguageLabel(e.target.value)}
                    placeholder="Language name (e.g. German)"
                    className="px-3 py-2 border border-slate-300 rounded-sm text-sm"
                  />
                  <input
                    value={newLanguageCode}
                    onChange={(e) => setNewLanguageCode(e.target.value)}
                    placeholder="Language code (e.g. de)"
                    maxLength={5}
                    className="px-3 py-2 border border-slate-300 rounded-sm text-sm"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-4 py-2 bg-[#D2A058] text-[#102355] text-xs font-bold uppercase rounded-sm"
                  >
                    Add Language
                  </button>
                </div>
              </section>
              <button
                type="submit"
                className="px-6 py-3 bg-[#102355] text-white text-xs uppercase tracking-[0.18em] font-bold rounded-sm hover:bg-[#1B367A]"
              >
                Save All Settings
              </button>
            </form>
          )}
          {translationModal && (
            <div
              className="fixed inset-0 z-[70] bg-[#0A1638]/70 p-4 flex items-center justify-center"
              onClick={() => setTranslationModal(null)}
            >
              <div
                className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-sm shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#B88346] font-semibold">
                      Content Translation
                    </p>
                    <h2 className="font-serif text-xl text-[#102355]">
                      Translate {translationModal.type === 'blog' ? 'Article' : translationModal.type === 'tour' ? 'Tour' : 'Destination'}
                    </h2>
                  </div>
                  <button type="button" onClick={() => setTranslationModal(null)} className="text-slate-500 hover:text-[#102355] text-xl">×</button>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-slate-600 font-semibold mb-2">
                      Translation Language
                    </label>
                    <select
                      value={translationModal.language}
                      onChange={(e) => changeTranslationLanguage(e.target.value)}
                      className="w-full max-w-xs px-3 py-2.5 border border-slate-300 rounded-sm text-sm"
                    >
                      {languages.map((language) => (
                        <option key={language.code} value={language.code}>
                          {language.label} / {language.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {translationModal.fields.map((field, index) => (
                      <label key={field.key} className={field.multiline ? 'md:col-span-2' : ''}>
                        <span className="block text-xs uppercase tracking-[0.12em] text-slate-600 font-semibold mb-1.5">
                          {field.label}
                        </span>
                        {field.multiline ? (
                          <textarea
                            rows={field.key === 'content' ? 10 : 4}
                            value={field.value}
                            onChange={(e) => setTranslationModal({
                              ...translationModal,
                              fields: translationModal.fields.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, value: e.target.value } : item
                              ),
                            })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm"
                          />
                        ) : (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => setTranslationModal({
                              ...translationModal,
                              fields: translationModal.fields.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, value: e.target.value } : item
                              ),
                            })}
                            className="w-full px-3 py-2.5 border border-slate-300 rounded-sm text-sm"
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={saveTranslationModal}
                      className="px-5 py-2.5 bg-[#102355] text-white text-xs font-bold uppercase rounded-sm"
                    >
                      Save Translation
                    </button>
                    <button
                      type="button"
                      onClick={() => setTranslationModal(null)}
                      className="px-5 py-2.5 border border-slate-300 text-xs font-bold uppercase rounded-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {submissionDetail && (
            <div className="fixed inset-0 z-[60] bg-[#0A1638]/70 p-4 flex items-center justify-center" onClick={() => setSubmissionDetail(null)}>
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#B88346] font-semibold">
                      {submissionDetail.type === 'booking' ? 'Booking Details' : 'Contact Message'}
                    </p>
                    <h2 className="font-serif text-xl text-[#102355]">{submissionDetail.data.fullName}</h2>
                  </div>
                  <button type="button" onClick={() => setSubmissionDetail(null)} className="text-slate-500 hover:text-[#102355] text-xl">×</button>
                </div>
                <div className="p-6 space-y-5">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div><dt className="text-xs text-slate-500">Email</dt><dd className="font-medium">{submissionDetail.data.email}</dd></div>
                    {submissionDetail.data.phone && <div><dt className="text-xs text-slate-500">Phone</dt><dd className="font-medium">{submissionDetail.data.phone}</dd></div>}
                    {submissionDetail.type === 'booking' ? (
                      <>
                        <div><dt className="text-xs text-slate-500">Tour</dt><dd>{submissionDetail.data.tourTitle || 'Custom Journey'}</dd></div>
                        <div><dt className="text-xs text-slate-500">Travel Date</dt><dd>{submissionDetail.data.travelDate || 'Flexible'}</dd></div>
                        <div><dt className="text-xs text-slate-500">Guests</dt><dd>{submissionDetail.data.guests}</dd></div>
                        <div><dt className="text-xs text-slate-500">Submitted</dt><dd>{new Date(submissionDetail.data.createdAt).toLocaleString()}</dd></div>
                      </>
                    ) : (
                      <>
                        <div><dt className="text-xs text-slate-500">Subject</dt><dd>{submissionDetail.data.subject}</dd></div>
                        <div><dt className="text-xs text-slate-500">Submitted</dt><dd>{new Date(submissionDetail.data.createdAt).toLocaleString()}</dd></div>
                      </>
                    )}
                  </dl>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-500 mb-2">Original Message</p>
                    <p className="text-sm whitespace-pre-wrap">{submissionDetail.data.notes || submissionDetail.data.message}</p>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.14em] text-slate-600 font-semibold mb-2">Reply</label>
                    <textarea
                      rows={5}
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      placeholder="Write a reply to the customer..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-sm text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={!replyDraft.trim()}
                      onClick={async () => {
                        try {
                          const result = submissionDetail.type === 'booking'
                            ? await adminApi.replyBooking(submissionDetail.data.id, replyDraft)
                            : await adminApi.replyContact(submissionDetail.data.id, replyDraft);
                          showToast(result.sent ? 'Reply email sent and saved' : 'Reply saved; configure SMTP to send email');
                          setSubmissionDetail(null);
                          loadAll();
                        } catch (err) {
                          showToast(err.message);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#102355] text-white text-xs font-bold uppercase rounded-sm disabled:opacity-50"
                    >
                      <Send size={14} /> Send & Save Reply
                    </button>
                    <a
                      href={`mailto:${submissionDetail.data.email}?subject=${encodeURIComponent(submissionDetail.type === 'booking' ? `Re: ${submissionDetail.data.tourTitle || 'Your Journey'}` : `Re: ${submissionDetail.data.subject}`)}&body=${encodeURIComponent(replyDraft)}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-xs font-bold uppercase rounded-sm"
                    >
                      <Mail size={14} /> Open Email App
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
