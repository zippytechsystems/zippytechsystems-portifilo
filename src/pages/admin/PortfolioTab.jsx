import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  X
} from 'lucide-react';

export default function PortfolioTab({ showToast, openConfirm }) {
  const {
    projectsData,
    addProject,
    editProject,
    deleteProject,
    uploadProjectImage
  } = useData();

  const [portfolioFilter, setPortfolioFilter] = useState('all');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [projectModal, setProjectModal] = useState({
    isOpen: false,
    mode: 'add',
    id: null,
    title: '',
    domain: 'web',
    clientCategory: 'Retail POS & Business',
    shortDescription: '',
    technologies: 'React, Node.js, Cloud',
    metrics: '',
    image: '/projects/saree-app.svg',
    imageFile: null
  });

  const filteredProjects =
    portfolioFilter === 'all'
      ? projectsData
      : projectsData.filter((p) => p.domain === portfolioFilter);

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadProjectImage(file);
      if (uploadedUrl) {
        setProjectModal((prev) => ({ ...prev, image: uploadedUrl }));
        showToast && showToast('Image uploaded successfully!');
      }
    } catch {
      showToast && showToast('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveProjectModal = async (e) => {
    e.preventDefault();
    if (!projectModal.title.trim() || !projectModal.shortDescription.trim()) return;

    const projectPayload = {
      title: projectModal.title.trim(),
      domain: projectModal.domain,
      domainLabel:
        projectModal.domain === 'web'
          ? 'Web Development'
          : projectModal.domain === 'app'
          ? 'App Development'
          : 'AI Automation',
      domainColor:
        projectModal.domain === 'web'
          ? '#1d5cf0'
          : projectModal.domain === 'app'
          ? '#12a150'
          : '#7a2fd0',
      clientCategory: projectModal.clientCategory.trim() || 'General Business',
      shortDescription: projectModal.shortDescription.trim(),
      technologies: projectModal.technologies
        ? projectModal.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Web Tech'],
      metrics: projectModal.metrics.trim(),
      image: projectModal.image || '/projects/clinic-web.svg'
    };

    try {
      if (projectModal.mode === 'add') {
        await addProject(projectPayload);
        showToast && showToast('New project created and published!');
      } else {
        await editProject(projectModal.id, projectPayload);
        showToast && showToast('Project updated successfully!');
      }
      setProjectModal((prev) => ({ ...prev, isOpen: false }));
    } catch {
      showToast && showToast('Failed to save project. Please check network/login.', 'error');
    }
  };

  const handleDeleteProject = (id, title) => {
    if (openConfirm) {
      openConfirm(
        'Delete Project',
        `Are you sure you want to delete "${title}"? This cannot be undone.`,
        async () => {
          await deleteProject(id);
          showToast && showToast('Project removed.', 'error');
        }
      );
    } else {
      if (window.confirm(`Delete project "${title}"?`)) {
        deleteProject(id);
        showToast && showToast('Project removed.', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Portfolio Projects ({projectsData.length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Add, edit, and manage projects displayed in your client portfolio.
          </p>
        </div>

        <button
          onClick={() =>
            setProjectModal({
              isOpen: true,
              mode: 'add',
              id: null,
              title: '',
              domain: 'web',
              clientCategory: 'Retail POS & Business',
              shortDescription: '',
              technologies: 'React, Node.js, Cloud',
              metrics: '',
              image: '/projects/saree-app.svg',
              imageFile: null
            })
          }
          className="btn btn-cta-yellow"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'web', label: 'Web Development' },
          { id: 'app', label: 'App Development' },
          { id: 'ai', label: 'AI Automation' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPortfolioFilter(tab.id)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: portfolioFilter === tab.id ? '1px solid #1d5cf0' : '1px solid var(--border-subtle)',
              background: portfolioFilter === tab.id ? 'rgba(29,92,240,0.15)' : 'transparent',
              color: portfolioFilter === tab.id ? '#1d5cf0' : 'var(--text-body)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredProjects.map((p) => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Thumbnail */}
            <div style={{ height: '170px', background: 'var(--bg-canvas)', position: 'relative', overflow: 'hidden' }}>
              <img
                src={p.image}
                alt={p.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/projects/clinic-web.svg'; }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(0,0,0,0.7)',
                  color: p.domainColor || '#ffe500'
                }}
              >
                {p.domainLabel}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>
                  {p.clientCategory}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {p.shortDescription}
                </p>

                {p.metrics && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#12a150', marginBottom: '0.75rem' }}>
                    ✓ {p.metrics}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() =>
                    setProjectModal({
                      isOpen: true,
                      mode: 'edit',
                      id: p.id,
                      title: p.title,
                      domain: p.domain,
                      clientCategory: p.clientCategory || '',
                      shortDescription: p.shortDescription || '',
                      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
                      metrics: p.metrics || '',
                      image: p.image || '/projects/clinic-web.svg',
                      imageFile: null
                    })
                  }
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Edit2 size={13} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDeleteProject(p.id, p.title)}
                  className="btn btn-outline"
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Add / Edit Modal */}
      {projectModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                {projectModal.mode === 'add' ? 'Add Portfolio Project' : 'Edit Project'}
              </h3>
              <button
                onClick={() => setProjectModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProjectModal}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Project Title *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Retail POS &amp; Inventory Billing App"
                  value={projectModal.title}
                  onChange={(e) => setProjectModal((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Domain *</label>
                  <select
                    className="form-input"
                    value={projectModal.domain}
                    onChange={(e) => setProjectModal((prev) => ({ ...prev, domain: e.target.value }))}
                  >
                    <option value="web">Web Development</option>
                    <option value="app">App Development</option>
                    <option value="ai">AI Automation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Client Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Supermarket, Clinic"
                    value={projectModal.clientCategory}
                    onChange={(e) => setProjectModal((prev) => ({ ...prev, clientCategory: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  className="form-input"
                  placeholder="Explain what the system does for the client..."
                  value={projectModal.shortDescription}
                  onChange={(e) => setProjectModal((prev) => ({ ...prev, shortDescription: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Key Metric / Result</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Saved ₹35,000/mo"
                    value={projectModal.metrics}
                    onChange={(e) => setProjectModal((prev) => ({ ...prev, metrics: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Technologies (comma separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="React, Flutter, MySQL"
                    value={projectModal.technologies}
                    onChange={(e) => setProjectModal((prev) => ({ ...prev, technologies: e.target.value }))}
                  />
                </div>
              </div>

              {/* Image Upload / URL */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Project Image / Screenshot</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', background: '#0b1b4a' }}>
                    <img
                      src={projectModal.image}
                      alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/projects/clinic-web.svg'; }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label
                      className="btn btn-outline"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.45rem 0.85rem',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={14} />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageFileChange}
                        disabled={isUploadingImage}
                      />
                    </label>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                      Uploads securely to Hostinger /uploads/ directory
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Or enter image URL path (e.g. /projects/saree-app.svg)"
                  value={projectModal.image}
                  onChange={(e) => setProjectModal((prev) => ({ ...prev, image: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setProjectModal((prev) => ({ ...prev, isOpen: false }))}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cta-yellow">
                  {projectModal.mode === 'add' ? 'Save Project' : 'Update Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
