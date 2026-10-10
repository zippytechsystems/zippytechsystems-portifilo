import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Edit2,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  X
} from 'lucide-react';

export default function ServicesTab({ showToast, openConfirm }) {
  const {
    servicesData,
    updateDomainPrice,
    addServiceItem,
    editServiceItem,
    deleteServiceItem,
    reorderServiceItems
  } = useData();

  const [selectedDomain, setSelectedDomain] = useState('web-development');
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceInput, setPriceInput] = useState('');

  const [serviceModal, setServiceModal] = useState({
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    domainSlug: 'web-development',
    type: 'main', // 'main' | 'more'
    index: null,
    title: '',
    desc: ''
  });

  const currentDomainData =
    servicesData.find((d) => d.slug === selectedDomain) || servicesData[0] || {};

  const handleSavePrice = async () => {
    if (!priceInput.trim()) return;
    try {
      await updateDomainPrice(selectedDomain, priceInput.trim());
      setEditingPrice(false);
      showToast && showToast(`Updated starting price for ${currentDomainData.domainLabel} to ${priceInput.trim()}`);
    } catch {
      showToast && showToast('Failed to update starting price', 'error');
    }
  };

  const handleOpenAddService = (type) => {
    setServiceModal({
      isOpen: true,
      mode: 'add',
      domainSlug: selectedDomain,
      type,
      index: null,
      title: '',
      desc: ''
    });
  };

  const handleOpenEditService = (type, index, serviceItem) => {
    setServiceModal({
      isOpen: true,
      mode: 'edit',
      domainSlug: selectedDomain,
      type,
      index,
      title: typeof serviceItem === 'string' ? serviceItem : serviceItem.title,
      desc: typeof serviceItem === 'string' ? '' : serviceItem.desc || ''
    });
  };

  const handleSaveServiceModal = async (e) => {
    e.preventDefault();
    if (!serviceModal.title.trim()) return;

    try {
      if (serviceModal.mode === 'add') {
        await addServiceItem(
          serviceModal.domainSlug,
          serviceModal.type,
          serviceModal.title.trim(),
          serviceModal.desc.trim()
        );
        showToast && showToast('New service added successfully!');
      } else {
        await editServiceItem(serviceModal.domainSlug, serviceModal.type, serviceModal.index, {
          title: serviceModal.title.trim(),
          desc: serviceModal.desc.trim()
        });
        showToast && showToast('Service updated successfully!');
      }
      setServiceModal((prev) => ({ ...prev, isOpen: false }));
    } catch {
      showToast && showToast('Failed to save service', 'error');
    }
  };

  const handleDeleteService = (type, index, title) => {
    if (openConfirm) {
      openConfirm(
        'Delete Service',
        `Are you sure you want to delete "${title}"? This will remove it from the public website.`,
        async () => {
          await deleteServiceItem(selectedDomain, type, index);
          showToast && showToast('Service deleted.', 'error');
        }
      );
    } else {
      if (window.confirm(`Delete service "${title}"?`)) {
        deleteServiceItem(selectedDomain, type, index);
        showToast && showToast('Service deleted.', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Services &amp; Pricing
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Manage domains, starting prices, main services, and additional services.
          </p>
        </div>
      </div>

      {/* Domain Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {servicesData.map((d) => {
          const isSelected = selectedDomain === d.slug;
          return (
            <button
              key={d.slug}
              onClick={() => {
                setSelectedDomain(d.slug);
                setEditingPrice(false);
              }}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: isSelected ? `2px solid ${d.badgeColor}` : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--bg-surface)' : 'transparent',
                color: isSelected ? d.badgeColor : 'var(--text-body)',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.badgeColor }} />
              <span>{d.domainLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Starting Price Editor Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem', borderColor: currentDomainData.badgeColor }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600 }}>
              STARTING PRICE FOR {currentDomainData.domainLabel?.toUpperCase()}
            </div>
            {!editingPrice ? (
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: currentDomainData.badgeColor, marginTop: '0.25rem' }}>
                {currentDomainData.startingPrice}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="e.g. ₹7,000"
                  style={{ width: '160px', padding: '0.45rem 0.75rem' }}
                />
                <button
                  onClick={handleSavePrice}
                  className="btn btn-cta-yellow"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingPrice(false)}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!editingPrice && (
            <button
              onClick={() => {
                setPriceInput(currentDomainData.startingPrice || '');
                setEditingPrice(true);
              }}
              className="btn btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Edit2 size={14} />
              <span>Edit Starting Price</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Services Block */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Our Main Services ({currentDomainData.mainServices?.length || 0})
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Prominently displayed with icons and detailed cards on the public website.
            </div>
          </div>
          <button
            onClick={() => handleOpenAddService('main')}
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={15} />
            <span>Add Main Service</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {(currentDomainData.mainServices || []).map((s, idx) => (
            <div
              key={idx}
              style={{
                padding: '1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{s.title}</div>
                {s.desc && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-body)', marginTop: '0.2rem' }}>
                    {s.desc}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  title="Move Up"
                  disabled={idx === 0}
                  onClick={() => reorderServiceItems(selectedDomain, 'main', idx, 'up')}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem', opacity: idx === 0 ? 0.3 : 1 }}
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  title="Move Down"
                  disabled={idx === currentDomainData.mainServices.length - 1}
                  onClick={() => reorderServiceItems(selectedDomain, 'main', idx, 'down')}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem', opacity: idx === currentDomainData.mainServices.length - 1 ? 0.3 : 1 }}
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  title="Edit"
                  onClick={() => handleOpenEditService('main', idx, s)}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.55rem' }}
                >
                  <Edit2 size={14} />
                </button>
                <button
                  title="Delete"
                  onClick={() => handleDeleteService('main', idx, s.title)}
                  className="btn btn-outline"
                  style={{ padding: '0.35rem 0.55rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Services Block */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              More Services We Provide ({currentDomainData.moreServices?.length || 0})
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
              Compact checklist items shown in the quieter block below main services.
            </div>
          </div>
          <button
            onClick={() => handleOpenAddService('more')}
            className="btn btn-outline"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={15} />
            <span>Add More Service</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {(currentDomainData.moreServices || []).map((title, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{title}</span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  title="Move Up"
                  disabled={idx === 0}
                  onClick={() => reorderServiceItems(selectedDomain, 'more', idx, 'up')}
                  className="btn btn-outline"
                  style={{ padding: '0.3rem', opacity: idx === 0 ? 0.3 : 1 }}
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  title="Move Down"
                  disabled={idx === currentDomainData.moreServices.length - 1}
                  onClick={() => reorderServiceItems(selectedDomain, 'more', idx, 'down')}
                  className="btn btn-outline"
                  style={{ padding: '0.3rem', opacity: idx === currentDomainData.moreServices.length - 1 ? 0.3 : 1 }}
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  title="Edit"
                  onClick={() => handleOpenEditService('more', idx, title)}
                  className="btn btn-outline"
                  style={{ padding: '0.3rem 0.5rem' }}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  title="Delete"
                  onClick={() => handleDeleteService('more', idx, title)}
                  className="btn btn-outline"
                  style={{ padding: '0.3rem 0.5rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Modal (Add / Edit) */}
      {serviceModal.isOpen && (
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
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {serviceModal.mode === 'add' ? 'Add Service' : 'Edit Service'}
              </h3>
              <button
                onClick={() => setServiceModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveServiceModal}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Service Type</label>
                <select
                  className="form-input"
                  value={serviceModal.type}
                  onChange={(e) => setServiceModal((prev) => ({ ...prev, type: e.target.value }))}
                >
                  <option value="main">Main Service (Feature Box)</option>
                  <option value="more">More Service (Compact List Item)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Service Title / Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. GST Billing &amp; Invoice POS App"
                  value={serviceModal.title}
                  onChange={(e) => setServiceModal((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {serviceModal.type === 'main' && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Short Description</label>
                  <textarea
                    rows={3}
                    className="form-input"
                    placeholder="Brief summary of what this service delivers..."
                    value={serviceModal.desc}
                    onChange={(e) => setServiceModal((prev) => ({ ...prev, desc: e.target.value }))}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setServiceModal((prev) => ({ ...prev, isOpen: false }))}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cta-yellow">
                  {serviceModal.mode === 'add' ? 'Save Service' : 'Update Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
