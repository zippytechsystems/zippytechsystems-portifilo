import React, { useState } from 'react';
import { ExternalLink, MessageCircle, ArrowUpRight, LayoutGrid, SlidersHorizontal, Eye } from 'lucide-react';
import { content, buildWhatsAppUrl } from '../data/content';
import { useData } from '../context/DataContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import TiltCard from './TiltCard';
import ProjectCoverflow from './ProjectCoverflow';
import ProjectModal from './ProjectModal';

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('coverflow'); // 'coverflow' | 'grid'
  const [selectedProject, setSelectedProject] = useState(null);
  const { projectsData, loading, designSettings } = useData();
  const isCoverflowAllowed = designSettings?.coverflow_enabled !== false;
  const currentViewMode = isCoverflowAllowed ? viewMode : 'grid';
  const allProjects = projectsData && projectsData.length > 0 ? projectsData : content.projects;
  useScrollReveal([activeFilter, currentViewMode]);

  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Development' },
    { id: 'app', label: 'App Development' },
    { id: 'ai', label: 'AI Automation' }
  ];

  const filteredProjects =
    activeFilter === 'all'
      ? allProjects
      : allProjects.filter((p) => p.domain === activeFilter);

  return (
    <section id="projects" style={{ padding: '5rem 0', background: 'var(--bg-surface)' }} aria-labelledby="portfolio-heading">
      <div className="container">
        
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge badge-web" style={{ marginBottom: '1rem' }}>
            PROVEN WORK &amp; CASE STUDIES
          </span>
          <h2 id="portfolio-heading" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Selected <span style={{ color: '#12a150' }}>Projects &amp; Solutions</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            Real-world systems delivered for retail shops, clinics, manufacturers, and growing SMBs across India.
            Easily customizable for your own business workflow.
          </p>
        </div>

        {/* Filter Pills & View Mode Switcher */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1.25rem'
          }}
        >
          {/* Domain Filter Tabs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.65rem'
            }}
            role="tablist"
            aria-label="Filter projects by domain"
          >
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className="btn"
                  role="tab"
                  aria-selected={isActive}
                  style={{
                    padding: '0.45rem 1.15rem',
                    fontSize: '0.88rem',
                    borderRadius: 'var(--radius-full)',
                    border: isActive ? '1px solid var(--brand-blue)' : '1px solid var(--border-subtle)',
                    background: isActive ? 'var(--brand-blue)' : 'var(--bg-canvas)',
                    color: isActive ? '#ffffff' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    boxShadow: isActive ? '0 4px 14px var(--domain-web-glow)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* 3D Showcase vs Grid View Toggle (Only shown when coverflow is enabled in admin) */}
          {isCoverflowAllowed && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '3px'
              }}
            >
              <button
                onClick={() => setViewMode('coverflow')}
                className="btn btn-sm"
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  background: currentViewMode === 'coverflow' ? 'var(--brand-blue)' : 'transparent',
                  color: currentViewMode === 'coverflow' ? '#ffffff' : 'var(--text-body)',
                  border: 'none',
                  fontWeight: currentViewMode === 'coverflow' ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
                title="3D Perspective Coverflow Showcase"
              >
                <SlidersHorizontal size={13} />
                <span>3D Showcase</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className="btn btn-sm"
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  background: currentViewMode === 'grid' ? 'var(--brand-blue)' : 'transparent',
                  color: currentViewMode === 'grid' ? '#ffffff' : 'var(--text-body)',
                  border: 'none',
                  fontWeight: currentViewMode === 'grid' ? 700 : 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
                title="Standard Grid Layout"
              >
                <LayoutGrid size={13} />
                <span>Grid View</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (!allProjects || allProjects.length === 0) && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="card"
                style={{
                  height: '380px',
                  background: 'var(--bg-card)',
                  animation: 'pulse 1.5s infinite ease-in-out',
                  borderRadius: 'var(--radius-lg)'
                }}
              />
            ))}
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              maxWidth: '560px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(29, 92, 240, 0.1)',
                color: '#1d5cf0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}
            >
              <ExternalLink size={26} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              No Projects Found in this Domain Yet
            </h3>
            <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We are constantly developing custom business solutions. Reach out directly to founder Lingaswamy for bespoke requirements.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="btn btn-cta-yellow"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              View All Projects
            </button>
          </div>
        )}

        {/* View Mode 1: 3D Coverflow Showcase */}
        {!loading && filteredProjects.length > 0 && currentViewMode === 'coverflow' && (
          <div style={{ marginBottom: '2rem' }}>
            <ProjectCoverflow
              projects={filteredProjects}
              onSelectProject={setSelectedProject}
            />
          </div>
        )}

        {/* View Mode 2: 3D Tilt Project Cards Grid */}
        {!loading && filteredProjects.length > 0 && currentViewMode === 'grid' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {filteredProjects.map((project) => {
              const isWeb = project.domain === 'web';
              const isApp = project.domain === 'app';
              const tagClass = isWeb ? 'badge-web' : isApp ? 'badge-app' : 'badge-ai';

              const projectInquiryUrl = buildWhatsAppUrl(
                `Hi Lingaswamy, I saw the "${project.title}" project on your portfolio. Can you build a similar solution for my business?`
              );

              return (
                <TiltCard key={project.id} maxTilt={6} glare={true} style={{ height: '100%' }}>
                  <article
                    className="card frosted-glass reveal-on-scroll"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Visual Image Preview */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '16 / 10',
                        background: 'var(--bg-surface-elevated)',
                        overflow: 'hidden',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />

                      {/* Domain Tag Overlay */}
                      <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                        <span className={`badge ${tagClass}`}>
                          {project.domainLabel}
                        </span>
                      </div>

                      {/* Impact Metric Pill */}
                      {project.metrics && (
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            background: 'rgba(7, 12, 30, 0.92)',
                            color: '#ffe500',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid rgba(255, 229, 0, 0.3)'
                          }}
                        >
                          ⚡ {project.metrics}
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: '1 0 auto'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          color: 'var(--text-dim)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '0.35rem'
                        }}
                      >
                        {project.clientCategory}
                      </span>

                      <h3
                        style={{
                          fontSize: '1.25rem',
                          marginBottom: '0.75rem',
                          fontWeight: 700,
                          lineHeight: 1.3
                        }}
                      >
                        {project.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.92rem',
                          color: 'var(--text-body)',
                          lineHeight: 1.5,
                          marginBottom: '1.25rem',
                          flex: '1 0 auto'
                        }}
                      >
                        {project.shortDescription}
                      </p>

                      {/* Technology Tags */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.4rem',
                          marginBottom: '1.5rem'
                        }}
                      >
                        {project.technologies.slice(0, 4).map((tech, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.75rem',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-xs)',
                              background: 'var(--bg-glass-subtle)',
                              color: 'var(--text-body)',
                              border: '1px solid var(--border-subtle)',
                              fontFamily: 'var(--font-mono)'
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                        <button
                          className="btn btn-outline"
                          style={{
                            flex: 1,
                            padding: '0.65rem 0.75rem',
                            fontSize: '0.88rem',
                            justifyContent: 'center'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                        >
                          <Eye size={15} />
                          <span>View Details</span>
                        </button>

                        <a
                          href={projectInquiryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-cta-yellow"
                          style={{
                            padding: '0.65rem 0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={(e) => e.stopPropagation()}
                          title="Inquire on WhatsApp"
                        >
                          <MessageCircle size={16} color="#0b1b4a" />
                        </a>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              );
            })}
          </div>
        )}

        {/* Project Lightbox Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />

      </div>
    </section>
  );
}
