import React, { useState } from 'react';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import { submitContactForm } from '../services/api';
import { useTranslation } from 'react-i18next';

export function ContactForm() {
  const { t } = useTranslation();
  const subjectLabels = t('options.subjects', { returnObjects: true });
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Custom Egypt Itinerary',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      setError(t('site.contactRequired'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      await submitContactForm(form);
      setSent(true);
    } catch (err) {
      setError(err.message || 'Could not send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="p-8 bg-[#FAF8F4] border border-[#D2A058] rounded-sm text-center">
        <CheckCircle2 size={40} className="mx-auto text-[#102355]" />
        <h3 className="mt-3 font-serif text-2xl text-[#102355]">{t('site.messageSent')}</h3>
        <p className="mt-2 text-sm text-[#102355]/75">
          {t('site.contactThanks')}
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ fullName: '', email: '', phone: '', subject: 'Custom Egypt Itinerary', message: '' });
          }}
          className="mt-5 text-xs uppercase tracking-[0.18em] font-semibold text-[#B88346] underline"
        >
          {t('site.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
            {t('site.fullName')}
          </label>
          <input
            type="text"
            name="fullName"
            required
            value={form.fullName}
            onChange={handleChange}
            placeholder={t('site.yourName')}
            className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
            {t('site.email')}
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
            {t('site.phoneWhatsapp')}
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 / +44 / +20..."
            className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
            {t('site.subject')}
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
          >
            {['Custom Egypt Itinerary', 'Luxury Nile Cruise Inquiry', 'Private Group / Family Travel', 'Partnership / Travel Agent', 'General Inquiry'].map((subject, index) => (
              <option key={subject} value={subject}>{subjectLabels[index] || subject}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
          {t('site.yourMessage')}
        </label>
        <textarea
          name="message"
          rows={5}
          required
          value={form.message}
          onChange={handleChange}
          placeholder={t('site.messagePlaceholder')}
          className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#102355] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#1B367A] transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} className="text-[#D2A058]" />}
        {loading ? t('site.sending') : t('site.sendMessage')}
      </button>
    </form>
  );
}
