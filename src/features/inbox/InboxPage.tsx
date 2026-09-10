import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import { useInboxData } from './hooks/useInboxData';
import { InboxFilterType } from './types';
import ConversationRow from './components/ConversationRow';
import ConversationHeader from './components/ConversationHeader';
import MessageBubble from './components/MessageBubble';
import RequestPanel from './components/RequestPanel';
import CreateRequestModal from './components/CreateRequestModal';
import {
  Search,
  Send,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Wrench,
  CheckCircle,
  Filter,
  RefreshCw,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

interface AppShellContext {
  selectedProperty: string;
}

const QUICK_REPLIES = [
  'We are on it right away!',
  'Your request has been shared with housekeeping.',
  'Delivering to your room shortly.',
  'Glad to assist! Please let us know if you need anything else.'
];

export default function InboxPage() {
  const { selectedProperty } = useOutletContext<AppShellContext>();
  const { id: routeConversationId } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeConversation,
    messages,
    requests,
    loading,
    messagesLoading,
    filterType,
    setFilterType,
    search,
    setSearch,
    totalUnreadCount,
    sendMessage,
    createRequest,
    updateRequestStatus,
    toggleConversationStatus,
    refresh
  } = useInboxData(selectedProperty, routeConversationId);

  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [modalInitialTitle, setModalInitialTitle] = useState('');
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Auto-scroll messages to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle selecting conversation
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    navigate(`/inbox/${id}`, { replace: true });
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    setSending(true);
    const text = inputMessage;
    setInputMessage('');
    const ok = await sendMessage(text);
    if (!ok) {
      setInputMessage(text);
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleConvertMessageToRequest = (text: string) => {
    setModalInitialTitle(text);
    setIsRequestModalOpen(true);
  };

  const guestName = activeConversation?.guest?.name || 'Guest';
  const stayToken =
    activeConversation?.booking_id === 'b-arr-1'
      ? 'demo-rahul-valley-204'
      : activeConversation?.booking_id === 'b-arr-2'
      ? 'demo-priya-heritage-104'
      : activeConversation?.booking_id || '';

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col bg-[#F8F7F4] overflow-hidden">
      {/* Top Mobile Bar / Stats header */}
      <div className="p-3 sm:px-6 bg-white border-b border-[#D8D2C5] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-[#0D5C56]" />
          <h1 className="text-base font-semibold text-[#1A2B28]">Guest Messaging & Requests</h1>
          {totalUnreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#0D5C56] text-white text-xs font-bold">
              {totalUnreadCount} unread
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {stayToken && (
            <a
              href={`/stay/${stayToken}`}
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 rounded-xl border border-[#BDDFC9] bg-[#E8F3F1] hover:bg-[#D5ECE8] text-[#0D5C56] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              title="Preview guest mobile view in new tab"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Guest Portal View</span>
            </a>
          )}

          <button
            type="button"
            onClick={refresh}
            className="p-1.5 text-[#5C6E6B] hover:text-[#1A2B28] hover:bg-[#FAF9F6] rounded-lg border border-[#D8D2C5]"
            title="Refresh inbox"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Multi-Column View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 bg-white border-r border-[#D8D2C5] flex flex-col shrink-0 ${
            activeConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search & Filter bar */}
          <div className="p-3 space-y-2 border-b border-[#EAE5DC] bg-[#FAF9F6]">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C6E6B]"
              />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search guest, room, or message..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28] focus:outline-none focus:border-[#0D5C56]"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'open_requests', label: 'Requests' },
                  { id: 'assigned_to_me', label: 'Assigned' }
                ] as const
              ).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                    filterType === tab.id
                      ? 'bg-[#0D5C56] text-white shadow-2xs'
                      : 'bg-white text-[#5C6E6B] border border-[#EAE5DC] hover:border-[#D8D2C5]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {loading ? (
              <div className="p-8 text-center text-xs text-[#5C6E6B]">Loading conversations...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#5C6E6B] space-y-1">
                <p className="font-semibold text-[#1A2B28]">No conversations found</p>
                <p className="text-[11px]">Try adjusting your search or active filter.</p>
              </div>
            ) : (
              conversations.map(conv => (
                <ConversationRow
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={handleSelectConversation}
                />
              ))
            )}
          </div>
        </div>

        {/* Middle Column: Chat Thread */}
        <div
          className={`flex-1 flex flex-col bg-[#F8F7F4] min-w-0 overflow-hidden ${
            !activeConversation ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeConversation ? (
            <>
              {/* Header */}
              <ConversationHeader
                conversation={activeConversation}
                onBackMobile={() => setActiveConversationId(null)}
                onCreateRequest={() => {
                  setModalInitialTitle('');
                  setIsRequestModalOpen(true);
                }}
                onToggleStatus={toggleConversationStatus}
              />

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
                {/* Stay banner */}
                <div className="max-w-md mx-auto p-3 rounded-xl bg-white border border-[#D8D2C5] text-center shadow-2xs text-xs text-[#5C6E6B] my-2">
                  <span className="font-semibold text-[#1A2B28]">Direct Guest Communication</span>
                  <p className="mt-0.5 text-[11px]">
                    Messages sent here appear on the guest's mobile stay dashboard in real time.
                  </p>
                </div>

                {messages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    guestName={guestName}
                    onConvertMessageToRequest={handleConvertMessageToRequest}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Bar */}
              <div className="px-4 py-2 bg-white/70 border-t border-[#EAE5DC] flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0">
                <span className="text-[#5C6E6B] font-medium shrink-0 flex items-center gap-1">
                  <Sparkles size={12} className="text-[#0D5C56]" />
                  Quick:
                </span>
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInputMessage(reply)}
                    className="px-2.5 py-1 rounded-full bg-white border border-[#D8D2C5] text-[#1A2B28] hover:border-[#0D5C56] hover:bg-[#FAF9F6] whitespace-nowrap transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Message Composer */}
              <div className="p-3 sm:p-4 bg-white border-t border-[#D8D2C5] shrink-0">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <textarea
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Reply to ${guestName}... (Press Enter to send)`}
                    rows={2}
                    className="flex-1 p-2.5 text-xs sm:text-sm rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28] focus:outline-none focus:border-[#0D5C56] focus:ring-1 focus:ring-[#0D5C56] resize-none"
                  />
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="submit"
                      disabled={sending || !inputMessage.trim()}
                      className="px-4 py-2.5 bg-[#0D5C56] hover:bg-[#094440] disabled:opacity-50 text-white rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Send size={14} />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRightPanel(!showRightPanel)}
                      className="hidden lg:flex px-2 py-1 text-[10px] text-[#5C6E6B] hover:text-[#1A2B28] items-center justify-center gap-1 rounded-lg border border-[#EAE5DC]"
                      title="Toggle Operational Requests Panel"
                    >
                      {showRightPanel ? <PanelRightClose size={12} /> : <PanelRightOpen size={12} />}
                      <span>Tasks</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#5C6E6B]">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F3F1] text-[#0D5C56] flex items-center justify-center mb-3 border border-[#BDDFC9]">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-base font-semibold text-[#1A2B28]">Select a conversation</h2>
              <p className="text-xs max-w-sm mt-1">
                Choose a guest stay thread on the left to review messages, resolve requests, or coordinate amenities.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Operational Requests Panel */}
        {activeConversation && showRightPanel && (
          <RequestPanel
            requests={requests}
            onCreateRequest={() => {
              setModalInitialTitle('');
              setIsRequestModalOpen(true);
            }}
            onUpdateStatus={updateRequestStatus}
          />
        )}
      </div>

      {/* Modal to Create Operational Request */}
      {activeConversation && (
        <CreateRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          guestName={guestName}
          roomNumber={activeConversation.room_number}
          initialTitle={modalInitialTitle}
          onSubmit={createRequest}
        />
      )}
    </div>
  );
}
