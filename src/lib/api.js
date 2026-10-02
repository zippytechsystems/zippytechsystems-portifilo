/**
 * =========================================================================
 * ZippyTechSystems Pvt. Ltd. — Centralized API Layer
 * =========================================================================
 * All database operations route through this layer. Never call Supabase
 * directly from UI components. Implements input validation, sanitization,
 * and zero-downtime offline fallback resilience.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import { content as initialContent } from '../data/content';

/**
 * Sanitize user string to prevent XSS and unwanted formatting
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // strip HTML brackets
    .trim();
}

/**
 * Validate phone number (must contain at least 10 digits)
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 10;
}

// -------------------------------------------------------------
// 1. Services API
// -------------------------------------------------------------

/**
 * Fetch all services grouped by domain with starting prices
 */
export async function getServices() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: domains, error: domErr } = await supabase
        .from('domains')
        .select('*');

      const { data: services, error: servErr } = await supabase
        .from('services')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!domErr && domains && domains.length > 0) {
        return domains.map((dom) => {
          const domainServices = (services || []).filter((s) => s.domain_id === dom.id);
          const mainServices = domainServices
            .filter((s) => s.type === 'main')
            .map((s) => ({ id: s.id, title: s.title, desc: s.description }));
          const moreServices = domainServices
            .filter((s) => s.type === 'more')
            .map((s) => s.title);

          const matchStatic = initialContent.services.find((s) => s.slug === dom.id) || {};

          return {
            ...matchStatic,
            id: dom.id,
            slug: dom.id,
            domainLabel: dom.name,
            startingPrice: dom.starting_price,
            startingPriceNum: dom.starting_price_num,
            introLine: dom.intro_line,
            conceptCopy: dom.concept_copy,
            badgeColor: dom.color,
            mainServices: mainServices.length > 0 ? mainServices : matchStatic.mainServices,
            moreServices: moreServices.length > 0 ? moreServices : matchStatic.moreServices
          };
        });
      }
    } catch (err) {
      console.warn('API getServices: Supabase unavailable, falling back to local data.', err);
    }
  }

  // Fallback to localStorage or static content
  try {
    const cached = localStorage.getItem('zippy_local_services');
    if (cached) return JSON.parse(cached);
  } catch {}
  return initialContent.services;
}

export async function updateDomainPriceApi(domainSlug, newPrice) {
  const cleanPrice = sanitizeInput(newPrice);
  if (isSupabaseConfigured && supabase) {
    try {
      const num = parseInt(cleanPrice.replace(/[^0-9]/g, ''), 10) || 0;
      await supabase
        .from('domains')
        .update({ starting_price: cleanPrice, starting_price_num: num })
        .eq('id', domainSlug);
    } catch (e) {
      console.error('API updateDomainPrice error:', e);
    }
  }
  return { success: true, newPrice: cleanPrice };
}

export async function createServiceApi({ domain_id, type, title, description, sort_order = 0 }) {
  const cleanTitle = sanitizeInput(title);
  const cleanDesc = sanitizeInput(description);
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('services').insert({
        domain_id,
        type,
        title: cleanTitle,
        description: cleanDesc,
        sort_order
      }).select().single();
      if (!error && data) return data;
    } catch (e) {
      console.error('API createService error:', e);
    }
  }
  return { id: 'serv-' + Date.now(), domain_id, type, title: cleanTitle, description: cleanDesc, sort_order };
}

export async function updateServiceApi(domainSlug, type, title, updatedData) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('services').update({
        title: sanitizeInput(updatedData.title),
        description: sanitizeInput(updatedData.desc || '')
      }).eq('domain_id', domainSlug).eq('type', type).eq('title', title);
    } catch (e) {
      console.error('API updateService error:', e);
    }
  }
  return { success: true };
}

export async function deleteServiceApi(domainSlug, type, title) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('services')
        .delete()
        .eq('domain_id', domainSlug)
        .eq('type', type)
        .eq('title', title);
    } catch (e) {
      console.error('API deleteService error:', e);
    }
  }
  return { success: true };
}

// -------------------------------------------------------------
// 2. Projects (Portfolio) API
// -------------------------------------------------------------

export async function getProjects() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && projects && projects.length > 0) {
        return projects.map((p) => ({
          id: p.id,
          title: p.title,
          domain: p.domain,
          domainLabel:
            p.domain === 'web'
              ? 'Web Development'
              : p.domain === 'app'
              ? 'App Development'
              : 'AI Automation',
          domainColor:
            p.domain === 'web'
              ? '#1d5cf0'
              : p.domain === 'app'
              ? '#12a150'
              : '#7a2fd0',
          clientCategory: p.client_category,
          shortDescription: p.short_description,
          technologies: p.technologies || [],
          metrics: p.metrics || '',
          image: p.image_url
        }));
      }
    } catch (err) {
      console.warn('API getProjects: Supabase unavailable, falling back to local data.', err);
    }
  }

  // Fallback to localStorage or static content
  try {
    const cached = localStorage.getItem('zippy_local_projects');
    if (cached) return JSON.parse(cached);
  } catch {}
  return initialContent.projects;
}

export async function createProjectApi(project) {
  const cleanTitle = sanitizeInput(project.title);
  const cleanDesc = sanitizeInput(project.shortDescription);
  const cleanCategory = sanitizeInput(project.clientCategory);
  const cleanMetrics = sanitizeInput(project.metrics);

  const newProj = {
    ...project,
    id: project.id || 'proj-' + Date.now(),
    title: cleanTitle,
    shortDescription: cleanDesc,
    clientCategory: cleanCategory,
    metrics: cleanMetrics,
    domainColor:
      project.domain === 'web'
        ? '#1d5cf0'
        : project.domain === 'app'
        ? '#12a150'
        : '#7a2fd0',
    domainLabel:
      project.domain === 'web'
        ? 'Web Development'
        : project.domain === 'app'
        ? 'App Development'
        : 'AI Automation'
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').insert({
        title: newProj.title,
        domain: newProj.domain,
        client_category: newProj.clientCategory,
        short_description: newProj.shortDescription,
        technologies: newProj.technologies || [],
        metrics: newProj.metrics || '',
        image_url: newProj.image
      });
    } catch (e) {
      console.error('API createProject error:', e);
    }
  }
  return newProj;
}

export async function updateProjectApi(id, project) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').update({
        title: sanitizeInput(project.title),
        domain: project.domain,
        client_category: sanitizeInput(project.clientCategory),
        short_description: sanitizeInput(project.shortDescription),
        technologies: project.technologies,
        metrics: sanitizeInput(project.metrics),
        image_url: project.image
      }).eq('id', id);
    } catch (e) {
      console.error('API updateProject error:', e);
    }
  }
  return { success: true };
}

export async function deleteProjectApi(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.error('API deleteProject error:', e);
    }
  }
  return { success: true };
}

export async function uploadProjectImageApi(file) {
  if (!file) return null;
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath);
        if (data?.publicUrl) return data.publicUrl;
      }
    } catch (err) {
      console.warn('API uploadProjectImage: Storage upload failed, using Data URL fallback.', err);
    }
  }

  // Local Data URL fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

// -------------------------------------------------------------
// 3. Settings API (Phone, WhatsApp, Social URLs, Taglines)
// -------------------------------------------------------------

export async function getSettings() {
  const defaultSettings = {
    phone: initialContent.founder.phone, // 6302690251
    phoneFormatted: initialContent.founder.phoneFormatted, // +91 63026 90251
    phoneCall: initialContent.founder.phoneCall, // +916302690251
    whatsappNumber: initialContent.founder.whatsappNumber, // 916302690251
    defaultWhatsAppMessage: "Hi Lingaswamy, I visited ZippyTechSystems and would like to get a quote for my business.",
    tagline: initialContent.company.tagline,
    secondaryTagline: initialContent.company.secondaryTagline,
    location: initialContent.company.location,
    instagramUrl: initialContent.social?.instagram || 'https://www.instagram.com/zippytechsystems',
    youtubeUrl: initialContent.social?.youtube || 'https://www.youtube.com/@zippytechsystems'
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: rows, error } = await supabase.from('settings').select('*');
      if (!error && rows && rows.length > 0) {
        const map = { ...defaultSettings };
        rows.forEach((r) => {
          if (r.key === 'phone') {
            map.phone = r.value;
            map.phoneCall = `tel:+91${r.value.replace(/[^0-9]/g, '')}`;
          }
          if (r.key === 'phone_formatted') map.phoneFormatted = r.value;
          if (r.key === 'whatsapp_number') map.whatsappNumber = r.value;
          if (r.key === 'whatsapp_prefill') map.defaultWhatsAppMessage = r.value;
          if (r.key === 'tagline') map.tagline = r.value;
          if (r.key === 'secondary_tagline') map.secondaryTagline = r.value;
          if (r.key === 'location') map.location = r.value;
          if (r.key === 'instagram_url') map.instagramUrl = r.value;
          if (r.key === 'youtube_url') map.youtubeUrl = r.value;
        });
        return map;
      }
    } catch (err) {
      console.warn('API getSettings: Supabase unavailable, falling back to local settings.', err);
    }
  }

  // Fallback to localStorage
  try {
    const cached = localStorage.getItem('zippy_local_settings');
    if (cached) return { ...defaultSettings, ...JSON.parse(cached) };
  } catch {}
  return defaultSettings;
}

export async function updateSettingsApi(settingsObj) {
  if (isSupabaseConfigured && supabase) {
    try {
      const entries = [
        { key: 'phone', value: sanitizeInput(settingsObj.phone) },
        { key: 'phone_formatted', value: sanitizeInput(settingsObj.phoneFormatted || `+91 ${settingsObj.phone}`) },
        { key: 'whatsapp_number', value: sanitizeInput(settingsObj.whatsappNumber) },
        { key: 'whatsapp_prefill', value: sanitizeInput(settingsObj.defaultWhatsAppMessage) },
        { key: 'tagline', value: sanitizeInput(settingsObj.tagline) },
        { key: 'secondary_tagline', value: sanitizeInput(settingsObj.secondaryTagline) },
        { key: 'location', value: sanitizeInput(settingsObj.location) },
        { key: 'instagram_url', value: sanitizeInput(settingsObj.instagramUrl) },
        { key: 'youtube_url', value: sanitizeInput(settingsObj.youtubeUrl) }
      ];

      for (const entry of entries) {
        await supabase.from('settings').upsert(entry);
      }
    } catch (e) {
      console.error('API updateSettings error:', e);
    }
  }
  return { success: true };
}

// -------------------------------------------------------------
// 4. Enquiries (Leads) API
// -------------------------------------------------------------

/**
 * Public enquiry submission. Sanitizes and validates inputs,
 * saves to Supabase (and local storage), and returns WhatsApp redirect info.
 */
export async function createEnquiry({ name, phone, service, message }) {
  const cleanName = sanitizeInput(name);
  const cleanPhone = sanitizeInput(phone);
  const cleanService = sanitizeInput(service);
  const cleanMessage = sanitizeInput(message);

  if (!cleanName) {
    throw new Error('Please provide your name.');
  }

  if (!isValidPhone(cleanPhone)) {
    throw new Error('Please provide a valid 10-digit mobile number.');
  }

  const newEnquiry = {
    id: 'enq-' + Date.now(),
    name: cleanName,
    phone: cleanPhone,
    service: cleanService || 'General Enquiry',
    message: cleanMessage,
    status: 'New',
    created_at: new Date().toISOString()
  };

  // Try Supabase insert
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').insert({
        name: cleanName,
        phone: cleanPhone,
        service: cleanService || 'General Enquiry',
        message: cleanMessage,
        status: 'New'
      });
    } catch (err) {
      console.warn('API createEnquiry: Supabase insert error, saved locally.', err);
    }
  }

  // Also save locally for fallback persistence
  try {
    const cached = localStorage.getItem('zippy_local_enquiries');
    const list = cached ? JSON.parse(cached) : [];
    localStorage.setItem('zippy_local_enquiries', JSON.stringify([newEnquiry, ...list]));
  } catch {}

  return { success: true, enquiry: newEnquiry };
}

export async function getEnquiriesApi() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    } catch (err) {
      console.warn('API getEnquiries: Supabase unavailable, reading local enquiries.', err);
    }
  }

  try {
    const cached = localStorage.getItem('zippy_local_enquiries');
    if (cached) return JSON.parse(cached);
  } catch {}
  return [];
}

export async function updateEnquiryStatusApi(id, newStatus) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.error('API updateEnquiryStatus error:', e);
    }
  }
  return { success: true };
}

export async function deleteEnquiryApi(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('enquiries').delete().eq('id', id);
    } catch (e) {
      console.error('API deleteEnquiry error:', e);
    }
  }
  return { success: true };
}
