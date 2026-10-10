import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Save,
  CheckCircle2,
  History
} from 'lucide-react';

export default function PricesTab({ showToast }) {
  const {
    domainsData,
    packagesData,
    isLiveConnected,
    priceHistory,
    updateDomainPrice,
    updatePackagePrice,
    saveAllPrices,
    formatINR
  } = useData();

  const [domainPriceInputs, setDomainPriceInputs] = useState({});
  const [packagePriceInputs, setPackagePriceInputs] = useState({});
  const [pricesSaving, setPricesSaving] = useState(false);
  const [pricesSuccessLink, setPricesSuccessLink] = useState(false);

  useEffect(() => {
    if (domainsData && domainsData.length > 0) {
      const initial = {};
      domainsData.forEach((d) => {
        initial[d.key] = d.starting_price;
      });
      setDomainPriceInputs(initial);
    }
  }, [domainsData]);

  useEffect(() => {
    if (packagesData && packagesData.length > 0) {
      const initial = {};
      packagesData.forEach((p) => {
        initial[p.id] = p.price;
      });
      setPackagePriceInputs(initial);
    }
  }, [packagesData]);

  const handleSaveDomainPrice = async (key, name) => {
    const val = Number(domainPriceInputs[key]);
    if (isNaN(val) || val < 0) {
      showToast && showToast('Please enter a valid price (0 or positive number).', 'error');
      return;
    }
    const res = await updateDomainPrice(key, val);
    if (res && res.success) {
      showToast && showToast(`Updated ${name} starting price to ${formatINR(val)}!`);
      setPricesSuccessLink(true);
    } else {
      showToast && showToast((res && res.error) || 'Failed to update price.', 'error');
    }
  };

  const handleSavePackagePrice = async (pkg) => {
    const val = Number(packagePriceInputs[pkg.id]);
    if (isNaN(val) || val < 0) {
      showToast && showToast('Please enter a valid price (0 or positive number).', 'error');
      return;
    }
    const res = await updatePackagePrice(pkg.id, val, pkg.name);
    if (res && res.success) {
      showToast && showToast(`Updated ${pkg.name} package price to ${formatINR(val)}!`);
      setPricesSuccessLink(true);
    } else {
      showToast && showToast((res && res.error) || 'Failed to update package price.', 'error');
    }
  };

  const handleSaveAllPrices = async () => {
    setPricesSaving(true);
    const domainsList = domainsData.map((d) => ({
      key: d.key,
      price: Number(domainPriceInputs[d.key] !== undefined ? domainPriceInputs[d.key] : d.starting_price)
    }));
    const packagesList = packagesData.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(packagePriceInputs[p.id] !== undefined ? packagePriceInputs[p.id] : p.price)
    }));
    const res = await saveAllPrices(domainsList, packagesList);
    setPricesSaving(false);
    if (res && res.success) {
      showToast && showToast('All prices saved successfully! Live website updated instantly.');
      setPricesSuccessLink(true);
    } else {
      showToast && showToast((res && res.error) || 'Failed to save all prices.', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, margin: 0 }}>
              Live Pricing Control
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: '12px',
                background: isLiveConnected ? 'rgba(18, 161, 80, 0.15)' : 'rgba(255, 229, 0, 0.2)',
                color: isLiveConnected ? '#12a150' : '#ffe500',
                border: isLiveConnected ? '1px solid rgba(18, 161, 80, 0.3)' : '1px solid rgba(255, 229, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isLiveConnected ? '#12a150' : '#ffe500' }} />
              {isLiveConnected ? 'Realtime Auto-Update Active' : 'Fallback Mode'}
            </span>
          </div>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', margin: 0 }}>
            Any price saved here updates instantly on the live website (headers, packages, FAQs &amp; WhatsApp greetings) with zero code changes or redeploy.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/#pricing"
            target="_blank"
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}
          >
            <ExternalLink size={15} />
            <span>View on Website</span>
          </Link>

          <button
            type="button"
            onClick={handleSaveAllPrices}
            disabled={pricesSaving}
            className="btn btn-cta-yellow"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.92rem', padding: '0.65rem 1.25rem' }}
          >
            <Save size={16} />
            <span>{pricesSaving ? 'Saving All...' : 'Save All Prices'}</span>
          </button>
        </div>
      </div>

      {pricesSuccessLink && (
        <div
          style={{
            background: 'rgba(18, 161, 80, 0.12)',
            border: '1px solid rgba(18, 161, 80, 0.3)',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#12a150', fontWeight: 600 }}>
            <CheckCircle2 size={18} />
            <span>Prices updated and saved to Hostinger MySQL! Live website in sync.</span>
          </div>
          <Link
            to="/"
            target="_blank"
            style={{
              color: '#12a150',
              fontWeight: 700,
              textDecoration: 'underline',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Open Live Website</span>
            <ExternalLink size={14} />
          </Link>
        </div>
      )}

      {/* DOMAIN STARTING PRICES */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
            1. Domain Starting Prices
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: 0 }}>
            These prices appear in the hero section, domain banners, and prefilled quote messages.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {domainsData.map((dom) => {
            const currentValue = domainPriceInputs[dom.key] !== undefined ? domainPriceInputs[dom.key] : dom.starting_price;
            return (
              <div
                key={dom.key}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: dom.color
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                      {dom.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      {dom.price_label || 'Starting from'} • Live value: <strong style={{ color: dom.color }}>{formatINR(dom.starting_price)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>₹</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      className="form-input"
                      style={{ width: '130px', padding: '0.45rem 0.65rem', fontWeight: 700, fontSize: '0.95rem' }}
                      value={currentValue}
                      onChange={(e) =>
                        setDomainPriceInputs((prev) => ({
                          ...prev,
                          [dom.key]: e.target.value
                        }))
                      }
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveDomainPrice(dom.key, dom.name)}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PACKAGE PRICES */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.35rem 0' }}>
            2. Pricing Packages
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', margin: 0 }}>
            Package prices for Starter, Growth, and Custom tiers across all service domains.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {packagesData.map((pkg) => {
            const currentValue = packagePriceInputs[pkg.id] !== undefined ? packagePriceInputs[pkg.id] : pkg.price;
            const domObj = domainsData.find((d) => d.key === pkg.domain_id);
            const color = domObj ? domObj.color : '#1d5cf0';

            return (
              <div
                key={pkg.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: '10px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: `${color}20`,
                        color: color
                      }}
                    >
                      {pkg.domain_id}
                    </span>
                    {pkg.is_popular && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: '#ffe500',
                          color: '#0b1b4a',
                          padding: '2px 7px',
                          borderRadius: '6px'
                        }}
                      >
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                    {pkg.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                    Live on site: <strong>{formatINR(pkg.price)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-dim)' }}>₹</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    className="form-input"
                    style={{ flex: 1, padding: '0.45rem 0.65rem', fontWeight: 700, fontSize: '0.95rem' }}
                    value={currentValue}
                    onChange={(e) =>
                      setPackagePriceInputs((prev) => ({
                        ...prev,
                        [pkg.id]: e.target.value
                      }))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => handleSavePackagePrice(pkg)}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                  >
                    <Save size={13} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRICE HISTORY AUDIT LOG */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
          <History size={20} color="#1d5cf0" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            Price Change History Log
          </h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
          Automated database triggers record every price revision for audit and transparency.
        </p>

        {priceHistory && priceHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Item</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Previous Price</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>New Price</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Difference</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Changed At</th>
                </tr>
              </thead>
              <tbody>
                {priceHistory.map((ph, idx) => {
                  const diff = Number(ph.new_price) - Number(ph.old_price);
                  const isIncrease = diff > 0;
                  return (
                    <tr key={ph.id || idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {ph.item_name}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-dim)' }}>
                        {formatINR(ph.old_price)}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#1d5cf0' }}>
                        {formatINR(ph.new_price)}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: isIncrease ? '#ef4444' : '#12a150',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          {isIncrease ? '+' : ''}{formatINR(diff)}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                        {new Date(ph.changed_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            No price revisions recorded yet. Once you modify and save a price, the audit entry will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
