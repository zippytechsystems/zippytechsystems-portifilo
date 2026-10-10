import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function ServiceAreasTab({ showToast, openConfirm }) {
  const {
    serviceAreas,
    addServiceArea,
    editServiceArea,
    deleteServiceArea
  } = useData();

  const [serviceAreaModal, setServiceAreaModal] = useState({
    isOpen: false,
    mode: 'add',
    id: null,
    name: '',
    notes: '',
    sort_order: 0,
    is_active: true
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Service Areas &amp; Locations ({serviceAreas.length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Locations where ZippyTechSystems provides services. The AI Chatbot uses these real locations to answer customer enquiries.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-cta-yellow"
          onClick={() =>
            setServiceAreaModal({
              isOpen: true,
              mode: 'add',
              id: null,
              name: '',
              notes: '',
              sort_order: serviceAreas.length,
              is_active: true
            })
          }
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
        >
          <Plus size={16} /> Add Location
        </button>
      </div>

      {serviceAreas.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          No service areas added yet. Click &quot;Add Location&quot; to define your service coverage.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {serviceAreas.map((area) => (
            <div key={area.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="#1d5cf0" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{area.name}</h3>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: area.is_active ? 'rgba(18, 161, 80, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: area.is_active ? '#12a150' : '#ef4444'
                    }}
                  >
                    {area.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {area.notes && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: '0.5rem 0', lineHeight: 1.4 }}>
                    {area.notes}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Sort order: {area.sort_order}
                </span>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.65rem' }}
                    onClick={() =>
                      setServiceAreaModal({
                        isOpen: true,
                        mode: 'edit',
                        id: area.id,
                        name: area.name,
                        notes: area.notes || '',
                        sort_order: area.sort_order,
                        is_active: area.is_active
                      })
                    }
                    title="Edit Location"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.65rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                    onClick={() => {
                      openConfirm(
                        'Delete Location',
                        `Are you sure you want to remove "${area.name}"?`,
                        async () => {
                          await deleteServiceArea(area.id);
                          showToast('Location removed.');
                        }
                      );
                    }}
                    title="Delete Location"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Area Modal */}
      {serviceAreaModal.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {serviceAreaModal.mode === 'add' ? 'Add Service Area' : 'Edit Service Area'}
              </h3>
              <button
                type="button"
                onClick={() => setServiceAreaModal((prev) => ({ ...prev, isOpen: false }))}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!serviceAreaModal.name.trim()) return;

                if (serviceAreaModal.mode === 'add') {
                  await addServiceArea({
                    name: serviceAreaModal.name.trim(),
                    notes: serviceAreaModal.notes.trim(),
                    sort_order: parseInt(serviceAreaModal.sort_order, 10) || 0,
                    is_active: serviceAreaModal.is_active
                  });
                  showToast('New location added successfully!');
                } else {
                  await editServiceArea(serviceAreaModal.id, {
                    name: serviceAreaModal.name.trim(),
                    notes: serviceAreaModal.notes.trim(),
                    sort_order: parseInt(serviceAreaModal.sort_order, 10) || 0,
                    is_active: serviceAreaModal.is_active
                  });
                  showToast('Location updated successfully!');
                }

                setServiceAreaModal((prev) => ({ ...prev, isOpen: false }));
              }}
            >
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">City / Region Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Hyderabad, Secunderabad, Online (All India)"
                  value={serviceAreaModal.name}
                  onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, name: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Notes (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. In-person meetings & remote delivery available"
                  value={serviceAreaModal.notes}
                  onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={serviceAreaModal.sort_order}
                    onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, sort_order: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="form-label">Status</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
                    <input
                      type="checkbox"
                      checked={serviceAreaModal.is_active}
                      onChange={(e) => setServiceAreaModal({ ...serviceAreaModal, is_active: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#1d5cf0' }}
                    />
                    <span style={{ fontSize: '0.85rem' }}>Active Location</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setServiceAreaModal((prev) => ({ ...prev, isOpen: false }))}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {serviceAreaModal.mode === 'add' ? 'Add Location' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
