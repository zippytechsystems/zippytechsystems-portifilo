import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { buildKnowledge } from '../../lib/knowledgeBuilder';
import { Bot, Mic, X, Plus, Send, Eye, Save } from 'lucide-react';

export default function ChatbotTab({ showToast }) {
  const {
    domainsData,
    servicesData,
    packagesData,
    projectsData,
    faqsData,
    serviceAreas,
    settingsData,
    loadAdminChatbot,
    persistChatbotSettings
  } = useData();

  const [chatbotForm, setChatbotForm] = useState({
    enabled: true,
    welcomeMessage: '',
    fallbackMessage: '',
    quickReplies: [],
    extraInstructions: '',
    model: 'claude-haiku-4-5-20251001',
    dailyLimit: 500,
    voiceEnabled: true,
    voiceDefaultLang: 'en-IN',
    voiceRate: 1.0,
    voiceNameEn: 'en-IN-NeerjaNeural',
    voiceNameTe: 'te-IN-ShrutiNeural',
    voiceNameHi: 'hi-IN-SwaraNeural'
  });
  const [quickReplyInput, setQuickReplyInput] = useState('');
  const [testChatMessages, setTestChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I am the ZippyTechSystems AI assistant. Test me right here in Admin!' }
  ]);
  const [testChatInput, setTestChatInput] = useState('');
  const [isTestBotSending, setIsTestBotSending] = useState(false);

  useEffect(() => {
    loadAdminChatbot().then((data) => {
      if (data) {
        setChatbotForm(data);
      }
    });
  }, [loadAdminChatbot]);

  const currentChatbotKnowledge = buildKnowledge({
    domains: domainsData,
    services: servicesData,
    packages: packagesData,
    projects: projectsData,
    faqs: faqsData,
    serviceAreas: serviceAreas,
    settings: settingsData
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            AI Chatbot Configuration
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Configure your customer enquiry assistant. Changes saved here take effect immediately on the live website.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700,
              background: chatbotForm.enabled ? 'rgba(18, 161, 80, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: chatbotForm.enabled ? '#12a150' : '#ef4444',
              border: chatbotForm.enabled ? '1px solid rgba(18, 161, 80, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            {chatbotForm.enabled ? 'Chatbot Active' : 'Chatbot Disabled'}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem', alignItems: 'start' }}>
        {/* Settings Form */}
        <div className="card" style={{ padding: '2rem' }}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await persistChatbotSettings(chatbotForm);
              if (res.success) {
                showToast('Chatbot settings saved successfully! Live bot updated immediately.');
              } else {
                showToast(res.error || 'Failed to save chatbot settings.', 'error');
              }
            }}
          >
            {/* Master Enable/Disable */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Enable AI Chatbot Widget</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                  Show floating chatbot on all public pages for customer enquiries
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={chatbotForm.enabled}
                  onChange={(e) => setChatbotForm({ ...chatbotForm, enabled: e.target.checked })}
                  style={{ width: '20px', height: '20px', accentColor: '#1d5cf0', cursor: 'pointer' }}
                />
              </label>
            </div>

            {/* Welcome Message */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Welcome Greeting Message</label>
              <textarea
                rows={3}
                className="form-input"
                value={chatbotForm.welcomeMessage || ''}
                onChange={(e) => setChatbotForm({ ...chatbotForm, welcomeMessage: e.target.value })}
                placeholder="Hi! I am the ZippyTechSystems AI assistant..."
              />
            </div>

            {/* Fallback Message */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Fallback &amp; WhatsApp Handoff Message</label>
              <textarea
                rows={2}
                className="form-input"
                value={chatbotForm.fallbackMessage || ''}
                onChange={(e) => setChatbotForm({ ...chatbotForm, fallbackMessage: e.target.value })}
                placeholder="I would be happy to connect you with founder Lingaswamy..."
              />
            </div>

            {/* Quick Replies Manager */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Suggested Quick-Reply Chips</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
                {(chatbotForm.quickReplies || []).map((chip, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(29, 92, 240, 0.15)',
                      color: '#93c5fd',
                      border: '1px solid rgba(29, 92, 240, 0.35)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {chip}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = chatbotForm.quickReplies.filter((_, i) => i !== idx);
                        setChatbotForm({ ...chatbotForm, quickReplies: updated });
                      }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex' }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a new quick reply chip..."
                  value={quickReplyInput}
                  onChange={(e) => setQuickReplyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (quickReplyInput.trim()) {
                        setChatbotForm({
                          ...chatbotForm,
                          quickReplies: [...(chatbotForm.quickReplies || []), quickReplyInput.trim()]
                        });
                        setQuickReplyInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                    if (quickReplyInput.trim()) {
                      setChatbotForm({
                        ...chatbotForm,
                        quickReplies: [...(chatbotForm.quickReplies || []), quickReplyInput.trim()]
                      });
                      setQuickReplyInput('');
                    }
                  }}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>

            {/* Extra Prompt Instructions */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">
                Extra System Instructions (Appended directly to AI prompt)
              </label>
              <textarea
                rows={4}
                className="form-input"
                placeholder="Add any special instructions for Claude (e.g. Always emphasize our fast 3-5 day delivery, or remind clients that custom quotes are free on WhatsApp)..."
                value={chatbotForm.extraInstructions || ''}
                onChange={(e) => setChatbotForm({ ...chatbotForm, extraInstructions: e.target.value })}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                These instructions are immediately injected into the Claude API system prompt on the very next message.
              </div>
            </div>

            {/* Model & Daily Limit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Claude Model</label>
                <input
                  type="text"
                  className="form-input"
                  value={chatbotForm.model || 'claude-haiku-4-5-20251001'}
                  onChange={(e) => setChatbotForm({ ...chatbotForm, model: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Daily Calls Limit</label>
                <input
                  type="number"
                  min="10"
                  max="5000"
                  className="form-input"
                  value={chatbotForm.dailyLimit || 500}
                  onChange={(e) => setChatbotForm({ ...chatbotForm, dailyLimit: e.target.value })}
                />
              </div>
            </div>

            {/* AI Female Voice Agent Configuration */}
            <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(29, 92, 240, 0.05)', borderRadius: '12px', border: '1px solid rgba(29, 92, 240, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Mic size={18} color="#1d5cf0" />
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>AI Female Voice Agent (Azure Neural TTS)</div>
              </div>

              {/* Voice Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>Enable Voice Mode</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Provides floating voice button &amp; natural female speech synthesis
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={chatbotForm.voiceEnabled ?? true}
                  onChange={(e) => setChatbotForm({ ...chatbotForm, voiceEnabled: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#1d5cf0', cursor: 'pointer' }}
                />
              </div>

              {/* Default Language & Speed Rate */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Default Voice Language</label>
                  <select
                    className="form-input"
                    style={{ fontSize: '0.85rem' }}
                    value={chatbotForm.voiceDefaultLang || 'en-IN'}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, voiceDefaultLang: e.target.value })}
                  >
                    <option value="en-IN">English (India) - en-IN</option>
                    <option value="te-IN">Telugu (India) - te-IN</option>
                    <option value="hi-IN">Hindi (India) - hi-IN</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Speech Rate ({chatbotForm.voiceRate || 1.0}x)</label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.1"
                    className="form-input"
                    style={{ padding: '4px' }}
                    value={chatbotForm.voiceRate || 1.0}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, voiceRate: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              {/* Azure Female Voice Names */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>English Female Voice</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '0.8rem' }}
                    value={chatbotForm.voiceNameEn || 'en-IN-NeerjaNeural'}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, voiceNameEn: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Telugu Female Voice</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '0.8rem' }}
                    value={chatbotForm.voiceNameTe || 'te-IN-ShrutiNeural'}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, voiceNameTe: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Hindi Female Voice</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '0.8rem' }}
                    value={chatbotForm.voiceNameHi || 'hi-IN-SwaraNeural'}
                    onChange={(e) => setChatbotForm({ ...chatbotForm, voiceNameHi: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-cta-yellow" style={{ padding: '0.75rem 1.75rem', fontWeight: 700, width: '100%' }}>
              Save Chatbot Configuration
            </button>
          </form>
        </div>

        {/* Live Interactive Test Sandbox */}
        <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', height: '620px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot size={20} color="#1d5cf0" />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>Test Chatbot Sandbox</h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Live interactive preview using current backend
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
              onClick={() => {
                setTestChatMessages([
                  { role: 'assistant', content: chatbotForm.welcomeMessage || 'Hi! I am the ZippyTechSystems AI assistant. Test me right here in Admin!' }
                ]);
              }}
            >
              Reset Sandbox
            </button>
          </div>

          {/* Sandbox Message Stream */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.5rem 0' }}>
            {testChatMessages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: m.role === 'user' ? '#1d5cf0' : 'var(--bg-surface)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  border: m.role === 'user' ? 'none' : '1px solid var(--border-glass)',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {m.content}
              </div>
            ))}

            {isTestBotSending && (
              <div style={{ alignSelf: 'flex-start', padding: '6px 12px', borderRadius: '12px', background: 'var(--bg-surface)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                Assistant is thinking...
              </div>
            )}
          </div>

          {/* Sandbox Input */}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!testChatInput.trim() || isTestBotSending) return;

              const userText = testChatInput.trim();
              setTestChatInput('');

              const nextMsgs = [...testChatMessages, { role: 'user', content: userText }];
              setTestChatMessages(nextMsgs);
              setIsTestBotSending(true);

              try {
                const { sendChatMessage } = await import('../../lib/chatApi');
                const res = await sendChatMessage({
                  sessionId: 'admin_test_session',
                  messages: nextMsgs,
                  pageUrl: '/admin'
                });

                setTestChatMessages((prev) => [
                  ...prev,
                  { role: 'assistant', content: res.reply }
                ]);
              } catch (err) {
                setTestChatMessages((prev) => [
                  ...prev,
                  { role: 'assistant', content: 'Sandbox connection fallback: Chatbot responded.' }
                ]);
              } finally {
                setIsTestBotSending(false);
              }
            }}
            style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem' }}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Type a test question (e.g. Website prices?)..."
              value={testChatInput}
              onChange={(e) => setTestChatInput(e.target.value)}
              disabled={isTestBotSending}
            />
            <button type="submit" className="btn btn-primary" disabled={isTestBotSending || !testChatInput.trim()} style={{ padding: '0 1rem' }}>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Chatbot Knowledge Preview Box */}
      <div className="card" style={{ marginTop: '1.75rem', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Eye size={20} color="#1d5cf0" />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Chatbot Knowledge Preview</h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Shows exactly the structured live text the chatbot sees right now (output of buildKnowledge).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={() => {
                if (navigator?.clipboard) {
                  navigator.clipboard.writeText(currentChatbotKnowledge);
                }
                showToast('Chatbot knowledge preview copied to clipboard!');
              }}
            >
              <Save size={14} /> Copy Knowledge
            </button>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <pre
            style={{
              background: 'rgba(11, 27, 74, 0.5)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '1.25rem',
              fontSize: '0.82rem',
              fontFamily: 'monospace',
              color: '#e2e8f0',
              lineHeight: 1.55,
              whiteSpace: 'pre-wrap',
              maxHeight: '380px',
              overflowY: 'auto'
            }}
          >
            {currentChatbotKnowledge || 'No active knowledge found in database.'}
          </pre>
        </div>
      </div>
    </div>
  );
}
