export default function TimeSlot({ slot, isBooked, isSelected, onSelect, disabled }) {
  const getClasses = () => {
    if (isBooked) {
      return 'bg-red-500/8 border-red-500/20 text-red-400/60 cursor-not-allowed line-through';
    }
    if (isSelected) {
      return 'bg-primary-500/20 border-primary-500/40 text-primary-300 shadow-lg shadow-primary-500/10 ring-1 ring-primary-500/30';
    }
    if (disabled) {
      return 'bg-surface-800/30 border-surface-700/30 text-surface-600 cursor-not-allowed';
    }
    return 'bg-surface-800/40 border-surface-700/50 text-surface-300 hover:border-primary-500/30 hover:bg-primary-500/5 hover:text-primary-300 cursor-pointer';
  };

  return (
    <button
      type="button"
      onClick={() => !isBooked && !disabled && onSelect(slot)}
      disabled={isBooked || disabled}
      className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-between ${getClasses()}`}
    >
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {slot.label}
      </span>
      {isBooked && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold">
          Booked
        </span>
      )}
      {isSelected && (
        <svg className="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      )}
    </button>
  );
}
