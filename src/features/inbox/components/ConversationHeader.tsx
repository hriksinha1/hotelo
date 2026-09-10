import React from 'react';
import { Link } from 'react-router-dom';
import { Conversation } from '../../../lib/repository/types';
import {
  ArrowLeft,
  User,
  CalendarDays,
  Plus,
  CheckCircle,
  RotateCcw,
  ExternalLink,
  BedDouble,
  Building2
} from 'lucide-react';
import { fmtDate } from '../../../lib/utils/formatters';

interface ConversationHeaderProps {
  conversation: Conversation;
  onBackMobile?: () => void;
  onCreateRequest: () => void;
  onToggleStatus: () => void;
}

export default function ConversationHeader({
  conversation,
  onBackMobile,
  onCreateRequest,
  onToggleStatus
}: ConversationHeaderProps) {
  const guest = conversation.guest;
  const booking = conversation.booking;
  const property = conversation.property;
  const room = conversation.room_number ? `Room ${conversation.room_number}` : (booking?.room_type || 'Stay');

  return (
    <div className="p-4 sm:p-5 border-b border-[#D8D2C5] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
      {/* Left Guest & Stay Context */}
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        {/* Mobile Back Button */}
        {onBackMobile && (
          <button
            type="button"
            onClick={onBackMobile}
            className="md:hidden p-1.5 -ml-1 rounded-lg text-[#5C6E6B] hover:text-[#1A2B28] hover:bg-[#FAF9F6]"
            aria-label="Back to conversations list"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="w-11 h-11 rounded-full bg-[#E8F3F1] border border-[#BDDFC9] text-[#0D5C56] font-semibold flex items-center justify-center text-sm shrink-0">
          {(guest?.name || 'G')[0]}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-base sm:text-lg text-[#1A2B28] truncate">
              {guest?.name || 'Guest'}
            </h2>
            {conversation.status === 'closed' ? (
              <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-medium border border-stone-200">
                Closed
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-[#EBF6EF] text-[#276749] text-[11px] font-medium border border-[#BDDFC9] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#276749] animate-pulse" />
                Active Stay
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#5C6E6B] mt-0.5 flex-wrap">
            <span className="font-semibold text-[#0D5C56] flex items-center gap-1">
              <BedDouble size={13} />
              {room}
            </span>
            <span>·</span>
            <span className="truncate">{property?.name}</span>
            {booking && (
              <>
                <span>·</span>
                <span className="font-mono text-[#1A2B28]">{booking.booking_no}</span>
                <span>·</span>
                <span>
                  {fmtDate(booking.check_in)} → {fmtDate(booking.check_out)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Operational Actions */}
      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EAE5DC]">
        {guest && (
          <Link
            to={`/guests/${guest.id}`}
            className="px-2.5 py-1.5 rounded-xl border border-[#D8D2C5] bg-white hover:bg-[#FAF9F6] text-[#1A2B28] text-xs font-medium inline-flex items-center gap-1 transition-colors"
            title="View full guest profile"
          >
            <User size={13} />
            <span className="hidden sm:inline">Guest</span>
          </Link>
        )}

        {booking && (
          <Link
            to={`/bookings/${booking.id}`}
            className="px-2.5 py-1.5 rounded-xl border border-[#D8D2C5] bg-white hover:bg-[#FAF9F6] text-[#1A2B28] text-xs font-medium inline-flex items-center gap-1 transition-colors"
            title="View booking details"
          >
            <CalendarDays size={13} />
            <span className="hidden sm:inline">Booking</span>
          </Link>
        )}

        <button
          type="button"
          onClick={onCreateRequest}
          className="px-3 py-1.5 rounded-xl bg-[#0D5C56] text-white hover:bg-[#094440] text-xs font-medium inline-flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Plus size={14} strokeWidth={2.2} />
          <span>Create Request</span>
        </button>

        <button
          type="button"
          onClick={onToggleStatus}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-[#D8D2C5] text-[#5C6E6B] hover:text-[#1A2B28] hover:bg-[#FAF9F6] text-xs font-medium inline-flex items-center gap-1 transition-colors"
          title={conversation.status === 'open' ? 'Mark conversation closed' : 'Re-open conversation'}
        >
          {conversation.status === 'open' ? (
            <>
              <CheckCircle size={14} className="text-[#276749]" />
              <span className="hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reopen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
