-- =========================================================================
-- ZippyTechSystems Pvt. Ltd. — Supabase Database Schema & RLS Policies
-- =========================================================================

-- 1. Domains Table (Web, App, AI with starting prices)
CREATE TABLE IF NOT EXISTS public.domains (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    starting_price TEXT NOT NULL,
    starting_price_num INTEGER NOT NULL,
    color TEXT NOT NULL,
    intro_line TEXT NOT NULL,
    concept_copy TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Services Table (categorized by domain and type: 'main' or 'more')
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain_id TEXT REFERENCES public.domains(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('main', 'more')) NOT NULL DEFAULT 'main',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Projects Table (Portfolio items)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    client_category TEXT DEFAULT 'Business Solutions',
    short_description TEXT NOT NULL,
    technologies TEXT[] DEFAULT '{}',
    metrics TEXT DEFAULT '',
    image_url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enquiries Table (Lead captures from public contact form)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    message TEXT DEFAULT '',
    status TEXT CHECK (status IN ('New', 'Contacted', 'Closed')) DEFAULT 'New' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Site Settings Table (Key-Value pairs for contact info & taglines)
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Testimonials Table (Real Indian SMB client reviews)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    role_or_company TEXT,
    domain TEXT DEFAULT 'web',
    rating INTEGER DEFAULT 5,
    content TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. FAQs Table (Common client questions & answers)
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    category TEXT DEFAULT 'General',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Packages Table (Transparent service packages per domain)
CREATE TABLE IF NOT EXISTS public.packages (
    id TEXT PRIMARY KEY,
    domain TEXT NOT NULL,
    name TEXT NOT NULL,
    price TEXT NOT NULL,
    tagline TEXT,
    deliverables TEXT[] DEFAULT '{}',
    popular BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_services_domain ON public.services(domain_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_domain ON public.projects(domain, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON public.testimonials(sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_packages_domain ON public.packages(domain, sort_order);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- 1. Domains: Everyone can read; Only authenticated users (Admin) can update
CREATE POLICY "Allow public read on domains" ON public.domains FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on domains" ON public.domains FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Services: Everyone can read; Only admin can insert, update, delete
CREATE POLICY "Allow public read on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Projects: Everyone can read; Only admin can insert, update, delete
CREATE POLICY "Allow public read on projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. Enquiries: Public can INSERT (submit form); Only admin can SELECT and UPDATE status
CREATE POLICY "Allow public to submit enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin full access on enquiries" ON public.enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Settings: Everyone can read; Only admin can update
CREATE POLICY "Allow public read on settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on settings" ON public.settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Testimonials: Everyone can read; Only admin can manage
CREATE POLICY "Allow public read on testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. FAQs: Everyone can read; Only admin can manage
CREATE POLICY "Allow public read on faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 8. Packages: Everyone can read; Only admin can manage
CREATE POLICY "Allow public read on packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on packages" ON public.packages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- STORAGE BUCKET FOR PROJECT IMAGES
-- =========================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read on portfolio-images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Allow admin upload to portfolio-images" ON storage.objects
FOR ALL TO authenticated USING (bucket_id = 'portfolio-images') WITH CHECK (bucket_id = 'portfolio-images');

-- =========================================================================
-- INITIAL SEED DATA
-- =========================================================================

-- Insert Domains
INSERT INTO public.domains (id, name, starting_price, starting_price_num, color, intro_line, concept_copy)
VALUES
('web-development', 'Web Development', '₹7,000', 7000, '#1d5cf0', 'A website that helps your business grow.', 'A good website brings your business online, builds trust, shows your services and products to customers 24 hours a day, and helps you get more enquiries and grow your business.'),
('app-development', 'App Development', '₹10,000', 10000, '#12a150', 'Ready-made business apps for shops, small or big.', 'We build accountant apps and business management apps for small and big shops. The app handles billing, accounts, stock and staff records automatically, so the shop owner can save the salary of a full-time accountant and still keep accurate accounts.'),
('ai-automation', 'AI Automation', '₹6,000', 6000, '#7a2fd0', 'Never miss a customer enquiry again.', 'Enquiries are answered instantly on WhatsApp, phone and website even when the owner is busy or the shop is closed, so no lead is lost and more enquiries turn into customers.')
ON CONFLICT (id) DO NOTHING;

-- Insert Main Services (Web)
INSERT INTO public.services (domain_id, type, title, description, sort_order) VALUES
('web-development', 'main', 'Business Websites & Landing Pages', 'High-converting, professional web pages that establish immediate credibility and capture customer enquiries.', 1),
('web-development', 'main', 'Services / Products Showcase Websites', 'Beautiful, visual catalog websites displaying your complete offerings, pricing, and client testimonials.', 2),
('web-development', 'main', 'E-Commerce Business Websites', 'Full online shopping stores with fast mobile checkout, UPI / Razorpay payment gateways, and order tracking.', 3),
('web-development', 'main', 'Custom Domain & Hosting Setup', 'Complete end-to-end setup of your custom .com / .in domain, high-speed cloud hosting, and free SSL certificate.', 4);

-- Insert More Services (Web)
INSERT INTO public.services (domain_id, type, title, description, sort_order) VALUES
('web-development', 'more', 'Portfolio, restaurant, clinic, school and real estate websites', '', 5),
('web-development', 'more', 'Booking and appointment scheduling websites', '', 6),
('web-development', 'more', 'Website redesign and modernization', '', 7),
('web-development', 'more', 'Search Engine Optimization (SEO) & Google Business Profile setup', '', 8),
('web-development', 'more', 'Payment gateway integration (Razorpay, PhonePe, UPI)', '', 9),
('web-development', 'more', 'Ongoing website maintenance, security updates and yearly support', '', 10);

-- Insert Main Services (App)
INSERT INTO public.services (domain_id, type, title, description, sort_order) VALUES
('app-development', 'main', 'Accountant App', 'Automates daily khata, ledger entries, customer credit balance, GST invoicing, and financial reports.', 1),
('app-development', 'main', 'Business Management App', 'Centralized mobile management app tracking inventory, purchases, supplier payments, and shop operations.', 2),
('app-development', 'main', 'E-Commerce Business App', 'Dedicated Android & iOS shopping app for your shop with instant push notifications and fast checkout.', 3),
('app-development', 'main', 'Staff Management App', 'Digital staff attendance, overtime tracker, salary slip calculator, and daily staff shift roster.', 4);

-- Insert More Services (App)
INSERT INTO public.services (domain_id, type, title, description, sort_order) VALUES
('app-development', 'more', 'Billing / POS and barcode inventory apps', '', 5),
('app-development', 'more', 'GST invoice & thermal receipt printing app', '', 6),
('app-development', 'more', 'CRM and customer loyalty management app', '', 7),
('app-development', 'more', 'Delivery partner and appointment booking apps', '', 8),
('app-development', 'more', 'School / college administration apps', '', 9),
('app-development', 'more', 'Google Play Store and Apple App Store publishing', '', 10),
('app-development', 'more', 'Continuous app maintenance, feature upgrades and bug fixes', '', 11);

-- Insert Main Services (AI Automation)
INSERT INTO public.services (domain_id, type, title, description, sort_order) VALUES
('ai-automation', 'main', 'WhatsApp Automation', 'Automatic replies to customers on WhatsApp, greeting new visitors, sharing catalogs, and qualifying leads.', 1),
('ai-automation', 'main', 'AI Voice Agent', 'Answers business enquiry calls intelligently, provides details, and schedules callbacks.', 2),
('ai-automation', 'main', 'AI Chatbot for Your Website', 'Handles customer enquiries 24x7 directly on your website and captures contact numbers.', 3),
('ai-automation', 'main', 'Lead Management Automation', 'Syncs incoming customer enquiries instantly to Google Sheets, CRM, and sales team phones.', 4),
('ai-automation', 'main', 'Follow-Up Reminders', 'Automated follow-up messages on WhatsApp for pending quotations and customer decisions.', 5),
('ai-automation', 'main', 'Customer Support Automation', 'Resolves frequent customer queries (timings, pricing, location, order status) without manual effort.', 6);

-- Insert More Services (AI Automation)
INSERT INTO public.services (domain_id, type, title, description, sort_order) VALUES
('ai-automation', 'more', 'Auto invoices and payment reminder workflows', '', 7),
('ai-automation', 'more', 'Email and social media inquiry automation', '', 8),
('ai-automation', 'more', 'Data entry and document processing automation', '', 9),
('ai-automation', 'more', 'AI content and marketing copy tools', '', 10),
('ai-automation', 'more', 'Google Sheets, Zoho, Excel and CRM integrations', '', 11),
('ai-automation', 'more', 'Custom AI agents tailored for your unique business operations', '', 12);

-- Insert Default Settings
INSERT INTO public.settings (key, value) VALUES
('founder_name', 'Lingaswamy'),
('phone', '9542439498'),
('phone_formatted', '+91 95424 39498'),
('whatsapp_number', '919542439498'),
('whatsapp_prefill', 'Hi Lingaswamy, I visited ZippyTechSystems and would like to get a quote for my business.'),
('tagline', 'Build • Automate • Grow'),
('secondary_tagline', 'Smart Technology for a Stronger Tomorrow'),
('location', 'Hyderabad, Telangana, India'),
('instagram_url', 'https://www.instagram.com/zippytechsystems'),
('youtube_url', 'https://www.youtube.com/@zippytechsystems')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert Seed Testimonials
INSERT INTO public.testimonials (id, client_name, role_or_company, domain, rating, content, sort_order) VALUES
('test-1', 'Dr. Ramesh Reddy', 'Reddy Multi-Specialty Dental Clinic, Hyderabad', 'web', 5, 'Lingaswamy built our clinic showcase website in just 4 days. Patients can now easily view treatments, doctors, and book appointments directly on WhatsApp. Super fast delivery and extremely affordable!', 1),
('test-2', 'Suresh Patel', 'Patel Wholesale Electricals, Secunderabad', 'app', 5, 'The custom billing and stock app replaced our expensive accounting software. We save at least ₹18,000 every month on accountant salaries, and I can check my shop daily sales on my phone from anywhere.', 2),
('test-3', 'Vikram Varma', 'Varma Logistics & Transport, Vijayawada', 'ai', 5, 'The 24/7 WhatsApp AI automation handles late-night freight rate queries instantly. We turned 35% more leads into booked orders within the first month itself.', 3),
('test-4', 'Ananya Sharma', 'TrendBoutique Ethnic Studio, Bangalore', 'web', 5, 'Great design aesthetic, mobile responsive, and honest pricing. Lingaswamy is always available on phone and WhatsApp without any corporate bureaucracy.', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert Seed FAQs
INSERT INTO public.faqs (id, category, question, answer, sort_order) VALUES
('faq-1', 'General', 'What makes ZippyTechSystems different from other agencies in India?', 'We eliminate bloated agency overhead and middleman layers. You communicate directly with founder Lingaswamy on WhatsApp or call. We provide transparent starting prices (Web from ₹7k, App from ₹10k, AI from ₹6k) and deliver production-ready software in 48 hours to 7 days.', 1),
('faq-2', 'Web', 'What is included in the ₹7,000 Web Development starting package?', 'It includes a modern responsive business website, custom domain connection, lightning-fast cloud hosting setup, mobile optimization, WhatsApp direct integration, contact form, and Google Search Console/SEO basics.', 2),
('faq-3', 'App', 'How does your business app help save on accountant salaries?', 'Our custom mobile & web applications automate day-to-day billing, GST invoice generation, thermal print receipts, customer udhar (credit ledger), and stock levels. Because calculations and reports are automated and tamper-proof, shop owners do not need to hire a full-time accountant for daily entries.', 3),
('faq-4', 'AI', 'How does WhatsApp AI Automation work when our shop is closed?', 'Our AI agent connects to your WhatsApp business number. When a customer messages at night or during peak rush hours, the AI answers product questions, shares price lists or catalogs, collects their requirements, and syncs their phone number to your dashboard or Google Sheet.', 4),
('faq-5', 'General', 'What are your payment terms and milestones?', 'We work with clear, risk-free milestones: a small advance to initiate the architecture and wireframing, milestone reviews where you inspect the live demo, and final payment upon your 100% satisfaction and handover.', 5),
('faq-6', 'General', 'Do you offer ongoing support and maintenance?', 'Yes! All projects come with 30 days of complimentary post-launch support. Afterward, we provide affordable yearly maintenance packages covering security updates, server monitoring, backups, and feature tweaks.', 6)
ON CONFLICT (id) DO NOTHING;

-- Insert Seed Packages
INSERT INTO public.packages (id, domain, name, price, tagline, deliverables, popular, sort_order) VALUES
('pkg-web-starter', 'web', 'Starter Web Presence', '₹7,000', 'Best for local shops, professionals, and new businesses', ARRAY['Single-page fast responsive landing site', 'Direct WhatsApp chat button & Call CTA', 'Mobile, tablet & desktop optimized', 'Google Maps & Google Business profile link', 'Free SSL certificate & fast cloud hosting setup', '7 days turnaround time'], false, 1),
('pkg-web-business', 'web', 'Business Growth Showcase', '₹14,500', 'For established businesses wanting full catalog showcases', ARRAY['Up to 5 pages (Home, About, Services, Gallery, Contact)', 'Full service/product visual showcase catalog', 'Customer enquiry form with database & WhatsApp sync', 'On-page SEO optimization & metadata', 'Google Search Console indexing', '30 days free support & maintenance'], true, 2),
('pkg-app-billing', 'app', 'Shop Billing & Udhar App', '₹10,000', 'Save accountant salary with automated shop records', ARRAY['Fast barcode scanning & POS billing', 'GST & non-GST thermal receipt printing', 'Customer credit ledger (Udhar tracking & WhatsApp reminders)', 'Daily cash in hand & profit report on mobile', 'Tamper-proof calculations & offline support', 'Free staff training session'], true, 3),
('pkg-app-enterprise', 'app', 'Complete Business Management App', '₹22,000', 'Multi-store, staff attendance, and inventory management', ARRAY['Multi-user roles (Owner, Manager, Cashier)', 'Live warehouse stock alerts & supplier order records', 'Staff attendance & payroll calculation', 'Cloud backup & multi-device sync', 'Android APK + Web dashboard included', '3 months priority bugfix guarantee'], false, 4),
('pkg-ai-whatsapp', 'ai', 'WhatsApp 24/7 Auto-Responder', '₹6,000', 'Never lose a customer lead after working hours', ARRAY['Official or QR WhatsApp automation setup', 'Instant replies with price cards & catalog PDF', 'Lead qualification & phone number capture', 'Instant alert on owner mobile for hot leads', 'Custom business greeting & FAQ answering', 'Quick 48-hour deployment'], true, 5),
('pkg-ai-agent', 'ai', 'AI Voice & Lead Pipeline Suite', '₹16,000', 'Full intelligent customer qualification & automated CRM', ARRAY['AI Voice Agent for telephone enquiry triage', 'Website AI chatbot widget trained on your business', 'Sync leads automatically to Google Sheets & CRM', 'Automated follow-up WhatsApp reminders for pending quotes', 'Weekly analytics of customer questions and conversions', 'Dedicated onboarding & testing'], false, 6)
ON CONFLICT (id) DO NOTHING;
