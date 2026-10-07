import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useBookings } from '../context/AppContext';
import ResourceCard from '../components/ResourceCard';
import ResourceFilter from '../components/ResourceFilter';
import ResourceModal from '../components/ResourceModal';
import StatusBadge from '../components/StatusBadge';

const baseCategories = [
  { id: 'all', label: 'All Resources', icon: '📦' },
  { id: 'Meeting Room', label: 'Meeting Rooms', icon: '🏢' },
  { id: 'Equipment', label: 'Equipment', icon: '🎙️' },
  { id: 'Device', label: 'Devices', icon: '📱' },
  { id: 'Workspace', label: 'Workspaces', icon: '💼' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const { resources, bookings, addResource, updateResource, deleteResource } = useBookings();
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState(null);

  const categories = useMemo(() => {
    return baseCategories.map(cat => ({
      ...cat,
      count: cat.id === 'all'
        ? resources.length
        : resources.filter(r => r.category === cat.id).length,
    }));
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (activeCategory === 'all') return resources;
    return resources.filter(r => r.category === activeCategory);
  }, [activeCategory, resources]);

  const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'upcoming' || b.status === 'confirmed');
  const availableCount = resources.filter(r => (r.status || '').toLowerCase() === 'available').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleOpenAddModal = () => {
    setResourceToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (resource) => {
    setResourceToEdit(resource);
    setIsModalOpen(true);
  };

  const handleDeleteResource = async (resource) => {
    const id = resource._id || resource.id;
    if (window.confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      const res = await deleteResource(id);
      if (!res.success) {
        alert(res.message || 'Failed to delete resource');
      }
    }
  };

  const handleSaveResource = async (formData) => {
    if (resourceToEdit) {
      const id = resourceToEdit._id || resourceToEdit.id;
      return await updateResource(id, formData);
    } else {
      return await addResource(formData);
    }
  };

  return (
    <div className="min-h-screen bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Hero */}
        <div className="glass rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-primary-400 font-medium mb-1">{greeting()}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 mb-2">
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
                {user?.isAdmin && (
                  <span className="ml-3 text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 align-middle">
                    Admin Portal
                  </span>
                )}
              </h1>
              <p className="text-surface-400 text-sm max-w-lg">
                Book meeting rooms, equipment, and shared workspaces. {availableCount} resources currently available.
              </p>
            </div>

            {/* Admin Add Resource CTA */}
            {user?.isAdmin && (
              <button
                onClick={handleOpenAddModal}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98] flex items-center justify-center gap-2 self-start md:self-auto"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                + Add Resource
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-10">
            {[
              { label: 'Total Resources', value: resources.length, color: 'text-primary-400' },
              { label: 'Available Now', value: availableCount, color: 'text-emerald-400' },
              { label: 'Your Bookings', value: activeBookings.length, color: 'text-blue-400' },
              { label: 'Categories', value: categories.length - 1, color: 'text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-800/40 rounded-xl px-4 py-3">
                <p className="text-2xl font-bold tracking-tight">
                  <span className={stat.color}>{stat.value}</span>
                </p>
                <p className="text-[11px] text-surface-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Bookings Quick View */}
        {activeBookings.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                Active & Upcoming
              </h2>
              <Link
                to="/bookings"
                className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1 transition-colors"
              >
                View all
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeBookings.slice(0, 3).map((booking) => (
                <div key={booking.id || booking._id} className="glass-light rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-200 truncate">{booking.resourceName}</p>
                    <p className="text-xs text-surface-500">{booking.timeSlot?.label} · {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <StatusBadge status={booking.status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-lg font-bold text-surface-100 flex items-center gap-3">
              Office Resources
              {user?.isAdmin && (
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1 rounded-lg bg-primary-500/15 text-primary-300 text-xs font-semibold hover:bg-primary-500/25 border border-primary-500/30 transition-all inline-flex items-center gap-1"
                >
                  + Add Resource
                </button>
              )}
            </h2>
          </div>

          <div className="mb-6">
            <ResourceFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource._id || resource.id}
                resource={resource}
                isAdmin={user?.isAdmin}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteResource}
              />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-16">
              <p className="text-surface-500 text-sm">No resources found in this category.</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Add/Edit Modal */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resourceToEdit={resourceToEdit}
        onSave={handleSaveResource}
      />
    </div>
  );
}

