import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDetails: {
    date: { type: String, required: true },
    time: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    requirements: { type: String }
  },
  pricing: {
    servicePrice: { type: Number, required: true },
    commission: { type: Number, required: true },
    platformFee: { type: Number, required: true },
    providerAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true }
  },
  payment: {
    method: { type: String, enum: ['online', 'cod'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paidAt: { type: Date }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  timeline: {
    bookedAt: { type: Date, default: Date.now },
    confirmedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date }
  },
  rating: {
    customerRating: { type: Number, min: 1, max: 5 },
    customerReview: { type: String },
    providerRating: { type: Number, min: 1, max: 5 },
    providerReview: { type: String }
  },
  cancellation: {
    reason: { type: String },
    cancelledBy: { type: String, enum: ['customer', 'provider', 'admin'] },
    refundAmount: { type: Number },
    refundStatus: { type: String, enum: ['pending', 'processed', 'failed'] }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
BookingSchema.index({ customerId: 1, createdAt: -1 });
BookingSchema.index({ providerId: 1, createdAt: -1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ 'payment.status': 1 });

// Calculate earnings for provider
BookingSchema.methods.getProviderEarnings = function() {
  if (this.status === 'completed' && this.payment.status === 'completed') {
    return this.pricing.providerAmount;
  }
  return 0;
};

// Calculate commission earned
BookingSchema.methods.getCommissionEarned = function() {
  if (this.status === 'completed' && this.payment.status === 'completed') {
    return this.pricing.commission + this.pricing.platformFee;
  }
  return 0;
};

// Virtual for formatted booking date
BookingSchema.virtual('formattedBookingDate').get(function() {
  return new Date(`${this.bookingDetails.date}T${this.bookingDetails.time}`);
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

export default Booking;
