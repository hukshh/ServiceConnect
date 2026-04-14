const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    required: true,
  },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '18:00' },
  isAvailable: { type: Boolean, default: true },
});

const providerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    availability: {
      type: [availabilitySchema],
      default: [
        { day: 'Mon', startTime: '09:00', endTime: '18:00', isAvailable: true },
        { day: 'Tue', startTime: '09:00', endTime: '18:00', isAvailable: true },
        { day: 'Wed', startTime: '09:00', endTime: '18:00', isAvailable: true },
        { day: 'Thu', startTime: '09:00', endTime: '18:00', isAvailable: true },
        { day: 'Fri', startTime: '09:00', endTime: '18:00', isAvailable: true },
        { day: 'Sat', startTime: '09:00', endTime: '13:00', isAvailable: true },
        { day: 'Sun', startTime: '09:00', endTime: '13:00', isAvailable: false },
      ],
    },
    blockedDates: [{ type: Date }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProviderProfile', providerProfileSchema);
