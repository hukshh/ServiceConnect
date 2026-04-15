const ProviderProfile = require('../models/ProviderProfile');
const Service = require('../models/Service');

// @desc    Get a provider's public profile along with their active services by userId
// @route   GET /api/providers/:userId
// @access  Public
const getProviderProfile = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.params.userId })
      .populate('user', 'name email profilePhoto phone');

    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const services = await Service.find({
      provider: req.params.userId,
      isActive: true,
    }).populate('category', 'name icon');

    res.status(200).json({ profile, services });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create or update the logged-in provider's profile (upsert)
// @route   POST /api/providers/profile
// @access  Provider
const createOrUpdateProfile = async (req, res) => {
  try {
    const { bio, experience, location, availability, blockedDates } = req.body;

    const profileData = {
      user: req.user._id,
      ...(bio !== undefined && { bio }),
      ...(experience !== undefined && { experience }),
      ...(location && { location }),
      ...(availability && { availability }),
      ...(blockedDates && { blockedDates }),
    };

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, upsert: true, runValidators: true }
    ).populate('user', 'name email profilePhoto phone');

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get the logged-in provider's own profile
// @route   GET /api/providers/profile/me
// @access  Provider
const getMyProfile = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({ user: req.user._id })
      .populate('user', 'name email profilePhoto phone');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found. Please create your profile.' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all verified provider profiles (public)
// @route   GET /api/providers
// @access  Public
const getAllProviders = async (req, res) => {
  try {
    const providers = await ProviderProfile.find({ isVerified: true })
      .populate('user', 'name profilePhoto')
      .sort({ rating: -1 });

    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update provider availability
// @route   PUT /api/providers/availability
// @access  Provider
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      { availability },
      { new: true, runValidators: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile.availability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Block a specific date
// @route   PUT /api/providers/block-date
// @access  Provider
const blockDate = async (req, res) => {
  try {
    const { date, remove } = req.body;
    let updateObj = {};
    if (remove) {
      updateObj = { $pull: { blockedDates: new Date(date) } };
    } else {
      updateObj = { $addToSet: { blockedDates: new Date(date) } };
    }
    
    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user._id },
      updateObj,
      { new: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.status(200).json(profile.blockedDates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProviderProfile,
  createOrUpdateProfile,
  getMyProfile,
  getAllProviders,
  updateAvailability,
  blockDate,
};
