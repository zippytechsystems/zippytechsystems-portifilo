import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function FaqsTab({ showToast, openConfirm }) {
  const { faqsData, addFaq, editFaq, deleteFaq } = useData();

  const [faqCategoryFilter, setFaqCategoryFilter] = useState('all');
  const [faqModal, setFaqModal] = useState({
    isOpen: false,
    mode: 'add',
    id: null,
    category: 'General',
    question: '',
    answer: ''
  });

  const handleSaveFaqModal = async (e) => {
    e.preventDefault();
    if (!faqModal.question.trim() || !faqModal.answer.trim()) return;

    const payload = {
      category: faqModal.category.trim() || 'General',
      question: faqModal.question.trim(),
      answer: faqModal.answer.trim()
    };

    if (faqModal.mode === 'add') {
      await addFaq(payload);
      showToast('FAQ added successfully!');
    } else {
      await editFaq(faqModal.id, payload);
      showToast('FAQ updated successfully!');
    }
    setFaqModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeleteFaq = (id, question) => {
    openConfirm(
      'Delete FAQ',
      `Are you sure you want to delete FAQ "${question}"?`,
      async () => {
        await deleteFaq(id);
        showToast('FAQ deleted.', 'error');
      }
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Frequently Asked Questions ({(faqsData || []).length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Answers to client queries about low-budget delivery, timelines, hosting, and AI setups.
          </p>
        </div>

        <button
          onClick={() =>
            setFaqModal({
              isOpen: true,
              mode: 'add',
              id: null,
              category: 'General',
              question: '',
              answer: ''
            })
          }
          className="btn btn-cta-yellow"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Add FAQ</span>
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {['all', 'Pricing & Budget', 'Timeline & Delivery', 'Technology & Security', 'AI & Automation', 'Support & Maintenance'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFaqCategoryFilter(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: faqCategoryFilter === cat ? '1px solid #1d5cf0' : '1px solid var(--border-subtle)',
              background: faqCategoryFilter === cat ? 'rgba(29, 92, 240, 0.15)' : 'transparent',
              color: faqCategoryFilter === cat ? '#1d5cf0' : 'var(--text-body)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* FAQs List */}
      {(faqsData || []).filter(f => faqCategoryFilter === 'all' || f.category === faqCategoryFilter).length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          No FAQs found in this category.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(faqsData || [])
            .filter((f) => faqCategoryFilter === 'all' || f.category === faqCategoryFilter)
            .map((faq) => (
              <div
                key={faq.id}
                className="card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: 'rgba(29, 92, 240, 0.1)',
                        color: '#1d5cf0',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        marginBottom: '0.4rem'
                      }}
                    >
                      {faq.category || 'General'}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                      {faq.question}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                    <button
                      onClick={() =>
                        setFaqModal({
                          isOpen: true,
                          mode: 'edit',
                          id: faq.id,
                          category: faq.category || 'General',
                          question: faq.question,
                          answer: faq.answer
                        })
                      }
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id, faq.question)}
                      className="btn btn-outline"
                      style={{ padding: '0.35rem 0.6rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      title="Delete FAQ"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.5, margin: 0 }}>
                  {faq.answer}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* FAQ Edit/Add Modal */}
      {faqModal.isOpen && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>
                {faqModal.mode === 'add' ? 'Add FAQ' : 'Edit FAQ'}
              </h3>
              <button
                onClick={() => setFaqModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveFaqModal}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={faqModal.category}
                  onChange={(e) => setFaqModal((prev) => ({ ...prev, category: e.target.value }))}
                >
                  <option value="General">General</option>
                  <option value="Pricing & Budget">Pricing & Budget</option>
                  <option value="Timeline & Delivery">Timeline & Delivery</option>
                  <option value="Technology & Security">Technology & Security</option>
                  <option value="AI & Automation">AI & Automation</option>
                  <option value="Support & Maintenance">Support & Maintenance</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Question *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Can you build a full website in under a week?"
                  value={faqModal.question}
                  onChange={(e) => setFaqModal((prev) => ({ ...prev, question: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Answer *</label>
                <textarea
                  rows={4}
                  required
                  className="form-input"
                  placeholder="Provide a clear, reassuring answer with specifics..."
                  value={faqModal.answer}
                  onChange={(e) => setFaqModal((prev) => ({ ...prev, answer: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setFaqModal((prev) => ({ ...prev, isOpen: false }))}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cta-yellow">
                  {faqModal.mode === 'add' ? 'Save FAQ' : 'Update FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
