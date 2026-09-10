import React from 'react';
import { Conversation } from '../../../lib/repository/types';
import { BedDouble, CheckCircle2, Clock, Wrench } from 'lucide-react';

interface ConversationRowProps {
  key?: React.Key;
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
}

function formatRelativeTime(dateStr: string): string {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  } catch {
    return '';
  }
}

export default function ConversationRow({ conversation, isActive, onSelect }: ConversationRowProps) {
  const guestName = conversation.guest?.name || 'Guest';
  const propertyName = conversation.property?.name || 'Property';
  const room = conversation.room_number ? `Room ${conversation.room_number}` : (conversation.booking?.room_type || 'Stay');
  const isUnread = (conversation.unread_count || 0) > 0;
  const hasOpenRequests = (conversation.open_requests_count || 0) > 0;

  // Initials for avatar
  const initials = guestName
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      className={`w-full text-left p-3.5 sm:p-4 rounded-xl transition-all border text-xs sm:text-sm relative flex items-start gap-3 select-none ${
        isActive
          ? 'bg-[#E8F3F1] border-[#0D5C56]/30 shadow-xs'
          : 'bg-white border-[#EAE5DC] hover:bg-[#FAF9F6] hover:border-[#D8D2C5]'
      }`}
    >
      {/* Unread indicator bar */}
      {isUnread && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded-full bg-[#0D5C56]" />
      )}

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 border ${
          isActive
            ? 'bg-[#0D5C56] text-white border-[#0D5C56]'
            : 'bg-[#FAF9F6] text-[#1A2B28] border-[#D8D2C5]'
        }`}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className={`font-semibold truncate text-[#1A2B28] ${isUnread ? 'font-bold' : ''}`}>
            {guestName}
          </span>
          <span className="text-[11px] text-[#5C6E6B] shrink-0 font-normal">
            {formatRelativeTime(conversation.last_message_at || conversation.updated_at)}
          </span>
        </div>

        {/* Property & Room context */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#5C6E6B] truncate mb-1.5 font-medium">
          <span className="truncate">{propertyName}</span>
          <span className="text-stone-400">·</span>
          <span className="text-[#0D5C56] font-semibold truncate flex items-center gap-0.5">
            <BedDouble size={11} className="inline" />
            {room}
          </span>
        </div>

        {/* Latest message preview */}
        <p className={`text-xs truncate ${isUnread ? 'text-[#1A2B28] font-medium' : 'text-[#5C6E6B]'}`}>
          {conversation.last_message_text || 'No messages yet.'}
        </p>

        {/* Indicators: unread count & open requests */}
        <div className="flex items-center gap-2 mt-2">
          {isUnread && (
            <span className="px-2 py-0.5 rounded-full bg-[#0D5C56] text-white text-[10px] font-bold">
              {conversation.unread_count} new
            </span>
          )}

          {hasOpenRequests && (
            <span className="px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C45532] border border-[#F5DCAD] text-[10px] font-semibold inline-flex items-center gap-1">
              <Wrench size={10} />
              {conversation.open_requests_count} open request{conversation.open_requests_count! > 1 ? 's' : ''}
            </span>
          )}

          {conversation.status === 'closed' && (
            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-medium">
              Closed
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
