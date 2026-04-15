const Booking = require('../models/Booking');
const Service = require('../models/Service');
const ProviderProfile = require('../models/ProviderProfile');
const PromoCode = require('../models/PromoCode');
const sendNotification = require('../utils/sendNotification');

// Strict finite state machine for booking status transitions
const allowedTransitions = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: [],
  rejected: [],
  cancelled: [],
};

// @desc    Create a new booking (customer only)
// @route   POST /api/bookings
// @access  Customer
const createBooking = async (req, res) => {
  try {
  const { serviceId, date, timeSlot, address, notes, promoCode } = req.body;

    // Find the requested service
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or inactive' });
    }

    // Prevent provider from booking their own service
    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own service' });
    }

    // Check if the provider is verified
    const providerProfile = await ProviderProfile.findOne({ user: service.provider });
    if (!providerProfile || !providerProfile.isVerified) {
      return res.status(400).json({ message: 'This provider is not yet verified' });
    }

    // Check if the booking date falls on a blocked date for the provider
    const targetDate = new Date(date).setHours(0, 0, 0, 0);
    const isBlocked = providerProfile.blockedDates.some(blockedDate => {
       return new Date(blockedDate).setHours(0, 0, 0, 0) === targetDate;
    });
    if (isBlocked) {
      return res.status(400).json({ message: 'Provider has blocked this date and is not available' });
    }

    // Check for conflicting bookings for this provider at the same date and time Slot
    const conflict = await Booking.findOne({
      provider: service.provider,
      date: new Date(date),
      timeSlot,
      status: { $in: ['pending', 'accepted', 'in_progress'] },
    });

    if (conflict) {
      return res.status(400).json({ message: 'Provider is not available at this time slot' });
    }

    let discountAmount = 0;
    
    // Validate Promo Code
    if (promoCode) {
       const promo = await PromoCode.findOne({ code: promoCode.toUpperCase(), isActive: true });
       if (!promo || promo.usedCount >= promo.maxUses || new Date() > new Date(promo.expiresAt) || service.price < promo.minOrderValue) {
          return res.status(400).json({ message: 'Invalid, expired, or inapplicable promo code' });
       }
       
       if (promo.discountType === 'percentage') {
          discountAmount = (promo.discountValue / 100) * service.price;
       } else {
          discountAmount = promo.discountValue;
       }
       discountAmount = Math.min(discountAmount, service.price); // cannot discount more than price
       
       // Increment promo usage
       promo.usedCount += 1;
       await promo.save();
    }

    // Create booking
    const booking = await Booking.create({
      customer: req.user._id,
      provider: service.provider,
      service: serviceId,
      date,
      timeSlot,
      address,
      notes,
      promoCode: promoCode ? promoCode.toUpperCase() : '',
      discountAmount,
      totalAmount: Math.max(0, service.price - discountAmount),
    });

    const populatedBooking = await booking.populate([
      { path: 'service', select: 'title category priceType' },
      { path: 'provider', select: 'name profilePhoto email phone' },
    ]);

    // Send Real-Time Notification to Provider
    const { io, connectedUsers } = require('../server');
    sendNotification(io, connectedUsers, service.provider, {
      type: 'new_booking',
      message: `You have a new booking request from ${req.user.name}`,
      bookingId: booking._id
    });

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all bookings for the logged-in customer
// @route   GET /api/bookings/my
// @access  Customer
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('service', 'title')
      .populate('provider', 'name profilePhoto phone')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Customer or Provider
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'title description price priceType')
      .populate('customer', 'name email phone profilePhoto')
      .populate('provider', 'name email phone profilePhoto');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify ownership (must be either the customer or the provider on the booking)
    if (
      booking.customer._id.toString() !== req.user._id.toString() &&
      booking.provider._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Cancel a booking (customer only)
// @route   PUT /api/bookings/:id/cancel
// @access  Customer
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (!['pending', 'accepted'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot cancel a booking that is ${booking.status}` });
    }

    booking.status = 'cancelled';
    booking.cancelledBy = 'customer';
    if (cancellationReason) booking.cancellationReason = cancellationReason;

    await booking.save();
    
    // Return populated so frontend can update state easily
    const updated = await Booking.findById(req.params.id)
       .populate('service', 'title')
       .populate('provider', 'name profilePhoto phone');

    // Notify Provider that Customer Cancelled
    const { io, connectedUsers } = require('../server');
    sendNotification(io, connectedUsers, booking.provider, {
      type: 'cancelled',
      message: `Customer ${req.user.name} cancelled the booking for ${updated.service.title}.`,
      bookingId: booking._id
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all bookings for the logged-in provider
// @route   GET /api/bookings/provider
// @access  Provider
const getProviderBookings = async (req, res) => {
  try {
    const filter = { provider: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .populate('service', 'title')
      .populate('customer', 'name profilePhoto phone email')
      .sort({ date: 1, timeSlot: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update booking status (provider only)
// @route   PUT /api/bookings/:id/status
// @access  Provider
const updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Validate the state transition using the allowedTransitions map
    const validNextStates = allowedTransitions[booking.status];
    if (!validNextStates || !validNextStates.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status transition from ${booking.status} to ${status}` 
      });
    }

    booking.status = status;

    // Handle cancellation attribution
    if (status === 'cancelled' || status === 'rejected') {
      booking.cancelledBy = 'provider';
      if (cancellationReason) booking.cancellationReason = cancellationReason;
    }

    await booking.save();

    // If marked completed, update provider earnings
    if (status === 'completed') {
      await ProviderProfile.findOneAndUpdate(
        { user: req.user._id },
        { $inc: { totalEarnings: booking.totalAmount } }
      );
    }

    const updated = await Booking.findById(req.params.id)
       .populate('service', 'title')
       .populate('customer', 'name profilePhoto phone email');

    // Send notifications based on status change
    const { io, connectedUsers } = require('../server');
    let message = '';
    
    if (status === 'accepted') message = 'Your booking has been accepted.';
    else if (status === 'rejected') message = 'Your booking request was rejected.';
    else if (status === 'in_progress') message = 'Your service has started.';
    else if (status === 'completed') message = 'Your service is complete. Please leave a review.';
    else if (status === 'cancelled') message = 'Your booking was cancelled by the provider.';
    
    if (message) {
      sendNotification(io, connectedUsers, booking.customer, {
        type: status,
        message,
        bookingId: booking._id
      });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get ALL bookings (admin only)
// @route   GET /api/bookings/all
// @access  Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('service', 'title')
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getProviderBookings,
  updateBookingStatus,
  getAllBookings,
};
