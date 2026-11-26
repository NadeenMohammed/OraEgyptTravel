import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'node:path';
import fs from 'node:fs';
import { prisma } from './prisma.js';
import { requireAdmin, signAdminToken } from './auth.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      cb(null, `${Date.now()}-${base || 'image'}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype));
  },
});

const safeParse = (val, fallback = []) => {
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val || '[]');
  } catch {
    return fallback;
  }
};

const formatTour = (t) => ({
  ...t,
  id: t.slug,
  dbId: t.id,
  destinations: safeParse(t.destinations, []),
  gallery: safeParse(t.gallery, [t.image]),
  highlights: safeParse(t.highlights, []),
  itinerary: safeParse(t.itinerary, []),
  included: safeParse(t.included, []),
  excluded: safeParse(t.excluded, []),
  translations: safeParse(t.translations, {}),
});

const formatDestination = (d) => ({
  ...d,
  id: d.slug,
  dbId: d.id,
  experiences: safeParse(d.experiences, []),
  translations: safeParse(d.translations, {}),
});

const formatBlog = (b) => ({
  ...b,
  id: b.slug,
  dbId: b.id,
  content: safeParse(b.content, []),
  translations: safeParse(b.translations, {}),
});

const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', message: err.message });
  }
});

// ================= PUBLIC CONTENT API =================
app.get('/api/tours', async (_req, res) => {
  try {
    const tours = await prisma.tour.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(tours.map(formatTour));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tours/:slug', async (req, res) => {
  try {
    const tour = await prisma.tour.findUnique({ where: { slug: req.params.slug } });
    if (!tour) return res.status(404).json({ error: 'Tour not found' });
    res.json(formatTour(tour));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/destinations', async (_req, res) => {
  try {
    const list = await prisma.destination.findMany({ orderBy: { name: 'asc' } });
    res.json(list.map(formatDestination));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/blog', async (_req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts.map(formatBlog));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', async (_req, res) => {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= PUBLIC FORMS API (SAVED TO PRISMA) =================
app.post('/api/forms/booking', async (req, res) => {
  try {
    const { fullName, email, phone, travelDate, guests, tourSlug, tourTitle, notes } = req.body || {};
    if (!fullName?.trim() || !email?.trim()) {
      return res.status(400).json({ error: 'Full name and email are required.' });
    }
    const record = await prisma.bookingInquiry.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: (phone || '').trim(),
        travelDate: (travelDate || '').trim(),
        guests: String(guests || '2'),
        tourSlug: (tourSlug || '').trim(),
        tourTitle: (tourTitle || '').trim(),
        notes: (notes || '').trim(),
        adminNotes: '',
        replyMessage: '',
      },
    });
    res.status(201).json({ success: true, id: record.id, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/forms/contact', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body || {};
    if (!fullName?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ error: 'Full name, email, and message are required.' });
    }
    const record = await prisma.contactMessage.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: (phone || '').trim(),
        subject: (subject || 'General Inquiry').trim(),
        message: message.trim(),
        adminNotes: '',
        replyMessage: '',
      },
    });
    res.status(201).json({ success: true, id: record.id, record });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/forms/newsletter', async (req, res) => {
  try {
    const { email, source } = req.body || {};
    if (!email?.trim()) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }
    const record = await prisma.newsletterSubscriber.upsert({
      where: { email: email.trim().toLowerCase() },
      update: {},
      create: {
        email: email.trim().toLowerCase(),
        source: source || 'footer',
      },
    });
    res.status(201).json({ success: true, id: record.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN AUTH =================
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const admin = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = signAdminToken(admin);
    res.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'A valid JPEG, PNG, WebP, or GIF image is required.' });
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

const sendAdminReply = async (email, subject, message) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return false;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    text: message,
  });
  return true;
};

// ================= ADMIN DASHBOARD STATS =================
app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
  try {
    const [
      toursCount,
      destinationsCount,
      blogCount,
      bookingsCount,
      newBookingsCount,
      contactsCount,
      newContactsCount,
      subscribersCount,
      recentBookings,
      recentContacts,
    ] = await Promise.all([
      prisma.tour.count(),
      prisma.destination.count(),
      prisma.blogPost.count(),
      prisma.bookingInquiry.count(),
      prisma.bookingInquiry.count({ where: { status: 'NEW' } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: 'NEW' } }),
      prisma.newsletterSubscriber.count(),
      prisma.bookingInquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    res.json({
      counts: {
        tours: toursCount,
        destinations: destinationsCount,
        blog: blogCount,
        bookings: bookingsCount,
        newBookings: newBookingsCount,
        contacts: contactsCount,
        newContacts: newContactsCount,
        subscribers: subscribersCount,
      },
      recentBookings,
      recentContacts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN BOOKINGS =================
app.get('/api/admin/bookings', requireAdmin, async (_req, res) => {
  try {
    const rows = await prisma.bookingInquiry.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body || {};
    const updated = await prisma.bookingInquiry.update({
      where: { id: req.params.id },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.bookingInquiry.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/bookings/:id/reply', requireAdmin, async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message?.trim()) return res.status(400).json({ error: 'Reply message is required.' });
    const booking = await prisma.bookingInquiry.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ error: 'Booking inquiry not found.' });
    let sent = false;
    try {
      sent = await sendAdminReply(booking.email, `Re: ${booking.tourTitle || 'Your Egypt Journey Inquiry'}`, message.trim());
    } catch (err) {
      return res.status(502).json({ error: `Email delivery failed: ${err.message}` });
    }
    const updated = await prisma.bookingInquiry.update({
      where: { id: booking.id },
      data: { replyMessage: message.trim(), repliedAt: new Date(), status: 'CONTACTED' },
    });
    res.json({ ...updated, sent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN CONTACTS =================
app.get('/api/admin/contacts', requireAdmin, async (_req, res) => {
  try {
    const rows = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/contacts/:id', requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body || {};
    const updated = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/contacts/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/contacts/:id/reply', requireAdmin, async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message?.trim()) return res.status(400).json({ error: 'Reply message is required.' });
    const contact = await prisma.contactMessage.findUnique({ where: { id: req.params.id } });
    if (!contact) return res.status(404).json({ error: 'Contact message not found.' });
    let sent = false;
    try {
      sent = await sendAdminReply(contact.email, `Re: ${contact.subject || 'Your Inquiry'}`, message.trim());
    } catch (err) {
      return res.status(502).json({ error: `Email delivery failed: ${err.message}` });
    }
    const updated = await prisma.contactMessage.update({
      where: { id: contact.id },
      data: { replyMessage: message.trim(), repliedAt: new Date(), status: 'REPLIED' },
    });
    res.json({ ...updated, sent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN SUBSCRIBERS =================
app.get('/api/admin/subscribers', requireAdmin, async (_req, res) => {
  try {
    const rows = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/subscribers/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.newsletterSubscriber.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN TOURS CRUD =================
app.post('/api/admin/tours', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    const slug = b.slug ? slugify(b.slug) : slugify(b.title);
    const created = await prisma.tour.create({
      data: {
        slug,
        title: b.title,
        destination: b.destination || '',
        destinations: JSON.stringify(Array.isArray(b.destinations) ? b.destinations : String(b.destinations || '').split(',').map((s) => s.trim()).filter(Boolean)),
        durationDays: Number(b.durationDays) || 1,
        durationLabel: b.durationLabel || `${b.durationDays || 1} Days`,
        category: b.category || 'Luxury Egypt Tours',
        style: b.style || 'Luxury',
        priceDisplay: b.priceDisplay || 'Tailored Quote / Price on Request',
        featured: Boolean(b.featured),
        image: b.image || '',
        gallery: JSON.stringify(Array.isArray(b.gallery) ? b.gallery : [b.image].filter(Boolean)),
        overview: b.overview || '',
        highlights: JSON.stringify(Array.isArray(b.highlights) ? b.highlights : String(b.highlights || '').split('\n').map((s) => s.trim()).filter(Boolean)),
        itinerary: JSON.stringify(Array.isArray(b.itinerary) ? b.itinerary : []),
        included: JSON.stringify(Array.isArray(b.included) ? b.included : String(b.included || '').split('\n').map((s) => s.trim()).filter(Boolean)),
        excluded: JSON.stringify(Array.isArray(b.excluded) ? b.excluded : String(b.excluded || '').split('\n').map((s) => s.trim()).filter(Boolean)),
        travelInfo: b.travelInfo || '',
        translations: JSON.stringify(b.translations || {}),
      },
    });
    res.status(201).json(formatTour(created));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/tours/:id', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    const updated = await prisma.tour.update({
      where: { id: req.params.id },
      data: {
        title: b.title,
        destination: b.destination || '',
        destinations: JSON.stringify(Array.isArray(b.destinations) ? b.destinations : String(b.destinations || '').split(',').map((s) => s.trim()).filter(Boolean)),
        durationDays: Number(b.durationDays) || 1,
        durationLabel: b.durationLabel || `${b.durationDays || 1} Days`,
        category: b.category || 'Luxury Egypt Tours',
        style: b.style || 'Luxury',
        priceDisplay: b.priceDisplay || 'Tailored Quote / Price on Request',
        featured: Boolean(b.featured),
        image: b.image || '',
        gallery: JSON.stringify(Array.isArray(b.gallery) ? b.gallery : [b.image].filter(Boolean)),
        overview: b.overview || '',
        highlights: JSON.stringify(Array.isArray(b.highlights) ? b.highlights : String(b.highlights || '').split('\n').map((s) => s.trim()).filter(Boolean)),
        itinerary: JSON.stringify(Array.isArray(b.itinerary) ? b.itinerary : []),
        included: JSON.stringify(Array.isArray(b.included) ? b.included : String(b.included || '').split('\n').map((s) => s.trim()).filter(Boolean)),
        excluded: JSON.stringify(Array.isArray(b.excluded) ? b.excluded : String(b.excluded || '').split('\n').map((s) => s.trim()).filter(Boolean)),
        travelInfo: b.travelInfo || '',
        translations: JSON.stringify(b.translations || {}),
      },
    });
    res.json(formatTour(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/tours/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.tour.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN DESTINATIONS CRUD =================
app.post('/api/admin/destinations', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    const created = await prisma.destination.create({
      data: {
        slug: b.slug ? slugify(b.slug) : slugify(b.name),
        name: b.name,
        region: b.region || 'Upper Egypt',
        tagline: b.tagline || '',
        description: b.description || '',
        image: b.image || '',
        experiences: JSON.stringify(Array.isArray(b.experiences) ? b.experiences : String(b.experiences || '').split(',').map((s) => s.trim()).filter(Boolean)),
        translations: JSON.stringify(b.translations || {}),
      },
    });
    res.status(201).json(formatDestination(created));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/destinations/:id', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    const updated = await prisma.destination.update({
      where: { id: req.params.id },
      data: {
        name: b.name,
        region: b.region || 'Upper Egypt',
        tagline: b.tagline || '',
        description: b.description || '',
        image: b.image || '',
        experiences: JSON.stringify(Array.isArray(b.experiences) ? b.experiences : String(b.experiences || '').split(',').map((s) => s.trim()).filter(Boolean)),
        translations: JSON.stringify(b.translations || {}),
      },
    });
    res.json(formatDestination(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/destinations/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.destination.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN BLOG CRUD =================
app.post('/api/admin/blog', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    const created = await prisma.blogPost.create({
      data: {
        slug: b.slug ? slugify(b.slug) : slugify(b.title),
        title: b.title,
        category: b.category || 'Travel Planning',
        readTime: b.readTime || '5 min read',
        image: b.image || '',
        excerpt: b.excerpt || '',
        content: JSON.stringify(Array.isArray(b.content) ? b.content : String(b.content || '').split('\n\n').map((s) => s.trim()).filter(Boolean)),
        published: b.published !== false,
        translations: JSON.stringify(b.translations || {}),
      },
    });
    res.status(201).json(formatBlog(created));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/blog/:id', requireAdmin, async (req, res) => {
  try {
    const b = req.body;
    const updated = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        title: b.title,
        category: b.category || 'Travel Planning',
        readTime: b.readTime || '5 min read',
        image: b.image || '',
        excerpt: b.excerpt || '',
        content: JSON.stringify(Array.isArray(b.content) ? b.content : String(b.content || '').split('\n\n').map((s) => s.trim()).filter(Boolean)),
        published: b.published !== false,
        translations: JSON.stringify(b.translations || {}),
      },
    });
    res.json(formatBlog(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/blog/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= ADMIN SETTINGS =================
app.put('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const entries = Object.entries(req.body || {});
    for (const [key, value] of entries) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value ?? '') },
        create: { key, value: String(value ?? '') },
      });
    }
    const rows = await prisma.siteSetting.findMany();
    res.json(Object.fromEntries(rows.map((r) => [r.key, r.value])));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
