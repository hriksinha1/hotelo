import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { repository } from '../../lib/repository';
import {
  Booking,
  Customer,
  Property,
  Conversation,
  Request,
  Message,
  RequestCategory
} from '../../lib/repository/types';
import {
  BedDouble,
  Wifi,
  Phone,
  MapPin,
  Clock,
  Send,
  Wrench,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  Building2
} from 'lucide-react';
import { fmtDate } from '../../lib/utils/formatters';

const PRESET_REQUESTS: { category: RequestCategory; title: string; icon: string }[] = [
  { category: 'Extra towels', title: 'Request Extra Towels', icon: '🧺' },
  { category: 'Extra pillows', title: 'Extra Pillows', icon: '🛏️' },
  { category: 'Housekeeping', title: 'Housekeeping Service', icon: '✨' },
  { category: 'Late checkout', title: 'Request Late Checkout', icon: '⏰' },
  { category: 'Wi-Fi issue', title: 'Wi-Fi Assistance', icon: '📶' },
  { category: 'Room service', title: 'In-Room Dining / Cutlery', icon: '🍽️' }
];

export default function StayPage() {
  const { token = 'demo-rahul-valley-204' } = useParams<{ token?: string }>();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stayData, setStayData] = useState<{
    booking: Booking;
    customer: Customer;
    property: Property;
    conversation: Conversation;
    requests: Request[];
    messages: Message[];
  } | null>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'services' | 'guide'>('chat');
  const [customRequestTitle, setCustomRequestTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<RequestCategory>('General request');
  const [submittingCustomRequest, setSubmittingCustomRequest] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadStay = async () => {
    try {
      setLoading(true);
      const data = await repository.getStayByToken(token);
      if (!data) {
        setError('Stay session not found. Please check your link or contact the front desk.');
      } else {
        setStayData(data);
      }
    } catch (e: any) {
      setError('Unable to load stay information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStay();
  }, [token]);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [stayData?.messages, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sendingMessage || !stayData) return;

    setSendingMessage(true);
    const text = inputMessage;
    setInputMessage('');
    try {
      const msg = await repository.createStayMessage(token, text);
      setStayData(prev =>
        prev
          ? {
              ...prev,
              messages: [...prev.messages, msg]
            }
          : null
      );
    } catch (e) {
      setInputMessage(text);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleQuickRequest = async (category: RequestCategory, title: string) => {
    if (!stayData) return;
    try {
      await repository.createStayRequest(token, category, title);
      // Reload stay data to refresh requests and messages
      const refreshed = await repository.getStayByToken(token);
      if (refreshed) setStayData(refreshed);
      setActiveTab('chat');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCustomRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRequestTitle.trim() || submittingCustomRequest || !stayData) return;
    setSubmittingCustomRequest(true);
    try {
      await repository.createStayRequest(token, customCategory, customRequestTitle.trim());
      setCustomRequestTitle('');
      const refreshed = await repository.getStayByToken(token);
      if (refreshed) setStayData(refreshed);
      setActiveTab('chat');
    } finally {
      setSubmittingCustomRequest(false);
    }
  };

  const handleCopyWifi = () => {
    navigator.clipboard.writeText('sunsetparadise');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-3 border-[#0D5C56] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-[#1A2B28]">Loading your guest stay portal...</p>
        </div>
      </div>
    );
  }

  if (error || !stayData) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#D8D2C5] p-6 text-center shadow-lg space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Building2 size={24} />
          </div>
          <h2 className="text-lg font-bold text-[#1A2B28]">Stay Link Expired or Not Found</h2>
          <p className="text-xs text-[#5C6E6B] leading-relaxed">
            {error || 'We could not locate this reservation record.'}
          </p>
          <div className="pt-2">
            <Link
              to="/stay/demo-rahul-valley-204"
              className="inline-block px-4 py-2 bg-[#0D5C56] text-white rounded-xl text-xs font-semibold"
            >
              Open Demo Stay (Rahul Sharma · Room 204)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { property, booking, customer, messages, requests } = stayData;
  const room = booking.room_number ? `Room ${booking.room_number}` : booking.room_type;
  const openRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between max-w-lg mx-auto border-x border-[#D8D2C5] shadow-xs">
      {/* Top Property Brand & Welcome Header */}
      <header className="bg-[#0D5C56] text-white p-5 pt-7 pb-6 rounded-b-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-200 tracking-wide uppercase">
                Welcome to
              </p>
              <h1 className="text-xl font-bold tracking-tight">{property.name}</h1>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-xs border border-white/20 text-right">
              <span className="text-[10px] text-emerald-100 block">Your Suite</span>
              <span className="font-bold text-sm text-white flex items-center gap-1">
                <BedDouble size={14} />
                {room}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-emerald-100/90 pt-1">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{fmtDate(booking.check_in)} – {fmtDate(booking.check_out)}</span>
            </div>
            <span>·</span>
            <span className="font-mono text-white text-[11px]">{booking.booking_no}</span>
          </div>

          {/* Quick Wi-Fi Pill */}
          <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs border border-white/15">
            <div className="flex items-center gap-2">
              <Wifi size={14} className="text-emerald-300" />
              <div>
                <span className="text-[10px] text-emerald-200 block">Guest Wi-Fi</span>
                <span className="font-mono font-semibold text-white">sunsetparadise</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyWifi}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-medium inline-flex items-center gap-1 transition-colors"
            >
              {copiedWifi ? <Check size={12} /> : <Copy size={12} />}
              <span>{copiedWifi ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs for Mobile Stay Experience */}
      <div className="px-4 -mt-3 z-20">
        <div className="bg-white rounded-2xl p-1 shadow-xs border border-[#D8D2C5] flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'chat'
                ? 'bg-[#0D5C56] text-white shadow-2xs'
                : 'text-[#5C6E6B] hover:text-[#1A2B28]'
            }`}
          >
            Chat & Requests
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'services'
                ? 'bg-[#0D5C56] text-white shadow-2xs'
                : 'text-[#5C6E6B] hover:text-[#1A2B28]'
            }`}
          >
            Request Service
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'guide'
                ? 'bg-[#0D5C56] text-white shadow-2xs'
                : 'text-[#5C6E6B] hover:text-[#1A2B28]'
            }`}
          >
            Stay Guide
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Active Operational Requests Banner */}
        {openRequests.length > 0 && (
          <div className="p-3.5 bg-[#FAF0EB] rounded-2xl border border-[#F5DCAD] space-y-2">
            <div className="flex items-center gap-2">
              <Wrench size={15} className="text-[#C45532]" />
              <h3 className="text-xs font-bold text-[#8C3B22]">Active Requests in Progress</h3>
            </div>
            <div className="space-y-1.5">
              {openRequests.map(req => (
                <div
                  key={req.id}
                  className="p-2 bg-white rounded-xl border border-[#F5DCAD]/60 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-[#1A2B28]">{req.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {req.status === 'in_progress' ? 'In Progress' : 'Received'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: Chat & Requests */}
        {activeTab === 'chat' && (
          <div className="space-y-3">
            {/* Quick Service Suggestions */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-[#5C6E6B] px-1">Quick Service Requests:</p>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_REQUESTS.slice(0, 4).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickRequest(item.category, item.title)}
                    className="p-2.5 rounded-xl bg-white border border-[#D8D2C5] hover:border-[#0D5C56] text-left text-xs font-medium text-[#1A2B28] transition-all flex items-center gap-2 shadow-2xs"
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="bg-white rounded-2xl border border-[#D8D2C5] p-4 shadow-2xs space-y-3 min-h-[260px] max-h-[380px] overflow-y-auto">
              <div className="text-center py-1">
                <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#EAE5DC] text-[10px] text-[#5C6E6B] font-medium">
                  Direct Front Desk Chat
                </span>
              </div>

              {messages.map(msg => {
                const isMe = msg.sender_type === 'guest';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} my-1.5`}
                  >
                    <span className="text-[10px] text-[#5C6E6B] mb-0.5 px-1 font-medium">
                      {isMe ? 'You' : msg.sender_name || 'Front Desk'}
                    </span>
                    <div
                      className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                        isMe
                          ? 'bg-[#0D5C56] text-white rounded-tr-xs'
                          : 'bg-[#FAF9F6] text-[#1A2B28] border border-[#D8D2C5] rounded-tl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask front desk anything..."
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28] focus:outline-none focus:border-[#0D5C56]"
              />
              <button
                type="submit"
                disabled={sendingMessage || !inputMessage.trim()}
                className="p-2.5 bg-[#0D5C56] text-white rounded-xl hover:bg-[#094440] disabled:opacity-50 transition-colors shadow-xs"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* TAB: Request Service */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#D8D2C5] p-4 shadow-2xs space-y-3">
              <h3 className="font-semibold text-sm text-[#1A2B28]">Instant Amenities & Housekeeping</h3>
              <p className="text-xs text-[#5C6E6B]">
                Tap any request to notify our on-duty team. We will dispatch items directly to {room}.
              </p>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {PRESET_REQUESTS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickRequest(item.category, item.title)}
                    className="w-full p-3 rounded-xl bg-[#FAF9F6] border border-[#EAE5DC] hover:border-[#0D5C56] text-left text-xs font-semibold text-[#1A2B28] flex items-center justify-between transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{item.icon}</span>
                      <span>{item.title}</span>
                    </span>
                    <ChevronRight size={14} className="text-[#5C6E6B]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Request Form */}
            <form
              onSubmit={handleCustomRequestSubmit}
              className="bg-white rounded-2xl border border-[#D8D2C5] p-4 shadow-2xs space-y-3"
            >
              <h3 className="font-semibold text-sm text-[#1A2B28]">Custom Stay Request</h3>
              <div>
                <label className="block text-[11px] font-semibold text-[#5C6E6B] mb-1">
                  Type of Request
                </label>
                <select
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value as RequestCategory)}
                  className="w-full p-2 text-xs rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28]"
                >
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Room issue">Room issue</option>
                  <option value="Late checkout">Late checkout</option>
                  <option value="General request">General request</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5C6E6B] mb-1">
                  What can we help you with?
                </label>
                <textarea
                  value={customRequestTitle}
                  onChange={e => setCustomRequestTitle(e.target.value)}
                  placeholder="e.g. Please bring two extra bottles of drinking water..."
                  rows={3}
                  className="w-full p-2.5 text-xs rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28] focus:outline-none focus:border-[#0D5C56]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingCustomRequest || !customRequestTitle.trim()}
                className="w-full py-2.5 bg-[#0D5C56] text-white rounded-xl text-xs font-semibold hover:bg-[#094440] disabled:opacity-50 transition-colors"
              >
                {submittingCustomRequest ? 'Submitting...' : 'Submit Request to Front Desk'}
              </button>
            </form>
          </div>
        )}

        {/* TAB: Stay Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-[#D8D2C5] p-4 shadow-2xs space-y-3">
              <h3 className="font-semibold text-sm text-[#1A2B28]">Property Details</h3>

              <div className="space-y-2 text-xs text-[#1A2B28]">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-[#0D5C56] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#5C6E6B] block text-[11px]">Address</span>
                    <span>
                      {property.address}, {property.city}, {property.state} {property.pincode}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-[#EAE5DC]">
                  <Phone size={15} className="text-[#0D5C56] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#5C6E6B] block text-[11px]">Front Desk Phone</span>
                    <a href={`tel:${property.phone}`} className="text-[#0D5C56] font-semibold">
                      {property.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-[#EAE5DC]">
                  <Clock size={15} className="text-[#0D5C56] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-[#5C6E6B] block text-[11px]">Timings</span>
                    <span>
                      Standard Check-in: {property.check_in_time} · Check-out: {property.check_out_time}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#E8F3F1] rounded-2xl border border-[#BDDFC9] p-4 text-xs text-[#1A2B28] space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#0D5C56]">
                <ShieldCheck size={16} />
                <span>Guest Protection & Assistance</span>
              </div>
              <p className="text-[11px] text-[#5C6E6B] leading-relaxed">
                Need anything urgent? Our desk is staffed 24/7. Use the chat tab or call the front desk directly from your phone.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="p-3 text-center text-[10px] text-[#5C6E6B] border-t border-[#EAE5DC] bg-white">
        Powered by Bookzee Hospitality Platform
      </footer>
    </div>
  );
}
