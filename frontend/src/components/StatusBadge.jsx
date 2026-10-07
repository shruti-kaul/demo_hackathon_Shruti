export default function StatusBadge({ status, size = 'md' }) {
  const normalizedKey = (status || '').toLowerCase().trim().replace(/\s+/g, '-');

  const config = {
    available: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      label: 'Available',
    },
    'in-use': {
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      label: 'In Use',
    },
    maintenance: {
      bg: 'bg-red-500/15',
      text: 'text-red-400',
      dot: 'bg-red-400',
      label: 'Maintenance',
    },
    confirmed: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      dot: 'bg-blue-400',
      label: 'Confirmed',
    },
    active: {
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      dot: 'bg-blue-400',
      label: 'Active',
    },
    upcoming: {
      bg: 'bg-primary-500/15',
      text: 'text-primary-400',
      dot: 'bg-primary-400',
      label: 'Upcoming',
    },
    completed: {
      bg: 'bg-surface-500/15',
      text: 'text-surface-400',
      dot: 'bg-surface-500',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-red-500/10',
      text: 'text-red-400/70',
      dot: 'bg-red-500/50',
      label: 'Cancelled',
    },
  };

  const c = config[normalizedKey] || {
    bg: 'bg-surface-500/15',
    text: 'text-surface-300',
    dot: 'bg-surface-400',
    label: status || 'Unknown',
  };
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}

