const Resource = require('../models/Resource');
const mongoose = require('mongoose');

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resources',
      error: error.message,
    });
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resource',
      error: error.message,
    });
  }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const { name, description, category, location, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and category for the resource',
      });
    }

    if (status && !['Available', 'In Use', 'Maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Available, In Use, Maintenance',
      });
    }

    const resource = await Resource.create({
      name,
      description: description || '',
      category,
      location: location || '',
      status: status || 'Available',
    });

    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating resource',
      error: error.message,
    });
  }
};

// @desc    Update an existing resource
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    const { name, description, category, location, status } = req.body;

    if (status && !['Available', 'In Use', 'Maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Available, In Use, Maintenance',
      });
    }

    if (name !== undefined) resource.name = name;
    if (description !== undefined) resource.description = description;
    if (category !== undefined) resource.category = category;
    if (location !== undefined) resource.location = location;
    if (status !== undefined) resource.status = status;

    await resource.save();

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource,
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating resource',
      error: error.message,
    });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resource ID format',
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    await Resource.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting resource',
      error: error.message,
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
