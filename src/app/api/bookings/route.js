import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectMongoDB from '../../../lib/mongodb';
import Booking from '../../../model/booking';
import Skill from '../../../model/skill';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();
    const bookingData = await request.json();

    // Validate service exists
    const service = await Skill.findById(bookingData.serviceId);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Create booking for Cash on Delivery
    const booking = new Booking({
      serviceId: bookingData.serviceId,
      providerId: bookingData.providerId,
      customerId: session.user.id,
      bookingDetails: {
        date: bookingData.bookingData.date,
        time: bookingData.bookingData.time,
        address: bookingData.bookingData.address,
        phone: bookingData.bookingData.phone,
        requirements: bookingData.bookingData.requirements || ''
      },
      pricing: {
        servicePrice: bookingData.amount,
        commission: bookingData.commission,
        platformFee: bookingData.platformFee,
        providerAmount: bookingData.providerAmount,
        totalAmount: bookingData.amount + bookingData.platformFee
      },
      payment: {
        method: bookingData.paymentMethod,
        status: 'pending'
      },
      status: 'pending'
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      bookingId: booking._id
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'customer'; // customer or provider

    let bookings;
    if (type === 'provider') {
      // Get bookings for service provider
      bookings = await Booking.find({ providerId: session.user.id })
        .populate('serviceId', 'title category price')
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      // Get bookings for customer
      bookings = await Booking.find({ customerId: session.user.id })
        .populate('serviceId', 'title category price')
        .populate('providerId', 'name email phone')
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(bookings);

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
