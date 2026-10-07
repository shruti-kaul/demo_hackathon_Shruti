import { useState } from 'react';
import { timeSlots } from '../data/mockData';
import { useBookings } from '../context/AppContext';
import TimeSlot from './TimeSlot';

export default function BookingForm({ resource, onSuccess }) {
  const { isSlotBooked, addBooking } = useBookings();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Generate next 7 days
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push({
      value: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      isToday: i === 0,
    });
  }

  const handleSlotSelect = (slot) => {
    if (isSlotBooked(resource._id || resource.id, selectedDate, slot.id)) {
      // Find next available slot
      const available = timeSlots.find(
        s => !isSlotBooked(resource._id || resource.id, selectedDate, s.id) && s.id !== slot.id
      );
      setConflict({
        slot,
        alternative: available || null,
      });
      setSelectedSlot(null);
    } else {
      setConflict(null);
      setSelectedSlot(slot);
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) return;

    const targetResId = resource._id || resource.id;

    const result = await addBooking({
      resourceId: targetResId,
      resourceName: resource.name,
      category: resource.category,
      location: resource.location,
      date: selectedDate,
      timeSlot: selectedSlot,
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
      status: selectedDate === today.toISOString().split('T')[0] ? 'active' : 'upcoming',
    });
    
    if (result.success) {
      setError('');
      setSuccess(true);
    
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } else {
      setSuccess(false);
      setError(result.message || 'This time slot is already booked.');
    }
  };

  const handlePickAlternative = () => {
    if (conflict?.alternative) {
      setSelectedSlot(conflict.alternative);
      setConflict(null);
    }
  };

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-surface-100 mb-1">Booking Confirmed!</h3>
        <p className="text-surface-400 text-sm">
          {resource.name} · {selectedDate} · {selectedSlot?.label}
        </p>
      </div>
    );
  }

  const statusLower = (resource.status || '').toLowerCase().trim();
  const isDisabledResource = statusLower !== 'available';
  const isInUse = statusLower === 'in use' || statusLower === 'in-use';

  return (
    <div className="space-y-6">
      {isDisabledResource && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-sm text-amber-400">
          <span className="font-semibold">⚠ This resource is currently {isInUse ? 'in use' : 'under maintenance'}.</span>
          <span className="block text-amber-400/70 text-xs mt-1">Booking is not available at this time.</span>
        </div>
      )}

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-semibold text-surface-200 mb-3">Select Date</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => { setSelectedDate(d.value); setSelectedSlot(null); setConflict(null); }}
              disabled={isDisabledResource}
              className={`px-3 py-3 rounded-xl text-center transition-all duration-200 border ${
                selectedDate === d.value
                  ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                  : 'bg-surface-800/40 border-surface-700/50 text-surface-400 hover:border-primary-500/20 hover:text-surface-200'
              } ${isDisabledResource ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="block text-[10px] uppercase tracking-wider font-semibold">
                {d.isToday ? 'Today' : d.label.split(',')[0]?.split(' ')[0]}
              </span>
              <span className="block text-sm font-bold mt-0.5">
                {d.label.split(' ').slice(1).join(' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-semibold text-surface-200 mb-3">Select Time Slot</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <TimeSlot
                key={slot.id}
                slot={slot}
                isBooked={isSlotBooked(resource._id || resource.id, selectedDate, slot.id)}
                isSelected={selectedSlot?.id === slot.id}
                onSelect={handleSlotSelect}
                disabled={isDisabledResource}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conflict Warning */}
      {conflict && (
        <div className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400">Booking Conflict</p>
              <p className="text-xs text-red-400/70 mt-1">
                The slot <span className="font-semibold">{conflict.slot.label}</span> is already booked for this date.
              </p>
              {conflict.alternative && (
                <button
                  onClick={handlePickAlternative}
                  className="mt-3 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-500/15 text-primary-300 border border-primary-500/30 hover:bg-primary-500/25 transition-all"
                >
                  ✨ Use available slot: {conflict.alternative.label}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
        {error}
      </div>
      )}

      {/* Book Button */}
      {selectedDate && selectedSlot && (
        <div className="pt-2">
          <div className="bg-surface-800/40 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-500 font-medium">Booking Summary</p>
              <p className="text-sm text-surface-200 font-semibold mt-0.5">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · {selectedSlot.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-surface-500 font-medium">Resource</p>
              <p className="text-sm text-primary-300 font-semibold mt-0.5">{resource.name}</p>
            </div>
          </div>
          <button
            onClick={handleBook}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98]"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
}
