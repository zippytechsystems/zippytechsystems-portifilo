import React, { useState, useEffect } from 'react';
import {
  SlidersHorizontal,
  RefreshCw,
  Save,
  Compass,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DEFAULT_DESIGN_SETTINGS } from '../../lib/api';

export default function DesignTab({ showToast }) {
  const { designSettings, persistDesignSettings } = useData();
  const [designForm, setDesignForm] = useState(designSettings || DEFAULT_DESIGN_SETTINGS);
  const [savingDesign, setSavingDesign] = useState(false);

  useEffect(() => {
    if (designSettings) {
      setDesignForm(designSettings);
    }
  }, [designSettings]);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SlidersHorizontal size={24} color="#1d5cf0" />
            <span>Design &amp; Motion Settings</span>
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Control dynamic visual effects and hardware performance tiers. Toggles apply immediately to live visitors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => {
              setDesignForm(DEFAULT_DESIGN_SETTINGS);
              showToast('Settings reset to system defaults. Click Save to publish.');
            }}
            className="btn btn-outline"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={15} />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="button"
            disabled={savingDesign}
            onClick={async () => {
              setSavingDesign(true);
              const res = await persistDesignSettings(designForm);
              setSavingDesign(false);
              if (res?.success) {
                showToast('Design settings saved and live on Hostinger!', 'success');
              } else {
                showToast(res?.error || 'Failed to save design settings.', 'error');
              }
            }}
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
          >
            <Save size={15} />
            <span>{savingDesign ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Performance Tier Card */}
      <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(29, 92, 240, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={18} color="#1d5cf0" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Device Quality Tier Override</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              Automatically detects visitor hardware capability, network data-saver, and prefers-reduced-motion.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {[
            { value: 'auto', title: 'Auto (Recommended)', desc: 'Detects GPU, memory & data-saver mode' },
            { value: 'full', title: 'Force Full Tier', desc: 'Enables all animations on desktop' },
            { value: 'lite', title: 'Force Lite Tier', desc: 'Conserves mobile battery & data' },
            { value: 'reduced', title: 'Force Reduced Motion', desc: 'Disables transitions & animations' }
          ].map((tierOpt) => {
            const isSelected = designForm.quality_override === tierOpt.value;
            return (
              <div
                key={tierOpt.value}
                onClick={() => setDesignForm((prev) => ({ ...prev, quality_override: tierOpt.value }))}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #1d5cf0' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(29, 92, 240, 0.08)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#1d5cf0' : 'var(--text-main)' }}>
                    {tierOpt.title}
                  </span>
                  {isSelected && <CheckCircle2 size={16} color="#1d5cf0" />}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4, display: 'block' }}>
                  {tierOpt.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Section Visual Experience */}
      <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(18, 161, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Eye size={18} color="#12a150" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Hero Section Visual Experience</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              Select the background style rendered behind the headline on the home page.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { value: 'mesh', title: 'Ambient Mesh Float', desc: 'Soft floating brand color orbs (Fast, zero layout shift)' },
            { value: '3d', title: '3D Floating Objects', desc: 'Interactive brand geometric shapes (Full tier only)' },
            { value: 'gradient', title: 'Clean Linear Gradient', desc: 'Ultra-lightweight static brand gradient' }
          ].map((styleOpt) => {
            const isSelected = designForm.hero_style === styleOpt.value;
            return (
              <div
                key={styleOpt.value}
                onClick={() => setDesignForm((prev) => ({ ...prev, hero_style: styleOpt.value }))}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #12a150' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(18, 161, 80, 0.08)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#12a150' : 'var(--text-main)' }}>
                    {styleOpt.title}
                  </span>
                  {isSelected && <CheckCircle2 size={16} color="#12a150" />}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4, display: 'block' }}>
                  {styleOpt.desc}
                </span>
              </div>
            );
          })}
        </div>

        {/* Optional Video Background Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.82rem' }}>Optional Video Background URL (.mp4 / .webm)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://.../video.mp4 (optional)"
              value={designForm.video_background_url || ''}
              onChange={(e) => setDesignForm((prev) => ({ ...prev, video_background_url: e.target.value }))}
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.82rem' }}>Video Poster Image URL (fallback image)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://.../poster.webp (optional)"
              value={designForm.video_poster_url || ''}
              onChange={(e) => setDesignForm((prev) => ({ ...prev, video_poster_url: e.target.value }))}
              style={{ fontSize: '0.88rem' }}
            />
          </div>
        </div>
      </div>

      {/* Individual Feature Toggles */}
      <div className="card" style={{ padding: '1.75rem', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(122, 47, 208, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SlidersHorizontal size={18} color="#7a2fd0" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Interactive Effects &amp; Micro-Animations</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: 0 }}>
              Enable or disable specific visual effects across the entire site with zero redeploy needed.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {[
            { key: 'liquid_mask_enabled', label: 'Hero Liquid Mask Reveal', desc: 'Dual-layer interactive cursor reveal canvas in Hero' },
            { key: 'particle_sphere_enabled', label: '3D Particle Constellation', desc: 'Interactive 3D particle sphere in Hero background' },
            { key: 'tech_orbit_enabled', label: '3D Orbiting Tech Cloud', desc: 'Concentric orbiting skills ring and dual marquee' },
            { key: 'coverflow_enabled', label: '3D Coverflow Showcase', desc: 'Interactive 3D perspective carousel for projects' },
            { key: 'magnetic_buttons_enabled', label: 'Magnetic CTA Buttons', desc: 'Pulls primary buttons subtly toward mouse on desktop fine pointer' },
            { key: 'cursor_effect_enabled', label: 'Cursor Follower Glow', desc: 'Subtle glowing trail following pointer on capable desktop hardware' },
            { key: 'parallax_enabled', label: 'Parallax Layer Depth', desc: 'Smooth multi-plane scroll depth on section backgrounds' },
            { key: 'lottie_enabled', label: 'Lottie Vector Icons', desc: 'Smooth animated SVG icons for domain headers and packages' },
            { key: 'tooltip_enabled', label: 'Rich Floating Tooltips', desc: 'Interactive info hints on price tags and technology badges' }
          ].map((toggle) => {
            const isChecked = Boolean(designForm[toggle.key]);
            return (
              <div
                key={toggle.key}
                onClick={() => setDesignForm((prev) => ({ ...prev, [toggle.key]: !prev[toggle.key] }))}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  border: isChecked ? '1px solid rgba(122, 47, 208, 0.35)' : '1px solid var(--border-subtle)',
                  background: isChecked ? 'rgba(122, 47, 208, 0.05)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // handled by parent onClick
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#7a2fd0',
                    marginTop: '2px',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isChecked ? '#c084fc' : 'var(--text-main)', marginBottom: '2px' }}>
                    {toggle.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                    {toggle.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Save Reminder */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginBottom: '2rem' }}>
        <button
          type="button"
          disabled={savingDesign}
          onClick={async () => {
            setSavingDesign(true);
            const res = await persistDesignSettings(designForm);
            setSavingDesign(false);
            if (res?.success) {
              showToast('Design settings saved and live on Hostinger!', 'success');
            } else {
              showToast(res?.error || 'Failed to save design settings.', 'error');
            }
          }}
          className="btn btn-primary"
          style={{ padding: '0.7rem 1.75rem', fontSize: '0.92rem' }}
        >
          <Save size={16} />
          <span>{savingDesign ? 'Saving Changes...' : 'Save Design Settings'}</span>
        </button>
      </div>
    </div>
  );
}
