import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const categoryIcons = {
  'Meeting Room': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
    </svg>
  ),
  'Equipment': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743" />
    </svg>
  ),
  'Device': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  'Workspace': (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  ),
};

export default function ResourceCard({ resource, isAdmin, onEdit, onDelete }) {
  const icon = categoryIcons[resource.category] || categoryIcons['Equipment'];
  const statusLower = (resource.status || '').toLowerCase();
  const isBookable = statusLower === 'available';

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(resource);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(resource);
  };

  return (
    <Link
      to={`/resources/${resource._id || resource.id}`}
      className="group block relative"
    >
      <div className={`glass-light rounded-2xl p-5 transition-all duration-300 hover:border-primary-500/25 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1 ${
        !isBookable ? 'opacity-80' : ''
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300 ${
            isBookable
              ? 'bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20'
              : 'bg-surface-700/50 text-surface-500'
          }`}>
            {icon}
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={resource.status} />

            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex items-center gap-1 z-10 bg-surface-800/80 rounded-lg p-1 border border-surface-700/50">
                <button
                  type="button"
                  onClick={handleEditClick}
                  title="Edit Resource"
                  className="p-1 rounded text-surface-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  title="Delete Resource"
                  className="p-1 rounded text-surface-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <h3 className="text-base font-semibold text-surface-100 mb-1 group-hover:text-primary-300 transition-colors">
          {resource.name}
        </h3>
        <p className="text-xs text-surface-500 mb-3 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
          </svg>
          {resource.location || 'Office Location'}
        </p>
        <p className="text-sm text-surface-400 line-clamp-2 mb-4 leading-relaxed">
          {resource.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-700/50">
          <span className="text-xs text-surface-500 font-medium">{resource.category}</span>
          {isBookable ? (
            <span className="text-xs text-primary-400 font-medium group-hover:text-primary-300 flex items-center gap-1 transition-colors">
              Book Now
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          ) : (
            <span className="text-xs text-surface-500 font-medium capitalize">{resource.status || 'Unavailable'}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

