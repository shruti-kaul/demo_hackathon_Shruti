const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes require authentication
router.use(protect);

// POST /api/bookings - Create new booking
router.post('/', createBooking);

// GET /api/bookings/my - Get user bookings
router.get('/my', getUserBookings);

// GET /api/bookings/:id - Get booking by ID
router.get('/:id', getBookingById);

// PATCH /api/bookings/:id/cancel - Cancel a booking
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
