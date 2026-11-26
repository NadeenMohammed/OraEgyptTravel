import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from 'i18next';
import { I18nextProvider, initReactI18next, useTranslation } from 'react-i18next';
import { fetchSiteSettings } from './services/api';

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
];

const LanguageRegistryContext = createContext({
  languages: LANGUAGES,
  setLanguages: () => {},
  showLanguageSwitcher: true,
  setShowLanguageSwitcher: () => {},
});

function normalizeLanguages(value) {
  let saved = [];
  try {
    saved = Array.isArray(value) ? value : JSON.parse(value || '[]');
  } catch {
    return LANGUAGES;
  }
  if (!Array.isArray(saved)) return LANGUAGES;

  const available = [];
  saved.forEach((language) => {
    if (
      !language ||
      !/^[a-z]{2}(?:-[A-Z]{2})?$/.test(language.code) ||
      typeof language.label !== 'string' ||
      !language.label.trim() ||
      available.some((item) => item.code === language.code)
    ) {
      return;
    }
    const builtIn = LANGUAGES.find((item) => item.code === language.code);
    available.push(builtIn || { code: language.code, label: language.label.trim() });
  });

  if (!available.some((item) => item.code === 'en')) {
    available.unshift(LANGUAGES[0]);
  }
  return available;
}

const resources = {
  en: {
    translation: {
      nav: { destinations: 'Destinations', tours: 'Tours & Experiences', about: 'About Us', blog: 'Travel Journal', faq: 'FAQ', contact: 'Contact', plan: 'Plan Your Journey' },
      common: { loading: 'Loading...', viewDetails: 'View Details', subscribe: 'Subscribe', emailPlaceholder: 'Enter your email address' },
      options: {
        categories: ['All Categories', 'Ancient Egypt Tours', 'Private Guided Tours', 'Nile Cruises', 'Luxury Egypt Tours', 'Desert Safaris', 'Adventure Tours', 'Cultural Experiences', 'Family Tours', 'Multi-Day Egypt Packages', 'Red Sea Experiences'],
        styles: ['All Styles', 'Luxury', 'Private', 'Cultural', 'Adventure', 'Family', 'Cruise'],
        regions: ['All Regions', 'Lower Egypt', 'Upper Egypt', 'Mediterranean', 'Red Sea', 'Western Desert'],
        subjects: ['Custom Egypt Itinerary', 'Luxury Nile Cruise Inquiry', 'Private Group / Family Travel', 'Partnership / Travel Agent', 'General Inquiry'],
      },
      hero: {
        giza: { title: 'Discover Egypt.', highlight: 'Experience the Extraordinary.', subtitle: 'Private Egyptologist-led explorations of the Great Pyramids, ancient temples, and timeless wonders crafted around your rhythm.', location: 'Giza Plateau, Egypt', eyebrow: 'ORA TRAVEL • DESCUBRE. VIAJA. VIVE.' },
        nile: { title: 'Sail the Timeless', highlight: 'Waters of the Nile.', subtitle: 'Drift between Karnak, Edfu, and Philae aboard an intimate handcrafted wooden Dahabiya or five-star luxury Nile cruise.', location: 'Aswan & Nile Valley', eyebrow: 'LUXURY NILE VOYAGES • LUXOR TO ASWAN' },
        luxor: { title: 'Walk Through Five', highlight: 'Millennia of Majesty.', subtitle: 'Private sunrise access to the Valley of the Kings, colossal pillars of Karnak, and golden-hour views over Luxor Temple.', location: 'Luxor & Valley of the Kings', eyebrow: 'ANCIENT THEBES • OPEN-AIR MUSEUM' },
        desert: { title: 'Beyond the Horizon:', highlight: 'Desert Stars & Coral Seas.', subtitle: 'From sculptural chalk monoliths in the White Desert and Siwa’s salt lakes to private Red Sea yacht charters.', location: 'White Desert & Siwa Oasis', eyebrow: 'WESTERN DESERT & RED SEA SANCTUARIES' },
      },
      faqs: [
        { q: 'Are all ORA EGYPT TRAVEL itineraries private and customizable?', a: 'Yes. Every itinerary can be tailored around your preferred travel dates, accommodation tier, pacing, and special interests—whether you are traveling as a couple, a family, or a private small group.' },
        { q: 'How are tour prices calculated?', a: 'Because our journeys are tailored to your travel season, hotel or Nile vessel selection, domestic flight routing, and group size, we provide transparent, itemized proposals on request with no hidden fees.' },
        { q: 'Are your guides licensed Egyptologists?', a: 'Yes. Cultural and archaeological excursions are led by licensed, multilingual Egyptologist guides selected for their deep academic knowledge and warm hospitality.' },
        { q: 'Is airport VIP meet-and-assist included?', a: 'Yes, we arrange seamless airport meet-and-assist, luggage support, and private chauffeured transfers across Cairo, Luxor, Aswan, Alexandria, and Red Sea gateways.' },
        { q: 'When is the best time of year to visit Egypt?', a: 'October through April offers the most comfortable temperatures for sightseeing and Nile cruising, while the Red Sea and Alexandria remain enjoyable year-round.' },
        { q: 'How far in advance should I plan my trip?', a: 'For peak winter dates (November–February) or private Dahabiya charters, we recommend inquiring 3 to 6 months ahead. However, our local team can also craft bespoke itineraries on shorter notice.' },
      ],
      site: {
        exploreTours: 'Explore Our Tours', planJourney: 'Plan Your Journey', destination: 'Destination', allDestinations: 'All Egypt Destinations', experienceType: 'Experience Type', allCategories: 'All Categories', findJourneys: 'Find Journeys',
        iconRegions: 'Iconic Regions', featuredDestinations: 'Featured Egypt Destinations', viewAllDestinations: 'View All Destinations', curatedItineraries: 'Curated Itineraries', signatureTours: 'Signature Tours & Experiences', browseAllTours: 'Browse All Tours',
        waysExperience: 'Ways to Experience Egypt', threeWorlds: 'Three Worlds, One Seamless Journey', luxuryCruises: 'Luxury Nile Cruises', cruiseDesc: 'Glide between Luxor and Aswan aboard five-star river vessels or private handcrafted wooden Dahabiyas.', culturalImmersion: 'Cultural & Historical Immersion', culturalDesc: 'Unlock five millennia of pharaonic, Greco-Roman, Coptic, and Islamic heritage with licensed Egyptologists.', desertAdventures: 'Desert & Oasis Adventures', desertDesc: 'Private 4x4 expeditions to the sculptural White Desert, tranquil Siwa Oasis, and starry Sinai canyons.', exploreExperiences: 'Explore Experiences',
        oraStandard: 'The ORA Standard', whyOra: 'Why Travel With ORA TRAVEL?', localExpertise: 'Local Egyptian Expertise', localDesc: 'On-the-ground specialists in Cairo, Luxor, Aswan, and the Red Sea ensuring authentic access and effortless logistics.', tailoredPacing: '100% Tailor-Made Pacing', pacingDesc: 'No rigid group schedules—every itinerary is designed around your interests, preferred hotels, and rhythm.', conciergeCare: 'End-to-End Concierge Care', conciergeDesc: 'VIP airport arrival support, private modern vehicles, and attentive 24/7 local assistance from touchdown to departure.',
        verifiedReflections: 'Verified Traveler Reflections', verifiedReviews: 'Authentic Experiences, Verified Reviews', reviewDesc: 'To preserve complete authenticity, no placeholder testimonials are shown. Connect your verified Google Reviews or TripAdvisor feed to showcase real traveler stories.', travelJournal: 'Travel Journal', storiesGuides: 'Stories & Planning Guides', readArticles: 'Read All Articles', readArticle: 'Read Article',
        tailormadeCollection: 'Tailor-Made Collection', toursIntro: 'Filter by destination, duration, category, or travel style. Every journey can be customized exclusively for your party.', searchTours: 'Search tours, temples, experiences...', allRegions: 'All Destinations', allStyles: 'All Styles', anyDuration: 'Any Duration', shortDuration: '1–5 Days', mediumDuration: '6–10 Days', longDuration: '11+ Days', showing: 'Showing', curatedJourneys: 'curated journeys', clearFilters: 'Clear filters', sortBy: 'Sort by:', featured: 'Featured', shortest: 'Duration: Shortest First', longest: 'Duration: Longest First', noItineraries: 'No matching itineraries found', broadenFilters: 'Try broadening your filters or contact our specialists to design a custom itinerary.', resetFilters: 'Reset All Filters',
        exploreEgypt: 'Explore Egypt', destinationsHeading: 'Destinations Across Egypt', destinationsIntro: 'From the ancient monuments of Giza and Luxor to the tranquil oases of the Western Desert and coral reefs of the Red Sea.',
        aboutUs: 'About Us', aboutIntro: 'ORA TRAVEL is dedicated to presenting Egypt with depth, elegance, and authentic local hospitality. We design private, tailor-made itineraries that connect international travelers with Egypt’s extraordinary monuments, living culture, Nile waterways, and desert horizons.', ourMission: 'Our Mission', missionDesc: 'To deliver seamless, culturally enriching, and deeply personal travel experiences across Egypt with international service standards.', ourVision: 'Our Vision', visionDesc: 'To represent Egypt on the global stage as a premier destination for refined cultural, river, desert, and coastal exploration.', travelPhilosophy: 'Travel Philosophy', philosophyDesc: 'We believe great travel is unhurried, thoughtfully guided by local experts, and tailored to the curiosity of every guest.', officialIdentity: 'Official Identity', brandPalette: 'The ORA TRAVEL Brand Palette', startPlanning: 'Start Planning With Our Specialists',
        concierge: 'Private Travel Concierge', planEgypt: 'Plan Your Egyptian Journey', contactIntro: 'Send us a general message or submit a tailored booking request. All submissions are saved directly to our travel desk.', contactForm: 'Contact Us Form', bookingRequest: 'Tailored Booking Request', directContact: 'Direct Contact Details', contactSettings: 'Update these details anytime from your /admin dashboard under Site Settings.', whatsappConcierge: 'WhatsApp Concierge', chatWhatsapp: 'Chat on WhatsApp', configureWhatsapp: 'Configure WhatsApp link in /admin', officeLocation: 'Office Location',
        travelerAssistance: 'Traveler Assistance', faqsTitle: 'Frequently Asked Questions', legalInfo: 'Legal Information', privacyPolicy: 'Privacy Policy', terms: 'Terms & Conditions',
        privacyP1: 'ORA TRAVEL respects your privacy and handles all personal inquiry details—including your name, contact details, and travel preferences—solely for preparing your requested travel proposals and coordinating confirmed bookings.',
        privacyP2: 'We do not sell or rent personal information to third parties. Data is shared only with trusted operational partners strictly as required to fulfill your confirmed itinerary.',
        termsP1: 'All itineraries displayed on ORA TRAVEL are customizable proposals. Final pricing, availability, deposit schedules, and cancellation terms are confirmed in writing within your official booking agreement.',
        termsP2: 'Travelers are responsible for holding a valid passport, appropriate entry visa, and comprehensive travel insurance.',
        newsletter: 'The ORA Journal', newsletterTitle: 'Receive Curated Egypt Travel Inspiration', newsletterDesc: 'Seasonal Nile cruise insights, newly opened archaeological sites, and private journey ideas.', thankSubscribe: 'Thank you for subscribing to ORA TRAVEL updates!', saving: 'Saving...', bespokeDesc: 'Bespoke luxury travel experiences across Egypt—crafted with local expertise, Egyptologist storytelling, and seamless private hospitality.', explore: 'Explore', popularRegions: 'Popular Regions', regionCairo: 'Cairo & Giza', regionLuxor: 'Luxor & Valley of the Kings', regionAswan: 'Aswan & Abu Simbel', regionSiwa: 'Siwa & White Desert', regionRedSea: 'Red Sea Sanctuaries', footerContact: 'Contact & Concierge', allRights: 'All rights reserved.',
        fullName: 'Full Name *', yourName: 'Your full name', email: 'Email *', phoneWhatsapp: 'Phone / WhatsApp', subject: 'Subject', yourMessage: 'Your Message *', messagePlaceholder: 'How can our travel specialists help you plan your Egypt experience?', sendMessage: 'Send Message', sending: 'Sending...', messageSent: 'Message Sent Successfully', contactThanks: 'Thank you for reaching out to ORA TRAVEL. Our concierge team has received your message and will respond promptly.', sendAnother: 'Send Another Message',
        travelDate: 'Preferred Travel Date', travelers: 'Travelers', oneTraveler: '1 Traveler', twoTravelers: '2 Travelers', threeFour: '3–4 Travelers', fiveEight: '5–8 Travelers', groupCharter: '9+ Group / Private Charter', preferences: 'Journey Preferences', dreamTrip: 'Tell us about your dream Egypt itinerary, hotel style, or special occasions...', requestProposal: 'Request Tailored Proposal', submitting: 'Submitting...', inquiryReceived: 'Booking Inquiry Received', bookingThanks: 'Your inquiry has been saved and our Egypt specialists will send a tailored proposal shortly.', anotherBooking: 'Submit Another Booking Request',
        fullNameEmailRequired: 'Please enter your full name and a valid email address.', contactRequired: 'Please complete your name, email, and message.', thankYou: 'Thank you', about: 'About', pricing: 'Pricing', viewDetails: 'View Details', loadingTour: 'Loading itinerary...', itineraryNotFound: 'Itinerary Not Found', backTours: 'Back to All Tours', backToTours: 'Back to Tours', journeyOverview: 'Journey Overview', highlights: 'Experience Highlights', itinerary: 'Day-by-Day Itinerary', included: 'What’s Included', excluded: 'What’s Excluded', importantInfo: 'Important Travel Information', privateQuote: 'Private Bespoke Quote', quoteDesc: 'Customized to your preferred hotel category, travel dates, and group size.', relatedJourneys: 'Related Journeys', day: 'Day', durationFormat: '{{days}} Days / {{nights}} Nights', priceOnRequest: 'Tailored Quote / Price on Request',
      },
    },
  },
  ar: {
    translation: {
      nav: { destinations: 'الوجهات', tours: 'الجولات والتجارب', about: 'من نحن', blog: 'مجلة السفر', faq: 'الأسئلة الشائعة', contact: 'تواصل معنا', plan: 'خطط رحلتك' },
      common: { loading: 'جارٍ التحميل...', viewDetails: 'عرض التفاصيل', subscribe: 'اشترك', emailPlaceholder: 'أدخل بريدك الإلكتروني' },
      options: {
        categories: ['كل الفئات', 'جولات مصر القديمة', 'جولات خاصة مع مرشد', 'رحلات نيلية', 'جولات مصر الفاخرة', 'رحلات سفاري صحراوية', 'جولات مغامرات', 'تجارب ثقافية', 'رحلات عائلية', 'برامج مصر متعددة الأيام', 'تجارب البحر الأحمر'],
        styles: ['كل الأنماط', 'فاخر', 'خاص', 'ثقافي', 'مغامرة', 'عائلي', 'رحلة بحرية'],
        regions: ['كل المناطق', 'مصر السفلى', 'مصر العليا', 'البحر المتوسط', 'البحر الأحمر', 'الصحراء الغربية'],
        subjects: ['برنامج خاص لمصر', 'استفسار عن رحلة نيلية فاخرة', 'رحلة مجموعة خاصة / عائلية', 'شراكة / وكيل سفر', 'استفسار عام'],
      },
      hero: {
        giza: { title: 'اكتشف مصر.', highlight: 'عِش تجربة استثنائية.', subtitle: 'استكشف الأهرامات والمعابد القديمة مع مرشدين متخصصين في علم المصريات، في رحلات خاصة تناسب إيقاعك.', location: 'هضبة الجيزة، مصر', eyebrow: 'أورا ترافل • اكتشف. سافر. عِش.' },
        nile: { title: 'أبحر في', highlight: 'مياه النيل الخالدة.', subtitle: 'تنقل بين الكرنك وإدفو وفيلة على متن دهبية خشبية خاصة أو رحلة نيلية فاخرة.', location: 'أسوان ووادي النيل', eyebrow: 'رحلات نيلية فاخرة • الأقصر إلى أسوان' },
        luxor: { title: 'سر عبر خمسة', highlight: 'آلاف الأعوام من العظمة.', subtitle: 'زيارة خاصة عند الشروق لوادي الملوك وأعمدة الكرنك الشاهقة ومعبد الأقصر وقت الغروب.', location: 'الأقصر ووادي الملوك', eyebrow: 'طيبة القديمة • متحف مفتوح' },
        desert: { title: 'ما وراء الأفق:', highlight: 'نجوم الصحراء وشعاب البحر.', subtitle: 'من التكوينات الطباشيرية بالصحراء البيضاء وبحيرات سيوة إلى رحلات اليخوت الخاصة بالبحر الأحمر.', location: 'الصحراء البيضاء وواحة سيوة', eyebrow: 'الصحراء الغربية وملاذات البحر الأحمر' },
      },
      faqs: [
        { q: 'هل جميع رحلات أورا خاصة وقابلة للتخصيص؟', a: 'نعم، نصمم كل رحلة حسب مواعيدك المفضلة ومستوى الإقامة والإيقاع والاهتمامات، للأزواج والعائلات والمجموعات الصغيرة.' },
        { q: 'كيف تُحدد أسعار الجولات؟', a: 'تعتمد الأسعار على الموسم والفنادق أو المركب النيلي والرحلات الداخلية وحجم المجموعة. نقدم عروضًا مفصلة وشفافة دون رسوم مخفية.' },
        { q: 'هل المرشدون خبراء مصريون مرخصون؟', a: 'نعم، يقود الجولات الثقافية والأثرية مرشدون متخصصون ومرخصون ومتعددو اللغات.' },
        { q: 'هل يشمل البرنامج الاستقبال الخاص بالمطار؟', a: 'نرتب الاستقبال والمساعدة في الأمتعة والتنقلات الخاصة في القاهرة والأقصر وأسوان والإسكندرية ومطارات البحر الأحمر.' },
        { q: 'ما أفضل وقت لزيارة مصر؟', a: 'من أكتوبر إلى أبريل تكون الأجواء ألطف لمشاهدة المعالم والرحلات النيلية، والبحر الأحمر والإسكندرية مناسبان طوال العام.' },
        { q: 'متى ينبغي أن أخطط للرحلة؟', a: 'ننصح بالحجز قبل ٣ إلى ٦ أشهر لموسم الشتاء أو رحلات الدهبية الخاصة، ويمكن لفريقنا إعداد رحلات مخصصة في وقت أقصر.' },
      ],
      site: {
        exploreTours: 'استكشف جولاتنا', planJourney: 'خطط رحلتك', destination: 'الوجهة', allDestinations: 'كل وجهات مصر', experienceType: 'نوع التجربة', allCategories: 'كل الفئات', findJourneys: 'ابحث عن الرحلات',
        iconRegions: 'مناطق أيقونية', featuredDestinations: 'وجهات مصر المميزة', viewAllDestinations: 'عرض كل الوجهات', curatedItineraries: 'رحلات مختارة', signatureTours: 'الجولات والتجارب المميزة', browseAllTours: 'تصفح كل الجولات',
        waysExperience: 'طرق استكشاف مصر', threeWorlds: 'ثلاثة عوالم في رحلة متكاملة', luxuryCruises: 'رحلات نيلية فاخرة', cruiseDesc: 'أبحر بين الأقصر وأسوان على متن مراكب نيلية فاخرة أو مراكب دهبية خشبية خاصة.', culturalImmersion: 'تجارب ثقافية وتاريخية', culturalDesc: 'اكتشف خمسة آلاف عام من الحضارة الفرعونية واليونانية الرومانية والقبطية والإسلامية مع مرشدين متخصصين.', desertAdventures: 'مغامرات الصحراء والواحات', desertDesc: 'رحلات خاصة بسيارات الدفع الرباعي إلى الصحراء البيضاء وواحة سيوة وأودية سيناء المرصعة بالنجوم.', exploreExperiences: 'اكتشف التجارب',
        oraStandard: 'معايير أورا', whyOra: 'لماذا تسافر مع أورا ترافل؟', localExpertise: 'خبرة مصرية محلية', localDesc: 'خبراء على الأرض في القاهرة والأقصر وأسوان والبحر الأحمر لتجربة أصيلة وتنقلات سهلة.', tailoredPacing: 'إيقاع رحلة مصمم لك بالكامل', pacingDesc: 'لا جداول جماعية ثابتة؛ نصمم كل رحلة حسب اهتماماتك وفنادقك المفضلة وإيقاعك.', conciergeCare: 'رعاية متكاملة من البداية للنهاية', conciergeDesc: 'استقبال كبار الزوار بالمطار وسيارات خاصة حديثة ومساعدة محلية على مدار الساعة.',
        verifiedReflections: 'آراء مسافرين موثقة', verifiedReviews: 'تجارب حقيقية وتقييمات موثقة', reviewDesc: 'لا نعرض شهادات غير حقيقية. اربط تقييمات Google أو TripAdvisor الموثقة لعرض تجارب المسافرين.', travelJournal: 'مجلة السفر', storiesGuides: 'قصص وأدلة التخطيط', readArticles: 'اقرأ كل المقالات', readArticle: 'اقرأ المقال',
        tailormadeCollection: 'مجموعة مصممة خصيصًا', toursIntro: 'صفِّ حسب الوجهة أو المدة أو الفئة أو أسلوب السفر. يمكن تخصيص كل رحلة لمجموعتك.', searchTours: 'ابحث عن الجولات والمعابد والتجارب...', allRegions: 'كل الوجهات', allStyles: 'كل الأنماط', anyDuration: 'أي مدة', shortDuration: '١–٥ أيام', mediumDuration: '٦–١٠ أيام', longDuration: '١١ يومًا فأكثر', showing: 'عرض', curatedJourneys: 'رحلات مختارة', clearFilters: 'مسح عوامل التصفية', sortBy: 'ترتيب حسب:', featured: 'مميزة', shortest: 'المدة: الأقصر أولًا', longest: 'المدة: الأطول أولًا', noItineraries: 'لم يتم العثور على رحلات مطابقة', broadenFilters: 'جرّب توسيع عوامل التصفية أو تواصل معنا لتصميم رحلة خاصة.', resetFilters: 'إعادة ضبط عوامل التصفية',
        exploreEgypt: 'اكتشف مصر', destinationsHeading: 'وجهات في أنحاء مصر', destinationsIntro: 'من آثار الجيزة والأقصر القديمة إلى واحات الصحراء الغربية الهادئة وشعاب البحر الأحمر المرجانية.',
        aboutUs: 'من نحن', aboutIntro: 'تقدم أورا ترافل مصر بعمق وأناقة وكرم ضيافة محلي أصيل. نصمم رحلات خاصة تناسبك وتربط المسافرين بمعالم مصر وثقافتها الحية والنيل والصحراء.', ourMission: 'مهمتنا', missionDesc: 'تقديم تجارب سفر سلسة وغنية ثقافيًا وشخصية في أنحاء مصر وفق معايير خدمة عالمية.', ourVision: 'رؤيتنا', visionDesc: 'تمثيل مصر عالميًا كوجهة رائدة للاستكشاف الثقافي والنهري والصحراوي والساحلي الراقي.', travelPhilosophy: 'فلسفة السفر', philosophyDesc: 'نؤمن أن السفر الرائع هادئ، يقوده خبراء محليون بعناية، ويلبي فضول كل ضيف.', officialIdentity: 'الهوية الرسمية', brandPalette: 'ألوان علامة أورا ترافل', startPlanning: 'ابدأ التخطيط مع خبرائنا',
        concierge: 'خدمة سفر خاصة', planEgypt: 'خطط رحلتك المصرية', contactIntro: 'أرسل لنا رسالة أو طلب حجز مصممًا لك. تُحفظ جميع الطلبات مباشرة لدى فريق السفر.', contactForm: 'نموذج تواصل معنا', bookingRequest: 'طلب حجز مصمم لك', directContact: 'بيانات التواصل المباشر', contactSettings: 'يمكن تحديث هذه البيانات من إعدادات الموقع في لوحة الإدارة.', whatsappConcierge: 'خدمة واتساب', chatWhatsapp: 'تواصل عبر واتساب', configureWhatsapp: 'أضف رابط واتساب من لوحة الإدارة', officeLocation: 'موقع المكتب',
        travelerAssistance: 'مساعدة المسافرين', faqsTitle: 'الأسئلة الشائعة', legalInfo: 'معلومات قانونية', privacyPolicy: 'سياسة الخصوصية', terms: 'الشروط والأحكام',
        privacyP1: 'تحترم أورا ترافل خصوصيتك، وتستخدم بيانات الاستفسار الشخصية، بما فيها الاسم وبيانات التواصل وتفضيلات السفر، لإعداد عروض السفر المطلوبة وتنسيق الحجوزات المؤكدة فقط.',
        privacyP2: 'لا نبيع المعلومات الشخصية أو نؤجرها لأطراف أخرى. ولا تتم مشاركة البيانات إلا مع شركاء موثوقين عند الحاجة لتنفيذ برنامج رحلتك المؤكد.',
        termsP1: 'جميع البرامج المعروضة لدى أورا ترافل مقترحات قابلة للتخصيص. يتم تأكيد السعر النهائي والتوافر والدفعات وشروط الإلغاء كتابيًا في اتفاق الحجز الرسمي.',
        termsP2: 'يتحمل المسافر مسؤولية حيازة جواز سفر ساري وتأشيرة دخول مناسبة وتأمين سفر شامل.',
        newsletter: 'مجلة أورا', newsletterTitle: 'إلهام مختار لرحلتك إلى مصر', newsletterDesc: 'أفكار عن الرحلات النيلية والمواقع الأثرية الجديدة والرحلات الخاصة.', thankSubscribe: 'شكرًا لاشتراكك في تحديثات أورا ترافل!', saving: 'جارٍ الحفظ...', bespokeDesc: 'تجارب سفر فاخرة مصممة خصيصًا في أنحاء مصر، بخبرة محلية وحكايات يرويها علماء المصريات وضيافة خاصة متكاملة.', explore: 'استكشف', popularRegions: 'مناطق شهيرة', regionCairo: 'القاهرة والجيزة', regionLuxor: 'الأقصر ووادي الملوك', regionAswan: 'أسوان وأبو سمبل', regionSiwa: 'سيوة والصحراء البيضاء', regionRedSea: 'وجهات البحر الأحمر', footerContact: 'التواصل وخدمة العملاء', allRights: 'جميع الحقوق محفوظة.',
        fullName: 'الاسم بالكامل *', yourName: 'اكتب اسمك بالكامل', email: 'البريد الإلكتروني *', phoneWhatsapp: 'الهاتف / واتساب', subject: 'الموضوع', yourMessage: 'رسالتك *', messagePlaceholder: 'كيف يمكن لخبراء السفر مساعدتك في التخطيط لرحلتك إلى مصر؟', sendMessage: 'إرسال الرسالة', sending: 'جارٍ الإرسال...', messageSent: 'تم إرسال الرسالة بنجاح', contactThanks: 'شكرًا لتواصلك مع أورا ترافل. استلم فريقنا رسالتك وسيرد عليك قريبًا.', sendAnother: 'إرسال رسالة أخرى',
        travelDate: 'موعد السفر المفضل', travelers: 'عدد المسافرين', oneTraveler: 'مسافر واحد', twoTravelers: 'مسافران', threeFour: '٣–٤ مسافرين', fiveEight: '٥–٨ مسافرين', groupCharter: '٩ فأكثر / رحلة خاصة', preferences: 'تفضيلات الرحلة', dreamTrip: 'أخبرنا عن رحلة أحلامك إلى مصر أو الفنادق المفضلة أو المناسبات الخاصة...', requestProposal: 'اطلب عرضًا مخصصًا', submitting: 'جارٍ الإرسال...', inquiryReceived: 'استلمنا طلب الحجز', bookingThanks: 'تم حفظ طلبك وسيرسل خبراؤنا في مصر عرضًا مخصصًا قريبًا.', anotherBooking: 'إرسال طلب حجز آخر',
        fullNameEmailRequired: 'يرجى إدخال الاسم بالكامل وبريد إلكتروني صحيح.', contactRequired: 'يرجى كتابة الاسم والبريد الإلكتروني والرسالة.', thankYou: 'شكرًا', about: 'عن', pricing: 'الأسعار', viewDetails: 'عرض التفاصيل', loadingTour: 'جارٍ تحميل تفاصيل الرحلة...', itineraryNotFound: 'لم يتم العثور على الرحلة', backTours: 'العودة إلى كل الجولات', backToTours: 'العودة إلى الجولات', journeyOverview: 'نظرة عامة على الرحلة', highlights: 'أبرز التجارب', itinerary: 'برنامج الرحلة يومًا بيوم', included: 'يشمل', excluded: 'لا يشمل', importantInfo: 'معلومات سفر مهمة', privateQuote: 'عرض سعر خاص', quoteDesc: 'يُخصص حسب فئة الفندق وموعد السفر وحجم المجموعة.', relatedJourneys: 'رحلات ذات صلة', day: 'اليوم', durationFormat: '{{days}} أيام / {{nights}} ليالٍ', priceOnRequest: 'عرض سعر مخصص / السعر عند الطلب',
      },
    },
  },
  es: {
    translation: {
      nav: { destinations: 'Destinos', tours: 'Tours y Experiencias', about: 'Sobre Nosotros', blog: 'Diario de Viajes', faq: 'Preguntas Frecuentes', contact: 'Contacto', plan: 'Planifica tu Viaje' },
      common: { loading: 'Cargando...', viewDetails: 'Ver Detalles', subscribe: 'Suscribirse', emailPlaceholder: 'Introduce tu correo electrónico' },
      options: {
        categories: ['Todas las Categorías', 'Tours del Antiguo Egipto', 'Tours Privados Guiados', 'Cruceros por el Nilo', 'Tours de Lujo por Egipto', 'Safaris por el Desierto', 'Tours de Aventura', 'Experiencias Culturales', 'Tours Familiares', 'Paquetes de Varios Días', 'Experiencias en el Mar Rojo'],
        styles: ['Todos los Estilos', 'Lujo', 'Privado', 'Cultural', 'Aventura', 'Familiar', 'Crucero'],
        regions: ['Todas las Regiones', 'Bajo Egipto', 'Alto Egipto', 'Mediterráneo', 'Mar Rojo', 'Desierto Occidental'],
        subjects: ['Itinerario Personalizado por Egipto', 'Consulta de Crucero de Lujo por el Nilo', 'Viaje Privado en Grupo / Familia', 'Colaboración / Agente de Viajes', 'Consulta General'],
      },
      hero: {
        giza: { title: 'Descubre Egipto.', highlight: 'Vive lo Extraordinario.', subtitle: 'Explora las pirámides y templos antiguos con egiptólogos privados, en un viaje diseñado a tu ritmo.', location: 'Meseta de Giza, Egipto', eyebrow: 'ORA TRAVEL • DESCUBRE. VIAJA. VIVE.' },
        nile: { title: 'Navega por las', highlight: 'Aguas Eternas del Nilo.', subtitle: 'Navega entre Karnak, Edfu y Philae en una dahabiya privada o un crucero de lujo por el Nilo.', location: 'Asuán y Valle del Nilo', eyebrow: 'CRUCEROS DE LUJO • LUXOR A ASUÁN' },
        luxor: { title: 'Camina por Cinco', highlight: 'Milenios de Grandeza.', subtitle: 'Visita privada al amanecer al Valle de los Reyes, Karnak y el templo de Luxor al atardecer.', location: 'Luxor y Valle de los Reyes', eyebrow: 'LA ANTIGUA TEBAS • MUSEO AL AIRE LIBRE' },
        desert: { title: 'Más Allá del Horizonte:', highlight: 'Estrellas del Desierto y Corales.', subtitle: 'Del Desierto Blanco y los lagos salados de Siwa a excursiones privadas en yate por el Mar Rojo.', location: 'Desierto Blanco y Oasis de Siwa', eyebrow: 'DESIERTO OCCIDENTAL Y MAR ROJO' },
      },
      faqs: [
        { q: '¿Todos los itinerarios de ORA son privados y personalizables?', a: 'Sí. Adaptamos cada viaje a tus fechas, alojamiento, ritmo e intereses, ya viajes en pareja, en familia o en un grupo pequeño.' },
        { q: '¿Cómo se calculan los precios?', a: 'Los precios dependen de la temporada, hoteles o barco, vuelos nacionales y tamaño del grupo. Ofrecemos propuestas detalladas y transparentes, sin cargos ocultos.' },
        { q: '¿Sus guías son egiptólogos licenciados?', a: 'Sí. Las excursiones culturales y arqueológicas están dirigidas por egiptólogos licenciados y multilingües.' },
        { q: '¿Se incluye asistencia VIP en el aeropuerto?', a: 'Organizamos asistencia en el aeropuerto, equipaje y traslados privados en El Cairo, Luxor, Asuán, Alejandría y el Mar Rojo.' },
        { q: '¿Cuál es la mejor época para visitar Egipto?', a: 'De octubre a abril el clima es más agradable para las visitas y los cruceros; el Mar Rojo y Alejandría se disfrutan todo el año.' },
        { q: '¿Con cuánta antelación debo planificar?', a: 'Recomendamos consultar con 3–6 meses de antelación para el invierno o los charters privados, aunque podemos organizar viajes con menos aviso.' },
      ],
      site: {
        exploreTours: 'Explora Nuestros Tours', planJourney: 'Planifica tu Viaje', destination: 'Destino', allDestinations: 'Todos los Destinos de Egipto', experienceType: 'Tipo de Experiencia', allCategories: 'Todas las Categorías', findJourneys: 'Buscar Viajes',
        iconRegions: 'Regiones Icónicas', featuredDestinations: 'Destinos Destacados de Egipto', viewAllDestinations: 'Ver Todos los Destinos', curatedItineraries: 'Itinerarios Seleccionados', signatureTours: 'Tours y Experiencias Destacados', browseAllTours: 'Ver Todos los Tours',
        waysExperience: 'Formas de Vivir Egipto', threeWorlds: 'Tres Mundos, Un Viaje Perfecto', luxuryCruises: 'Cruceros de Lujo por el Nilo', cruiseDesc: 'Navega entre Luxor y Asuán en barcos de cinco estrellas o dahabiyas privadas de madera.', culturalImmersion: 'Inmersión Cultural e Histórica', culturalDesc: 'Descubre cinco milenios de patrimonio faraónico, grecorromano, copto e islámico con egiptólogos licenciados.', desertAdventures: 'Aventuras en el Desierto y los Oasis', desertDesc: 'Expediciones privadas en 4x4 al Desierto Blanco, el oasis de Siwa y los cañones estrellados del Sinaí.', exploreExperiences: 'Explorar Experiencias',
        oraStandard: 'El Estándar ORA', whyOra: '¿Por Qué Viajar con ORA TRAVEL?', localExpertise: 'Experiencia Local Egipcia', localDesc: 'Especialistas locales en El Cairo, Luxor, Asuán y el Mar Rojo para una experiencia auténtica y logística sencilla.', tailoredPacing: 'Ritmo Totalmente Personalizado', pacingDesc: 'Sin horarios grupales rígidos: cada itinerario se adapta a tus intereses, hoteles preferidos y ritmo.', conciergeCare: 'Atención Integral de Concierge', conciergeDesc: 'Recepción VIP en el aeropuerto, vehículos privados modernos y asistencia local las 24 horas.',
        verifiedReflections: 'Opiniones Verificadas', verifiedReviews: 'Experiencias Auténticas, Opiniones Verificadas', reviewDesc: 'No mostramos testimonios ficticios. Conecta tus reseñas verificadas de Google o TripAdvisor.', travelJournal: 'Diario de Viajes', storiesGuides: 'Historias y Guías de Planificación', readArticles: 'Leer Todos los Artículos', readArticle: 'Leer Artículo',
        tailormadeCollection: 'Colección a Medida', toursIntro: 'Filtra por destino, duración, categoría o estilo. Cada viaje puede personalizarse para tu grupo.', searchTours: 'Buscar tours, templos y experiencias...', allRegions: 'Todos los Destinos', allStyles: 'Todos los Estilos', anyDuration: 'Cualquier Duración', shortDuration: '1–5 Días', mediumDuration: '6–10 Días', longDuration: '11+ Días', showing: 'Mostrando', curatedJourneys: 'viajes seleccionados', clearFilters: 'Borrar filtros', sortBy: 'Ordenar por:', featured: 'Destacados', shortest: 'Duración: Menor primero', longest: 'Duración: Mayor primero', noItineraries: 'No se encontraron itinerarios', broadenFilters: 'Amplía los filtros o contacta con nuestros especialistas para diseñar un viaje.', resetFilters: 'Restablecer Filtros',
        exploreEgypt: 'Explora Egipto', destinationsHeading: 'Destinos por Todo Egipto', destinationsIntro: 'Desde los monumentos de Giza y Luxor hasta los tranquilos oasis del Desierto Occidental y los arrecifes del Mar Rojo.',
        aboutUs: 'Sobre Nosotros', aboutIntro: 'ORA TRAVEL presenta Egipto con profundidad, elegancia y auténtica hospitalidad local. Diseñamos itinerarios privados a medida que conectan a los viajeros con los monumentos, la cultura viva, el Nilo y el desierto.', ourMission: 'Nuestra Misión', missionDesc: 'Ofrecer experiencias de viaje fluidas, enriquecedoras y personales en Egipto con estándares internacionales.', ourVision: 'Nuestra Visión', visionDesc: 'Representar a Egipto como destino de referencia para explorar cultura, ríos, desiertos y costas.', travelPhilosophy: 'Filosofía de Viaje', philosophyDesc: 'Creemos que viajar bien es hacerlo sin prisas, con expertos locales y según la curiosidad de cada viajero.', officialIdentity: 'Identidad Oficial', brandPalette: 'Paleta de Marca ORA TRAVEL', startPlanning: 'Empieza a Planificar con Nuestros Especialistas',
        concierge: 'Conserjería de Viajes Privados', planEgypt: 'Planifica tu Viaje a Egipto', contactIntro: 'Envíanos un mensaje o una solicitud de reserva personalizada. Guardamos todas las solicitudes en nuestro equipo de viajes.', contactForm: 'Formulario de Contacto', bookingRequest: 'Solicitud de Reserva a Medida', directContact: 'Datos de Contacto Directo', contactSettings: 'Actualiza estos datos desde Configuración del Sitio en /admin.', whatsappConcierge: 'Conserjería WhatsApp', chatWhatsapp: 'Chatear por WhatsApp', configureWhatsapp: 'Configura el enlace de WhatsApp en /admin', officeLocation: 'Ubicación de la Oficina',
        travelerAssistance: 'Asistencia al Viajero', faqsTitle: 'Preguntas Frecuentes', legalInfo: 'Información Legal', privacyPolicy: 'Política de Privacidad', terms: 'Términos y Condiciones',
        privacyP1: 'ORA TRAVEL respeta tu privacidad y utiliza tus datos personales, incluidos nombre, contacto y preferencias, únicamente para preparar propuestas y coordinar reservas confirmadas.',
        privacyP2: 'No vendemos ni alquilamos información personal. Solo compartimos datos con socios operativos de confianza cuando sea necesario para cumplir tu itinerario.',
        termsP1: 'Todos los itinerarios de ORA TRAVEL son propuestas personalizables. El precio final, disponibilidad, depósitos y cancelaciones se confirman por escrito en el acuerdo de reserva.',
        termsP2: 'Los viajeros son responsables de tener pasaporte válido, visado adecuado y seguro de viaje completo.',
        newsletter: 'El Diario ORA', newsletterTitle: 'Inspiración de Viaje Seleccionada sobre Egipto', newsletterDesc: 'Ideas sobre cruceros, nuevos sitios arqueológicos y viajes privados.', thankSubscribe: '¡Gracias por suscribirte a las novedades de ORA TRAVEL!', saving: 'Guardando...', bespokeDesc: 'Experiencias de lujo a medida por Egipto, creadas con conocimiento local, relatos de egiptólogos y hospitalidad privada.', explore: 'Explorar', popularRegions: 'Regiones Populares', regionCairo: 'El Cairo y Giza', regionLuxor: 'Luxor y Valle de los Reyes', regionAswan: 'Asuán y Abu Simbel', regionSiwa: 'Siwa y Desierto Blanco', regionRedSea: 'Santuarios del Mar Rojo', footerContact: 'Contacto y Conserjería', allRights: 'Todos los derechos reservados.',
        fullName: 'Nombre Completo *', yourName: 'Tu nombre completo', email: 'Correo Electrónico *', phoneWhatsapp: 'Teléfono / WhatsApp', subject: 'Asunto', yourMessage: 'Tu Mensaje *', messagePlaceholder: '¿Cómo pueden ayudarte nuestros especialistas a planificar tu experiencia en Egipto?', sendMessage: 'Enviar Mensaje', sending: 'Enviando...', messageSent: 'Mensaje Enviado Correctamente', contactThanks: 'Gracias por contactar con ORA TRAVEL. Nuestro equipo ha recibido tu mensaje y responderá pronto.', sendAnother: 'Enviar Otro Mensaje',
        travelDate: 'Fecha Preferida', travelers: 'Viajeros', oneTraveler: '1 Viajero', twoTravelers: '2 Viajeros', threeFour: '3–4 Viajeros', fiveEight: '5–8 Viajeros', groupCharter: '9+ Grupo / Charter Privado', preferences: 'Preferencias del Viaje', dreamTrip: 'Cuéntanos sobre tu viaje ideal a Egipto, hoteles o ocasiones especiales...', requestProposal: 'Solicitar Propuesta Personalizada', submitting: 'Enviando...', inquiryReceived: 'Solicitud de Reserva Recibida', bookingThanks: 'Tu solicitud está guardada y nuestros especialistas enviarán una propuesta personalizada pronto.', anotherBooking: 'Enviar Otra Solicitud',
        fullNameEmailRequired: 'Introduce tu nombre completo y un correo electrónico válido.', contactRequired: 'Completa tu nombre, correo electrónico y mensaje.', thankYou: 'Gracias', about: 'Acerca de', pricing: 'Precio', viewDetails: 'Ver Detalles', loadingTour: 'Cargando itinerario...', itineraryNotFound: 'Itinerario No Encontrado', backTours: 'Volver a Todos los Tours', backToTours: 'Volver a los Tours', journeyOverview: 'Resumen del Viaje', highlights: 'Experiencias Destacadas', itinerary: 'Itinerario Día a Día', included: 'Incluye', excluded: 'No Incluye', importantInfo: 'Información Importante', privateQuote: 'Presupuesto Privado a Medida', quoteDesc: 'Personalizado según hotel, fechas y tamaño del grupo.', relatedJourneys: 'Viajes Relacionados', day: 'Día', durationFormat: '{{days}} Días / {{nights}} Noches', priceOnRequest: 'Presupuesto a Medida / Precio a Consultar',
      },
    },
  },
  fr: {
    translation: {
      nav: { destinations: 'Destinations', tours: 'Circuits & Expériences', about: 'À Propos', blog: 'Journal de Voyage', faq: 'FAQ', contact: 'Contact', plan: 'Planifiez Votre Voyage' },
      common: { loading: 'Chargement...', viewDetails: 'Voir les Détails', subscribe: 'S’abonner', emailPlaceholder: 'Entrez votre adresse e-mail' },
      options: {
        categories: ['Toutes les Catégories', 'Circuits Égypte Antique', 'Circuits Guidés Privés', 'Croisières sur le Nil', 'Circuits de Luxe en Égypte', 'Safaris dans le Désert', 'Circuits Aventure', 'Expériences Culturelles', 'Circuits en Famille', 'Circuits Multi-Jours', 'Expériences en Mer Rouge'],
        styles: ['Tous les Styles', 'Luxe', 'Privé', 'Culturel', 'Aventure', 'Famille', 'Croisière'],
        regions: ['Toutes les Régions', 'Basse-Égypte', 'Haute-Égypte', 'Méditerranée', 'Mer Rouge', 'Désert Occidental'],
        subjects: ['Itinéraire Personnalisé en Égypte', 'Demande de Croisière de Luxe sur le Nil', 'Voyage Privé en Groupe / Famille', 'Partenariat / Agent de Voyage', 'Demande Générale'],
      },
      hero: {
        giza: { title: 'Découvrez l’Égypte.', highlight: 'Vivez l’Extraordinaire.', subtitle: 'Explorez les pyramides et temples antiques avec des égyptologues privés, au rythme qui vous convient.', location: 'Plateau de Gizeh, Égypte', eyebrow: 'ORA TRAVEL • DÉCOUVREZ. VOYAGEZ. VIVEZ.' },
        nile: { title: 'Naviguez sur les', highlight: 'Eaux Éternelles du Nil.', subtitle: 'Voguez entre Karnak, Edfou et Philae à bord d’une dahabiya privée ou d’une croisière de luxe.', location: 'Assouan et Vallée du Nil', eyebrow: 'CROISIÈRES DE LUXE • LOUXOR À ASSOUAN' },
        luxor: { title: 'Parcourez Cinq', highlight: 'Millénaires de Grandeur.', subtitle: 'Accès privé au lever du soleil à la Vallée des Rois, Karnak et au temple de Louxor au crépuscule.', location: 'Louxor et Vallée des Rois', eyebrow: 'THÈBES ANTIQUE • MUSÉE À CIEL OUVERT' },
        desert: { title: 'Au-delà de l’Horizon :', highlight: 'Étoiles du Désert et Coraux.', subtitle: 'Du Désert Blanc et des lacs salés de Siwa aux croisières privées en yacht en mer Rouge.', location: 'Désert Blanc et oasis de Siwa', eyebrow: 'DÉSERT OCCIDENTAL ET MER ROUGE' },
      },
      faqs: [
        { q: 'Tous les itinéraires ORA sont-ils privés et personnalisables ?', a: 'Oui. Chaque voyage est adapté à vos dates, votre hébergement, votre rythme et vos intérêts, en couple, en famille ou en petit groupe.' },
        { q: 'Comment les tarifs sont-ils calculés ?', a: 'Les tarifs dépendent de la saison, des hôtels ou du bateau, des vols intérieurs et de la taille du groupe. Nos propositions sont détaillées et sans frais cachés.' },
        { q: 'Vos guides sont-ils des égyptologues agréés ?', a: 'Oui. Les excursions culturelles et archéologiques sont menées par des égyptologues agréés et multilingues.' },
        { q: 'L’accueil VIP à l’aéroport est-il inclus ?', a: 'Nous organisons l’accueil, l’aide aux bagages et les transferts privés au Caire, à Louxor, Assouan, Alexandrie et en mer Rouge.' },
        { q: 'Quelle est la meilleure période pour visiter l’Égypte ?', a: 'D’octobre à avril, les températures sont idéales pour les visites et les croisières. La mer Rouge et Alexandrie se visitent toute l’année.' },
        { q: 'Combien de temps à l’avance faut-il planifier ?', a: 'Nous conseillons 3 à 6 mois pour l’hiver ou les dahabiyas privées, mais notre équipe peut organiser des séjours dans des délais plus courts.' },
      ],
      site: {
        exploreTours: 'Découvrir Nos Circuits', planJourney: 'Planifiez Votre Voyage', destination: 'Destination', allDestinations: 'Toutes les Destinations d’Égypte', experienceType: 'Type d’Expérience', allCategories: 'Toutes les Catégories', findJourneys: 'Trouver un Voyage',
        iconRegions: 'Régions Iconiques', featuredDestinations: 'Destinations Incontournables d’Égypte', viewAllDestinations: 'Voir Toutes les Destinations', curatedItineraries: 'Itinéraires Sélectionnés', signatureTours: 'Circuits et Expériences Signature', browseAllTours: 'Voir Tous les Circuits',
        waysExperience: 'Découvrir l’Égypte', threeWorlds: 'Trois Univers, Un Voyage Harmonieusement Conçu', luxuryCruises: 'Croisières de Luxe sur le Nil', cruiseDesc: 'Naviguez entre Louxor et Assouan à bord de bateaux cinq étoiles ou de dahabiyas privées en bois.', culturalImmersion: 'Immersion Culturelle et Historique', culturalDesc: 'Découvrez cinq millénaires d’histoire avec des égyptologues agréés.', desertAdventures: 'Aventures dans le Désert et les Oasis', desertDesc: 'Expéditions privées en 4x4 vers le Désert Blanc, l’oasis de Siwa et les canyons du Sinaï.', exploreExperiences: 'Découvrir les Expériences',
        oraStandard: 'L’Exigence ORA', whyOra: 'Pourquoi Voyager avec ORA TRAVEL ?', localExpertise: 'Expertise Locale Égyptienne', localDesc: 'Des spécialistes au Caire, à Louxor, Assouan et en mer Rouge pour une expérience authentique et des déplacements simples.', tailoredPacing: 'Un Rythme Entièrement Personnalisé', pacingDesc: 'Pas d’horaires de groupe rigides : chaque itinéraire suit vos envies et votre rythme.', conciergeCare: 'Un Service de Conciergerie Complet', conciergeDesc: 'Accueil VIP à l’aéroport, véhicules privés modernes et assistance locale 24 h/24.',
        verifiedReflections: 'Avis de Voyageurs Vérifiés', verifiedReviews: 'Expériences Authentiques, Avis Vérifiés', reviewDesc: 'Aucun témoignage fictif. Connectez vos avis vérifiés Google ou TripAdvisor.', travelJournal: 'Carnet de Voyage', storiesGuides: 'Récits et Guides de Voyage', readArticles: 'Lire Tous les Articles', readArticle: 'Lire l’Article',
        tailormadeCollection: 'Collection sur Mesure', toursIntro: 'Filtrez par destination, durée, catégorie ou style. Chaque voyage est personnalisable.', searchTours: 'Rechercher des circuits, temples et expériences...', allRegions: 'Toutes les Destinations', allStyles: 'Tous les Styles', anyDuration: 'Toute Durée', shortDuration: '1–5 Jours', mediumDuration: '6–10 Jours', longDuration: '11 Jours et Plus', showing: 'Affichage', curatedJourneys: 'voyages sélectionnés', clearFilters: 'Effacer les filtres', sortBy: 'Trier par :', featured: 'À la une', shortest: 'Durée : plus courte', longest: 'Durée : plus longue', noItineraries: 'Aucun itinéraire correspondant', broadenFilters: 'Élargissez vos filtres ou contactez nos spécialistes pour créer un voyage.', resetFilters: 'Réinitialiser les Filtres',
        exploreEgypt: 'Explorer l’Égypte', destinationsHeading: 'Destinations à Travers l’Égypte', destinationsIntro: 'Des monuments de Gizeh et Louxor aux oasis paisibles du désert Occidental et aux récifs de la mer Rouge.',
        aboutUs: 'À Propos', aboutIntro: 'ORA TRAVEL fait découvrir l’Égypte avec profondeur, élégance et hospitalité locale. Nous créons des itinéraires privés sur mesure reliant les voyageurs aux monuments, à la culture vivante, au Nil et au désert.', ourMission: 'Notre Mission', missionDesc: 'Offrir des expériences de voyage fluides, enrichissantes et personnelles en Égypte, selon des standards internationaux.', ourVision: 'Notre Vision', visionDesc: 'Faire de l’Égypte une destination de premier plan pour la découverte culturelle, fluviale, désertique et côtière.', travelPhilosophy: 'Notre Philosophie', philosophyDesc: 'Nous croyons aux voyages sans hâte, guidés par des experts locaux et adaptés à la curiosité de chacun.', officialIdentity: 'Identité Officielle', brandPalette: 'Palette de la Marque ORA TRAVEL', startPlanning: 'Planifiez avec Nos Spécialistes',
        concierge: 'Conciergerie de Voyage Privée', planEgypt: 'Planifiez Votre Voyage en Égypte', contactIntro: 'Envoyez-nous un message ou une demande de réservation sur mesure. Toutes les demandes sont enregistrées par notre équipe.', contactForm: 'Formulaire de Contact', bookingRequest: 'Demande de Réservation sur Mesure', directContact: 'Coordonnées Directes', contactSettings: 'Modifiez ces informations dans les paramètres du site sur /admin.', whatsappConcierge: 'Conciergerie WhatsApp', chatWhatsapp: 'Discuter sur WhatsApp', configureWhatsapp: 'Configurez le lien WhatsApp dans /admin', officeLocation: 'Adresse du Bureau',
        travelerAssistance: 'Assistance aux Voyageurs', faqsTitle: 'Questions Fréquemment Posées', legalInfo: 'Informations Légales', privacyPolicy: 'Politique de Confidentialité', terms: 'Conditions Générales',
        privacyP1: 'ORA TRAVEL respecte votre vie privée et utilise vos informations personnelles, notamment votre nom, vos coordonnées et préférences, uniquement pour préparer vos propositions et coordonner les réservations confirmées.',
        privacyP2: 'Nous ne vendons ni ne louons vos informations personnelles. Elles ne sont partagées qu’avec des partenaires de confiance si nécessaire à la réalisation de votre itinéraire.',
        termsP1: 'Tous les itinéraires d’ORA TRAVEL sont des propositions personnalisables. Le tarif final, les disponibilités, les acomptes et les conditions d’annulation sont confirmés par écrit dans votre accord de réservation.',
        termsP2: 'Les voyageurs doivent être munis d’un passeport valide, du visa requis et d’une assurance voyage complète.',
        newsletter: 'Le Journal ORA', newsletterTitle: 'L’Inspiration Voyage en Égypte', newsletterDesc: 'Conseils sur les croisières, nouveaux sites archéologiques et voyages privés.', thankSubscribe: 'Merci de vous être abonné aux actualités ORA TRAVEL !', saving: 'Enregistrement...', bespokeDesc: 'Des expériences de luxe sur mesure en Égypte, conçues avec expertise locale, récits d’égyptologues et hospitalité privée.', explore: 'Explorer', popularRegions: 'Régions Populaires', regionCairo: 'Le Caire et Gizeh', regionLuxor: 'Louxor et Vallée des Rois', regionAswan: 'Assouan et Abou Simbel', regionSiwa: 'Siwa et Désert Blanc', regionRedSea: 'Sanctuaires de la mer Rouge', footerContact: 'Contact et Conciergerie', allRights: 'Tous droits réservés.',
        fullName: 'Nom Complet *', yourName: 'Votre nom complet', email: 'E-mail *', phoneWhatsapp: 'Téléphone / WhatsApp', subject: 'Sujet', yourMessage: 'Votre Message *', messagePlaceholder: 'Comment nos spécialistes peuvent-ils vous aider à organiser votre voyage en Égypte ?', sendMessage: 'Envoyer le Message', sending: 'Envoi...', messageSent: 'Message Envoyé avec Succès', contactThanks: 'Merci d’avoir contacté ORA TRAVEL. Notre équipe a reçu votre message et vous répondra rapidement.', sendAnother: 'Envoyer un Autre Message',
        travelDate: 'Date de Voyage Souhaitée', travelers: 'Voyageurs', oneTraveler: '1 Voyageur', twoTravelers: '2 Voyageurs', threeFour: '3–4 Voyageurs', fiveEight: '5–8 Voyageurs', groupCharter: '9+ Groupe / Charter Privé', preferences: 'Préférences de Voyage', dreamTrip: 'Parlez-nous de votre voyage idéal en Égypte, de vos hôtels ou occasions spéciales...', requestProposal: 'Demander une Proposition sur Mesure', submitting: 'Envoi...', inquiryReceived: 'Demande de Réservation Reçue', bookingThanks: 'Votre demande est enregistrée et nos spécialistes vous enverront bientôt une proposition.', anotherBooking: 'Envoyer une Autre Demande',
        fullNameEmailRequired: 'Veuillez saisir votre nom complet et une adresse e-mail valide.', contactRequired: 'Veuillez renseigner votre nom, votre e-mail et votre message.', thankYou: 'Merci', about: 'À propos', pricing: 'Tarif', viewDetails: 'Voir les Détails', loadingTour: 'Chargement de l’itinéraire...', itineraryNotFound: 'Itinéraire Introuvable', backTours: 'Retour à Tous les Circuits', backToTours: 'Retour aux Circuits', journeyOverview: 'Aperçu du Voyage', highlights: 'Temps Forts', itinerary: 'Itinéraire Jour par Jour', included: 'Inclus', excluded: 'Non Inclus', importantInfo: 'Informations Importantes', privateQuote: 'Devis Privé sur Mesure', quoteDesc: 'Adapté à votre hôtel, vos dates et la taille de votre groupe.', relatedJourneys: 'Voyages Associés', day: 'Jour', durationFormat: '{{days}} Jours / {{nights}} Nuits', priceOnRequest: 'Devis sur Mesure / Prix sur Demande',
      },
    },
  },
};

const savedLanguage = localStorage.getItem('ora_language') || 'en';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export function LanguageProvider({ children }) {
  const { i18n: instance } = useTranslation();
  const [languages, setLanguages] = useState(() => {
    try {
      return normalizeLanguages(localStorage.getItem('ora_languages'));
    } catch {
      return LANGUAGES;
    }
  });
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(
    () => localStorage.getItem('ora_show_language_switcher') !== 'false'
  );
  const language = instance.resolvedLanguage || 'en';

  const setLanguage = (nextLanguage) => {
    instance.changeLanguage(nextLanguage);
  };

  useEffect(() => {
    localStorage.setItem('ora_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = /^(ar|he|fa|ur)(-|$)/.test(language) ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    if (!instance.resolvedLanguage) instance.changeLanguage(savedLanguage);
  }, [instance]);

  useEffect(() => {
    let active = true;
    fetchSiteSettings().then((settings) => {
      if (!active) return;
      if (settings.languages) {
        const next = normalizeLanguages(settings.languages);
        setLanguages(next);
        localStorage.setItem('ora_languages', JSON.stringify(next));
        if (!next.some((item) => item.code === instance.language)) {
          instance.changeLanguage('en');
        }
      }
      if (settings.showLanguageSwitcher !== undefined) {
        const visible = settings.showLanguageSwitcher !== 'false' && settings.showLanguageSwitcher !== false;
        setShowLanguageSwitcher(visible);
        localStorage.setItem('ora_show_language_switcher', String(visible));
      }
    });
    return () => { active = false; };
  }, []);

  return (
    <LanguageRegistryContext.Provider
      value={{ languages, setLanguages, showLanguageSwitcher, setShowLanguageSwitcher }}
    >
      <I18nextProvider i18n={instance}>{children}</I18nextProvider>
    </LanguageRegistryContext.Provider>
  );
}

export function useLanguage() {
  const { i18n: instance } = useTranslation();
  const {
    languages,
    setLanguages,
    showLanguageSwitcher,
    setShowLanguageSwitcher,
  } = useContext(LanguageRegistryContext);
  return {
    language: instance.resolvedLanguage || 'en',
    setLanguage: (nextLanguage) => instance.changeLanguage(nextLanguage),
    languages,
    setLanguages,
    showLanguageSwitcher,
    setShowLanguageSwitcher,
  };
}

export function translated(entity, field, language) {
  const translations = entity?.translations || {};
  return translations?.[language]?.[field] || entity?.[field] || '';
}

export function translatedArray(entity, field, language) {
  const translations = entity?.translations || {};
  const value = translations?.[language]?.[field];
  return Array.isArray(value) ? value : (entity?.[field] || []);
}
