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

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

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
('location', 'Hyderabad, Telangana, India')
ON CONFLICT (key) DO NOTHING;
