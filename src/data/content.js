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
    priceRange: '₹6,500+'
  },

  // Founder & Direct Contact Person
  founder: {
    name: 'Lingaswamy Maddeboina',
    role: 'Founder & Solutions Architect',
    bio: 'Direct technical guidance without middlemen or inflated agency fees. Experienced in building practical web platforms, business accounting apps, and AI automations for growing Indian enterprises.',
    phone: '6302690251',
    phoneFormatted: '+91 63026 90251',
    phoneCall: '+916302690251',
    whatsappNumber: '916302690251',
    whatsappLink: 'https://wa.me/916302690251',
    email: 'contact@zippysoftwares.in'
  },

  // Social Media Links (Muted, optional-looking)
  social: {
    instagram: 'https://www.instagram.com/zippytechsystems',
    youtube: 'https://www.youtube.com/@zippytechsystems'
  },

  // Trust Points (Used for Bento Grid and Hero pillars with zero fabricated stats)
  trustPoints: [
    {
      id: 'fast-delivery',
      title: 'Fast Delivery',
      shortText: 'Rapid turnaround without delays',
      description: 'Get your business live quickly without frustrating delays. We ship clean, tested code on clear schedules.',
      icon: 'Zap'
    },
    {
      id: 'reliable-secure',
      title: 'Reliable and Secure',
      shortText: 'Bug-tested code & cloud protection',
      description: 'Built on rock-solid architecture with SSL security, automated cloud backups, and data protection.',
      icon: 'ShieldCheck'
    },
    {
      id: 'affordable-pricing',
      title: 'Affordable Pricing',
      shortText: 'Transparent rates for Indian businesses',
      description: 'Low-budget, high-value packages designed specifically for small and mid-size businesses in India.',
      icon: 'BadgePercent'
    },
    {
      id: 'full-support',
      title: 'Full Support',
      shortText: 'Direct WhatsApp assistance & care',
      description: 'Dedicated post-launch guidance, regular updates, and direct founder support whenever you need help.',
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
      domainLabel: 'Web Development Services',
      badgeColor: '#1d5cf0',
      gradient: 'linear-gradient(135deg, #1d5cf0 0%, #3b82f6 100%)',
      introLine: 'Business Websites, Product Showcases & High-Converting Landing Pages.',
      startingPrice: '₹6,500',
      startingPriceNum: 6500,
      priceNote: 'Starting price in INR',
      conceptCopy:
        'A high-performance website brings your business online, builds instant customer trust, showcases your products and services 24 hours a day, and turns visitors into high-paying enquiries.',
      mainServicesTitle: 'Our Core Web Offerings',
      mainServices: [
        {
          title: 'Business Websites / Landing Page',
          desc: 'High-converting, mobile-responsive web pages that establish immediate credibility and capture direct customer enquiries.'
        },
        {
          title: 'Services / Products Showcase Website',
          desc: 'Visual, high-resolution product and service catalogs with instant WhatsApp inquiry triggers and customer reviews.'
        },
        {
          title: 'E-commerce Business Website',
          desc: 'Full online store with seamless mobile shopping, shopping cart, UPI & card payments (Razorpay/PhonePe), and order alerts.'
        },
        {
          title: 'Custom Domain & Hosting Setup',
          desc: 'Complete end-to-end setup of your custom .com / .in domain, high-speed secure cloud hosting, and lifetime SSL certificate.'
        }
      ],
      moreServicesTitle: 'More Web Development Capabilities',
      moreServices: [
        'Portfolio, clinic, showroom, restaurant, school and real estate websites',
        'Direct WhatsApp chat integration & click-to-call buttons',
        'Search Engine Optimization (SEO) & Google Business Profile verification',
        'Website redesign, modernization and mobile optimization',
        'Payment gateway integration (PhonePe, Google Pay, Paytm, UPI)',
        'Ongoing website maintenance, regular backups and technical support'
      ],
      whatsappMessage:
        "Hi Lingaswamy, I am interested in Web Development Services starting from ₹6,500. I need a website for my business. Please share details.",
      icon: 'Globe'
    },
    {
      id: 'app-development',
      slug: 'app-development',
      domain: 'app',
      domainLabel: 'App Development Services',
      badgeColor: '#12a150',
      gradient: 'linear-gradient(135deg, #12a150 0%, #10b981 100%)',
      introLine: 'Custom Business Management & Accountant Apps for Small & Big Enterprises.',
      startingPrice: '₹20,000',
      startingPriceNum: 20000,
      priceNote: 'Starting price in INR',
      conceptCopy:
        'We build custom accountant apps and business management software that automate billing, inventory, ledgers, and staff records. Save the monthly salary of a full-time accountant while keeping 100% accurate accounts on your phone.',
      accountantCallout: {
        title: 'Save Full-Time Accountant Salary',
        tagline: 'Run your shop accounts on autopilot without paying high monthly accountant retainers.',
        benefits: [
          'Less manual work: Automated billing, GST invoices, and daily customer udhar ledger entries.',
          'Fewer calculation mistakes: Tamper-proof calculations for stock, discounts, and customer credit.',
          'Accounts on your phone 24/7: Check daily sales, cash in hand, and pending collections from anywhere.'
        ]
      },
      mainServicesTitle: 'Our Core App Offerings',
      mainServices: [
        {
          title: 'Accountant App',
          desc: 'Automates daily billing, customer credit (udhar khata), automated GST invoices, and instant financial reports on mobile.'
        },
        {
          title: 'Business Management App',
          desc: 'Centralized mobile management app tracking inventory, purchases, supplier payments, and overall shop operations.'
        },
        {
          title: 'E-commerce Business App',
          desc: 'Dedicated Android app for your business with instant push notifications, order tracking, and mobile checkout.'
        },
        {
          title: 'Staff Management App',
          desc: 'Digital staff selfie attendance with GPS verification, overtime tracker, shift timings, and monthly salary slips.'
        },
        {
          title: 'Custom App Development',
          desc: 'Tailor-made Android and tablet applications built precisely for your unique business workflows and store requirements.'
        }
      ],
      moreServicesTitle: 'More App Development Capabilities',
      moreServices: [
        'Billing / POS with camera and handheld barcode scanner lookup',
        'GST & non-GST thermal receipt and invoice printing',
        'Multi-user access control (Owner, Cashier, Inventory Staff)',
        'Offline-first architecture with automatic background cloud sync',
        'Google Play Store publishing and deployment support',
        'Continuous app maintenance, feature upgrades and bug fixes'
      ],
      whatsappMessage:
        "Hi Lingaswamy, I am interested in App Development Services starting from ₹20,000 for my business/shop. I would like to discuss my requirements.",
      icon: 'Smartphone'
    },
    {
      id: 'ai-automation',
      slug: 'ai-automation',
      domain: 'ai',
      domainLabel: 'AI Agent Development Services',
      badgeColor: '#7a2fd0',
      gradient: 'linear-gradient(135deg, #7a2fd0 0%, #9333ea 100%)',
      introLine: 'Smart 24×7 Customer Support AI Chatbots & WhatsApp Automation.',
      startingPrice: '₹7,500',
      startingPriceNum: 7500,
      priceNote: 'Starting price in INR',
      conceptCopy:
        'Never lose a customer lead after hours. Our intelligent AI agents answer customer enquiries 24×7 on WhatsApp and your website, share catalogs, qualify budgets, and book meetings automatically.',
      mainServicesTitle: 'Our Core AI Agent Offerings',
      mainServices: [
        {
          title: 'Smart Support 24×7 AI Chatbot',
          desc: 'Intelligent AI chatbot trained on your business products and pricing, answering customer enquiries 24 hours a day.'
        },
        {
          title: 'WhatsApp Automation',
          desc: 'Instant replies on WhatsApp, automatic greeting of new leads, catalog & price list sharing, and contact capture.'
        },
        {
          title: 'Lead Management Automation',
          desc: 'Captures and qualifies incoming leads, syncing phone numbers and requirements instantly to Google Sheets and CRM.'
        },
        {
          title: 'Follow-up Reminders',
          desc: 'Automated follow-up messages sent to prospective customers for pending quotes and decision closures.'
        },
        {
          title: 'Customer Support Automation',
          desc: 'Resolves frequent customer queries (pricing, timings, location, order status) with zero human intervention.'
        },
        {
          title: 'AI Voice Agent',
          desc: 'Answers incoming business telephone enquiry calls intelligently, logs customer needs, and schedules callbacks.'
        }
      ],
      moreServicesTitle: 'More AI & Automation Capabilities',
      moreServices: [
        'Automated GST invoice generation & WhatsApp payment reminder workflows',
        'Social media & website inquiry qualification automation',
        'Google Sheets, Excel, Zoho, and WhatsApp Business API integrations',
        'Custom AI prompts and knowledge base tuning for your business',
        'Weekly analytics on customer queries, popular products, and lead conversions'
      ],
      whatsappMessage:
        "Hi Lingaswamy, I am interested in AI Agent Development Services starting from ₹7,500. I want to automate my customer enquiries and WhatsApp replies.",
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
      'With direct founder communication on WhatsApp, honest starting prices (Web from ₹6.5k, App from ₹20k, AI from ₹7.5k), and rapid delivery, we partner with you for long-term growth.'
    ],
    milestones: [
      { number: '₹6,500', label: 'Starting Price in INR' },
      { number: '48h', label: 'Fastest Delivery Milestone' },
      { number: '100%', label: 'Direct Founder Line' },
      { number: '99.9%', label: 'Uptime & Reliability' }
    ]
  },

  // Client Testimonials
  testimonials: [
    {
      id: 'test-1',
      clientName: 'Dr. Ramesh Reddy',
      roleOrCompany: 'Reddy Multi-Specialty Dental Clinic, Hyderabad',
      domain: 'web',
      rating: 5,
      content: 'Lingaswamy built our clinic showcase website in just 4 days. Patients can now easily view treatments, doctors, and book appointments directly on WhatsApp. Super fast delivery and extremely affordable!'
    },
    {
      id: 'test-2',
      clientName: 'Suresh Patel',
      roleOrCompany: 'Patel Wholesale Electricals, Secunderabad',
      domain: 'app',
      rating: 5,
      content: 'The custom billing and stock app replaced our expensive accounting software. We save at least ₹18,000 every month on accountant salaries, and I can check my shop daily sales on my phone from anywhere.'
    },
    {
      id: 'test-3',
      clientName: 'Vikram Varma',
      roleOrCompany: 'Varma Logistics & Transport, Vijayawada',
      domain: 'ai',
      rating: 5,
      content: 'The 24/7 WhatsApp AI automation handles late-night freight rate queries instantly. We turned 35% more leads into booked orders within the first month itself.'
    },
    {
      id: 'test-4',
      clientName: 'Ananya Sharma',
      roleOrCompany: 'TrendBoutique Ethnic Studio, Bangalore',
      domain: 'web',
      rating: 5,
      content: 'Great design aesthetic, mobile responsive, and honest pricing. Lingaswamy is always available on phone and WhatsApp without any corporate bureaucracy.'
    }
  ],

  // Frequently Asked Questions
  faqs: [
    {
      id: 'faq-1',
      category: 'General',
      question: 'What makes ZippyTechSystems different from other agencies in India?',
      answer: 'We eliminate bloated agency overhead and middleman layers. You communicate directly with founder Lingaswamy on WhatsApp or call. We provide transparent starting prices (Web from ₹6.5k, App from ₹20k, AI from ₹7.5k) and deliver production-ready software in 48 hours to 7 days.'
    },
    {
      id: 'faq-2',
      category: 'Web',
      question: 'What is included in the ₹6,500 Web Development starting package?',
      answer: 'It includes a modern responsive business website, custom domain connection, lightning-fast cloud hosting setup, mobile optimization, WhatsApp direct integration, contact form, and Google Search Console/SEO basics.'
    },
    {
      id: 'faq-3',
      category: 'App',
      question: 'How does your business app help save on accountant salaries?',
      answer: 'Our custom mobile & web applications automate day-to-day billing, GST invoice generation, thermal print receipts, customer udhar (credit ledger), and stock levels. Because calculations and reports are automated and tamper-proof, shop owners do not need to hire a full-time accountant for daily entries.'
    },
    {
      id: 'faq-4',
      category: 'AI',
      question: 'How does WhatsApp AI Automation work when our shop is closed?',
      answer: 'Our AI agent connects to your WhatsApp business number. When a customer messages at night or during peak rush hours, the AI answers product questions, shares price lists or catalogs, collects their requirements, and syncs their phone number to your dashboard or Google Sheet.'
    },
    {
      id: 'faq-5',
      category: 'General',
      question: 'What are your payment terms and milestones?',
      answer: 'We work with clear, risk-free milestones: a small advance to initiate the architecture and wireframing, milestone reviews where you inspect the live demo, and final payment upon your 100% satisfaction and handover.'
    },
    {
      id: 'faq-6',
      category: 'General',
      question: 'Do you offer ongoing support and maintenance?',
      answer: 'Yes! All projects come with 30 days of complimentary post-launch support. Afterward, we provide affordable yearly maintenance packages covering security updates, server monitoring, backups, and feature tweaks.'
    }
  ],

  // Solution Packages
  packages: [
    {
      id: 'pkg-web-starter',
      domain: 'web',
      name: 'Business Websites / Landing Page',
      price: '₹6,500',
      tagline: 'High-converting business website with custom domain & hosting',
      deliverables: [
        'Business Websites / Landing Page',
        'Services / Products Showcase Website',
        'E-commerce Business Website & UPI Payments',
        'Custom Domain, Cloud Hosting & Free SSL',
        'Direct WhatsApp Chat & Click-to-Call CTAs',
        '48 Hours to 7 Days Fast Delivery'
      ],
      popular: false
    },
    {
      id: 'pkg-web-business',
      domain: 'web',
      name: 'E-Commerce & Product Showcase',
      price: '₹14,500',
      tagline: 'Full online shopping store, product catalog, UPI checkout & SEO',
      deliverables: [
        'Full Product & Services Showcase Catalog',
        'Shopping Cart & UPI Payment Gateway (PhonePe/GPay)',
        'Custom Domain, Cloud Hosting & Free SSL',
        'Google Business Profile & Local SEO Setup',
        'Customer Enquiry Form with WhatsApp Sync',
        '30 Days Free Support & Maintenance'
      ],
      popular: true
    },
    {
      id: 'pkg-app-billing',
      domain: 'app',
      name: 'Accountant App & Shop Billing',
      price: '₹20,000',
      tagline: 'Save full-time accountant salary with automated shop records',
      deliverables: [
        'Accountant App (Save Full-Time Accountant Salary!)',
        'Automated Billing, Khata & GST Invoicing',
        'Thermal Receipt Printing & Udhar Reminders',
        'Daily Cash in Hand & Mobile Sales Reports',
        'Offline DB Support with Automatic Cloud Sync',
        'Free Shop Staff Training & Setup'
      ],
      popular: true
    },
    {
      id: 'pkg-app-enterprise',
      domain: 'app',
      name: 'Business Management & Staff App',
      price: '₹28,000',
      tagline: 'Multi-store, staff attendance, stock barcodes & custom app features',
      deliverables: [
        'Business Management App for Shop & Warehouse',
        'Barcode Scanner & Low Stock Notifications',
        'Staff Management & GPS Selfie Attendance',
        'Automated Monthly Salary Slips Calculator',
        'Android App, Tablet Ready & Web Admin',
        'Custom App Development & Dedicated Care'
      ],
      popular: false
    },
    {
      id: 'pkg-ai-whatsapp',
      domain: 'ai',
      name: 'Smart Support 24×7 AI Chatbot',
      price: '₹7,500',
      tagline: 'Never lose a customer lead on WhatsApp or website',
      deliverables: [
        'Smart Support 24×7 AI Chatbot for Website',
        'WhatsApp Automation with Instant Auto-Replies',
        'Lead Management Automation & Phone Capture',
        'Auto Catalog & Price List PDF Dispatch',
        'Follow-up Reminders for Pending Enquiries',
        '24 to 48 Hours Quick Deployment'
      ],
      popular: true
    },
    {
      id: 'pkg-ai-agent',
      domain: 'ai',
      name: 'AI Agent & Voice Calling Suite',
      price: '₹16,000',
      tagline: 'AI phone voice agent & automated CRM lead qualification',
      deliverables: [
        'AI Voice Agent Answering Inbound Phone Calls',
        'Customer Support Automation for 24/7 Operations',
        'Instant Lead Sync to Google Sheets & CRM',
        'Automated WhatsApp Invoices & Reminders',
        'Weekly Conversion & Enquiry Analytics',
        'Dedicated AI Knowledge Base Tuning'
      ],
      popular: false
    }
  ],

  // Navigation Links
  navLinks: [
    { label: 'Home', path: '/' },
    { label: 'Web Development', path: '/#web-development' },
    { label: 'App Development', path: '/#app-development' },
    { label: 'AI Agent Services', path: '/#ai-automation' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ],

  // Footer Navigation
  footerLinks: {
    services: [
      { label: 'Web Development Services (from ₹6,500)', path: '/#web-development' },
      { label: 'App Development Services (from ₹20,000)', path: '/#app-development' },
      { label: 'AI Agent Development Services (from ₹7,500)', path: '/#ai-automation' }
    ],
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'All Projects', path: '/portfolio' },
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
(Sent from zippysoftwares.in portfolio website)`;

  return buildWhatsAppUrl(text);
}
