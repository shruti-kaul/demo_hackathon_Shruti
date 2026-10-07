import StatusBadge from './StatusBadge';

export default function BookingCard({ booking, onCancel }) {
  const statusLower = (booking.status || '').toLowerCase();
  const canCancel = statusLower !== 'cancelled';

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatBookedAt = (isoStr) => {
    if (!isoStr) return '';
    const d = new Date(isoStr);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className={`glass-light rounded-2xl p-5 transition-all duration-300 hover:border-primary-500/15 ${
      statusLower === 'cancelled' ? 'opacity-50' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-surface-100">{booking.resourceName || booking.resource?.name || 'Resource'}</h3>
          <p className="text-xs text-surface-500 mt-0.5 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
            </svg>
            {booking.location || booking.resource?.location || 'Office Location'}
          </p>
        </div>
        <StatusBadge status={booking.status} size="sm" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface-800/40 rounded-xl px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold mb-0.5">Date</p>
          <p className="text-sm text-surface-200 font-medium">{formatDate(booking.date)}</p>
        </div>
        <div className="bg-surface-800/40 rounded-xl px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold mb-0.5">Time</p>
          <p className="text-sm text-surface-200 font-medium">{booking.timeSlot?.label || `${booking.startTime} - ${booking.endTime}`}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-surface-700/40">
        <span className="text-[11px] text-surface-500">
          Booked {formatBookedAt(booking.bookedAt || booking.createdAt)}
        </span>
        {canCancel && (
          <button
            onClick={() => onCancel(booking._id || booking.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

