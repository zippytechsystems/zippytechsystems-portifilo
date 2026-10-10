import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  FileCode2,
  Hammer,
  ShieldCheck,
  Rocket,
  Clock,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useQualityTier } from '../context/QualityTierContext';
import { buildWhatsAppUrl } from '../data/content';

const steps = [
  {
    number: '01',
    title: 'Discover',
    tagline: 'Requirement Discovery & Goal Setting',
    duration: 'Day 1 – 2',
    icon: Compass,
    accent: '#1d5cf0',
    summary: 'Direct consultation to understand your business model, customer workflows, and core challenges.',
    details:
      'We begin with a direct 1-on-1 requirements session with founder Lingaswamy on WhatsApp or call. We analyze your customer demographics, existing spreadsheets or paper records, and define clear success metrics before writing a single line of code.',
    deliverables: [
      'Documented Project Scope & Milestone Breakdown',
      'Feature Prioritization Matrix (Must-have vs Nice-to-have)',
      'Dedicated WhatsApp Project Support Channel'
    ],
    founderRole: 'Direct consultation with Founder Lingaswamy'
  },
  {
    number: '02',
    title: 'Plan & Design',
    tagline: 'UI/UX Wireframing & System Architecture',
    duration: 'Day 3 – 5',
    icon: FileCode2,
    accent: '#00f2fe',
    summary: 'Visual mockups, database schemas, and clean mobile-first interactive wireframes.',
    details:
      'We craft clean, intuitive user interfaces tailored for Indian customers. Every screen is designed for high conversion, large tap targets, and frictionless mobile navigation. We select the optimal tech stack for speed, reliability, and low server cost.',
    deliverables: [
      'Interactive Mobile & Desktop Layout Mockups',
      'Database Schema & API Architecture Blueprint',
      'Transparent Milestone Timeline & Handover Plan'
    ],
    founderRole: 'Architecture review & UI aesthetic sign-off'
  },
  {
    number: '03',
    title: 'Agile Build',
    tagline: 'Clean Full-Stack Coding & Automated Pipelines',
    duration: 'Week 2 – 3',
    icon: Hammer,
    accent: '#12a150',
    summary: 'Rapid engineering with production-grade code, offline storage, and WhatsApp integration.',
    details:
      'Our engineers construct modular, maintainable code with zero bloat. We integrate instant WhatsApp messaging, UPI/Razorpay payment gateways, and automated report generators. You receive staging links to test real features as they are built.',
    deliverables: [
      'Staging URL to test features on your own smartphone',
      'WhatsApp API & Payment Gateway Integrations',
      'Weekly Video / WhatsApp Walkthrough Demos'
    ],
    founderRole: 'Lead development & code quality enforcement'
  },
  {
    number: '04',
    title: 'Test & Polish',
    tagline: 'Device Profiling, Edge Cases & Speed Optimization',
    duration: 'Day 18 – 20',
    icon: ShieldCheck,
    accent: '#ffe500',
    summary: 'Rigorous cross-device testing across low-end Androids, iPads, iPhones, and desktop browsers.',
    details:
      'We verify that your system loads in under 1 second even on patchy 4G connections. We simulate edge cases: network disconnects, invalid form entries, and high order volumes. Security audits ensure SSL encryption and tamper-proof records.',
    deliverables: [
      'Sub-second Performance Profiling on 4G Networks',
      'Cross-Device Compatibility & Form Validation Check',
      'SSL Security Certificate & Backup Verification'
    ],
    founderRole: 'End-to-end user acceptance testing'
  },
  {
    number: '05',
    title: 'Launch & Care',
    tagline: 'Cloud Production Deployment & 24/7 Ongoing Support',
    duration: 'Launch Day & Beyond',
    icon: Rocket,
    accent: '#7a2fd0',
    summary: 'Smooth production launch on your domain, staff walkthrough training, and 30 days free care.',
    details:
      'We connect your custom domain (.com / .in), configure high-speed cloud servers, and conduct live walkthrough training for you and your staff. Every project includes complimentary 30 days support to ensure smooth day-to-day operations.',
    deliverables: [
      'Live Production Deployment on Custom Domain',
      'Staff Training Video & Admin Guide Handover',
      '30-Day Complimentary Post-Launch Guarantee'
    ],
    founderRole: 'Personal handover & ongoing WhatsApp assistance'
  }
];

export default function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const { tier } = useQualityTier();
  const isReduced = tier === 'reduced';
  const autoPlayTimerRef = useRef(null);

  const active = steps[activeStep] || steps[0];
  const IconActive = active.icon;

  // Optional auto-rotation if user enables or for cinematic preview
  useEffect(() => {
    if (!isAutoPlaying || isReduced) return;
    autoPlayTimerRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(autoPlayTimerRef.current);
  }, [isAutoPlaying, isReduced]);

  const progressPercent = (activeStep / (steps.length - 1)) * 100;

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--bg-card)',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        padding: 'clamp(1.5rem, 3.5vw, 2.75rem)',
        boxShadow: 'var(--card-shadow)',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${active.accent}12 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none',
          transition: 'background 0.5s ease'
        }}
      />

      {/* Stepper Progress Bar (Desktop & Tablet) */}
      <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
        {/* Background track */}
        <div
          style={{
            position: 'absolute',
            top: '26px',
            left: '30px',
            right: '30px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '2px',
            zIndex: 0
          }}
        >
          {/* Animated filled progress line */}
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #1d5cf0 0%, #00f2fe 50%, #12a150 100%)',
              borderRadius: '2px',
              transition: isReduced ? 'none' : 'width 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
              boxShadow: '0 0 12px rgba(0, 242, 254, 0.5)'
            }}
          />
        </div>

        {/* 5 Node Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}
        >
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isSelected = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <button
                key={step.number}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  setIsAutoPlaying(false);
                }}
                aria-label={`Step ${step.number}: ${step.title}`}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.6rem',
                  maxWidth: '120px',
                  textAlign: 'center'
                }}
              >
                {/* Node circle */}
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: isSelected
                      ? `linear-gradient(135deg, #0b1b4a 0%, ${step.accent} 100%)`
                      : isCompleted
                      ? 'rgba(18, 161, 80, 0.2)'
                      : 'var(--bg-surface)',
                    border: isSelected
                      ? `2px solid ${step.accent}`
                      : isCompleted
                      ? '2px solid #12a150'
                      : '2px solid var(--border-subtle)',
                    color: isSelected
                      ? '#ffffff'
                      : isCompleted
                      ? '#12a150'
                      : 'var(--text-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isSelected
                      ? `0 0 20px ${step.accent}50, 0 4px 15px rgba(0, 0, 0, 0.2)`
                      : 'none',
                    transform: isSelected && !isReduced ? 'scale(1.12)' : 'scale(1)'
                  }}
                >
                  <IconComp size={22} strokeWidth={isSelected ? 2.5 : 2} />
                </div>

                {/* Step number & label */}
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isSelected ? step.accent : 'var(--text-dim)',
                      letterSpacing: '0.04em'
                    }}
                  >
                    STEP {step.number}
                  </div>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 800 : 600,
                      color: isSelected ? 'var(--text-main)' : 'var(--text-dim)',
                      transition: 'color 0.2s ease',
                      display: 'none' // Hidden on ultra-compact mobile, visible on desktop via CSS or media
                    }}
                    className="step-title-desktop"
                  >
                    {step.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Story Deep Dive Card */}
      <div
        className="glass-card"
        style={{
          padding: 'clamp(1.5rem, 3vw, 2.25rem)',
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.65)',
          border: `1px solid ${active.accent}35`,
          borderLeft: `5px solid ${active.accent}`,
          boxShadow: `0 15px 35px rgba(0, 0, 0, 0.2), 0 0 25px ${active.accent}15`,
          transition: 'all 0.4s ease'
        }}
      >
        {/* Step Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1rem',
                fontWeight: 800,
                color: active.accent,
                background: `${active.accent}15`,
                border: `1px solid ${active.accent}40`,
                padding: '4px 12px',
                borderRadius: '8px'
              }}
            >
              Step {active.number} of 05
            </span>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                color: 'var(--text-dim)',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <Clock size={13} color={active.accent} />
              <span>Timeline: {active.duration}</span>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#ffe500',
              background: 'rgba(255, 229, 0, 0.08)',
              border: '1px solid rgba(255, 229, 0, 0.25)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)'
            }}
          >
            <UserCheck size={14} />
            <span>{active.founderRole}</span>
          </div>
        </div>

        {/* Title & Tagline */}
        <h4
          style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 0.35rem 0',
            fontFamily: 'var(--font-display)'
          }}
        >
          {active.title}: <span style={{ color: active.accent }}>{active.tagline}</span>
        </h4>

        {/* Summary Lead */}
        <p
          style={{
            fontSize: '1.02rem',
            color: 'var(--text-body)',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            fontWeight: 500
          }}
        >
          {active.details}
        </p>

        {/* Deliverables Checklist */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              marginBottom: '0.75rem'
            }}
          >
            What You Receive In This Step:
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.75rem'
            }}
          >
            {active.deliverables.map((item, dIdx) => (
              <div
                key={dIdx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.65rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px'
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: `${active.accent}25`,
                    color: active.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <CheckCircle2 size={13} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.45, fontWeight: 500 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation & WhatsApp Action */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              disabled={activeStep === 0}
              onClick={() => {
                setActiveStep((prev) => Math.max(0, prev - 1));
                setIsAutoPlaying(false);
              }}
              className="btn btn-outline"
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                opacity: activeStep === 0 ? 0.4 : 1,
                cursor: activeStep === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous Step
            </button>

            <button
              type="button"
              disabled={activeStep === steps.length - 1}
              onClick={() => {
                setActiveStep((prev) => Math.min(steps.length - 1, prev + 1));
                setIsAutoPlaying(false);
              }}
              className="btn btn-primary"
              style={{
                padding: '0.5rem 1.15rem',
                fontSize: '0.85rem',
                opacity: activeStep === steps.length - 1 ? 0.4 : 1,
                cursor: activeStep === steps.length - 1 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>Next Step ({steps[(activeStep + 1) % steps.length].title})</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <a
            href={buildWhatsAppUrl(
              `Hi Lingaswamy, I'm reviewing Step ${active.number} (${active.title}) in your process and would like to start a project.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-cta-yellow"
            style={{ padding: '0.5rem 1.15rem', fontSize: '0.85rem' }}
          >
            <MessageCircle size={15} />
            <span>Start Step 01 With Us</span>
          </a>
        </div>
      </div>
    </div>
  );
}
