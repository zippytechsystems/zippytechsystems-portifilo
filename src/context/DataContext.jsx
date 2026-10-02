import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { content as initialContent } from '../data/content';
import {
  formatINR,
  getDomains,
  updateDomainPriceApi,
  getServices,
  createServiceApi,
  updateServiceApi,
  deleteServiceApi,
  getPackages,
  createPackageApi,
  updatePackageApi,
  updatePackagePriceApi,
  deletePackageApi,
  getProjects,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  uploadProjectImageApi,
  getTestimonials,
  createTestimonialApi,
  updateTestimonialApi,
  deleteTestimonialApi,
  getFaqs,
  createFaqApi,
  updateFaqApi,
  deleteFaqApi,
  getSettings,
  updateSettingsApi,
  createEnquiry,
  getEnquiriesApi,
  updateEnquiryStatusApi,
  deleteEnquiryApi,
  getPriceHistoryApi
} from '../lib/api';

const DataContext = createContext();

export function DataProvider({ children }) {
  // State for all 7 dynamic entities + domains + price history
  const [domainsData, setDomainsData] = useState([
    { id: 'web', key: 'web', name: 'Web Development', starting_price: 7000, price_label: 'Starting from', color: '#1d5cf0' },
    { id: 'app', key: 'app', name: 'App Development', starting_price: 10000, price_label: 'Starting from', color: '#12a150' },
    { id: 'ai', key: 'ai', name: 'AI Automation', starting_price: 6000, price_label: 'Starting from', color: '#7a2fd0' }
  ]);

  const [servicesData, setServicesData] = useState(initialContent.services);
  const [packagesData, setPackagesData] = useState(initialContent.packages || []);
  const [projectsData, setProjectsData] = useState(initialContent.projects || []);
  const [testimonialsData, setTestimonialsData] = useState(initialContent.testimonials || []);
  const [faqsData, setFaqsData] = useState(initialContent.faqs || []);
  const [settingsData, setSettingsData] = useState({
    phone: initialContent.founder.phone,
    whatsappNumber: initialContent.founder.whatsappNumber,
    defaultWhatsAppMessage: 'Hi Lingaswamy, I visited ZippyTechSystems and would like to get a quote for my business.',
    tagline: initialContent.company.tagline,
    secondaryTagline: initialContent.company.secondaryTagline,
    location: initialContent.company.location,
    instagramUrl: initialContent.social?.instagram || 'https://www.instagram.com/zippytechsystems',
    youtubeUrl: initialContent.social?.youtube || 'https://www.youtube.com/@zippytechsystems'
  });
  const [enquiries, setEnquiries] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(isSupabaseConfigured);

  // Fetch all fresh data
  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [doms, srvs, pkgs, projs, tests, fqs, sttngs, enqs, phist] = await Promise.all([
        getDomains(),
        getServices(),
        getPackages(),
        getProjects(),
        getTestimonials(),
        getFaqs(),
        getSettings(),
        getEnquiriesApi(),
        getPriceHistoryApi()
      ]);

      if (doms && doms.length > 0) setDomainsData(doms);
      if (srvs && srvs.length > 0) setServicesData(srvs);
      if (pkgs && pkgs.length > 0) setPackagesData(pkgs);
      if (projs && projs.length > 0) setProjectsData(projs);
      if (tests && tests.length > 0) setTestimonialsData(tests);
      if (fqs && fqs.length > 0) setFaqsData(fqs);
      if (sttngs) setSettingsData(sttngs);
      if (enqs) setEnquiries(enqs);
      if (phist) setPriceHistory(phist);

      setIsLiveConnected(isSupabaseConfigured && Boolean(supabase));
    } catch (err) {
      console.warn('DataContext synchronization warning:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Realtime Subscriptions: Auto-update live website on changes to domains, packages, settings
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel('zippy_live_website_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'domains' },
        async () => {
          const freshDomains = await getDomains();
          setDomainsData(freshDomains);
          const freshServices = await getServices();
          setServicesData(freshServices);
          const freshHistory = await getPriceHistoryApi();
          setPriceHistory(freshHistory);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'packages' },
        async () => {
          const freshPkgs = await getPackages();
          setPackagesData(freshPkgs);
          const freshHistory = await getPriceHistoryApi();
          setPriceHistory(freshHistory);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        async () => {
          const freshSettings = await getSettings();
          setSettingsData(freshSettings);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services' },
        async () => {
          const freshServices = await getServices();
          setServicesData(freshServices);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        async () => {
          const freshProjs = await getProjects();
          setProjectsData(freshProjs);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'testimonials' },
        async () => {
          const freshTests = await getTestimonials();
          setTestimonialsData(freshTests);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'faqs' },
        async () => {
          const freshFaqs = await getFaqs();
          setFaqsData(freshFaqs);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enquiries' },
        async () => {
          const freshEnqs = await getEnquiriesApi();
          setEnquiries(freshEnqs);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helper: Retrieve formatted price for any domain ('web', 'app', 'ai')
  const getDomainPrice = (key) => {
    const d = domainsData.find((item) => item.key === key || item.id === key);
    if (!d) {
      if (key === 'web') return '₹7,000';
      if (key === 'app') return '₹10,000';
      if (key === 'ai') return '₹6,000';
      return '₹7,000';
    }
    return formatINR(d.starting_price);
  };

  const getDomainPriceNum = (key) => {
    const d = domainsData.find((item) => item.key === key || item.id === key);
    if (!d) {
      if (key === 'web') return 7000;
      if (key === 'app') return 10000;
      if (key === 'ai') return 6000;
      return 7000;
    }
    return Number(d.starting_price) || 0;
  };

  // -------------------------------------------------------------
  // Prices Tab Actions
  // -------------------------------------------------------------
  const updateDomainPrice = async (domainId, newPrice) => {
    const numeric = Math.max(0, Number(newPrice) || 0);
    // Optimistic local update
    setDomainsData((prev) =>
      prev.map((d) => (d.id === domainId || d.key === domainId ? { ...d, starting_price: numeric } : d))
    );
    setServicesData((prev) =>
      prev.map((s) => (s.domain === domainId ? { ...s, startingPrice: formatINR(numeric), startingPriceNum: numeric } : s))
    );

    const res = await updateDomainPriceApi(domainId, numeric);
    const hist = await getPriceHistoryApi();
    setPriceHistory(hist);
    return res;
  };

  const updatePackagePrice = async (packageId, newPrice) => {
    const numeric = Math.max(0, Number(newPrice) || 0);
    setPackagesData((prev) =>
      prev.map((p) => (p.id === packageId ? { ...p, price: formatINR(numeric), priceNum: numeric } : p))
    );

    const res = await updatePackagePriceApi(packageId, numeric);
    const hist = await getPriceHistoryApi();
    setPriceHistory(hist);
    return res;
  };

  const saveAllPrices = async (domainPricesObj, packagePricesObj) => {
    const promises = [];
    Object.entries(domainPricesObj).forEach(([dId, price]) => {
      promises.push(updateDomainPrice(dId, price));
    });
    Object.entries(packagePricesObj).forEach(([pkgId, price]) => {
      promises.push(updatePackagePrice(pkgId, price));
    });
    await Promise.all(promises);
    const hist = await getPriceHistoryApi();
    setPriceHistory(hist);
    return { success: true };
  };

  // -------------------------------------------------------------
  // Services Actions
  // -------------------------------------------------------------
  const addServiceItem = async (domainKey, type, name, description = '') => {
    const res = await createServiceApi({
      domain_id: domainKey,
      name,
      description,
      type,
      sort_order: 99
    });
    const fresh = await getServices();
    setServicesData(fresh);
    return res;
  };

  const editServiceItem = async (serviceId, updates) => {
    const res = await updateServiceApi(serviceId, updates);
    const fresh = await getServices();
    setServicesData(fresh);
    return res;
  };

  const deleteServiceItem = async (serviceId) => {
    const res = await deleteServiceApi(serviceId);
    const fresh = await getServices();
    setServicesData(fresh);
    return res;
  };

  // -------------------------------------------------------------
  // Packages Actions
  // -------------------------------------------------------------
  const addPackage = async (payload) => {
    const res = await createPackageApi(payload);
    const fresh = await getPackages();
    setPackagesData(fresh);
    return res;
  };

  const editPackage = async (packageId, payload) => {
    const res = await updatePackageApi(packageId, payload);
    const fresh = await getPackages();
    setPackagesData(fresh);
    return res;
  };

  const deletePackage = async (packageId) => {
    const res = await deletePackageApi(packageId);
    const fresh = await getPackages();
    setPackagesData(fresh);
    return res;
  };

  // -------------------------------------------------------------
  // Portfolio Actions
  // -------------------------------------------------------------
  const addProject = async (payload) => {
    const res = await createProjectApi(payload);
    const fresh = await getProjects();
    setProjectsData(fresh);
    return res;
  };

  const editProject = async (projectId, payload) => {
    const res = await updateProjectApi(projectId, payload);
    const fresh = await getProjects();
    setProjectsData(fresh);
    return res;
  };

  const deleteProject = async (projectId) => {
    const res = await deleteProjectApi(projectId);
    const fresh = await getProjects();
    setProjectsData(fresh);
    return res;
  };

  const uploadProjectImage = async (file) => {
    return await uploadProjectImageApi(file);
  };

  // -------------------------------------------------------------
  // Testimonials Actions
  // -------------------------------------------------------------
  const addTestimonial = async (payload) => {
    const res = await createTestimonialApi(payload);
    const fresh = await getTestimonials();
    setTestimonialsData(fresh);
    return res;
  };

  const editTestimonial = async (id, payload) => {
    const res = await updateTestimonialApi(id, payload);
    const fresh = await getTestimonials();
    setTestimonialsData(fresh);
    return res;
  };

  const deleteTestimonial = async (id) => {
    const res = await deleteTestimonialApi(id);
    const fresh = await getTestimonials();
    setTestimonialsData(fresh);
    return res;
  };

  // -------------------------------------------------------------
  // FAQs Actions
  // -------------------------------------------------------------
  const addFaq = async (payload) => {
    const res = await createFaqApi(payload);
    const fresh = await getFaqs();
    setFaqsData(fresh);
    return res;
  };

  const editFaq = async (id, payload) => {
    const res = await updateFaqApi(id, payload);
    const fresh = await getFaqs();
    setFaqsData(fresh);
    return res;
  };

  const deleteFaq = async (id) => {
    const res = await deleteFaqApi(id);
    const fresh = await getFaqs();
    setFaqsData(fresh);
    return res;
  };

  // -------------------------------------------------------------
  // Settings Actions
  // -------------------------------------------------------------
  const persistSettings = async (data) => {
    setSettingsData(data);
    return await updateSettingsApi(data);
  };

  // -------------------------------------------------------------
  // Enquiries Actions
  // -------------------------------------------------------------
  const saveEnquiry = async (data) => {
    const res = await createEnquiry(data);
    if (res.data) {
      setEnquiries((prev) => [res.data, ...prev]);
    }
    return res;
  };

  const updateEnquiryStatus = async (id, status) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    return await updateEnquiryStatusApi(id, status);
  };

  const deleteEnquiry = async (id) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    return await deleteEnquiryApi(id);
  };

  // CSV Export for Enquiries
  const exportEnquiriesCSV = () => {
    if (!enquiries || enquiries.length === 0) return false;

    const headers = ['ID', 'Date', 'Name', 'Phone', 'Service', 'Message', 'Status', 'Source'];
    const rows = enquiries.map((enq) => [
      enq.id,
      new Date(enq.created_at).toLocaleString('en-IN'),
      `"${(enq.name || '').replace(/"/g, '""')}"`,
      `"${enq.phone || ''}"`,
      `"${(enq.service || '').replace(/"/g, '""')}"`,
      `"${(enq.message || '').replace(/"/g, '""')}"`,
      enq.status || 'New',
      enq.source || 'contact'
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zippy_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  };

  return (
    <DataContext.Provider
      value={{
        domainsData,
        servicesData,
        packagesData,
        projectsData,
        testimonialsData,
        faqsData,
        settingsData,
        enquiries,
        priceHistory,
        loading,
        isLiveConnected,
        loadAllData,
        formatINR,
        getDomainPrice,
        getDomainPriceNum,
        updateDomainPrice,
        updatePackagePrice,
        saveAllPrices,
        addServiceItem,
        editServiceItem,
        deleteServiceItem,
        addPackage,
        editPackage,
        deletePackage,
        addProject,
        editProject,
        deleteProject,
        uploadProjectImage,
        addTestimonial,
        editTestimonial,
        deleteTestimonial,
        addFaq,
        editFaq,
        deleteFaq,
        persistSettings,
        saveEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        exportEnquiriesCSV
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
