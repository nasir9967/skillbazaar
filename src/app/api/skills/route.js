import { connectDB } from "@/app/lib/mongodb";   
import Skill from '@/app/model/skill';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  try {
    await connectDB();
    
    const skills = await Skill.find({})
      .sort({ createdAt: -1 })
      .limit(50);
    
    return Response.json(skills);
  } catch (error) {
    console.error('GET Skills error:', error);
    return Response.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'business') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const body = await request.json();
    const { title, description, price, category, location, tags, businessId, businessName, businessEmail } = body;

    if (!title || !description || !price || !category || !location) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const skill = new Skill({
      title,
      description,
      price,
      category,
      location,
      tags: tags || [],
      businessId,
      businessName,
      businessEmail,
    });

    await skill.save();
    
    return Response.json({ success: true, skill }, { status: 201 });
  } catch (error) {
    console.error('POST Skills error:', error);
    return Response.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
