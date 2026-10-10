import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PortfolioSection from '../components/PortfolioSection';
import ContactSection from '../components/ContactSection';
import { content, buildWhatsAppUrl } from '../data/content';
import { ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function ProjectsPage() {
  const { slug } = useParams();
  const { projectsData } = useData() || {};
  const allProjects = projectsData && projectsData.length > 0 ? projectsData : content.projects;
  const currentProject = slug ? allProjects.find((p) => p.slug === slug || p.id === slug) : null;

  useEffect(() => {
    if (currentProject) {
      document.title = `${currentProject.title} | Case Study - ZippyTechSystems`;
    } else {
      document.title = 'Projects & Portfolio Showcase | ZippyTechSystems';
    }
  }, [currentProject]);

  return (
    <main style={{ paddingTop: 'calc(var(--navbar-height) + 2rem)' }}>
      {/* Page Header */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.9rem',
            color: 'var(--text-body)',
            marginBottom: '1.5rem',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>

        <div style={{ maxWidth: '800px' }}>
          <span className="badge badge-web" style={{ marginBottom: '0.75rem' }}>
            PORTFOLIO SHOWCASE
          </span>
          <h1 style={{ marginBottom: '1rem', fontSize: 'clamp(2.2rem, 4vw, 3rem)' }}>
            Engineered for <span style={{ color: '#1d5cf0' }}>Performance &amp; Scale</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            Browse through our portfolio of custom websites, business management apps, and WhatsApp AI automations.
            All projects can be tailored to your specific commercial requirements.
          </p>
        </div>
      </div>

      {/* Portfolio Grid with Web / App / AI filter and deep-link initial slug */}
      <PortfolioSection initialSlug={slug} />

      {/* Direct Contact Form */}
      <ContactSection />
    </main>
  );
}
