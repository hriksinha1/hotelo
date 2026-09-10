import React, { useState, useEffect } from 'react';
import { RequestCategory } from '../../../lib/repository/types';
import { X, Wrench, BedDouble, User } from 'lucide-react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  roomNumber?: string;
  initialTitle?: string;
  onSubmit: (data: {
    category: RequestCategory;
    title: string;
    description?: string;
    assigned_to?: string;
  }) => Promise<any>;
}

const CATEGORIES: RequestCategory[] = [
  'Housekeeping',
  'Extra towels',
  'Extra pillows',
  'Maintenance',
  'Wi-Fi issue',
  'Room issue',
  'Room service',
  'Late checkout',
  'General request'
];

const STAFF_MEMBERS = [
  'Unassigned',
  'Anika Rao (Operations)',
  'Arjun Mehta (Front Desk)',
  'Pooja Joshi (Housekeeping)',
  'Ramesh Kumar (Engineering)'
];

export default function CreateRequestModal({
  isOpen,
  onClose,
  guestName,
  roomNumber,
  initialTitle = '',
  onSubmit
}: CreateRequestModalProps) {
  const [category, setCategory] = useState<RequestCategory>('Extra towels');
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('Unassigned');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit({
        category,
        title: title.trim(),
        description: description.trim() || undefined,
        assigned_to: assignedTo === 'Unassigned' ? undefined : assignedTo
      });
      setTitle('');
      setDescription('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white rounded-2xl border border-[#D8D2C5] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE5DC] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF0EB] text-[#C45532] border border-[#F5DCAD] flex items-center justify-center">
              <Wrench size={16} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1A2B28]">Create Operational Request</h3>
              <p className="text-xs text-[#5C6E6B]">
                {guestName} {roomNumber ? `· Room ${roomNumber}` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5C6E6B] hover:text-[#1A2B28] hover:bg-[#EAE5DC]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2B28] mb-1.5">
              Request Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-2 text-xs rounded-xl border text-left font-medium transition-all ${
                    category === cat
                      ? 'bg-[#0D5C56] text-white border-[#0D5C56]'
                      : 'bg-[#FAF9F6] text-[#1A2B28] border-[#D8D2C5] hover:border-[#0D5C56]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Request Title */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2B28] mb-1.5">
              Summary / Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 2 extra bath towels for Room 204"
              required
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28] focus:outline-none focus:border-[#0D5C56] focus:ring-1 focus:ring-[#0D5C56]"
            />
          </div>

          {/* Notes / Details */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2B28] mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide special instructions or delivery time window..."
              rows={2}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28] focus:outline-none focus:border-[#0D5C56] focus:ring-1 focus:ring-[#0D5C56]"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-xs font-semibold text-[#1A2B28] mb-1.5">
              Assign Staff Member
            </label>
            <select
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-[#D8D2C5] bg-white text-[#1A2B28] focus:outline-none focus:border-[#0D5C56]"
            >
              {STAFF_MEMBERS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE5DC]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#5C6E6B] hover:text-[#1A2B28] hover:bg-[#FAF9F6] rounded-xl border border-[#D8D2C5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-5 py-2 text-xs font-medium text-white bg-[#0D5C56] hover:bg-[#094440] disabled:opacity-50 rounded-xl transition-all shadow-xs"
            >
              {submitting ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
