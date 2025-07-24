import { NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import Skill from '../../model/skill';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch all services posted by this user
    const services = await Skill.find({ businessId: userId })
      .sort({ createdAt: -1 }) // Most recent first
      .lean();

    return NextResponse.json({
      success: true,
      services: services,
      total: services.length
    });
    
  } catch (error) {
    console.error('Error fetching user services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
