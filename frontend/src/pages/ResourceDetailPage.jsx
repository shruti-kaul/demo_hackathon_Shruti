import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, useBookings } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import BookingForm from '../components/BookingForm';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { resources, getAvailableSlotCount } = useBookings();
  const { user } = useAuth();
  const resource = resources.find(r => (r._id || r.id) === id);

  if (!resource) {
    return (
      <div className="min-h-screen bg-grid flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-surface-100 mb-2">Resource Not Found</h2>
          <p className="text-surface-500 text-sm mb-6">The resource you're looking for doesn't exist.</p>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary-500/15 text-primary-300 font-medium text-sm border border-primary-500/30 hover:bg-primary-500/25 transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const resourceId = resource._id || resource.id;
const slotsAvailableToday = getAvailableSlotCount(resourceId, todayStr);

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-surface-500 mb-6">
          <Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-surface-300">{resource.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Resource Info — Left Column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Resource Card */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
                  </svg>
                </div>
                <StatusBadge status={resource.status} />
              </div>

              <h1 className="text-2xl font-bold text-surface-100 mb-1">{resource.name}</h1>
              <p className="text-sm text-surface-400 flex items-center gap-1.5 mb-4">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                </svg>
                {resource.location}
              </p>
              <p className="text-sm text-surface-400 leading-relaxed">{resource.description}</p>
            </div>

            {/* Details */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-surface-300 mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-500">Category</span>
                  <span className="text-sm text-surface-200 font-medium">{resource.category}</span>
                </div>
                {resource.capacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-surface-500">Capacity</span>
                    <span className="text-sm text-surface-200 font-medium">{resource.capacity} people</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-surface-500">Today's Availability</span>
                  <span className={`text-sm font-medium ${slotsAvailableToday > 5 ? 'text-emerald-400' : slotsAvailableToday > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                    {slotsAvailableToday}/10 slots free
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {resource.amenities && resource.amenities.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-surface-300 mb-4">Amenities & Features</h3>
                <div className="flex flex-wrap gap-2">
                  {resource.amenities.map((a) => (
                    <span
                      key={a}
                      className="px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700/40 text-xs text-surface-300 font-medium"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form — Right Column */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-surface-100 mb-1">Book This Resource</h2>
              <p className="text-sm text-surface-500 mb-6">Select a date and available time slot to make a reservation.</p>
              <BookingForm
                resource={resource}
                onSuccess={() => navigate('/bookings')}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
