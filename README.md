# ZippyTechSystems Pvt. Ltd. — Official Portfolio Website

> **Build • Automate • Grow**  
> *Smart Technology for a Stronger Tomorrow*

A modern, high-performance portfolio website for **ZippyTechSystems Pvt. Ltd.**, showcasing low-budget, high-value digital solutions tailored for small and mid-size businesses (SMBs) in India. Built with **React 18 + Vite** frontend, self-hosted **PHP 8 + MySQL** backend on **Hostinger**, custom design tokens, dark/light theme switching, and zero-backend WhatsApp lead automation.

---

## 🚀 Key Features

- **Domain-Specific Brand Architecture**:
  - 🌐 **Web Development**: Blue (`#1d5cf0`), Starting from **₹6,500**
  - 📱 **App Development**: Green (`#12a150`), Starting from **₹20,000**
  - ⚡ **AI Automation**: Purple (`#7a2fd0`), Starting from **₹7,500**
  - 🟡 **Primary Highlights & CTA**: High-contrast Yellow (`#ffe500`)
- **Direct Founder Line**: Direct access to founder & lead architect **Lingaswamy** (+91 63026 90251).
- **Direct WhatsApp Lead Flow**: Enquiry form automatically saves to MySQL and opens WhatsApp with pre-filled project scope.
- **Sticky Floating WhatsApp Button**: Always visible with one-click direct chat on every page (bottom-right).
- **AI Chatbot & Female Voice Agent**: Discreetly stacked at bottom-left without overlapping any UI controls.
- **Dual Theme Support**: Seamless Light & Dark mode toggle with system preference detection and localStorage persistence.
- **Self-Hosted PHP 8 + MySQL Backend**: Zero external runtime lock-in. Powered by Hostinger cPanel / hPanel.
- **SEO & Structured Data**: Semantic HTML5, Open Graph meta tags, and `LocalBusiness` JSON-LD schema on `https://zippysoftwares.in`.

---

## 🔐 Protected Admin Panel (`/admin`)

The website includes a mobile-friendly, secure administrative dashboard located at **`/admin`**.

### 🔑 Owner Login Credentials
- **Username**: `lingaswamymaddeboina`
- **Password**: `linga@123`

### 🕵️ Discreet Website Access
The link to the admin area is kept tiny and subtle on the public website:
- Located at the bottom right corner of the **Footer** right after "Terms" in low opacity (`admin`).

### 🎛️ Admin Features
1. **Services & Pricing Management**: Edit domain starting prices, add/edit/delete domain services.
2. **Portfolio Projects CRUD**: Add, edit, or delete showcase projects with image and video upload.
3. **Customer Enquiries & Lead Management**: Live table of customer leads with status tracking (`New`, `Contacted`, `Closed`).
4. **Site Settings Editor**: Edit phone number, WhatsApp number, brand tagline, address, and social links.
5. **AI Chatbot & Voice Settings**: Configure prompt, model, speech rates, and allowed voices.

---

## 🗄️ Hostinger PHP 8 & MySQL Backend Setup

The backend is fully self-hosted in the `/api` directory and connects to Hostinger MySQL via PDO.

### Step 1: Create Database in Hostinger hPanel
1. Log in to your Hostinger hPanel > **Databases** > **Management**.
2. Create a new MySQL database (e.g. `u914601002_zippytech`) and database user with a strong password.

### Step 2: Import the SQL Schema
1. Open **phpMyAdmin** for your database.
2. Click **Import** and select [`database/schema.sql`](./database/schema.sql).
3. Click **Go** to create all tables and initial seed data.

### Step 3: Configure Backend (`api/config.php`)
1. In your `api/` directory, copy `config.example.php` to `config.php`:
   ```bash
   cp api/config.example.php api/config.php
   ```
2. Enter your Hostinger MySQL database credentials:
   ```php
   'db' => [
       'host'     => 'localhost',
       'port'     => 3306,
       'dbname'   => 'u914601002_zippytech',
       'username' => 'u914601002_zippyuser',
       'password' => 'YOUR_STRONG_DATABASE_PASSWORD',
       'charset'  => 'utf8mb4',
   ],
   ```
3. Set your secret keys (`session_secret`, optional `azure_key`, WhatsApp `app_secret` & `verify_token`).

---

## 🛠️ How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- `npm` (included with Node.js)
- PHP 8.1+ with PDO MySQL extension (for running local backend)

### Step 1: Install Frontend Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Step 3: Build for Production (Hostinger)
```bash
npm run build
```
This generates the optimized production bundle inside `dist/`.

---

## 📁 Project Directory Structure

```
├── .github/
│   └── workflows/
│       └── deploy-hostinger.yml # GitHub Actions automated FTP deploy
├── api/                        # PHP 8 REST API Backend
│   ├── bootstrap.php           # CORS, PDO DB connection, CSRF & middleware
│   ├── config.example.php      # Safe configuration template (gitignored config.php)
│   ├── index.php               # Unified REST API router for all models
│   ├── auth.php                # Admin authentication & CSRF endpoints
│   ├── chat.php                # AI customer enquiry chatbot endpoint
│   ├── voice.php               # Azure Neural TTS female voice endpoint
│   ├── upload.php              # Secure image & video upload with .htaccess protection
│   └── whatsapp/               # WhatsApp Cloud API webhook & send handlers
├── database/
│   ├── schema.sql              # MySQL database schema & initial seed
│   └── migrations/             # Incremental database migrations
├── public/                     # Static assets, logos, favicon, robots.txt
├── src/
│   ├── components/             # Reusable UI components
│   ├── context/                # ThemeContext, DataContext, AdminAuthContext, QualityTierContext
│   ├── data/                   # Default fallback content (content.js)
│   ├── lib/
│   │   ├── api.js              # Base API client with automatic CSRF token handling
│   │   ├── ttsApi.js           # Voice synthesis client
│   │   └── supabase.js         # Safe compatibility stub
│   ├── pages/                  # Page routes (Home, Projects, About, Contact, Services, Admin)
│   ├── styles/                 # Design tokens, animations, and index.css
│   ├── App.jsx                 # Router layout coordinator
│   └── main.jsx                # Application root entry
├── archive/                    # Archived legacy scripts & migrations
├── index.html                  # HTML entry with SEO & JSON-LD
├── package.json                # Project dependencies and npm scripts
└── vite.config.js              # Vite build configuration
```

---

## 📞 Contact Information

- **Company**: ZippyTechSystems Pvt. Ltd.
- **Founder**: Lingaswamy
- **Phone / Calling**: [+91 63026 90251](tel:+916302690251)
- **WhatsApp**: [wa.me/916302690251](https://wa.me/916302690251)
- **Email**: info@zippysoftwares.in
- **Location**: Hyderabad, Telangana, India
