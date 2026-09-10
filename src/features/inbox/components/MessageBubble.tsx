import React from 'react';
import { Message } from '../../../lib/repository/types';
import { Wrench, CheckCheck, Clock } from 'lucide-react';

interface MessageBubbleProps {
  key?: React.Key;
  message: Message;
  guestName: string;
  onConvertMessageToRequest?: (text: string) => void;
}

function formatMessageTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function MessageBubble({
  message,
  guestName,
  onConvertMessageToRequest
}: MessageBubbleProps) {
  const isGuest = message.sender_type === 'guest';
  const isRequestNotification = message.body.startsWith('[Request:');

  return (
    <div
      className={`group flex flex-col my-1.5 ${
        isGuest ? 'items-start' : 'items-end'
      }`}
    >
      <div className="flex items-center gap-1.5 text-[11px] text-[#5C6E6B] px-1 mb-1 font-medium">
        <span>{isGuest ? guestName : message.sender_name || 'Staff'}</span>
        <span>·</span>
        <span>{formatMessageTime(message.created_at)}</span>
      </div>

      <div className="relative max-w-[85%] sm:max-w-[75%] flex items-center gap-2">
        <div
          className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all ${
            isRequestNotification
              ? 'bg-[#FAF0EB] text-[#8C3B22] border border-[#F5DCAD] font-medium'
              : isGuest
              ? 'bg-white text-[#1A2B28] border border-[#D8D2C5] shadow-2xs rounded-tl-xs'
              : 'bg-[#0D5C56] text-white shadow-2xs rounded-tr-xs'
          }`}
        >
          {isRequestNotification ? (
            <div className="flex items-start gap-2">
              <Wrench size={14} className="text-[#C45532] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-[#C45532]">Operational Update</p>
                <p className="mt-0.5">{message.body.replace(/^\[Request:[^\]]+\]\s*/, '')}</p>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.body}</p>
          )}

          {!isGuest && !isRequestNotification && (
            <div className="flex justify-end items-center gap-1 mt-1 -mb-1 text-[10px] text-white/70">
              <CheckCheck size={12} className="inline" />
            </div>
          )}
        </div>

        {/* Action to create request from guest message on hover */}
        {isGuest && !isRequestNotification && onConvertMessageToRequest && (
          <button
            type="button"
            onClick={() => onConvertMessageToRequest(message.body)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white border border-[#D8D2C5] text-[#5C6E6B] hover:text-[#0D5C56] hover:border-[#0D5C56] text-xs shadow-2xs shrink-0 flex items-center gap-1"
            title="Convert this message into an operational request"
          >
            <Wrench size={12} />
            <span className="text-[10px] hidden sm:inline">Add Request</span>
          </button>
        )}
      </div>
    </div>
  );
}
