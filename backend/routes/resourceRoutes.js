const express = require('express');
const router = express.Router();
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
} = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getResources);
router.get('/:id', getResourceById);

// Admin only routes
router.post('/', protect, admin, createResource);
router.put('/:id', protect, admin, updateResource);
router.delete('/:id', protect, admin, deleteResource);

module.exports = router;
