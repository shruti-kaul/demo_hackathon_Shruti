import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { resources as mockResources, initialUserBookings, bookedSlots as initialBookedSlots } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('deskdrop_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('deskdrop_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = Boolean(token && user);

  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('deskdrop_token', data.token);
        localStorage.setItem('deskdrop_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Invalid email or password' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('deskdrop_token', data.token);
        localStorage.setItem('deskdrop_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Server connection error. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('deskdrop_token');
    localStorage.removeItem('deskdrop_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ── Booking & Resource Context ──
const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookedSlots, setBookedSlots] = useState(initialBookedSlots);
  const [loadingResources, setLoadingResources] = useState(false);

  // Fetch all resources from backend
  const fetchResources = useCallback(async () => {
    setLoadingResources(true);
    try {
      const res = await fetch('/api/resources');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data) && data.data.length > 0) {
        // Normalize id field for frontend convenience
        const normalized = data.data.map(r => ({
          ...r,
          id: r._id || r.id,
        }));
        setResources(normalized);
      } else {
        setResources(mockResources);
      }
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      setResources(mockResources);
    } finally {
      setLoadingResources(false);
    }
  }, []);

  // Fetch bookings for logged-in user
  const fetchBookings = useCallback(async () => {
    if (!token) {
      setBookings([]);
      return;
    }
    try {
      const res = await fetch('/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        const normalizedBookings = data.data.map(b => ({
          ...b,
          id: b._id || b.id,
          resourceId: b.resource?._id || b.resource || b.resourceId,
          resourceName: b.resource?.name || b.resourceName || 'Resource',
          category: b.resource?.category || b.category || 'General',
          location: b.resource?.location || b.location || 'Office',
          timeSlot: {
            id: `ts-${b.startTime}`,
            label: `${b.startTime} – ${b.endTime}`,
            start: b.startTime,
            end: b.endTime,
          },
          status: (b.status || 'Confirmed').toLowerCase(),
          bookedAt: b.createdAt || new Date().toISOString(),
        }));
        setBookings(normalizedBookings);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      setBookings([]);
    }
  }, [isAuthenticated, fetchBookings]);

  // Admin Resource Actions
  const addResource = useCallback(async (resourceData) => {
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchResources();
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message || 'Failed to add resource' };
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      return { success: false, message: error.message || 'Server error' };
    }
  }, [token, fetchResources]);

  const updateResource = useCallback(async (id, resourceData) => {
    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
      });
  
      const data = await res.json();
  
      if (res.ok && data.success) {
        await fetchResources();
        return { success: true, data: data.data };
      } else {
        return {
          success: false,
          message: data.message || 'Failed to update resource',
        };
      }
    } catch (error) {
      console.error('Error updating resource:', error);
      return {
        success: false,
        message: error.message || 'Server error',
      };
    }
  }, [token, fetchResources]);

  const deleteResource = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchResources();
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Failed to delete resource' };
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      return { success: false, message: error.message || 'Server error' };
    }
  }, [token, fetchResources]);

  // Booking Actions
  const addBooking = useCallback(async (bookingInput) => {
    try {
      const payload = {
        resource: bookingInput.resourceId,
        date: bookingInput.date,
        startTime: bookingInput.timeSlot?.start || bookingInput.startTime,
        endTime: bookingInput.timeSlot?.end || bookingInput.endTime,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        await fetchBookings();
        return { success: true, data: data.data };
      }
      
      return {
        success: false,
        message: data.message || 'Failed to create booking',
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, message: error.message || 'Failed to create booking' };
    }
  }, [token, fetchBookings]);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await fetchBookings();
        return { success: true };
      } else {
        // Optimistic fallback
        setBookings(prev =>
          prev.map(b => (b.id === bookingId || b._id === bookingId) ? { ...b, status: 'cancelled' } : b)
        );
        return { success: true };
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setBookings(prev =>
        prev.map(b => (b.id === bookingId || b._id === bookingId) ? { ...b, status: 'cancelled' } : b)
      );
      return { success: true };
    }
  }, [token, fetchBookings]);

  const isSlotBooked = useCallback((resourceId, date, slotId) => {
    const key = `${resourceId}-${date}`;
    return (bookedSlots[key] || []).includes(slotId);
  }, [bookedSlots]);

  const getAvailableSlotCount = useCallback((resourceId, date) => {
    const key = `${resourceId}-${date}`;
    const booked = bookedSlots[key] || [];
    return 10 - booked.length;
  }, [bookedSlots]);

  return (
    <BookingContext.Provider
      value={{
        resources,
        bookings,
        loadingResources,
        fetchResources,
        fetchBookings,
        addResource,
        updateResource,
        deleteResource,
        addBooking,
        cancelBooking,
        isSlotBooked,
        getAvailableSlotCount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBookings must be used within BookingProvider');
  return ctx;
}

