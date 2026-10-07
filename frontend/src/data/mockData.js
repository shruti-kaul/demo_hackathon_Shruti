// ── Mock Resources ──
export const resources = [
  {
    id: 'res-001',
    name: 'Meeting Room A',
    category: 'Meeting Room',
    location: 'Floor 2, Wing A',
    description: 'Spacious conference room with a 65" display, whiteboard, and video conferencing setup. Seats up to 12 people.',
    capacity: 12,
    amenities: ['Video Conferencing', '65" Display', 'Whiteboard', 'WiFi', 'Power Outlets'],
    status: 'available',
    image: 'meeting-room',
  },
  {
    id: 'res-002',
    name: 'Meeting Room B',
    category: 'Meeting Room',
    location: 'Floor 3, Wing B',
    description: 'Compact huddle room perfect for quick syncs and brainstorming sessions. Seats up to 6 people.',
    capacity: 6,
    amenities: ['Smart TV', 'Whiteboard', 'WiFi'],
    status: 'in-use',
    image: 'meeting-room',
  },
  {
    id: 'res-003',
    name: 'Podcast Microphone',
    category: 'Equipment',
    location: 'Media Room, Floor 1',
    description: 'Professional-grade Blue Yeti X condenser microphone with pop filter, boom arm, and shock mount.',
    capacity: null,
    amenities: ['Pop Filter', 'Boom Arm', 'Shock Mount', 'XLR Cable'],
    status: 'available',
    image: 'microphone',
  },
  {
    id: 'res-004',
    name: 'Testing Device — iPad Pro',
    category: 'Device',
    location: 'QA Lab, Floor 2',
    description: 'iPad Pro 12.9" (M2) pre-loaded with TestFlight, BrowserStack, and debugging tools for mobile QA testing.',
    capacity: null,
    amenities: ['Apple Pencil', 'Magic Keyboard', 'USB-C Hub'],
    status: 'available',
    image: 'device',
  },
  {
    id: 'res-005',
    name: 'Display Screen — 4K Monitor',
    category: 'Equipment',
    location: 'Hot-Desk Area, Floor 1',
    description: 'LG 32" UltraFine 4K IPS display with USB-C PD (90W), HDMI 2.1, and ergonomic stand.',
    capacity: null,
    amenities: ['USB-C PD', 'HDMI 2.1', 'Adjustable Stand', 'Built-in Speakers'],
    status: 'maintenance',
    image: 'display',
  },
  {
    id: 'res-006',
    name: 'Standing Desk Pod',
    category: 'Workspace',
    location: 'Open Office, Floor 1',
    description: 'Motorized sit-stand desk pod with privacy screens, integrated power, and ergonomic chair.',
    capacity: 1,
    amenities: ['Motorized Desk', 'Privacy Screen', 'Ergonomic Chair', 'Power Strip'],
    status: 'available',
    image: 'workspace',
  },
];

// ── Categories ──
export const categories = [
  { id: 'all', label: 'All Resources', icon: '📦', count: resources.length },
  { id: 'Meeting Room', label: 'Meeting Rooms', icon: '🏢', count: resources.filter(r => r.category === 'Meeting Room').length },
  { id: 'Equipment', label: 'Equipment', icon: '🎙️', count: resources.filter(r => r.category === 'Equipment').length },
  { id: 'Device', label: 'Devices', icon: '📱', count: resources.filter(r => r.category === 'Device').length },
  { id: 'Workspace', label: 'Workspaces', icon: '💼', count: resources.filter(r => r.category === 'Workspace').length },
];

// ── Time Slots ──
export const timeSlots = [
  { id: 'ts-01', label: '08:00 – 09:00', start: '08:00', end: '09:00' },
  { id: 'ts-02', label: '09:00 – 10:00', start: '09:00', end: '10:00' },
  { id: 'ts-03', label: '10:00 – 11:00', start: '10:00', end: '11:00' },
  { id: 'ts-04', label: '11:00 – 12:00', start: '11:00', end: '12:00' },
  { id: 'ts-05', label: '12:00 – 13:00', start: '12:00', end: '13:00' },
  { id: 'ts-06', label: '13:00 – 14:00', start: '13:00', end: '14:00' },
  { id: 'ts-07', label: '14:00 – 15:00', start: '14:00', end: '15:00' },
  { id: 'ts-08', label: '15:00 – 16:00', start: '15:00', end: '16:00' },
  { id: 'ts-09', label: '16:00 – 17:00', start: '16:00', end: '17:00' },
  { id: 'ts-10', label: '17:00 – 18:00', start: '17:00', end: '18:00' },
];

// ── Mock Booked Slots (simulates bookings from other users) ──
// Key: "resourceId-YYYY-MM-DD" → array of time-slot IDs that are booked
const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];

export const bookedSlots = {
  [`res-001-${todayStr}`]: ['ts-02', 'ts-03', 'ts-06'],
  [`res-001-${tomorrowStr}`]: ['ts-04', 'ts-05'],
  [`res-002-${todayStr}`]: ['ts-01', 'ts-02', 'ts-03', 'ts-04', 'ts-05', 'ts-06', 'ts-07', 'ts-08', 'ts-09', 'ts-10'],
  [`res-002-${tomorrowStr}`]: ['ts-03', 'ts-07'],
  [`res-003-${todayStr}`]: ['ts-05'],
  [`res-004-${tomorrowStr}`]: ['ts-02', 'ts-03', 'ts-04'],
  [`res-006-${todayStr}`]: ['ts-01', 'ts-02'],
};

// ── Mock User Bookings ──
export const initialUserBookings = [
  {
    id: 'bk-001',
    resourceId: 'res-001',
    resourceName: 'Meeting Room A',
    category: 'Meeting Room',
    location: 'Floor 2, Wing A',
    date: todayStr,
    timeSlot: { id: 'ts-07', label: '14:00 – 15:00', start: '14:00', end: '15:00' },
    status: 'active',
    bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30).toISOString(),
  },
  {
    id: 'bk-002',
    resourceId: 'res-003',
    resourceName: 'Podcast Microphone',
    category: 'Equipment',
    location: 'Media Room, Floor 1',
    date: tomorrowStr,
    timeSlot: { id: 'ts-04', label: '11:00 – 12:00', start: '11:00', end: '12:00' },
    status: 'upcoming',
    bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15).toISOString(),
  },
  {
    id: 'bk-003',
    resourceId: 'res-004',
    resourceName: 'Testing Device — iPad Pro',
    category: 'Device',
    location: 'QA Lab, Floor 2',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString().split('T')[0],
    timeSlot: { id: 'ts-03', label: '10:00 – 11:00', start: '10:00', end: '11:00' },
    status: 'completed',
    bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3).toISOString(),
  },
  {
    id: 'bk-004',
    resourceId: 'res-002',
    resourceName: 'Meeting Room B',
    category: 'Meeting Room',
    location: 'Floor 3, Wing B',
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toISOString().split('T')[0],
    timeSlot: { id: 'ts-02', label: '09:00 – 10:00', start: '09:00', end: '10:00' },
    status: 'completed',
    bookedAt: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toISOString(),
  },
];

// ── Mock User ──
export const mockUser = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@company.com',
  avatar: null,
  department: 'Engineering',
};
