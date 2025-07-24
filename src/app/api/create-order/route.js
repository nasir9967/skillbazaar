import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectMongoDB from '../../../lib/mongodb';
import Booking from '../../../model/booking';
import Skill from '../../../model/skill';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();
    const { amount, serviceId, bookingData } = await request.json();

    // Validate service exists
    const service = await Skill.findById(serviceId);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Calculate pricing
    const COMMISSION_RATE = 0.05; // 5%
    const PLATFORM_FEE_RATE = 0.02; // 2%
    
    const servicePrice = service.price;
    const commission = Math.round(servicePrice * COMMISSION_RATE);
    const platformFee = Math.round(servicePrice * PLATFORM_FEE_RATE);
    const providerAmount = servicePrice - commission;
    const totalAmount = servicePrice + platformFee;

    // Create Razorpay order
    const options = {
      amount: totalAmount * 100, // Razorpay expects amount in paisa
      currency: 'INR',
      receipt: `booking_${Date.now()}`,
      payment_capture: 1,
      notes: {
        serviceId: serviceId,
        customerId: session.user.id,
        providerId: service.userId
      }
    };

    const order = await razorpay.orders.create(options);

    // Create booking record with pending status
    const booking = new Booking({
      serviceId,
      providerId: service.userId,
      customerId: session.user.id,
      bookingDetails: {
        date: bookingData.date,
        time: bookingData.time,
        address: bookingData.address,
        phone: bookingData.phone,
        requirements: bookingData.requirements || ''
      },
      pricing: {
        servicePrice,
        commission,
        platformFee,
        providerAmount,
        totalAmount
      },
      payment: {
        method: 'online',
        status: 'pending',
        razorpayOrderId: order.id
      },
      status: 'pending'
    });

    await booking.save();

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
