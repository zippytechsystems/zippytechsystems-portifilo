/**
 * =========================================================================
 * ZippyTechSystems Pvt. Ltd. — Central Content Configuration
 * =========================================================================
 * All website text, services, prices, copy, and projects live in this single file.
 * Structured with i18n readiness so a Telugu version (e.g. content.te) can be
 * integrated seamlessly without touching any component logic.
 */

export const content = {
  // Localization Meta
  locale: 'en',
  supportedLocales: ['en', 'te'],

  // Company Information
  company: {
    name: 'ZippyTechSystems Pvt. Ltd.',
    shortName: 'ZippyTechSystems',
    legalName: 'ZippyTechSystems Pvt. Ltd.',
    tagline: 'Build • Automate • Grow',
    secondaryTagline: 'Smart Technology for a Stronger Tomorrow',
    headline: 'Websites, apps and AI for your business',
    subheadline:
      'Low budget, high value digital solutions for small and mid-size businesses in India. Fast delivery, reliable and secure, affordable pricing, full support.',
    positioning:
      'Low budget, high value digital solutions for small and mid-size businesses in India.',
    location: 'Hyderabad, Telangana, India',
    yearFounded: '2024',
    currenciesAccepted: 'INR',
    priceRange: '₹6,000 - ₹50,000'
  },

  // Founder & Direct Contact Person
  founder: {
    name: 'Lingaswamy',
    role: 'Founder & Solutions Architect',
    bio: 'Direct technical guidance without middlemen or inflated agency fees. Experienced in building practical web platforms, business accounting apps, and AI automations for growing Indian enterprises.',
    phone: '6302690251',
    phoneFormatted: '+91 63026 90251',
    phoneCall: '+916302690251',
    whatsappNumber: '916302690251',
    whatsappLink: 'https://wa.me/916302690251',
    email: 'contact@zippytechsystems.com'
  },

  // Social Media Links (Muted, optional-looking)
  social: {
    instagram: 'https://www.instagram.com/zippytechsystems',
    youtube: 'https://www.youtube.com/@zippytechsystems'
  },

  // Trust Points
  trustPoints: [
    {
      id: 'fast-delivery',
      title: 'Fast Delivery',
      shortText: 'Rapid turnaround in 48h to 7 days',
      description: 'Get your business live without frustrating delays. We ship tested code on strict schedules.',
      icon: 'Zap'
    },
    {
      id: 'reliable-secure',
      title: 'Reliable & Secure',
      shortText: '100% bug-tested, secure code & high uptime',
      description: 'Built on rock-solid architecture with SSL security, automated cloud backups, and data protection.',
      icon: 'ShieldCheck'
    },
    {
      id: 'affordable-pricing',
      title: 'Affordable Pricing',
      shortText: 'Transparent INR rates starting from ₹6,000',
      description: 'Low-budget, high-value packages designed specifically for small and mid-size businesses in India.',
      icon: 'BadgePercent'
    },
    {
      id: 'full-support',
      title: 'Full Support',
      shortText: 'Direct WhatsApp assistance & maintenance',
      description: 'Dedicated post-launch handholding, updates, and direct support from founder Lingaswamy.',
      icon: 'Headphones'
    }
  ],

  // Brand Colors
  brandColors: {
    navy: '#0b1b4a',
    blue: '#1d5cf0', // Web Domain
    green: '#12a150', // App Domain
    purple: '#7a2fd0', // AI Domain
    yellow: '#ffe500', // Highlight / Primary CTA
    lightBg: '#f6f9ff'
  },

  // 3 Service Domains (Rendered ONE BY ONE as separate full-width stacked sections)
  services: [
    {
      id: 'web-development',
      slug: 'web-development',
      domain: 'web',
      domainLabel: 'Web Development',
      badgeColor: '#1d5cf0',
      gradient: 'linear-gradient(135deg, #1d5cf0 0%, #3b82f6 100%)',
      introLine: 'A website that helps your business grow.',
      startingPrice: '₹7,000',
      startingPriceNum: 7000,
      priceNote: 'Starting price in INR',
      conceptCopy:
        'A good website brings your business online, builds trust, shows your services and products to customers 24 hours a day, and helps you get more enquiries and grow your business.',
      mainServicesTitle: 'Our Main Services',
      mainServices: [
        {
          title: 'Business Websites & Landing Pages',
          desc: 'High-converting, professional web pages that establish immediate credibility and capture customer enquiries.'
        },
        {
          title: 'Services / Products Showcase Websites',
          desc: 'Beautiful, visual catalog websites displaying your complete offerings, pricing, and client testimonials.'
        },
        {
          title: 'E-Commerce Business Websites',
          desc: 'Full online shopping stores with fast mobile checkout, UPI / Razorpay payment gateways, and order tracking.'
        },
        {
          title: 'Custom Domain & Hosting Setup',
          desc: 'Complete end-to-end setup of your custom .com / .in domain, high-speed cloud hosting, and free SSL certificate.'
        }
      ],
      moreServicesTitle: 'More Web Services We Provide',
      moreServices: [
        'Portfolio, restaurant, clinic, school and real estate websites',
        'Booking and appointment scheduling websites',
        'Website redesign and modernization',
        'Search Engine Optimization (SEO) & Google Business Profile setup',
        'Payment gateway integration (Razorpay, PhonePe, UPI)',
        'Ongoing website maintenance, security updates and yearly support'
      ],
      whatsappMessage:
        "Hi Lingaswamy, I'm interested in Web Development services starting from ₹7,000. I need a website for my business. Please share details.",
      icon: 'Globe'
    },
    {
      id: 'app-development',
      slug: 'app-development',
      domain: 'app',
      domainLabel: 'App Development',
      badgeColor: '#12a150',
      gradient: 'linear-gradient(135deg, #12a150 0%, #10b981 100%)',
      introLine: 'Ready-made business apps for shops, small or big.',
      startingPrice: '₹10,000',
      startingPriceNum: 10000,
      priceNote: 'Starting price in INR',
      conceptCopy:
        'We build accountant apps and business management apps for small and big shops. The app handles billing, accounts, stock and staff records automatically, so the shop owner can save the salary of a full-time accountant and still keep accurate accounts.',
      accountantCallout: {
        title: 'Save Accountant Salary',
        tagline: 'Run your shop accounts on autopilot without paying high monthly accountant retainers.',
        benefits: [
          'Less manual work: Automated billing, GST invoices, and daily ledger entries.',
          'Fewer calculation mistakes: Tamper-proof calculations for stock, discounts, and customer credit.',
          'Accounts available on your phone anytime: Check daily sales, cash in hand, and pending udhar 24/7.'
        ]
      },
      mainServicesTitle: 'Our Main Services',
      mainServices: [
        {
          title: 'Accountant App',
          desc: 'Automates daily khata, ledger entries, customer credit balance, GST invoicing, and financial reports.'
        },
        {
          title: 'Business Management App',
          desc: 'Centralized mobile management app tracking inventory, purchases, supplier payments, and shop operations.'
        },
        {
          title: 'E-Commerce Business App',
          desc: 'Dedicated Android & iOS shopping app for your shop with instant push notifications and fast checkout.'
        },
        {
          title: 'Staff Management App',
          desc: 'Digital staff attendance, overtime tracker, salary slip calculator, and daily staff shift roster.'
        }
      ],
      moreServicesTitle: 'More App Services We Provide',
      moreServices: [
        'Billing / POS and barcode inventory apps',
        'GST invoice & thermal receipt printing app',
        'CRM and customer loyalty management app',
        'Delivery partner and appointment booking apps',
        'School / college administration apps',
        'Google Play Store and Apple App Store publishing',
        'Continuous app maintenance, feature upgrades and bug fixes'
      ],
      whatsappMessage:
        "Hi Lingaswamy, I'm interested in App Development services starting from ₹10,000 for my shop/business. I would like to discuss my requirements.",
      icon: 'Smartphone'
    },
    {
      id: 'ai-automation',
      slug: 'ai-automation',
      domain: 'ai',
      domainLabel: 'AI Automation',
      badgeColor: '#7a2fd0',
      gradient: 'linear-gradient(135deg, #7a2fd0 0%, #9333ea 100%)',
      introLine: 'Never miss a customer enquiry again.',
      startingPrice: '₹6,000',
      startingPriceNum: 6000,
      priceNote: 'Starting price in INR',
      conceptCopy:
        'Enquiries are answered instantly on WhatsApp, phone and website even when the owner is busy or the shop is closed, so no lead is lost and more enquiries turn into customers.',
      mainServicesTitle: 'Our Main Services',
      mainServices: [
        {
          title: 'WhatsApp Automation',
          desc: 'Automatic replies to customers on WhatsApp, greeting new visitors, sharing catalogs, and qualifying leads.'
        },
        {
          title: 'AI Voice Agent',
          desc: 'Answers business enquiry calls intelligently, provides details, and schedules callbacks.'
        },
        {
          title: 'AI Chatbot for Your Website',
          desc: 'Handles customer enquiries 24x7 directly on your website and captures contact numbers.'
        },
        {
          title: 'Lead Management Automation',
          desc: 'Syncs incoming customer enquiries instantly to Google Sheets, CRM, and sales team phones.'
        },
        {
          title: 'Follow-Up Reminders',
          desc: 'Automated follow-up messages on WhatsApp for pending quotations and customer decisions.'
        },
        {
          title: 'Customer Support Automation',
          desc: 'Resolves frequent customer queries (timings, pricing, location, order status) without manual effort.'
        }
      ],
      moreServicesTitle: 'More AI & Automation Services We Provide',
      moreServices: [
        'Auto invoices and payment reminder workflows',
        'Email and social media inquiry automation',
        'Data entry and document processing automation',
        'AI content and marketing copy tools',
        'Google Sheets, Zoho, Excel and CRM integrations',
        'Custom AI agents tailored for your unique business operations'
      ],
      whatsappMessage:
        "Hi Lingaswamy, I'm interested in AI Automation starting from ₹6,000. I want to automate my customer enquiries and WhatsApp replies.",
      icon: 'Cpu'
    }
  ],

  // Projects / Portfolio Grid
  projects: [
    {
      id: 'saree-business-management-app',
      title: 'Saree Business Management & Accountant App',
      domain: 'app',
      domainLabel: 'App Development',
      domainColor: '#12a150',
      clientCategory: 'Textiles & Wholesale Retail',
      shortDescription:
        'Complete shop management app handling saree stock catalog, barcode billing, customer udhar khata, and automated GST invoice dispatch.',
      technologies: ['React Native', 'Android', 'Offline DB', 'Cloud Sync'],
      metrics: 'Save Full-Time Accountant Salary',
      image: '/projects/saree-app.svg'
    },
    {
      id: 'clinic-appointment-booking-portal',
      title: 'Clinic & Doctor Appointment Website',
      domain: 'web',
      domainLabel: 'Web Development',
      domainColor: '#1d5cf0',
      clientCategory: 'Healthcare & Medical',
      shortDescription:
        'Fast clinic website with online appointment booking, doctor profiles, Google Maps integration, and automated WhatsApp booking reminders.',
      technologies: ['React', 'Vite', 'SEO Schema', 'WhatsApp API'],
      metrics: '3x More Online Appointments',
      image: '/projects/clinic-web.svg'
    },
    {
      id: 'whatsapp-ai-lead-qualification-bot',
      title: '24/7 WhatsApp AI Customer Support & Lead Bot',
      domain: 'ai',
      domainLabel: 'AI Automation',
      domainColor: '#7a2fd0',
      clientCategory: 'Real Estate & Coaching',
      shortDescription:
        'Intelligent WhatsApp bot that replies instantly to customers 24 hours a day, qualifies buyer budget, and syncs leads directly to Google Sheets.',
      technologies: ['WhatsApp Cloud API', 'AI Agent', 'Google Sheets'],
      metrics: 'Instant Replies 24 Hours a Day',
      image: '/projects/whatsapp-ai.svg'
    },
    {
      id: 'fashion-ecommerce-store',
      title: 'Boutique E-Commerce Store with UPI Checkout',
      domain: 'web',
      domainLabel: 'Web Development',
      domainColor: '#1d5cf0',
      clientCategory: 'Fashion & Retail',
      shortDescription:
        'Fast mobile shopping website featuring catalog filtering, shopping cart, UPI payment integration (PhonePe/GPay), and WhatsApp order tracking.',
      technologies: ['React', 'Razorpay & UPI', 'Mobile First'],
      metrics: 'Sub-second Mobile Load Speed',
      image: '/projects/ecommerce-web.svg'
    },
    {
      id: 'staff-attendance-payroll-app',
      title: 'Staff Management & Geo-Fenced Attendance App',
      domain: 'app',
      domainLabel: 'App Development',
      domainColor: '#12a150',
      clientCategory: 'SME Operations & Manufacturing',
      shortDescription:
        'Mobile app allowing shop and factory staff to punch attendance with selfie and GPS verification, calculate overtime, and generate monthly salary slips.',
      technologies: ['Mobile App', 'GPS Verification', 'PDF Payslips'],
      metrics: 'Replaces Costly Biometric Machines',
      image: '/projects/staff-app.svg'
    },
    {
      id: 'automated-invoicing-followup-system',
      title: 'Automated Invoice Generation & WhatsApp Reminders',
      domain: 'ai',
      domainLabel: 'AI Automation',
      domainColor: '#7a2fd0',
      clientCategory: 'B2B Services & Trading',
      shortDescription:
        'Automated workflow connecting order forms to instant PDF invoice creation and automated WhatsApp payment reminders on overdue dates.',
      technologies: ['Cloud Pipeline', 'PDF Generator', 'WhatsApp API'],
      metrics: '95% Faster Payment Follow-ups',
      image: '/projects/invoice-ai.svg'
    }
  ],

  // Why Choose Us
  whyChooseUs: [
    {
      id: 'low-budget-high-value',
      title: 'Low Budget, High Value',
      description:
        'Enterprise-grade code and designs priced realistically for Indian small and mid-size businesses. No agency markups.',
      icon: 'TrendingUp'
    },
    {
      id: 'rapid-turnaround',
      title: 'Fast Delivery',
      description:
        'No multi-month delays. We deliver live websites in 48 hours to 7 days, and mobile applications in 2 to 3 weeks.',
      icon: 'Clock'
    },
    {
      id: 'direct-founder-access',
      title: 'Direct Access to Lingaswamy',
      description:
        'You speak directly with the founder and lead engineer. Direct WhatsApp access means quick decisions and zero miscommunications.',
      icon: 'UserCheck'
    },
    {
      id: 'full-support',
      title: 'Full Post-Launch Support',
      description:
        'We do not disappear after launch. We provide ongoing support, bug fixes, updates, and technical guidance.',
      icon: 'ShieldCheck'
    }
  ],

  // About Section & Story
  about: {
    missionTitle: 'Smart Technology for a Stronger Tomorrow',
    missionStatement:
      'We believe every shop owner, clinic, and growing enterprise in India deserves modern software that works smoothly, saves time, and does not cost a fortune.',
    story: [
      'ZippyTechSystems was founded by Lingaswamy to provide affordable, transparent, and high-quality software solutions specifically for Indian SMBs.',
      'Big agencies charge lakhs for basic setups, while generic templates fail when your business expands. We provide custom websites, business accountant apps, and WhatsApp AI automations that bring tangible value from day one.',
      'With direct founder communication on WhatsApp, honest starting prices (Web from ₹7k, App from ₹10k, AI from ₹6k), and rapid delivery, we partner with you for long-term growth.'
    ],
    milestones: [
      { number: '₹6,000', label: 'Starting Price in INR' },
      { number: '48h', label: 'Fastest Delivery Milestone' },
      { number: '100%', label: 'Direct Founder Line' },
      { number: '99.9%', label: 'Uptime & Reliability' }
    ]
  },

  // Navigation Links
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Web', path: '/#web-development' },
    { label: 'Apps', path: '/#app-development' },
    { label: 'AI Automation', path: '/#ai-automation' },
    { label: 'Portfolio', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ],

  // Footer Navigation
  footerLinks: {
    services: [
      { label: 'Web Development (from ₹7,000)', path: '/#web-development' },
      { label: 'App Development (from ₹10,000)', path: '/#app-development' },
      { label: 'AI Automation (from ₹6,000)', path: '/#ai-automation' }
    ],
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'All Projects', path: '/projects' },
      { label: 'About Founder Lingaswamy', path: '/about' },
      { label: 'Contact Us', path: '/contact' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' }
    ]
  }
};

/**
 * Helper to build custom WhatsApp URL with prefilled text
 */
export function buildWhatsAppUrl(message) {
  const base = `https://wa.me/${content.founder.whatsappNumber}`;
  const text = encodeURIComponent(message || "Hi Lingaswamy, I'd like to discuss a project with ZippyTechSystems.");
  return `${base}?text=${text}`;
}

/**
 * Helper to build enquiry form WhatsApp URL
 */
export function buildEnquiryWhatsAppUrl({ name, phone, service, message }) {
  const text = `*New Project Enquiry — ZippyTechSystems*
-----------------------------
👤 *Name:* ${name || 'N/A'}
📱 *Phone:* ${phone || 'N/A'}
🛠️ *Service Needed:* ${service || 'General Enquiry'}
💬 *Project Details:* ${message || 'I would like more information and a price quote.'}
-----------------------------
(Sent from zippytechsystems.com portfolio website)`;

  return buildWhatsAppUrl(text);
}
