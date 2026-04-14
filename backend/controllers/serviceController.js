const Service = require('../models/Service');

// Builds a MongoDB filter object from the request query parameters
const buildServiceFilter = (query) => {
  const filter = { isActive: true };

  if (query.search) {
    filter.title = { $regex: query.search, $options: 'i' };
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.minRating) {
    filter.rating = { $gte: Number(query.minRating) };
  }

  return filter;
};

// Builds a MongoDB sort object from a sort query string
const buildSortOption = (sort) => {
  switch (sort) {
    case 'price_asc': return { price: 1 };
    case 'price_desc': return { price: -1 };
    case 'rating': return { rating: -1 };
    case 'newest': return { createdAt: -1 };
    default: return { createdAt: -1 };
  }
};

// @desc    Get all services with search, filter, and sort support (public)
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const filter = buildServiceFilter(req.query);
    const sort = buildSortOption(req.query.sort);

    const services = await Service.find(filter)
      .populate('provider', 'name profilePhoto')
      .populate('category', 'name icon')
      .sort(sort);

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single service by ID (public)
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name profilePhoto email phone')
      .populate('category', 'name icon description');

    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new service (provider only)
// @route   POST /api/services
// @access  Provider
const createService = async (req, res) => {
  try {
    const { title, description, category, price, priceType } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({ message: 'Please provide title, description, category, and price' });
    }

    const service = await Service.create({
      title,
      description,
      category,
      price,
      priceType: priceType || 'fixed',
      provider: req.user._id,
    });

    const populated = await service.populate('category', 'name icon');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a service — only the owning provider can update
// @route   PUT /api/services/:id
// @access  Provider
const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('provider', 'name profilePhoto')
      .populate('category', 'name icon');

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete (deactivate) a service — only the owning provider can delete
// @route   DELETE /api/services/:id
// @access  Provider
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    service.isActive = false;
    await service.save();

    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all services listed by the logged-in provider
// @route   GET /api/services/my
// @access  Provider
const getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ provider: req.user._id, isActive: true })
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
};
