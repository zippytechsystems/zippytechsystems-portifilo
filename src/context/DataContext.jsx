import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { content as initialContent } from '../data/content';
import {
  getServices,
  getProjects,
  getSettings,
  createEnquiry,
  getEnquiriesApi,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  updateDomainPriceApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  uploadProjectImageApi,
  updateEnquiryStatusApi,
  deleteEnquiryApi,
  updateSettingsApi,
  getTestimonials,
  createTestimonialApi,
  updateTestimonialApi,
  deleteTestimonialApi,
  getFaqs,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi,
  getPackages,
  createPackageApi,
  updatePackageApi,
  deletePackageApi
} from '../lib/api';

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

  const [testimonialsData, setTestimonialsData] = useState(() => {
    try {
      const cached = localStorage.getItem('zippy_local_testimonials');
      return cached ? JSON.parse(cached) : initialContent.testimonials || [];
    } catch {
      return initialContent.testimonials || [];
    }
  });

  const [faqsData, setFaqsData] = useState(() => {
    try {
      const cached = localStorage.getItem('zippy_local_faqs');
      return cached ? JSON.parse(cached) : initialContent.faqs || [];
    } catch {
      return initialContent.faqs || [];
    }
  });

  const [packagesData, setPackagesData] = useState(() => {
    try {
      const cached = localStorage.getItem('zippy_local_packages');
      return cached ? JSON.parse(cached) : initialContent.packages || [];
    } catch {
      return initialContent.packages || [];
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
            phoneCall: initialContent.founder.phoneCall,
            whatsappNumber: initialContent.founder.whatsappNumber,
            defaultWhatsAppMessage: 'Hi Lingaswamy, I visited ZippyTechSystems and would like to get a quote for my business.',
            tagline: initialContent.company.tagline,
            secondaryTagline: initialContent.company.secondaryTagline,
            location: initialContent.company.location,
            instagramUrl: initialContent.social?.instagram || 'https://www.instagram.com/zippytechsystems',
            youtubeUrl: initialContent.social?.youtube || 'https://www.youtube.com/@zippytechsystems'
          };
    } catch {
      return {
        phone: initialContent.founder.phone,
        phoneFormatted: initialContent.founder.phoneFormatted,
        phoneCall: initialContent.founder.phoneCall,
        whatsappNumber: initialContent.founder.whatsappNumber,
        defaultWhatsAppMessage: 'Hi Lingaswamy, I visited ZippyTechSystems and would like to get a quote for my business.',
        tagline: initialContent.company.tagline,
        secondaryTagline: initialContent.company.secondaryTagline,
        location: initialContent.company.location,
        instagramUrl: initialContent.social?.instagram || 'https://www.instagram.com/zippytechsystems',
        youtubeUrl: initialContent.social?.youtube || 'https://www.youtube.com/@zippytechsystems'
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

  const [isLiveConnected, setIsLiveConnected] = useState(isSupabaseConfigured);
  const [loading, setLoading] = useState(false);

  // Sync data on mount via API layer
  useEffect(() => {
    let mounted = true;
    async function loadAllData() {
      setLoading(true);
      try {
        const [services, projects, settings, enqs, tests, faqs, pkgs] = await Promise.all([
          getServices(),
          getProjects(),
          getSettings(),
          getEnquiriesApi(),
          getTestimonials(),
          getFaqs(),
          getPackages()
        ]);

        if (mounted) {
          if (services && services.length > 0) setServicesData(services);
          if (projects && projects.length > 0) setProjectsData(projects);
          if (settings) setSettingsData(settings);
          if (enqs && enqs.length > 0) setEnquiries(enqs);
          if (tests && tests.length > 0) setTestimonialsData(tests);
          if (faqs && faqs.length > 0) setFaqsData(faqs);
          if (pkgs && pkgs.length > 0) setPackagesData(pkgs);
          setIsLiveConnected(isSupabaseConfigured);
        }
      } catch (err) {
        console.warn('DataContext: API synchronization fallback active.', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAllData();
    return () => {
      mounted = false;
    };
  }, []);

  // Persistence helpers
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

  const persistSettings = async (data) => {
    setSettingsData(data);
    try {
      localStorage.setItem('zippy_local_settings', JSON.stringify(data));
    } catch {}
    await updateSettingsApi(data);
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
    await updateDomainPriceApi(domainSlug, newPrice);
  };

  // 2. Add Service
  const addServiceItem = async (domainSlug, type, title, desc = '') => {
    const updated = servicesData.map((s) => {
      if (s.slug !== domainSlug) return s;
      if (type === 'main') {
        return {
          ...s,
          mainServices: [...(s.mainServices || []), { title, desc }]
        };
      } else {
        return {
          ...s,
          moreServices: [...(s.moreServices || []), title]
        };
      }
    });
    persistServices(updated);
    await createServiceApi({ domain_id: domainSlug, type, title, description: desc });
  };

  // 3. Edit Service
  const editServiceItem = async (domainSlug, type, index, updatedItem) => {
    let oldTitle = '';
    const updated = servicesData.map((s) => {
      if (s.slug !== domainSlug) return s;
      if (type === 'main') {
        const list = [...s.mainServices];
        oldTitle = list[index]?.title || '';
        list[index] = { title: updatedItem.title, desc: updatedItem.desc || '' };
        return { ...s, mainServices: list };
      } else {
        const list = [...s.moreServices];
        oldTitle = list[index] || '';
        list[index] = updatedItem.title;
        return { ...s, moreServices: list };
      }
    });
    persistServices(updated);
    await updateServiceApi(domainSlug, type, oldTitle || updatedItem.title, updatedItem);
  };

  // 4. Delete Service
  const deleteServiceItem = async (domainSlug, type, indexOrTitle) => {
    let titleToDelete = typeof indexOrTitle === 'string' ? indexOrTitle : '';
    const updated = servicesData.map((s) => {
      if (s.slug !== domainSlug) return s;
      if (type === 'main') {
        const list = s.mainServices.filter((item, idx) => {
          if (typeof indexOrTitle === 'number') {
            if (idx === indexOrTitle) titleToDelete = item.title;
            return idx !== indexOrTitle;
          }
          return item.title !== indexOrTitle;
        });
        return { ...s, mainServices: list };
      } else {
        const list = s.moreServices.filter((t, idx) => {
          if (typeof indexOrTitle === 'number') {
            if (idx === indexOrTitle) titleToDelete = t;
            return idx !== indexOrTitle;
          }
          return t !== indexOrTitle;
        });
        return { ...s, moreServices: list };
      }
    });
    persistServices(updated);
    await deleteServiceApi(domainSlug, type, titleToDelete);
  };

  // 5. Reorder Services
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

  // 6. Project Management
  const addProject = async (project) => {
    const created = await createProjectApi(project);
    const updated = [created, ...projectsData];
    persistProjects(updated);
    return created;
  };

  const editProject = async (id, updatedFields) => {
    const updated = projectsData.map((p) => {
      if (p.id !== id) return p;
      return { ...p, ...updatedFields };
    });
    persistProjects(updated);
    await updateProjectApi(id, updatedFields);
  };

  const deleteProject = async (id) => {
    const updated = projectsData.filter((p) => p.id !== id);
    persistProjects(updated);
    await deleteProjectApi(id);
  };

  const uploadProjectImage = async (file) => {
    return await uploadProjectImageApi(file);
  };

  // 7. Enquiries Management
  const saveEnquiry = async ({ name, phone, service, message }) => {
    const res = await createEnquiry({ name, phone, service, message });
    if (res.success && res.enquiry) {
      persistEnquiries([res.enquiry, ...enquiries]);
    }
    return res;
  };

  const updateEnquiryStatus = async (id, newStatus) => {
    const updated = enquiries.map((e) =>
      e.id === id ? { ...e, status: newStatus } : e
    );
    persistEnquiries(updated);
    await updateEnquiryStatusApi(id, newStatus);
  };

  const deleteEnquiry = async (id) => {
    const updated = enquiries.filter((e) => e.id !== id);
    persistEnquiries(updated);
    await deleteEnquiryApi(id);
  };

  // 8. Testimonials Management
  const persistTestimonials = (data) => {
    setTestimonialsData(data);
    try {
      localStorage.setItem('zippy_local_testimonials', JSON.stringify(data));
    } catch {}
  };

  const addTestimonial = async (item) => {
    const created = await createTestimonialApi(item);
    persistTestimonials([...testimonialsData, created]);
    return created;
  };

  const editTestimonial = async (id, updates) => {
    const updated = testimonialsData.map((t) => (t.id === id ? { ...t, ...updates } : t));
    persistTestimonials(updated);
    await updateTestimonialApi(id, updates);
  };

  const deleteTestimonial = async (id) => {
    const updated = testimonialsData.filter((t) => t.id !== id);
    persistTestimonials(updated);
    await deleteTestimonialApi(id);
  };

  // 9. FAQs Management
  const persistFaqs = (data) => {
    setFaqsData(data);
    try {
      localStorage.setItem('zippy_local_faqs', JSON.stringify(data));
    } catch {}
  };

  const addFaq = async (item) => {
    const created = await createFaqApi(item);
    persistFaqs([...faqsData, created]);
    return created;
  };

  const editFaq = async (id, updates) => {
    const updated = faqsData.map((f) => (f.id === id ? { ...f, ...updates } : f));
    persistFaqs(updated);
    await updateFaqApi(id, updates);
  };

  const deleteFaq = async (id) => {
    const updated = faqsData.filter((f) => f.id !== id);
    persistFaqs(updated);
    await deleteFaqApi(id);
  };

  // 10. Packages Management
  const persistPackages = (data) => {
    setPackagesData(data);
    try {
      localStorage.setItem('zippy_local_packages', JSON.stringify(data));
    } catch {}
  };

  const addPackage = async (item) => {
    const created = await createPackageApi(item);
    persistPackages([...packagesData, created]);
    return created;
  };

  const editPackage = async (id, updates) => {
    const updated = packagesData.map((p) => (p.id === id ? { ...p, ...updates } : p));
    persistPackages(updated);
    await updatePackageApi(id, updates);
  };

  const deletePackage = async (id) => {
    const updated = packagesData.filter((p) => p.id !== id);
    persistPackages(updated);
    await deletePackageApi(id);
  };

  return (
    <DataContext.Provider
      value={{
        servicesData,
        projectsData,
        testimonialsData,
        faqsData,
        packagesData,
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
        persistSettings,
        addTestimonial,
        editTestimonial,
        deleteTestimonial,
        addFaq,
        editFaq,
        deleteFaq,
        addPackage,
        editPackage,
        deletePackage
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
