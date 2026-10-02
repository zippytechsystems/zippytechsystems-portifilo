import { supabase, isSupabaseConfigured } from './supabase';
import { content as initialContent } from '../data/content';

/**
 * Currency Formatter for Indian Rupees
 * Takes number (e.g. 7000) -> returns formatted string "₹7,000"
 */
export function formatINR(value) {
  if (value === null || value === undefined || value === '') return '₹0';
  if (typeof value === 'string' && value.includes('₹')) return value;
  const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '₹0';
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Sanitize text input to prevent XSS / malicious injections
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Clean phone numbers to pure digits
 */
export function cleanPhone(phone) {
  if (!phone) return '';
  return String(phone).replace(/[^0-9]/g, '');
}

// =========================================================================
// 1. SETTINGS API
// =========================================================================
export async function getSettings() {
  const fallback = {
    phone: initialContent.founder.phone,
    whatsappNumber: initialContent.founder.whatsappNumber,
    defaultWhatsAppMessage: 'Hi Lingaswamy, I visited ZippyTechSystems and would like to get a quote for my business.',
    tagline: initialContent.company.tagline,
    secondaryTagline: initialContent.company.secondaryTagline,
    location: initialContent.company.location,
    instagramUrl: initialContent.social?.instagram || 'https://www.instagram.com/zippytechsystems',
    youtubeUrl: initialContent.social?.youtube || 'https://www.youtube.com/@zippytechsystems'
  };

  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error || !data) return fallback;

    return {
      phone: data.phone || fallback.phone,
      whatsappNumber: data.whatsapp_number || fallback.whatsappNumber,
      defaultWhatsAppMessage: data.default_whatsapp_message || fallback.defaultWhatsAppMessage,
      tagline: data.tagline || fallback.tagline,
      secondaryTagline: data.secondary_tagline || fallback.secondaryTagline,
      location: data.location || fallback.location,
      instagramUrl: data.instagram_url || fallback.instagramUrl,
      youtubeUrl: data.youtube_url || fallback.youtubeUrl
    };
  } catch (err) {
    console.warn('api.getSettings fallback:', err);
    return fallback;
  }
}

export async function updateSettingsApi(settingsData) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const payload = {
      phone: sanitizeString(settingsData.phone),
      whatsapp_number: cleanPhone(settingsData.whatsappNumber),
      default_whatsapp_message: sanitizeString(settingsData.defaultWhatsAppMessage),
      tagline: sanitizeString(settingsData.tagline),
      secondary_tagline: sanitizeString(settingsData.secondaryTagline),
      location: sanitizeString(settingsData.location),
      instagram_url: sanitizeString(settingsData.instagramUrl),
      youtube_url: sanitizeString(settingsData.youtubeUrl),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...payload });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateSettingsApi error:', err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// 2. DOMAINS & STARTING PRICES API
// =========================================================================
export async function getDomains() {
  const fallback = [
    { id: 'web', key: 'web', name: 'Web Development', starting_price: 7000, price_label: 'Starting from', color: '#1d5cf0', intro: 'A modern, high-speed website that brings local customers to your door 24/7.' },
    { id: 'app', key: 'app', name: 'App Development', starting_price: 10000, price_label: 'Starting from', color: '#12a150', intro: 'Custom billing, accounts, and inventory apps for retail and wholesale shops.' },
    { id: 'ai', key: 'ai', name: 'AI Automation', starting_price: 6000, price_label: 'Starting from', color: '#7a2fd0', intro: 'Never lose another customer enquiry with 24/7 WhatsApp and voice agents.' }
  ];

  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('domains')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    return data.map((d) => ({
      ...d,
      starting_price: Number(d.starting_price) || 0
    }));
  } catch (err) {
    console.warn('api.getDomains fallback:', err);
    return fallback;
  }
}

export async function updateDomainPriceApi(domainId, newPrice) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const numericPrice = Math.max(0, Number(newPrice) || 0);
    const { error } = await supabase
      .from('domains')
      .update({
        starting_price: numericPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', domainId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateDomainPriceApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateDomainApi(domainId, updates) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase
      .from('domains')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', domainId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateDomainApi error:', err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// 3. SERVICES API
// =========================================================================
export async function getServices() {
  const fallback = initialContent.services;
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const [{ data: domainsData }, { data: servicesData, error: sErr }] = await Promise.all([
      supabase.from('domains').select('*').order('sort_order', { ascending: true }),
      supabase.from('services').select('*').order('sort_order', { ascending: true })
    ]);

    if (sErr || !servicesData || servicesData.length === 0) return fallback;

    const domainsList = domainsData && domainsData.length > 0 ? domainsData : [
      { id: 'web', key: 'web', name: 'Web Development', starting_price: 7000, color: '#1d5cf0' },
      { id: 'app', key: 'app', name: 'App Development', starting_price: 10000, color: '#12a150' },
      { id: 'ai', key: 'ai', name: 'AI Automation', starting_price: 6000, color: '#7a2fd0' }
    ];

    return domainsList.map((d) => {
      const matchingServices = servicesData.filter(
        (s) => s.domain_id === d.id || s.domain_id === d.key
      );

      const mainServices = matchingServices
        .filter((s) => s.type === 'main')
        .map((s) => ({ id: s.id, title: s.name, desc: s.description, isActive: s.is_active }));

      const moreServices = matchingServices
        .filter((s) => s.type === 'more')
        .map((s) => ({ id: s.id, title: s.name, desc: s.description, isActive: s.is_active }));

      const baseFallback = fallback.find((fb) => fb.domain === d.key) || {};

      return {
        id: d.id,
        slug: d.key === 'web' ? 'web-development' : d.key === 'app' ? 'app-development' : 'ai-automation',
        domain: d.key,
        domainLabel: d.name,
        startingPrice: formatINR(d.starting_price),
        startingPriceNum: Number(d.starting_price) || 0,
        badgeColor: d.color,
        gradient: baseFallback.gradient || 'linear-gradient(135deg, #0b1b4a 0%, #1d5cf0 100%)',
        introLine: d.intro || baseFallback.introLine,
        conceptCopy: baseFallback.conceptCopy || '',
        whatsappMessage: baseFallback.whatsappMessage || '',
        mainServices: mainServices.length > 0 ? mainServices : baseFallback.mainServices || [],
        moreServices: moreServices.length > 0 ? moreServices : baseFallback.moreServices || []
      };
    });
  } catch (err) {
    console.warn('api.getServices fallback:', err);
    return fallback;
  }
}

export async function createServiceApi({ domain_id, name, description = '', type = 'main', sort_order = 0, is_active = true }) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { data, error } = await supabase
      .from('services')
      .insert([
        {
          domain_id,
          name: sanitizeString(name),
          description: sanitizeString(description),
          type,
          sort_order,
          is_active
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('api.createServiceApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateServiceApi(id, updates) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const payload = { ...updates, updated_at: new Date().toISOString() };
    if (payload.name) payload.name = sanitizeString(payload.name);
    if (payload.description) payload.description = sanitizeString(payload.description);

    const { error } = await supabase.from('services').update(payload).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateServiceApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteServiceApi(id) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.deleteServiceApi error:', err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// 4. PACKAGES API
// =========================================================================
export async function getPackages() {
  const fallback = initialContent.packages || [];
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    return data.map((pkg) => ({
      id: pkg.id,
      domain: pkg.domain_id,
      name: pkg.name,
      price: formatINR(pkg.price),
      priceNum: Number(pkg.price) || 0,
      tagline: pkg.tagline || '',
      deliverables: Array.isArray(pkg.features) ? pkg.features : [],
      popular: Boolean(pkg.is_popular),
      isActive: pkg.is_active
    }));
  } catch (err) {
    console.warn('api.getPackages fallback:', err);
    return fallback;
  }
}

export async function createPackageApi(payload) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const featuresArray = Array.isArray(payload.deliverables)
      ? payload.deliverables
      : typeof payload.deliverables === 'string'
      ? payload.deliverables.split('\n').map((f) => f.trim()).filter(Boolean)
      : [];

    const { data, error } = await supabase
      .from('packages')
      .insert([
        {
          domain_id: payload.domain,
          name: sanitizeString(payload.name),
          price: Math.max(0, Number(payload.priceNum || payload.price) || 0),
          features: featuresArray,
          is_popular: Boolean(payload.popular),
          sort_order: payload.sort_order || 0,
          is_active: payload.isActive !== false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('api.createPackageApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function updatePackageApi(id, updates) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const payload = { updated_at: new Date().toISOString() };
    if (updates.domain) payload.domain_id = updates.domain;
    if (updates.name) payload.name = sanitizeString(updates.name);
    if (updates.price !== undefined || updates.priceNum !== undefined) {
      payload.price = Math.max(0, Number(updates.priceNum ?? updates.price) || 0);
    }
    if (updates.deliverables !== undefined) {
      payload.features = Array.isArray(updates.deliverables)
        ? updates.deliverables
        : typeof updates.deliverables === 'string'
        ? updates.deliverables.split('\n').map((f) => f.trim()).filter(Boolean)
        : [];
    }
    if (updates.popular !== undefined) payload.is_popular = Boolean(updates.popular);
    if (updates.isActive !== undefined) payload.is_active = Boolean(updates.isActive);

    const { error } = await supabase.from('packages').update(payload).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updatePackageApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function updatePackagePriceApi(id, newPrice) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const numericPrice = Math.max(0, Number(newPrice) || 0);
    const { error } = await supabase
      .from('packages')
      .update({ price: numericPrice, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updatePackagePriceApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function deletePackageApi(id) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.deletePackageApi error:', err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// 5. PROJECTS API
// =========================================================================
export async function getProjects() {
  const fallback = initialContent.projects;
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    return data.map((p) => ({
      id: p.id,
      title: p.title,
      domain: p.domain_id,
      clientCategory: p.client_category,
      shortDescription: p.description,
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      metrics: p.metrics || '',
      link: p.link || 'https://wa.me/916302690251',
      image: p.image_url || '/projects/clinic-web.svg',
      isActive: p.is_active
    }));
  } catch (err) {
    console.warn('api.getProjects fallback:', err);
    return fallback;
  }
}

export async function createProjectApi(payload) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const techArray = Array.isArray(payload.technologies)
      ? payload.technologies
      : typeof payload.technologies === 'string'
      ? payload.technologies.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title: sanitizeString(payload.title),
          domain_id: payload.domain || 'web',
          client_category: sanitizeString(payload.clientCategory || 'Business Solutions'),
          description: sanitizeString(payload.shortDescription || payload.description),
          technologies: techArray,
          metrics: sanitizeString(payload.metrics || ''),
          link: payload.link || 'https://wa.me/916302690251',
          image_url: payload.image || payload.image_url || '/projects/clinic-web.svg',
          is_active: payload.isActive !== false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('api.createProjectApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateProjectApi(id, updates) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const payload = { updated_at: new Date().toISOString() };
    if (updates.title) payload.title = sanitizeString(updates.title);
    if (updates.domain) payload.domain_id = updates.domain;
    if (updates.clientCategory) payload.client_category = sanitizeString(updates.clientCategory);
    if (updates.shortDescription || updates.description) {
      payload.description = sanitizeString(updates.shortDescription || updates.description);
    }
    if (updates.technologies) {
      payload.technologies = Array.isArray(updates.technologies)
        ? updates.technologies
        : String(updates.technologies).split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (updates.metrics !== undefined) payload.metrics = sanitizeString(updates.metrics);
    if (updates.link !== undefined) payload.link = updates.link;
    if (updates.image || updates.image_url) payload.image_url = updates.image || updates.image_url;
    if (updates.isActive !== undefined) payload.is_active = Boolean(updates.isActive);

    const { error } = await supabase.from('projects').update(payload).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateProjectApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteProjectApi(id) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.deleteProjectApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function uploadProjectImageApi(file) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase Storage is not configured. Falling back to local placeholder.');
  }

  // 1. File size validation (limit to 2 MB)
  const MAX_SIZE_BYTES = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 2 MB.`);
  }

  // 2. MIME type validation (images only)
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Only image files (JPEG, PNG, WebP, SVG) are allowed.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

// =========================================================================
// 6. TESTIMONIALS API
// =========================================================================
export async function getTestimonials() {
  const fallback = initialContent.testimonials || [];
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    return data.map((t) => ({
      id: t.id,
      clientName: t.client_name,
      roleOrCompany: t.business,
      domain: t.domain_id || 'web',
      rating: t.rating || 5,
      content: t.message,
      isActive: t.is_active
    }));
  } catch (err) {
    console.warn('api.getTestimonials fallback:', err);
    return fallback;
  }
}

export async function createTestimonialApi(payload) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([
        {
          client_name: sanitizeString(payload.clientName),
          business: sanitizeString(payload.roleOrCompany || payload.business),
          domain_id: payload.domain || 'web',
          rating: Math.min(5, Math.max(1, Number(payload.rating) || 5)),
          message: sanitizeString(payload.content || payload.message),
          is_active: payload.isActive !== false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('api.createTestimonialApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateTestimonialApi(id, updates) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const payload = { updated_at: new Date().toISOString() };
    if (updates.clientName) payload.client_name = sanitizeString(updates.clientName);
    if (updates.roleOrCompany || updates.business) {
      payload.business = sanitizeString(updates.roleOrCompany || updates.business);
    }
    if (updates.domain) payload.domain_id = updates.domain;
    if (updates.rating) payload.rating = Math.min(5, Math.max(1, Number(updates.rating) || 5));
    if (updates.content || updates.message) {
      payload.message = sanitizeString(updates.content || updates.message);
    }
    if (updates.isActive !== undefined) payload.is_active = Boolean(updates.isActive);

    const { error } = await supabase.from('testimonials').update(payload).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateTestimonialApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteTestimonialApi(id) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.deleteTestimonialApi error:', err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// 7. FAQS API
// =========================================================================
export async function getFaqs() {
  const fallback = initialContent.faqs || [];
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    return data.map((f) => ({
      id: f.id,
      category: f.category || 'General',
      question: f.question,
      answer: f.answer,
      isActive: f.is_active
    }));
  } catch (err) {
    console.warn('api.getFaqs fallback:', err);
    return fallback;
  }
}

export async function createFaqApi(payload) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { data, error } = await supabase
      .from('faqs')
      .insert([
        {
          category: sanitizeString(payload.category || 'General'),
          question: sanitizeString(payload.question),
          answer: sanitizeString(payload.answer),
          is_active: payload.isActive !== false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('api.createFaqApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function updateFaqApi(id, updates) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const payload = { updated_at: new Date().toISOString() };
    if (updates.category) payload.category = sanitizeString(updates.category);
    if (updates.question) payload.question = sanitizeString(updates.question);
    if (updates.answer) payload.answer = sanitizeString(updates.answer);
    if (updates.isActive !== undefined) payload.is_active = Boolean(updates.isActive);

    const { error } = await supabase.from('faqs').update(payload).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateFaqApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteFaqApi(id) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.deleteFaqApi error:', err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// 8. ENQUIRIES API (Contact & Quote Form Submissions)
// =========================================================================
export async function createEnquiry(enquiryData) {
  const name = sanitizeString(enquiryData.name);
  const phone = cleanPhone(enquiryData.phone);
  const service = sanitizeString(enquiryData.service || 'General Enquiry');
  const message = sanitizeString(enquiryData.message || '');
  const source = enquiryData.source === 'quote' ? 'quote' : 'contact';

  if (!name || phone.length < 10) {
    return { success: false, error: 'Name and a valid 10-digit phone number are required.' };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { success: true, offline: true };
  }

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([
        {
          name,
          phone,
          service,
          message,
          status: 'New',
          source
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('api.createEnquiry database save fallback:', err);
    return { success: true, offline: true, error: err.message };
  }
}

export async function getEnquiriesApi() {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn('api.getEnquiriesApi error:', err);
    return [];
  }
}

export async function updateEnquiryStatusApi(id, status) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.updateEnquiryStatusApi error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteEnquiryApi(id) {
  if (!isSupabaseConfigured || !supabase) return { success: true };

  try {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('api.deleteEnquiryApi error:', err);
    return { success: false, error: err.message };
  }
}

// =========================================================================
// 9. PRICE HISTORY API
// =========================================================================
export async function getPriceHistoryApi() {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(30);

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn('api.getPriceHistoryApi error:', err);
    return [];
  }
}
