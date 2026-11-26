import React, { useState } from 'react';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import { submitBookingForm } from '../services/api';
import { useTranslation } from 'react-i18next';

export function BookingInquiryForm({ tourSlug = '', tourTitle = '' }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    travelDate: '',
    guests: '2',
    notes: tourTitle ? `I am interested in "${tourTitle}".` : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedId, setSubmittedId] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      setError(t('site.fullNameEmailRequired'));
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await submitBookingForm({ ...form, tourSlug, tourTitle });
      setSubmittedId(res.id || 'SAVED');
    } catch (err) {
      setError(err.message || 'Could not submit booking inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="p-6 bg-[#FAF8F4] border border-[#D2A058] rounded-sm text-center">
        <CheckCircle2 size={38} className="mx-auto text-[#102355]" />
        <h4 className="mt-3 font-serif text-xl text-[#102355]">{t('site.inquiryReceived')}</h4>
        <p className="mt-2 text-sm text-[#102355]/75">
          {t('site.thankYou')}, <strong>{form.fullName}</strong>. {t('site.bookingThanks')}
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedId('');
            setForm((prev) => ({ ...prev, notes: '' }));
          }}
          className="mt-5 text-xs uppercase tracking-[0.18em] font-semibold text-[#B88346] underline"
        >
          {t('site.anotherBooking')}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
            {t('site.travelDate')}
          </label>
          <input
            type="date"
            name="travelDate"
            value={form.travelDate}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
            {t('site.travelers')}
          </label>
          <select
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
          >
            <option value="1">{t('site.oneTraveler')}</option>
            <option value="2">{t('site.twoTravelers')}</option>
            <option value="3-4">{t('site.threeFour')}</option>
            <option value="5-8">{t('site.fiveEight')}</option>
            <option value="9+">{t('site.groupCharter')}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-[0.14em] text-[#102355]/75 mb-1.5 font-medium">
          {t('site.preferences')}
        </label>
        <textarea
          name="notes"
          rows={3}
          value={form.notes}
          onChange={handleChange}
          placeholder={t('site.dreamTrip')}
          className="w-full px-3.5 py-2.5 bg-white border border-[#D2A058]/40 text-sm rounded-sm focus:outline-none focus:border-[#102355]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#102355] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-sm hover:bg-[#1B367A] transition-colors disabled:opacity-60"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} className="text-[#D2A058]" />}
        {loading ? t('site.submitting') : t('site.requestProposal')}
      </button>
    </form>
  );
}
