import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { content as initialContent } from '../data/content';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [servicesData, setServicesData] = useState(() => {
    try {
      const cached = localStorage.getItem('zippy_local_services');
      return cached ? JSON.parse(cached) : initialContent.services;
    } catch {
      return initialContent.services;
    }
  });

  const [projectsData, setProjectsData] = useState(() => {
    try {
      const cached = localStorage.getItem('zippy_local_projects');
      return cached ? JSON.parse(cached) : initialContent.projects;
    } catch {
      return initialContent.projects;
    }
  });

  const [settingsData, setSettingsData] = useState(() => {
    try {
      const cached = localStorage.getItem('zippy_local_settings');
      return cached
        ? JSON.parse(cached)
        : {
            phone: initialContent.founder.phone,
            phoneFormatted: initialContent.founder.phoneFormatted,
            whatsappNumber: initialContent.founder.whatsappNumber,
            tagline: initialContent.company.tagline,
            secondaryTagline: initialContent.company.secondaryTagline,
            location: initialContent.company.location
          };
    } catch {
      return {
        phone: initialContent.founder.phone,
        phoneFormatted: initialContent.founder.phoneFormatted,
        whatsappNumber: initialContent.founder.whatsappNumber,
        tagline: initialContent.company.tagline,
        secondaryTagline: initialContent.company.secondaryTagline,
        location: initialContent.company.location
      };
    }
  });

  const [enquiries, setEnquiries] = useState(() => {
    try {
      const cached = localStorage.getItem('zippy_local_enquiries');
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync with Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchFromSupabase() {
      setLoading(true);
      try {
        // 1. Fetch Domains
        const { data: domains, error: domainErr } = await supabase
          .from('domains')
          .select('*');

        // 2. Fetch Services
        const { data: services, error: servErr } = await supabase
          .from('services')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!domainErr && domains && domains.length > 0) {
          setIsLiveConnected(true);
          // Map DB structure to content.services structure
          const combined = domains.map((dom) => {
            const domainServices = (services || []).filter((s) => s.domain_id === dom.id);
            const mainServices = domainServices
              .filter((s) => s.type === 'main')
              .map((s) => ({ title: s.title, desc: s.description }));
            const moreServices = domainServices
              .filter((s) => s.type === 'more')
              .map((s) => s.title);

            // Find matching static config for icons/gradients
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
          setServicesData(combined);
        }

        // 3. Fetch Projects
        const { data: projects, error: projErr } = await supabase
          .from('projects')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!projErr && projects && projects.length > 0) {
          setProjectsData(
            projects.map((p) => ({
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
            }))
          );
        }

        // 4. Fetch Enquiries (for Admin)
        const { data: enqData } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (enqData) {
          setEnquiries(enqData);
        }
      } catch (err) {
        console.warn('Could not sync with Supabase, using fallback data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();
  }, []);

  // Save changes to localStorage when updated
  const persistServices = (data) => {
    setServicesData(data);
    try {
      localStorage.setItem('zippy_local_services', JSON.stringify(data));
    } catch {}
  };

  const persistProjects = (data) => {
    setProjectsData(data);
    try {
      localStorage.setItem('zippy_local_projects', JSON.stringify(data));
    } catch {}
  };

  const persistSettings = (data) => {
    setSettingsData(data);
    try {
      localStorage.setItem('zippy_local_settings', JSON.stringify(data));
    } catch {}
  };

  const persistEnquiries = (data) => {
    setEnquiries(data);
    try {
      localStorage.setItem('zippy_local_enquiries', JSON.stringify(data));
    } catch {}
  };

  // 1. Update Domain Starting Price
  const updateDomainPrice = async (domainSlug, newPrice) => {
    const updated = servicesData.map((s) =>
      s.slug === domainSlug ? { ...s, startingPrice: newPrice } : s
    );
    persistServices(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        const num = parseInt(newPrice.replace(/[^0-9]/g, ''), 10) || 0;
        await supabase
          .from('domains')
          .update({ starting_price: newPrice, starting_price_num: num })
          .eq('id', domainSlug);
      } catch (e) {
        console.error('Supabase domain update error:', e);
      }
    }
  };

  // 2. Add or Edit Main/More Service
  const addServiceItem = async (domainSlug, type, title, desc = '') => {
    const updated = servicesData.map((s) => {
      if (s.slug !== domainSlug) return s;
      if (type === 'main') {
        return {
          ...s,
          mainServices: [...s.mainServices, { title, desc }]
        };
      } else {
        return {
          ...s,
          moreServices: [...s.moreServices, title]
        };
      }
    });
    persistServices(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').insert({
          domain_id: domainSlug,
          type,
          title,
          description: desc
        });
      } catch (e) {
        console.error('Supabase service insert error:', e);
      }
    }
  };

  const deleteServiceItem = async (domainSlug, type, indexOrTitle) => {
    const updated = servicesData.map((s) => {
      if (s.slug !== domainSlug) return s;
      if (type === 'main') {
        return {
          ...s,
          mainServices: s.mainServices.filter((_, idx) => idx !== indexOrTitle)
        };
      } else {
        return {
          ...s,
          moreServices: s.moreServices.filter((t) => t !== indexOrTitle)
        };
      }
    });
    persistServices(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('services')
          .delete()
          .eq('domain_id', domainSlug)
          .eq('type', type)
          .eq('title', typeof indexOrTitle === 'string' ? indexOrTitle : '');
      } catch (e) {}
    }
  };

  // Edit Service Item
  const editServiceItem = async (domainSlug, type, index, updatedItem) => {
    const updated = servicesData.map((s) => {
      if (s.slug !== domainSlug) return s;
      if (type === 'main') {
        const list = [...s.mainServices];
        list[index] = { title: updatedItem.title, desc: updatedItem.desc || '' };
        return { ...s, mainServices: list };
      } else {
        const list = [...s.moreServices];
        list[index] = updatedItem.title;
        return { ...s, moreServices: list };
      }
    });
    persistServices(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('services').update({
          title: updatedItem.title,
          description: updatedItem.desc || ''
        }).eq('domain_id', domainSlug).eq('type', type);
      } catch (e) {}
    }
  };

  // Reorder Service Items (Move Up / Down)
  const reorderServiceItems = async (domainSlug, type, index, direction) => {
    const targetDomain = servicesData.find((s) => s.slug === domainSlug);
    if (!targetDomain) return;

    const list = type === 'main' ? [...targetDomain.mainServices] : [...targetDomain.moreServices];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(newIndex, 0, moved);

    const updated = servicesData.map((s) => {
      if (s.slug !== domainSlug) return s;
      return type === 'main' ? { ...s, mainServices: list } : { ...s, moreServices: list };
    });
    persistServices(updated);
  };

  // Image Upload helper (Supabase storage with local Data URL fallback)
  const uploadProjectImage = async (file) => {
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
          if (data?.publicUrl) {
            return data.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload error, using local fallback:', err);
      }
    }

    // Local Data URL fallback
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    });
  };

  // 3. Project Management
  const addProject = async (project) => {
    const newProj = {
      ...project,
      id: project.id || 'proj-' + Date.now(),
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
    const updated = [newProj, ...projectsData];
    persistProjects(updated);

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
        console.error('Supabase project insert error:', e);
      }
    }
  };

  const editProject = async (id, updatedFields) => {
    const updated = projectsData.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...updatedFields,
        domainColor:
          (updatedFields.domain || p.domain) === 'web'
            ? '#1d5cf0'
            : (updatedFields.domain || p.domain) === 'app'
            ? '#12a150'
            : '#7a2fd0',
        domainLabel:
          (updatedFields.domain || p.domain) === 'web'
            ? 'Web Development'
            : (updatedFields.domain || p.domain) === 'app'
            ? 'App Development'
            : 'AI Automation'
      };
    });
    persistProjects(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').update({
          title: updatedFields.title,
          domain: updatedFields.domain,
          client_category: updatedFields.clientCategory,
          short_description: updatedFields.shortDescription,
          technologies: updatedFields.technologies,
          metrics: updatedFields.metrics,
          image_url: updatedFields.image
        }).eq('id', id);
      } catch (e) {
        console.error('Supabase project update error:', e);
      }
    }
  };

  const deleteProject = async (id) => {
    const updated = projectsData.filter((p) => p.id !== id);
    persistProjects(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (e) {}
    }
  };

  // 4. Save Enquiry (Public form submission)
  const saveEnquiry = async ({ name, phone, service, message }) => {
    const newEnquiry = {
      id: 'enq-' + Date.now(),
      name,
      phone,
      service,
      message,
      status: 'New',
      created_at: new Date().toISOString()
    };

    const updated = [newEnquiry, ...enquiries];
    persistEnquiries(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('enquiries').insert({
          name,
          phone,
          service,
          message,
          status: 'New'
        });
      } catch (err) {
        console.warn('Could not insert enquiry to Supabase, saved locally:', err);
      }
    }
    return { success: true };
  };

  // 5. Update Enquiry Status (New -> Contacted -> Closed)
  const updateEnquiryStatus = async (id, newStatus) => {
    const updated = enquiries.map((e) =>
      e.id === id ? { ...e, status: newStatus } : e
    );
    persistEnquiries(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
      } catch (e) {
        console.error('Supabase enquiry status update error:', e);
      }
    }
  };

  // 6. Delete Enquiry
  const deleteEnquiry = async (id) => {
    const updated = enquiries.filter((e) => e.id !== id);
    persistEnquiries(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('enquiries').delete().eq('id', id);
      } catch (e) {}
    }
  };

  return (
    <DataContext.Provider
      value={{
        servicesData,
        projectsData,
        settingsData,
        enquiries,
        isLiveConnected,
        loading,
        updateDomainPrice,
        addServiceItem,
        editServiceItem,
        deleteServiceItem,
        reorderServiceItems,
        addProject,
        editProject,
        deleteProject,
        uploadProjectImage,
        saveEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        persistSettings
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
