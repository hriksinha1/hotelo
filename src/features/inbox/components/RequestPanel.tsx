import React from 'react';
import { Request, RequestStatus } from '../../../lib/repository/types';
import { Wrench, CheckCircle2, Clock, User, Plus, AlertCircle } from 'lucide-react';

interface RequestPanelProps {
  requests: Request[];
  onCreateRequest: () => void;
  onUpdateStatus: (id: string, status: RequestStatus) => void;
}

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  open: { label: 'Open', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  assigned: { label: 'Assigned', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  in_progress: { label: 'In Progress', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  cancelled: { label: 'Cancelled', bg: 'bg-stone-50', text: 'text-stone-600', border: 'border-stone-200' }
};

export default function RequestPanel({
  requests,
  onCreateRequest,
  onUpdateStatus
}: RequestPanelProps) {
  const openRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const pastRequests = requests.filter(r => r.status === 'completed' || r.status === 'cancelled');

  return (
    <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#D8D2C5] bg-[#FAF9F6] flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#EAE5DC] flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-[#0D5C56]" />
          <h3 className="font-semibold text-sm text-[#1A2B28]">Operational Requests</h3>
          <span className="px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#C45532] text-xs font-bold border border-[#F5DCAD]">
            {openRequests.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onCreateRequest}
          className="p-1.5 rounded-lg text-[#0D5C56] hover:bg-[#E8F3F1] border border-[#BDDFC9] text-xs font-medium inline-flex items-center gap-1 transition-colors"
          title="Add new operational request"
        >
          <Plus size={14} />
          <span className="text-xs">Add</span>
        </button>
      </div>

      {/* List */}
      <div className="p-4 space-y-3.5 flex-1">
        {requests.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-[#D8D2C5] rounded-xl bg-white">
            <div className="w-10 h-10 rounded-full bg-[#FAF9F6] text-[#5C6E6B] flex items-center justify-center mx-auto mb-2 border border-[#EAE5DC]">
              <Wrench size={18} />
            </div>
            <p className="text-xs font-semibold text-[#1A2B28]">No requests yet</p>
            <p className="text-[11px] text-[#5C6E6B] mt-1 leading-normal">
              Track housekeeping, maintenance, late checkout, or amenities directly in this guest stay.
            </p>
            <button
              type="button"
              onClick={onCreateRequest}
              className="mt-3 px-3 py-1.5 rounded-xl bg-[#0D5C56] text-white text-xs font-medium hover:bg-[#094440] transition-colors inline-flex items-center gap-1"
            >
              <Plus size={12} />
              Create First Request
            </button>
          </div>
        ) : (
          <>
            {/* Active Requests */}
            {openRequests.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold text-[#5C6E6B] uppercase tracking-wider">
                  Active ({openRequests.length})
                </p>
                {openRequests.map(req => {
                  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.open;
                  return (
                    <div
                      key={req.id}
                      className="p-3 bg-white rounded-xl border border-[#D8D2C5] shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="text-xs font-semibold text-[#1A2B28] leading-tight">
                          {req.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#5C6E6B]">
                        <span className="px-1.5 py-0.5 rounded-md bg-[#FAF9F6] border border-[#EAE5DC] text-[10px] font-medium text-[#1A2B28]">
                          {req.category}
                        </span>
                        {req.assigned_to && (
                          <span className="flex items-center gap-1 truncate">
                            <User size={10} />
                            {req.assigned_to.split(' ')[0]}
                          </span>
                        )}
                      </div>

                      {req.description && (
                        <p className="text-[11px] text-[#5C6E6B] leading-normal line-clamp-2">
                          {req.description}
                        </p>
                      )}

                      {/* Quick Status Select */}
                      <div className="pt-2 border-t border-[#EAE5DC] flex items-center justify-between gap-2">
                        <span className="text-[10px] text-[#5C6E6B]">Update status:</span>
                        <select
                          value={req.status}
                          onChange={e => onUpdateStatus(req.id, e.target.value as RequestStatus)}
                          className="text-xs px-2 py-1 rounded-lg border border-[#D8D2C5] bg-[#FAF9F6] text-[#1A2B28] focus:outline-none focus:border-[#0D5C56]"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Completed / History */}
            {pastRequests.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-[#EAE5DC]">
                <p className="text-[11px] font-bold text-[#5C6E6B] uppercase tracking-wider">
                  Resolved ({pastRequests.length})
                </p>
                {pastRequests.map(req => {
                  const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.completed;
                  return (
                    <div
                      key={req.id}
                      className="p-2.5 bg-white/70 rounded-xl border border-[#EAE5DC] space-y-1 opacity-80"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-medium text-[#1A2B28] line-through">
                          {req.title}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#5C6E6B]">
                        {req.category} · {req.assigned_to || 'Resolved'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
