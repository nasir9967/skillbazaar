import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { connectDB } from "@/app/lib/mongodb";
import Skill from '@/app/model/skill';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const { role, email } = session.user;

    if (role === 'business') {
      // Business dashboard data
      const mySkills = await Skill.find({ businessEmail: email });
      const totalSkills = mySkills.length;
      const avgPrice = totalSkills > 0 
        ? Math.round(mySkills.reduce((sum, skill) => sum + skill.price, 0) / totalSkills)
        : 0;
      
      const recentSkills = await Skill.find({ businessEmail: email })
        .sort({ createdAt: -1 })
        .limit(5);

      // Mock data for views (in real app, you'd track this)
      const totalViews = totalSkills * Math.floor(Math.random() * 20 + 10);

      return Response.json({
        role: 'business',
        totalSkills,
        avgPrice,
        totalViews,
        recentSkills
      });
    } else {
      // Regular user dashboard data
      const totalServices = await Skill.countDocuments();
      const featuredSkills = await Skill.find({})
        .sort({ createdAt: -1 })
        .limit(6);

      // Get popular categories
      const popularCategories = await Skill.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      return Response.json({
        role: 'user',
        totalServices,
        featuredSkills,
        popularCategories,
        userLocation: 'Bihar' // This would come from user profile in real app
      });
    }
  } catch (error) {
    console.error('Dashboard API error:', error);
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
