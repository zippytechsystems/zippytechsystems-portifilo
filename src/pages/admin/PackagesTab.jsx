import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function PackagesTab({ showToast, openConfirm }) {
  const { packagesData, addPackage, editPackage, deletePackage } = useData();

  const [packageDomainFilter, setPackageDomainFilter] = useState('all');
  const [packageModal, setPackageModal] = useState({
    isOpen: false,
    mode: 'add',
    id: null,
    domain: 'web',
    name: '',
    price: '',
    tagline: '',
    deliverables: '',
    popular: false
  });

  const handleSavePackageModal = async (e) => {
    e.preventDefault();
    if (!packageModal.name.trim() || !packageModal.price.trim()) return;

    const deliverablesList =
      typeof packageModal.deliverables === 'string'
        ? packageModal.deliverables
            .split('\n')
            .map((d) => d.trim())
            .filter(Boolean)
        : packageModal.deliverables;

    const payload = {
      domain: packageModal.domain,
      name: packageModal.name.trim(),
      price: packageModal.price.trim(),
      tagline: packageModal.tagline.trim(),
      deliverables: deliverablesList,
      popular: Boolean(packageModal.popular)
    };

    if (packageModal.mode === 'add') {
      await addPackage(payload);
      showToast('New package published successfully!');
    } else {
      await editPackage(packageModal.id, payload);
      showToast('Package updated successfully!');
    }
    setPackageModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleDeletePackage = (id, name) => {
    openConfirm(
      'Delete Package',
      `Are you sure you want to delete package "${name}"?`,
      async () => {
        await deletePackage(id);
        showToast('Package deleted.', 'error');
      }
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Transparent Packages ({(packagesData || []).length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Manage clear budget packages across Web Development, Mobile Apps, and AI Automation.
          </p>
        </div>

        <button
          onClick={() =>
            setPackageModal({
              isOpen: true,
              mode: 'add',
              id: null,
              domain: 'web',
              name: '',
              price: '₹9,999',
              tagline: '',
              deliverables: '',
              popular: false
            })
          }
          className="btn btn-cta-yellow"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <Plus size={16} />
          <span>Add Package</span>
        </button>
      </div>

      {/* Domain Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Packages' },
          { id: 'web', label: 'Web Development' },
          { id: 'app', label: 'App Development' },
          { id: 'ai', label: 'AI Automation' }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setPackageDomainFilter(f.id)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: packageDomainFilter === f.id ? '1px solid #1d5cf0' : '1px solid var(--border-subtle)',
              background: packageDomainFilter === f.id ? 'rgba(29, 92, 240, 0.15)' : 'transparent',
              color: packageDomainFilter === f.id ? '#1d5cf0' : 'var(--text-body)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Packages Grid */}
      {(packagesData || []).filter(p => packageDomainFilter === 'all' || p.domain === packageDomainFilter).length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          No packages found in this category.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {(packagesData || [])
            .filter((p) => packageDomainFilter === 'all' || p.domain === packageDomainFilter)
            .map((pkg) => {
              const domainColor =
                pkg.domain === 'app'
                  ? '#12a150'
                  : pkg.domain === 'ai'
                  ? '#7a2fd0'
                  : '#1d5cf0';

              return (
                <div
                  key={pkg.id}
                  className="card"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: `4px solid ${domainColor}`,
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: `${domainColor}20`,
                          color: domainColor
                        }}
                      >
                        {pkg.domain === 'app' ? 'Mobile App' : pkg.domain === 'ai' ? 'AI System' : 'Web Platform'}
                      </span>
                      {pkg.popular && (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: '#ffe500',
                            color: '#0b1b4a',
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}
                        >
                          ★ Most Popular
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      {pkg.name}
                    </h3>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: domainColor, marginBottom: '0.5rem' }}>
                      {pkg.price}
                    </div>
                    {pkg.tagline && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1rem', fontStyle: 'italic' }}>
                        {pkg.tagline}
                      </p>
                    )}

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        Included Deliverables:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {(pkg.deliverables || []).map((del, dIdx) => (
                          <li key={dIdx} style={{ fontSize: '0.82rem', color: 'var(--text-body)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span style={{ color: domainColor, fontWeight: 'bold' }}>✓</span>
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                    <button
                      onClick={() =>
                        setPackageModal({
                          isOpen: true,
                          mode: 'edit',
                          id: pkg.id,
                          domain: pkg.domain,
                          name: pkg.name,
                          price: pkg.price,
                          tagline: pkg.tagline || '',
                          deliverables: (pkg.deliverables || []).join('\n'),
                          popular: Boolean(pkg.popular)
                        })
                      }
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Edit2 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.65rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      title="Delete Package"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Package Edit/Add Modal */}
      {packageModal.isOpen && (
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
                {packageModal.mode === 'add' ? 'Add Transparent Package' : 'Edit Package'}
              </h3>
              <button
                onClick={() => setPackageModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePackageModal}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Domain *</label>
                  <select
                    className="form-input"
                    value={packageModal.domain}
                    onChange={(e) => setPackageModal((prev) => ({ ...prev, domain: e.target.value }))}
                  >
                    <option value="web">Web Development</option>
                    <option value="app">App Development</option>
                    <option value="ai">AI Automation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Price Display *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. ₹9,999 or ₹29,999"
                    value={packageModal.price}
                    onChange={(e) => setPackageModal((prev) => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Package Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Business Pro Web or Cross-Platform Mobile"
                  value={packageModal.name}
                  onChange={(e) => setPackageModal((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Tagline / Short Summary</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. For shops & clinics needing online bookings"
                  value={packageModal.tagline}
                  onChange={(e) => setPackageModal((prev) => ({ ...prev, tagline: e.target.value }))}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Deliverables (one per line) *</label>
                <textarea
                  rows={4}
                  required
                  className="form-input"
                  placeholder={"Up to 7 Custom Pages\n100% Mobile Responsive\nWhatsApp Click-to-Chat\nAdmin Lead Management"}
                  value={packageModal.deliverables}
                  onChange={(e) => setPackageModal((prev) => ({ ...prev, deliverables: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="package-popular"
                  checked={packageModal.popular}
                  onChange={(e) => setPackageModal((prev) => ({ ...prev, popular: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="package-popular" style={{ fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                  Mark as "Most Popular" / Recommended Tier
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setPackageModal((prev) => ({ ...prev, isOpen: false }))}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cta-yellow">
                  {packageModal.mode === 'add' ? 'Save Package' : 'Update Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
