import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBookings } from '../context/AppContext';
import BookingCard from '../components/BookingCard';

const tabs = [
  { id: 'upcoming', label: 'Upcoming', statuses: ['upcoming'] },
  { id: 'active', label: 'Active / Confirmed', statuses: ['active', 'confirmed'] },
  { id: 'past', label: 'Past', statuses: ['completed', 'cancelled'] },
  { id: 'all', label: 'All', statuses: null },
];

export default function BookingsPage() {
  const { bookings, cancelBooking } = useBookings();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = useMemo(() => {
    const tab = tabs.find(t => t.id === activeTab);
    if (!tab || !tab.statuses) return bookings;
    return bookings.filter(b => tab.statuses.includes((b.status || '').toLowerCase()));
  }, [activeTab, bookings]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBooking(id);
    }
  };

  const counts = {
    upcoming: bookings.filter(b => (b.status || '').toLowerCase() === 'upcoming').length,
    active: bookings.filter(b => ['active', 'confirmed'].includes((b.status || '').toLowerCase())).length,
    past: bookings.filter(b => ['completed', 'cancelled'].includes((b.status || '').toLowerCase())).length,
    all: bookings.length,
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-surface-100">My Bookings</h1>
            <p className="text-sm text-surface-500 mt-1">Manage and track all your resource reservations</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98] inline-flex items-center gap-2 w-fit cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Booking
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface-800/40 rounded-xl mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[100px] px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary-500/15 text-primary-300 shadow-inner'
                  : 'text-surface-500 hover:text-surface-300'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.id
                  ? 'bg-primary-500/25 text-primary-200'
                  : 'bg-surface-700/50 text-surface-500'
              }`}>
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((booking) => (
              <BookingCard
                key={booking._id || booking.id}
                booking={booking}
                onCancel={handleCancel}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-surface-800/50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-surface-300 mb-1">No bookings found</h3>
            <p className="text-sm text-surface-500 mb-6">
              {activeTab === 'all'
                ? "You haven't made any bookings yet."
                : `No ${activeTab} bookings at the moment.`}
            </p>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-primary-500/15 text-primary-300 font-medium text-sm border border-primary-500/30 hover:bg-primary-500/25 transition-all inline-flex items-center gap-2"
            >
              Browse Resources
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
