import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, Star, X } from 'lucide-react';

export default function TestimonialsTab({ showToast, openConfirm }) {
  const { testimonialsData, addTestimonial, editTestimonial, deleteTestimonial } = useData();

  const [testimonialDomainFilter, setTestimonialDomainFilter] = useState('all');
  const [testimonialModal, setTestimonialModal] = useState({
    isOpen: false,
    mode: 'add',
    id: null,
    clientName: '',
    roleOrCompany: '',
    domain: 'web',
    rating: 5,
    content: ''
  });

  const handleSaveTestimonialModal = async (e) => {
    e.preventDefault();
    if (!testimonialModal.clientName.trim() || !testimonialModal.content.trim()) return;

    const payload = {
      clientName: testimonialModal.clientName.trim(),
      roleOrCompany: testimonialModal.roleOrCompany.trim(),
      domain: testimonialModal.domain,
      rating: Number(testimonialModal.rating) || 5,
      content: testimonialModal.content.trim()
    };

    if (testimonialModal.mode === 'add') {
      await addTestimonial(payload);
      showToast('Client review published successfully!');
    } else {
      await editTestimonial(testimonialModal.id, payload);
      showToast('Review updated successfully!');
    }
    setTestimonialModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteTestimonial = (id, clientName) => {
    openConfirm(
      'Delete Review',
      `Are you sure you want to delete review from "${clientName}"?`,
      async () => {
        await deleteTestimonial(id);
        showToast('Review deleted.', 'error');
      }
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Client Reviews &amp; Testimonials ({(testimonialsData || []).length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Verified feedback and ratings from business owners who built with ZippyTechSystems.
          </p>
        </div>

        <button
          onClick={() =>
            setTestimonialModal({
              isOpen: true,
              mode: 'add',
              id: null,
              clientName: '',
              roleOrCompany: '',
              domain: 'web',
              rating: 5,
              content: ''
            })
          }
          className="btn btn-cta-yellow"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Add Review</span>
        </button>
      </div>

      {/* Testimonials Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Domains' },
          { id: 'web', label: 'Web' },
          { id: 'app', label: 'App' },
          { id: 'ai', label: 'AI' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setTestimonialDomainFilter(f.id)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: testimonialDomainFilter === f.id ? '1px solid #1d5cf0' : '1px solid var(--border-subtle)',
              background: testimonialDomainFilter === f.id ? 'rgba(29, 92, 240, 0.15)' : 'transparent',
              color: testimonialDomainFilter === f.id ? '#1d5cf0' : 'var(--text-body)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Testimonials Grid */}
      {(testimonialsData || []).filter(t => testimonialDomainFilter === 'all' || t.domain === testimonialDomainFilter).length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          No reviews found in this category.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {(testimonialsData || [])
            .filter((t) => testimonialDomainFilter === 'all' || t.domain === testimonialDomainFilter)
            .map((rev) => {
              const domainColor =
                rev.domain === 'app'
                  ? '#12a150'
                  : rev.domain === 'ai'
                  ? '#7a2fd0'
                  : '#1d5cf0';

              return (
                <div
                  key={rev.id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderLeft: `4px solid ${domainColor}`
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '2px', color: '#ffe500' }}>
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={15} fill="#ffe500" />
                        ))}
                      </div>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: `${domainColor}20`,
                          color: domainColor
                        }}
                      >
                        {rev.domain}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
                      "{rev.content}"
                    </p>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        {rev.clientName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {rev.roleOrCompany}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() =>
                        setTestimonialModal({
                          isOpen: true,
                          mode: 'edit',
                          id: rev.id,
                          clientName: rev.clientName,
                          roleOrCompany: rev.roleOrCompany,
                          domain: rev.domain,
                          rating: rev.rating || 5,
                          content: rev.content
                        })
                      }
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(rev.id, rev.clientName)}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.65rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      title="Delete Review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Testimonial Edit/Add Modal */}
      {testimonialModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(0, 0, 0, 0.75)',
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
              maxWidth: '480px',
              width: '100%',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                {testimonialModal.mode === 'add' ? 'Add Client Review' : 'Edit Review'}
              </h3>
              <button
                onClick={() => setTestimonialModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonialModal}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Client Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Dr. K. Rao"
                    value={testimonialModal.clientName}
                    onChange={(e) => setTestimonialModal((prev) => ({ ...prev, clientName: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role or Company</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Founder, CareClinic"
                    value={testimonialModal.roleOrCompany}
                    onChange={(e) => setTestimonialModal((prev) => ({ ...prev, roleOrCompany: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Domain *</label>
                  <select
                    className="form-input"
                    value={testimonialModal.domain}
                    onChange={(e) => setTestimonialModal((prev) => ({ ...prev, domain: e.target.value }))}
                  >
                    <option value="web">Web Development</option>
                    <option value="app">App Development</option>
                    <option value="ai">AI Automation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Star Rating *</label>
                  <select
                    className="form-input"
                    value={testimonialModal.rating}
                    onChange={(e) => setTestimonialModal((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Review Content *</label>
                <textarea
                  rows={3}
                  required
                  className="form-input"
                  placeholder="What did the client say about our speed, communication, and quality?"
                  value={testimonialModal.content}
                  onChange={(e) => setTestimonialModal((prev) => ({ ...prev, content: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setTestimonialModal((prev) => ({ ...prev, isOpen: false }))}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cta-yellow">
                  {testimonialModal.mode === 'add' ? 'Save Review' : 'Update Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
