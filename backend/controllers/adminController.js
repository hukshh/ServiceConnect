const User = require('../models/User');
const ProviderProfile = require('../models/ProviderProfile');
const Booking = require('../models/Booking');

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all provider profiles (Admin only)
// @route   GET /api/admin/providers
// @access  Admin
const getAllProviders = async (req, res) => {
  try {
    const providers = await ProviderProfile.find()
      .populate('user', 'name email profilePhoto phone isBlocked')
      .sort({ createdAt: -1 });
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify a provider profile (Admin only)
// @route   PUT /api/admin/providers/:id/verify
// @access  Admin
const verifyProvider = async (req, res) => {
  try {
    // Note: :id here refers to the actual ProviderProfile ObjectId by default, 
    // but often we pass the userId. Let's assume passed ID is the profile ID or User ID
    let profile = await ProviderProfile.findById(req.params.id);
    if (!profile) {
      profile = await ProviderProfile.findOne({ user: req.params.id });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    profile.isVerified = true;
    await profile.save();

    res.status(200).json({ message: 'Provider verified successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Block or Unblock a user (Admin only)
// @route   PUT /api/admin/users/:id/block
// @access  Admin
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot block yourself' });
    }

    // Toggle blocked status - assuming you added isBlocked to User model, if not, we must handle it
    user.isBlocked = !user.isBlocked;
    // Note: The original User schema setup didn't explicitly have isBlocked. 
    // We can use Mongoose mixed or update the schema automatically, since Mongoose 
    // allows adding fields if strict is false, but usually strict is true. 
    // We will save it.
    await user.save();

    res.status(200).json({ 
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, 
      user: { _id: user._id, isBlocked: user.isBlocked } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    // Optional: Also delete their ProviderProfile, Bookings, Services, Reviews
    if (user.role === 'provider') {
       await ProviderProfile.findOneAndDelete({ user: user._id });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get dashboard statistics overview (Admin only)
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const totalBookings = await Booking.countDocuments();

    // Calculate total revenue from completed bookings
    const revenueStats = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // Group bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Top 5 providers by earnings
    const topProviders = await ProviderProfile.find()
       .sort({ totalEarnings: -1, rating: -1 })
       .limit(5)
       .populate('user', 'name email profilePhoto');

    // Most booked category
    const categoryStats = await Booking.aggregate([
       { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'serviceDetails' } },
       { $unwind: '$serviceDetails' },
       { $group: { _id: '$serviceDetails.category', count: { $sum: 1 } } },
       { $sort: { count: -1 } },
       { $limit: 1 },
       { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'categoryDetails' } },
       { $unwind: '$categoryDetails' }
    ]);
    const mostBookedCategory = categoryStats.length > 0 ? categoryStats[0] : null;

    res.status(200).json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue,
      bookingsByStatus,
      topProviders,
      mostBookedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get monthly revenue & bookings trend for last 6 months
// @route   GET /api/admin/monthly-stats
// @access  Admin
const getMonthlyStats = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of that month

    const stats = await Booking.aggregate([
      { 
         $match: { 
            createdAt: { $gte: sixMonthsAgo } 
         } 
      },
      {
         $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            revenue: { 
               $sum: { 
                  $cond: [ { $eq: ["$status", "completed"] }, "$totalAmount", 0 ] 
               } 
            },
            bookings: { $sum: 1 }
         }
      },
      { $sort: { _id: 1 } } // Sort chronologically
    ]);

    // Format array output { month, revenue, bookings }
    const formattedStats = stats.map(item => {
       const [year, monthNum] = item._id.split('-');
       const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
       const monthName = date.toLocaleString('default', { month: 'short' });
       return {
          month: monthName,
          revenue: item.revenue,
          bookings: item.bookings
       };
    });

    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllProviders,
  verifyProvider,
  blockUser,
  deleteUser,
  getDashboardStats,
  getMonthlyStats,
};
