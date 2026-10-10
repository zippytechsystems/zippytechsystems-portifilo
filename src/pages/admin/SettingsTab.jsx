import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';

export default function SettingsTab({ showToast }) {
  const { settingsData, persistSettings } = useData();
  const [settingsForm, setSettingsForm] = useState(settingsData || {});

  useEffect(() => {
    if (settingsData) {
      setSettingsForm(settingsData);
    }
  }, [settingsData]);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    persistSettings(settingsForm);
    showToast('Site settings updated successfully!');
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
          Site &amp; Contact Settings
        </h1>
        <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
          Configure phone numbers, WhatsApp routing, prefilled message text, and company taglines.
        </p>
      </div>

      <div className="card" style={{ maxWidth: '680px', padding: '2rem' }}>
        <form onSubmit={handleSaveSettings}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Founder &amp; Solutions Architect Full Name</label>
            <input
              type="text"
              className="form-input"
              value={settingsForm.founderName || 'Lingaswamy Maddeboina'}
              onChange={(e) => setSettingsForm({ ...settingsForm, founderName: e.target.value })}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Used across website badges, about pages, chatbot system prompt, and WhatsApp communications.
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number (Calling)</label>
              <input
                type="text"
                className="form-input"
                value={settingsForm.phone || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Business WhatsApp Number (Bot Number)</label>
              <input
                type="text"
                className="form-input"
                value={settingsForm.whatsappNumber || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Default WhatsApp Prefilled Greeting</label>
            <textarea
              rows={2}
              className="form-input"
              value={settingsForm.defaultWhatsAppMessage || 'Hi Lingaswamy, I would like to get a quote for my business.'}
              onChange={(e) => setSettingsForm({ ...settingsForm, defaultWhatsAppMessage: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Primary Brand Tagline</label>
            <input
              type="text"
              className="form-input"
              value={settingsForm.tagline || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Secondary Tagline</label>
            <input
              type="text"
              className="form-input"
              value={settingsForm.secondaryTagline || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, secondaryTagline: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Office Location</label>
            <input
              type="text"
              className="form-input"
              value={settingsForm.location || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, location: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Instagram Profile URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.instagram.com/zippytechsystems"
                value={settingsForm.instagramUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">YouTube Channel URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.youtube.com/@zippytechsystems"
                value={settingsForm.youtubeUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, youtubeUrl: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Facebook Page URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.facebook.com/zippytechsystems"
                value={settingsForm.facebookUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn Profile / Company URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.linkedin.com/company/zippytechsystems"
                value={settingsForm.linkedinUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Response Time Target</label>
            <input
              type="text"
              className="form-input"
              placeholder="24 hours"
              value={settingsForm.responseTimeText || '24 hours'}
              onChange={(e) => setSettingsForm({ ...settingsForm, responseTimeText: e.target.value })}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
              Used on customer confirmation banners and Project Builder (e.g. "We will contact you within 24 hours").
            </div>
          </div>

          {/* Business Info (AI Chatbot Knowledge) */}
          <div style={{ marginTop: '1.75rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#1d5cf0' }}>
              Business Info (AI Chatbot Knowledge Base)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Leave any field blank if not applicable. The AI Chatbot will ONLY mention non-empty fields. If a client asks about an empty field, the chatbot will politely offer WhatsApp handoff.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Working Hours / Timings</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mon - Sat: 9:00 AM - 8:00 PM"
                  value={settingsForm.workingHours || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Support / Business Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contact@zippysoftwares.in"
                  value={settingsForm.email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Office / Physical Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hyderabad, Telangana, India"
                value={settingsForm.officeAddress || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">About ZippyTechSystems / Founder Note</label>
              <textarea
                rows={2}
                className="form-input"
                placeholder="Brief summary of founder Lingaswamy's focus on affordable web, app & AI solutions..."
                value={settingsForm.aboutText || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, aboutText: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Languages Supported</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="English, Telugu, Hindi"
                  value={settingsForm.languagesSupported || 'English, Telugu, Hindi'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, languagesSupported: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery &amp; Turnaround Note</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Websites delivered in 3-5 days"
                  value={settingsForm.deliveryNote || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, deliveryNote: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* WhatsApp & Email Automation Settings */}
          <div style={{ marginTop: '1.75rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem', color: '#12a150' }}>
              WhatsApp &amp; Communication Automation
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Manage the 24/7 AI WhatsApp chatbot, Coexistence app pauses, and notification alerts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Master WhatsApp Bot Switch */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={settingsForm.whatsappBotEnabled ?? true}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappBotEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#12a150' }}
                />
                <span><strong>Enable WhatsApp AI Chatbot</strong> (AI replies automatically to customer WhatsApp messages)</span>
              </label>

              {/* Email Alert (Primary) */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={settingsForm.notifyEmailEnabled ?? true}
                  onChange={(e) => setSettingsForm({ ...settingsForm, notifyEmailEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#1d5cf0' }}
                />
                <span><strong>Send Admin Email Alerts (Primary)</strong> (Instant notification via Resend when new enquiry arrives)</span>
              </label>

              {/* WhatsApp Admin Alert (Optional, OFF by default) */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(settingsForm.waAdminAlertEnabled)}
                  onChange={(e) => setSettingsForm({ ...settingsForm, waAdminAlertEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#12a150' }}
                />
                <span><strong>Optional: WhatsApp Admin Alert</strong> (Requires personal number below; never sends to bot number)</span>
              </label>
            </div>

            {/* Personal Number for WA Alerts */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Personal WhatsApp Number for Admin Alerts (WA_ADMIN_TO)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 9876543210 (your personal number, NOT 6302690251)"
                value={settingsForm.waAdminTo || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, waAdminTo: e.target.value })}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                <strong>Important:</strong> Must NOT be {settingsForm.whatsappNumber || '6302690251'} because Meta does not allow the bot to message itself. If left blank, WhatsApp admin alerts are skipped silently.
              </div>
            </div>

            {/* Coexistence Pause Duration */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Coexistence Mode: Human Reply Pause Duration (Hours)</label>
              <input
                type="number"
                min={1}
                max={72}
                className="form-input"
                value={settingsForm.humanPauseHours ?? 2}
                onChange={(e) => setSettingsForm({ ...settingsForm, humanPauseHours: e.target.value })}
              />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                When you reply to a customer from the WhatsApp Business mobile app on your phone, the AI assistant will automatically pause for this contact for {settingsForm.humanPauseHours || 2} hours. You can resume AI at any time in the admin inbox.
              </div>
            </div>

            {/* Additional WhatsApp Automation Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem', background: 'var(--bg-surface)', padding: '1rem', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(settingsForm.whatsappAutoConfirm)}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappAutoConfirm: e.target.checked })}
                  style={{ accentColor: '#12a150' }}
                />
                <span>Enquiry Auto-Confirm</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(settingsForm.whatsappFollowups)}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappFollowups: e.target.checked })}
                  style={{ accentColor: '#12a150' }}
                />
                <span>Smart Follow-ups (24h)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={Boolean(settingsForm.dailySummaryEnabled)}
                  onChange={(e) => setSettingsForm({ ...settingsForm, dailySummaryEnabled: e.target.checked })}
                  style={{ accentColor: '#12a150' }}
                />
                <span>Daily Summary (9 PM)</span>
              </label>
            </div>

            {/* Quiet Hours */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Quiet Hours Start (No outbound automations)</label>
                <input
                  type="time"
                  className="form-input"
                  value={settingsForm.quietHoursStart || '22:00'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, quietHoursStart: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.82rem' }}>Quiet Hours End</label>
                <input
                  type="time"
                  className="form-input"
                  value={settingsForm.quietHoursEnd || '08:00'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, quietHoursEnd: e.target.value })}
                />
              </div>
            </div>

            {/* Multilingual WhatsApp Auto-reply Templates */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '8px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                Customer WhatsApp Message Templates (By Customer Language)
              </h4>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>English Template</label>
                <textarea
                  rows={2}
                  className="form-input"
                  value={settingsForm.waTemplateEn || 'Thank you for contacting ZippyTechSystems. We received your enquiry and will contact you within 24 hours.'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, waTemplateEn: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Telugu (తెలుగు) Template</label>
                <textarea
                  rows={2}
                  className="form-input"
                  value={settingsForm.waTemplateTe || 'ZippyTechSystems ను సంప్రదించినందుకు ధన్యవాదాలు. మీ విచారణ మాకు అందింది, మేము 24 గంటల్లో మిమ్మల్ని సంప్రదిస్తాము.'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, waTemplateTe: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Hindi (हिन्दी) Template</label>
                <textarea
                  rows={2}
                  className="form-input"
                  value={settingsForm.waTemplateHi || 'ZippyTechSystems से संपर्क करने के लिए धन्यवाद। हमें आपकी पूछताछ मिल गई है और हम 24 घंटे के भीतर आपसे संपर्क करेंगे।'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, waTemplateHi: e.target.value })}
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-cta-yellow" style={{ padding: '0.75rem 1.75rem', fontWeight: 700 }}>
            Save Site Settings
          </button>
        </form>
      </div>
    </div>
  );
}
