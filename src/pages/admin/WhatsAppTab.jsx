import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import {
  RefreshCw,
  Search,
  MessageCircle,
  ExternalLink,
  Phone,
  Play,
  Pause,
  Smartphone,
  Clock,
  AlertCircle,
  CheckCheck,
  Check,
  Send
} from 'lucide-react';

export default function WhatsAppTab({ showToast }) {
  const {
    whatsappContacts,
    settingsData,
    loadWhatsAppContacts,
    loadWhatsAppMessages,
    takeOverWhatsAppChat,
    resumeWhatsAppChat,
    loadWhatsAppTemplates,
    sendWhatsAppMessage
  } = useData();

  const [selectedWaContactId, setSelectedWaContactId] = useState(null);
  const [waMessages, setWaMessages] = useState([]);
  const [loadingWaMessages, setLoadingWaMessages] = useState(false);
  const [waSearch, setWaSearch] = useState('');
  const [waFilter, setWaFilter] = useState('all'); // 'all' | 'needs_human' | 'app' | 'active' | 'opted_out'
  const [waReplyText, setWaReplyText] = useState('');
  const [waSending, setWaSending] = useState(false);
  const [waSendMode, setWaSendMode] = useState('text'); // 'text' | 'template'
  const [waSelectedTemplateName, setWaSelectedTemplateName] = useState('enquiry_confirmation');
  const [waTemplateVar1, setWaTemplateVar1] = useState('');
  const [waTemplateVar2, setWaTemplateVar2] = useState('');

  useEffect(() => {
    loadWhatsAppContacts();
    loadWhatsAppTemplates();
  }, [loadWhatsAppContacts, loadWhatsAppTemplates]);

  // Load transcript when selectedWaContactId changes
  useEffect(() => {
    if (selectedWaContactId) {
      setLoadingWaMessages(true);
      loadWhatsAppMessages(selectedWaContactId)
        .then((msgs) => setWaMessages(msgs || []))
        .finally(() => setLoadingWaMessages(false));
    } else {
      setWaMessages([]);
    }
  }, [selectedWaContactId, loadWhatsAppMessages]);

  const selectedWaContact = (whatsappContacts || []).find((c) => c.id === selectedWaContactId) || null;

  const getWaWindowInfo = (lastMsgAt) => {
    if (!lastMsgAt) return { isOpen: false, text: 'No inbound message' };
    const diffMs = 24 * 60 * 60 * 1000 - (Date.now() - new Date(lastMsgAt).getTime());
    if (diffMs <= 0) {
      return { isOpen: false, text: '24h Window Closed (Template required)' };
    }
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const mins = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    return { isOpen: true, hours, mins, text: `24h Window: ${hours}h ${mins}m left` };
  };

  const handleTakeOverChat = async (contactId) => {
    const pauseHours = settingsData?.human_pause_hours || 2;
    const res = await takeOverWhatsAppChat(contactId, pauseHours);
    if (res.success) {
      showToast(`You took over this chat. AI automated replies paused for ${pauseHours} hours.`);
      loadWhatsAppContacts();
    } else {
      showToast(res.error || 'Failed to take over chat.', 'error');
    }
  };

  const handleResumeChatAi = async (contactId) => {
    const res = await resumeWhatsAppChat(contactId);
    if (res.success) {
      showToast('AI automated replies resumed for this contact.');
      loadWhatsAppContacts();
    } else {
      showToast(res.error || 'Failed to resume AI.', 'error');
    }
  };

  const handleSendWaReply = async (e) => {
    if (e) e.preventDefault();
    if (!selectedWaContact) return;

    const windowInfo = getWaWindowInfo(selectedWaContact.last_customer_message_at);

    if (waSendMode === 'text') {
      if (!windowInfo.isOpen) {
        showToast('24-Hour customer window has expired. Meta requires an approved template to message this customer.', 'error');
        setWaSendMode('template');
        return;
      }
      if (!waReplyText.trim()) {
        showToast('Please type a reply message.', 'error');
        return;
      }

      setWaSending(true);
      const res = await sendWhatsAppMessage({
        to: selectedWaContact.phone,
        text: waReplyText.trim()
      });
      setWaSending(false);

      if (res.success) {
        showToast('WhatsApp reply sent successfully!');
        setWaReplyText('');
        const updatedMsgs = await loadWhatsAppMessages(selectedWaContact.id);
        setWaMessages(updatedMsgs || []);
        loadWhatsAppContacts();
      } else {
        showToast(res.error || 'Failed to send WhatsApp message.', 'error');
      }
    } else {
      // Template mode
      if (!waSelectedTemplateName) {
        showToast('Please select a template.', 'error');
        return;
      }

      setWaSending(true);
      const vars = [waTemplateVar1.trim(), waTemplateVar2.trim()].filter(Boolean);
      const res = await sendWhatsAppMessage({
        to: selectedWaContact.phone,
        template_name: waSelectedTemplateName,
        language: selectedWaContact.language || 'en',
        variables: vars
      });
      setWaSending(false);

      if (res.success) {
        showToast(`Template "${waSelectedTemplateName}" sent successfully!`);
        const updatedMsgs = await loadWhatsAppMessages(selectedWaContact.id);
        setWaMessages(updatedMsgs || []);
        loadWhatsAppContacts();
      } else {
        showToast(res.error || 'Failed to send template message.', 'error');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            WhatsApp Live Inbox ({(whatsappContacts || []).length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Manage WhatsApp customer conversations, view app echoes, take over chats, and send Meta-approved templates.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              loadWhatsAppContacts();
              if (selectedWaContactId) {
                loadWhatsAppMessages(selectedWaContactId).then((m) => setWaMessages(m || []));
              }
              showToast('WhatsApp contacts refreshed');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <RefreshCw size={15} /> Refresh Inbox
          </button>
        </div>
      </div>

      {/* Split Pane: Contacts List & Live Conversation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Contacts List */}
        <div className="card" style={{ padding: '1.25rem', maxHeight: '720px', overflowY: 'auto' }}>
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'needs_human', label: '⚠️ Needs Human' },
              { id: 'app', label: '📱 App Replied' },
              { id: 'active', label: '🤖 AI Active' },
              { id: 'opted_out', label: 'Opted Out' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setWaFilter(tab.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  background: waFilter === tab.id ? '#12a150' : 'transparent',
                  borderColor: waFilter === tab.id ? '#12a150' : 'var(--border-glass)',
                  color: waFilter === tab.id ? '#ffffff' : 'var(--text-dim)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search phone or name..."
              value={waSearch}
              onChange={(e) => setWaSearch(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
          </div>

          {(whatsappContacts || []).length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              <MessageCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No WhatsApp contacts yet. Customer messages to 6302690251 will appear here in real time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(whatsappContacts || [])
                .filter((c) => {
                  const q = waSearch.toLowerCase();
                  const matchesSearch =
                    (c.phone || '').includes(q) ||
                    (c.name || '').toLowerCase().includes(q);
                  if (!matchesSearch) return false;

                  if (waFilter === 'needs_human') {
                    return c.status === 'needs_human' || c.isPaused;
                  }
                  if (waFilter === 'app') {
                    return c.isPaused && c.status === 'needs_human';
                  }
                  if (waFilter === 'active') {
                    return c.status === 'active' && !c.isPaused;
                  }
                  if (waFilter === 'opted_out') {
                    return c.opted_out || c.status === 'opted_out';
                  }
                  return true;
                })
                .map((c) => {
                  const isSelected = selectedWaContactId === c.id;
                  const windowInfo = getWaWindowInfo(c.last_customer_message_at);

                  return (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedWaContactId(c.id);
                        if (c.name) setWaTemplateVar1(c.name);
                      }}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(18, 161, 80, 0.15)' : 'var(--bg-surface)',
                        border: isSelected ? '1px solid #12a150' : '1px solid var(--border-glass)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#12a150' : 'var(--text-main)' }}>
                          {c.name || `+${c.phone}`}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          {c.language ? c.language.toUpperCase() : 'EN'}
                        </span>
                      </div>

                      {c.name && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.35rem', fontFamily: 'monospace' }}>
                          +{c.phone}
                        </div>
                      )}

                      {/* Status Pills */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                        {c.opted_out ? (
                          <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                            Opted Out
                          </span>
                        ) : c.isPaused || c.status === 'needs_human' ? (
                          <span style={{ background: 'rgba(122, 47, 208, 0.15)', color: '#a855f7', border: '1px solid rgba(122, 47, 208, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                            Human Replied (AI Paused)
                          </span>
                        ) : (
                          <span style={{ background: 'rgba(18, 161, 80, 0.15)', color: '#12a150', border: '1px solid rgba(18, 161, 80, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 700 }}>
                            AI Active
                          </span>
                        )}

                        <span style={{ background: windowInfo.isOpen ? 'rgba(29, 92, 240, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: windowInfo.isOpen ? '#1d5cf0' : 'var(--text-dim)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem' }}>
                          {windowInfo.isOpen ? `Window: ${windowInfo.hours}h left` : 'Window Closed'}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Right Column: Chat Transcript & Actions */}
        <div className="card" style={{ padding: '1.5rem', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
          {!selectedWaContact ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-dim)', padding: '2rem' }}>
              <MessageCircle size={44} style={{ margin: '0 auto 1rem', opacity: 0.5, color: '#12a150' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Select a WhatsApp Conversation</h3>
              <p style={{ margin: 0, fontSize: '0.88rem', maxWidth: '360px' }}>
                Pick any contact from the left to view the live message transcript, take over from AI, or reply directly.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
              {/* Header Bar */}
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{selectedWaContact.name || `+${selectedWaContact.phone}`}</span>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        Lang: {(selectedWaContact.language || 'en').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span>+{selectedWaContact.phone}</span>
                      <a href={`https://wa.me/${selectedWaContact.phone}`} target="_blank" rel="noopener noreferrer" style={{ color: '#12a150', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                        <ExternalLink size={12} /> Open WhatsApp App
                      </a>
                      <a href={`tel:+${selectedWaContact.phone}`} style={{ color: '#1d5cf0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                        <Phone size={12} /> Call Client
                      </a>
                    </div>
                  </div>

                  {/* AI Takeover / Resume Toggle */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    {selectedWaContact.isPaused || selectedWaContact.status === 'needs_human' ? (
                      <button
                        type="button"
                        onClick={() => handleResumeChatAi(selectedWaContact.id)}
                        className="btn btn-cta-yellow"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Play size={14} /> Resume AI Automation
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleTakeOverChat(selectedWaContact.id)}
                        className="btn btn-outline"
                        style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#eab308', borderColor: '#eab308' }}
                      >
                        <Pause size={14} /> Take Over Chat (Pause AI)
                      </button>
                    )}
                  </div>
                </div>

                {/* 24-Hour Window & AI Status Banner */}
                <div style={{ marginTop: '0.85rem' }}>
                  {selectedWaContact.isPaused || selectedWaContact.status === 'needs_human' ? (
                    <div style={{ background: 'rgba(122, 47, 208, 0.12)', border: '1px solid rgba(122, 47, 208, 0.3)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Smartphone size={16} />
                      <span>
                        <strong>Human Takeover Active:</strong> AI replies are paused for this contact.
                        {selectedWaContact.ai_paused_until && ` Resumes automatically at ${new Date(selectedWaContact.ai_paused_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`}
                      </span>
                    </div>
                  ) : null}

                  {(() => {
                    const windowInfo = getWaWindowInfo(selectedWaContact.last_customer_message_at);
                    return windowInfo.isOpen ? (
                      <div style={{ background: 'rgba(18, 161, 80, 0.1)', border: '1px solid rgba(18, 161, 80, 0.25)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#12a150', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={15} />
                        <span>
                          <strong>24-Hour Window Open:</strong> You can send free-form text messages. Remaining: {windowInfo.hours}h {windowInfo.mins}m.
                        </span>
                      </div>
                    ) : (
                      <div style={{ background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.25)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#eab308', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={15} />
                        <span>
                          <strong>24-Hour Window Closed:</strong> More than 24h passed since customer&apos;s last message. Meta requires an approved template to message this contact.
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Messages Transcript Scroll Area */}
              <div style={{ flex: 1, minHeight: '320px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {loadingWaMessages ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.88rem' }}>Loading conversation history...</div>
                ) : waMessages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.88rem' }}>No messages recorded yet with this contact.</div>
                ) : (
                  waMessages.map((msg) => {
                    const isInbound = msg.direction === 'inbound';
                    const isApp = msg.source === 'app';
                    const isBot = msg.source === 'bot';
                    const isAdmin = msg.source === 'admin';
                    const isAuto = msg.source === 'automation';

                    return (
                      <div
                        key={msg.id}
                        style={{
                          alignSelf: isInbound ? 'flex-start' : 'flex-end',
                          maxWidth: '82%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: isInbound
                            ? 'var(--bg-surface)'
                            : isApp
                            ? 'linear-gradient(135deg, #7a2fd0 0%, #9333ea 100%)'
                            : isAdmin
                            ? '#1d5cf0'
                            : '#0b1b4a',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          border: isInbound ? '1px solid var(--border-glass)' : '1px solid rgba(255,255,255,0.1)',
                          lineHeight: 1.45,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'space-between' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            {isInbound && '👤 Customer'}
                            {isApp && '📱 Phone App (You)'}
                            {isBot && '🤖 Zippy AI Assistant'}
                            {isAdmin && '👨‍💼 Admin Reply'}
                            {isAuto && '⚡ Automation Queue'}
                          </span>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {msg.content}
                        </div>

                        {/* Outbound Delivery Status Ticks */}
                        {!isInbound && (
                          <div style={{ fontSize: '0.68rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '4px', color: 'rgba(255,255,255,0.75)' }}>
                            {msg.status === 'read' ? (
                              <span style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 700 }}>
                                <CheckCheck size={13} /> Read
                              </span>
                            ) : msg.status === 'delivered' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                <CheckCheck size={13} /> Delivered
                              </span>
                            ) : msg.status === 'sent' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                <Check size={13} /> Sent
                              </span>
                            ) : msg.status === 'failed' ? (
                              <span style={{ color: '#fca5a5', display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                <AlertCircle size={13} /> Failed
                              </span>
                            ) : null}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Reply & Template Sender Box */}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginTop: 'auto' }}>
                {/* Mode Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setWaSendMode('text')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid',
                      cursor: 'pointer',
                      background: waSendMode === 'text' ? '#1d5cf0' : 'transparent',
                      borderColor: waSendMode === 'text' ? '#1d5cf0' : 'var(--border-glass)',
                      color: waSendMode === 'text' ? '#ffffff' : 'var(--text-dim)'
                    }}
                  >
                    💬 Free-form Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaSendMode('template')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid',
                      cursor: 'pointer',
                      background: waSendMode === 'template' ? '#12a150' : 'transparent',
                      borderColor: waSendMode === 'template' ? '#12a150' : 'var(--border-glass)',
                      color: waSendMode === 'template' ? '#ffffff' : 'var(--text-dim)'
                    }}
                  >
                    📋 Meta Approved Template
                  </button>
                </div>

                {waSendMode === 'text' ? (
                  <form onSubmit={handleSendWaReply}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                      <textarea
                        rows={2}
                        className="form-input"
                        placeholder={
                          getWaWindowInfo(selectedWaContact.last_customer_message_at).isOpen
                            ? 'Type your reply message to customer...'
                            : '24-hour window closed. Please switch to "Meta Approved Template" above.'
                        }
                        disabled={!getWaWindowInfo(selectedWaContact.last_customer_message_at).isOpen || waSending}
                        value={waReplyText}
                        onChange={(e) => setWaReplyText(e.target.value)}
                        style={{ flex: 1, resize: 'none', fontSize: '0.88rem' }}
                      />
                      <button
                        type="submit"
                        disabled={!getWaWindowInfo(selectedWaContact.last_customer_message_at).isOpen || waSending || !waReplyText.trim()}
                        className="btn btn-cta-yellow"
                        style={{ padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                      >
                        <Send size={15} />
                        {waSending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSendWaReply}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Template</label>
                        <select
                          className="form-input"
                          value={waSelectedTemplateName}
                          onChange={(e) => setWaSelectedTemplateName(e.target.value)}
                          style={{ fontSize: '0.82rem' }}
                        >
                          <option value="enquiry_confirmation">enquiry_confirmation (Utility)</option>
                          <option value="follow_up">follow_up (Utility)</option>
                          <option value="thank_you">thank_you (Utility)</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Variable 1: Customer Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Customer Name"
                          value={waTemplateVar1}
                          onChange={(e) => setWaTemplateVar1(e.target.value)}
                          style={{ fontSize: '0.82rem' }}
                        />
                      </div>

                      {waSelectedTemplateName !== 'thank_you' && (
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '0.75rem' }}>Variable 2: Service / Project</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Web Development / App / AI"
                            value={waTemplateVar2}
                            onChange={(e) => setWaTemplateVar2(e.target.value)}
                            style={{ fontSize: '0.82rem' }}
                          />
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="submit"
                        disabled={waSending}
                        className="btn"
                        style={{ background: '#12a150', color: '#ffffff', padding: '0.65rem 1.25rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                      >
                        <Send size={15} />
                        {waSending ? 'Sending Template...' : 'Send Approved Template'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
