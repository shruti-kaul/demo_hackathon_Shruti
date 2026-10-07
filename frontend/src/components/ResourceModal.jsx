import { useState, useEffect } from 'react';

export default function ResourceModal({ isOpen, onClose, resourceToEdit, onSave }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Meeting Room',
    location: '',
    description: '',
    status: 'Available',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resourceToEdit) {
      setForm({
        name: resourceToEdit.name || '',
        category: resourceToEdit.category || 'Meeting Room',
        location: resourceToEdit.location || '',
        description: resourceToEdit.description || '',
        status: resourceToEdit.status || 'Available',
      });
    } else {
      setForm({
        name: '',
        category: 'Meeting Room',
        location: '',
        description: '',
        status: 'Available',
      });
    }
    setError('');
  }, [resourceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Resource name is required');
      return;
    }
    if (!form.category) {
      setError('Category is required');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const result = await onSave(form);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || 'Failed to save resource');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-lg p-6 sm:p-8 relative border border-primary-500/20 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-700/50">
          <h2 className="text-xl font-bold text-surface-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-400" />
            {resourceToEdit ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Resource Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Executive Boardroom"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
              >
                <option value="Meeting Room">Meeting Room</option>
                <option value="Equipment">Equipment</option>
                <option value="Device">Device</option>
                <option value="Workspace">Workspace</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
              >
                <option value="Available">Available</option>
                <option value="In Use">In Use</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Floor 2, Wing B"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the resource features and details..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-surface-400 hover:text-surface-200 hover:bg-surface-800/50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                resourceToEdit ? 'Save Changes' : 'Create Resource'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
