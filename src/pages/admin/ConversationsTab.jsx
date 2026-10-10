import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { RefreshCw, Search, Trash2 } from 'lucide-react';

export default function ConversationsTab({ showToast, openConfirm }) {
  const {
    chatSessions,
    loadChatSessions,
    loadChatMessages,
    deleteChatSession
  } = useData();

  const [conversationSearch, setConversationSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all'); // 'all' | 'text' | 'voice'
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [activeSessionMessages, setActiveSessionMessages] = useState([]);
  const [loadingSessionMessages, setLoadingSessionMessages] = useState(false);

  useEffect(() => {
    loadChatSessions();
  }, [loadChatSessions]);

  useEffect(() => {
    if (selectedSessionId) {
      setLoadingSessionMessages(true);
      loadChatMessages(selectedSessionId)
        .then((msgs) => setActiveSessionMessages(msgs || []))
        .finally(() => setLoadingSessionMessages(false));
    } else {
      setActiveSessionMessages([]);
    }
  }, [selectedSessionId, loadChatMessages]);

  const selectedSession = (chatSessions || []).find((s) => s.session_id === selectedSessionId) || null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '0.35rem' }}>
            Customer Conversations ({(chatSessions || []).length})
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.95rem' }}>
            Review live visitor questions, session transcripts, and leads captured by the AI chatbot.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline"
          onClick={() => loadChatSessions()}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={15} /> Refresh List
        </button>
      </div>

      {/* Split Pane: Sessions List & Transcript Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Sessions List */}
        <div className="card" style={{ padding: '1.25rem', maxHeight: '680px', overflowY: 'auto' }}>
          {/* Channel Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
            {['all', 'text', 'voice'].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setChannelFilter(mode)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid',
                  cursor: 'pointer',
                  background: channelFilter === mode ? '#1d5cf0' : 'transparent',
                  borderColor: channelFilter === mode ? '#1d5cf0' : 'var(--border-glass)',
                  color: channelFilter === mode ? '#ffffff' : 'var(--text-dim)'
                }}
              >
                {mode === 'all' ? 'All Channels' : mode === 'voice' ? '🎙️ Voice' : '💬 Text'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search session or lead..."
              value={conversationSearch}
              onChange={(e) => setConversationSearch(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.85rem' }}
            />
          </div>

          {(chatSessions || []).length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              No chat conversations recorded yet. Visitors using the widget will appear here.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(chatSessions || [])
                .filter((s) => {
                  const q = conversationSearch.toLowerCase();
                  return (
                    (s.session_id || '').toLowerCase().includes(q) ||
                    (s.enquiries?.name || '').toLowerCase().includes(q) ||
                    (s.enquiries?.phone || '').includes(q)
                  );
                })
                .map((session) => {
                  const isSelected = selectedSessionId === session.session_id;
                  return (
                    <div
                      key={session.id || session.session_id}
                      onClick={() => setSelectedSessionId(session.session_id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(29, 92, 240, 0.18)' : 'var(--bg-surface)',
                        border: isSelected ? '1px solid #1d5cf0' : '1px solid var(--border-glass)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1d5cf0' }}>
                          {session.enquiries?.name || 'Anonymous Visitor'}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          {session.created_at ? new Date(session.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                        Session: {session.session_id.slice(0, 16)}...
                      </div>

                      {session.enquiries?.phone && (
                        <div style={{ fontSize: '0.75rem', color: '#12a150', fontWeight: 600 }}>
                          Captured Phone: {session.enquiries.phone}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Transcript Viewer */}
        <div className="card" style={{ padding: '1.25rem', minHeight: '400px' }}>
          {!selectedSession ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
              Select a conversation from the left to view the full dialogue transcript.
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                    {selectedSession.enquiries?.name ? `Chat with ${selectedSession.enquiries.name}` : 'Visitor Chat'}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Session ID: {selectedSession.session_id}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '4px 10px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => {
                    openConfirm(
                      'Delete Conversation',
                      'Are you sure you want to delete this session and its message logs?',
                      async () => {
                        const res = await deleteChatSession(selectedSession.session_id);
                        if (res.success) {
                          showToast('Conversation deleted.');
                          setSelectedSessionId(null);
                        } else {
                          showToast(res.error || 'Failed to delete conversation.', 'error');
                        }
                      }
                    );
                  }}
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>

              {/* Messages List */}
              {loadingSessionMessages ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading transcript...</div>
              ) : activeSessionMessages.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>No messages recorded for this session.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
                  {activeSessionMessages
                    .filter((msg) => {
                      if (channelFilter === 'voice') return msg.channel === 'voice';
                      if (channelFilter === 'text') return msg.channel !== 'voice';
                      return true;
                    })
                    .map((msg, i) => (
                      <div
                        key={msg.id || i}
                        style={{
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '85%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: msg.role === 'user' ? '#1d5cf0' : 'var(--bg-surface)',
                          color: '#ffffff',
                          fontSize: '0.88rem',
                          border: msg.role === 'user' ? 'none' : '1px solid var(--border-glass)',
                          lineHeight: 1.45
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--text-dim)', marginBottom: '3px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{msg.role === 'user' ? 'Customer' : 'Zippy AI Assistant'}</span>
                          {msg.channel === 'voice' && (
                            <span style={{ background: 'rgba(255, 229, 0, 0.2)', color: '#ffe500', padding: '1px 5px', borderRadius: '4px', fontSize: '0.68rem', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              🎙️ Voice
                            </span>
                          )}
                          <span>• {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
