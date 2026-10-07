const Booking = require('../models/Booking');
const User = require('../models/User');
const Resource = require('../models/Resource');
const mongoose = require('mongoose');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Authenticated users)
const createBooking = async (req, res) => {
  try {
    const { user, userId, resource, resourceId, date, startTime, endTime } = req.body;

    // A normal user can only create bookings for themselves. Admin can optionally specify another user.
    let targetUser = req.user._id;
    if (req.user.isAdmin && (user || userId)) {
      targetUser = user || userId;
    }

    const targetResource = resource || resourceId;

    // Validate required fields
    if (!targetResource || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide resource, date, startTime, and endTime',
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(targetUser)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid User ID format',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetResource)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Resource ID format',
      });
    }

    // Verify user exists
    const userDoc = await User.findById(targetUser);
    if (!userDoc) {
      return res.status(404).json({
        success: false,
        message: 'Referenced user not found',
      });
    }

    // Verify resource exists
    const resourceDoc = await Resource.findById(targetResource);
    if (!resourceDoc) {
      return res.status(404).json({
        success: false,
        message: 'Referenced resource not found',
      });
    }


    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
      resource: targetResource,
      date,
      status: 'Confirmed',
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (conflictingBooking) {
      return res.status(409).json({
      success: false,
      message: 'This resource is already booked for the selected time slot',
    });
    }

    // Create booking
    const booking = await Booking.create({
      user: targetUser,
      resource: targetResource,
      date,
      startTime,
      endTime,
      status: 'Confirmed',
    });

    // Populate user and resource info for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email')
      .populate('resource', 'name category location status description');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking',
      error: error.message,
    });
  }
};

// @desc    Get bookings for authenticated user (or all/query if admin)
// @route   GET /api/bookings/my
// @access  Private (Authenticated users)
const getUserBookings = async (req, res) => {
  try {
    let query = {};

    if (req.user.isAdmin) {
      // Admin can filter by userId if requested, or see all bookings
      const requestedUser = req.query.userId || req.query.user;
      if (requestedUser) {
        if (!mongoose.Types.ObjectId.isValid(requestedUser)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid User ID format',
          });
        }
        query.user = requestedUser;
      }
    } else {
      // Normal user can ONLY see their own bookings
      query.user = req.user._id;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('resource', 'name category location status description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings',
      error: error.message,
    });
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (Owner or Admin)
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Booking ID format',
      });
    }

    const booking = await Booking.findById(id)
      .populate('user', 'name email')
      .populate('resource', 'name category location status description');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check ownership or admin status
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (!req.user.isAdmin && bookingUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking',
      error: error.message,
    });
  }
};

// @desc    Cancel a booking (change status to Cancelled)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private (Owner or Admin)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Booking ID format',
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check ownership or admin status
    const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();
    if (!req.user.isAdmin && bookingUserId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    booking.status = 'Cancelled';
    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate('user', 'name email')
      .populate('resource', 'name category location status description');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updatedBooking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking',
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
