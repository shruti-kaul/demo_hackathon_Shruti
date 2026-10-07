const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    success: true,
    message: 'DeskDrop Backend API is running',
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
