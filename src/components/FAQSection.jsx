import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Search, X } from 'lucide-react';
import { content, buildWhatsAppUrl } from '../data/content';
import { useData } from '../context/DataContext';

function HighlightText({ text, query }) {
  if (!query || !query.trim() || !text) return text;
  const trimmed = query.trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark
            key={i}
            style={{
              background: 'rgba(255, 229, 0, 0.25)',
              color: '#ffe500',
              padding: '1px 4px',
              borderRadius: '4px',
              fontWeight: 700
            }}
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function FAQSection() {
  const { faqsData, loading } = useData();
  const faqs = faqsData && faqsData.length > 0 ? faqsData : content.faqs || [];

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id || null);

  const categories = ['All', 'General', 'Web', 'App', 'AI'];

  const filteredFaqs = useMemo(() => {
    let result = faqs;
    if (activeCategory !== 'All') {
      result = result.filter((f) => f.category?.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (f) =>
          f.question?.toLowerCase().includes(q) ||
          f.answer?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [faqs, activeCategory, searchQuery]);

  // When search query is entered, auto-open the first matching answer
  useEffect(() => {
    if (searchQuery.trim() && filteredFaqs.length > 0) {
      setOpenFaqId(filteredFaqs[0].id);
    }
  }, [searchQuery, filteredFaqs]);

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section
      id="faq"
      style={{
        padding: '5.5rem 0',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        position: 'relative'
      }}
      aria-labelledby="faq-heading"
    >
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3rem auto' }}>
          <span className="badge badge-purple" style={{ marginBottom: '1rem' }}>
            GOT QUESTIONS?
          </span>
          <h2 id="faq-heading" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}>
            Frequently Asked <span style={{ color: '#7a2fd0' }}>Questions</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
            Clear, upfront answers about our starting prices, fast turnaround times, payment milestones, and post-delivery support.
          </p>
        </div>

        {/* Live Search Input Bar */}
        <div
          style={{
            maxWidth: '620px',
            margin: '0 auto 2.25rem auto',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '0.65rem 1.25rem',
              boxShadow: 'var(--card-shadow)',
              transition: 'border-color var(--transition-fast)'
            }}
          >
            <Search size={18} color="#7a2fd0" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. advance, timeline, hosting, app)..."
              aria-label="Search frequently asked questions"
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.95rem'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                  borderRadius: '50%'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
          {searchQuery.trim() && (
            <div style={{ textAlign: 'center', marginTop: '0.65rem', fontSize: '0.84rem', color: 'var(--text-dim)' }}>
              Found {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            marginBottom: '2.5rem'
          }}
          role="tablist"
          aria-label="Filter FAQs by category"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="btn"
                role="tab"
                aria-selected={isActive}
                style={{
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.88rem',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid #7a2fd0' : '1px solid var(--border-subtle)',
                  background: isActive ? '#7a2fd0' : 'var(--bg-canvas)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  fontWeight: isActive ? 700 : 500,
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat === 'All' ? 'All Questions' : `${cat} Questions`}
              </button>
            );
          })}
        </div>

        {/* Loading Skeleton */}
        {loading && (!faqs || faqs.length === 0) && (
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="card skeleton"
                style={{ height: '68px', borderRadius: '12px', opacity: 0.6 }}
              />
            ))}
          </div>
        )}

        {/* Friendly Empty State */}
        {!loading && filteredFaqs.length === 0 && (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '550px', margin: '0 auto' }}>
            <HelpCircle size={36} color="#7a2fd0" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              {searchQuery.trim() ? `No questions matching "${searchQuery}"` : 'No Questions in This Category'}
            </h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem', fontSize: '0.92rem', lineHeight: 1.5 }}>
              {searchQuery.trim()
                ? 'Have a specific requirement or technical question? Founder Lingaswamy answers directly on WhatsApp.'
                : 'Have a custom question not covered here? Ask founder Lingaswamy directly on WhatsApp.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {searchQuery.trim() && (
                <button onClick={() => setSearchQuery('')} className="btn btn-outline">
                  Clear Search
                </button>
              )}
              <a
                href={buildWhatsAppUrl(
                  searchQuery.trim()
                    ? `Hi Lingaswamy, I searched for "${searchQuery}" on your FAQ but had a question about...`
                    : 'Hi Lingaswamy, I have a question about ZippyTechSystems services.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-cta-yellow"
              >
                <MessageCircle size={16} />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        )}

        {/* Accordion List */}
        {filteredFaqs.length > 0 && (
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="card"
                  style={{
                    padding: 0,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: isOpen ? '1px solid rgba(122, 47, 208, 0.4)' : '1px solid var(--border-glass)',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    style={{
                      width: '100%',
                      padding: '1.35rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'var(--text-main)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '1.02rem'
                    }}
                  >
                    <span>
                      <HighlightText text={faq.question} query={searchQuery} />
                    </span>
                    <div
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform var(--transition-fast)',
                        color: isOpen ? '#7a2fd0' : 'var(--text-dim)',
                        flexShrink: 0
                      }}
                    >
                      <ChevronDown size={20} />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      style={{
                        padding: '0 1.5rem 1.5rem 1.5rem',
                        fontSize: '0.94rem',
                        color: 'var(--text-body)',
                        lineHeight: 1.65,
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '1.1rem'
                      }}
                    >
                      <HighlightText text={faq.answer} query={searchQuery} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
