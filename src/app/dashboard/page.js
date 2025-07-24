'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border border-blue-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('dashboard.loadingTitle')}</h3>
            <p className="text-gray-500">{t('dashboard.loadingMessage')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border border-blue-100">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('dashboard.welcomeTitle')}</h1>
            <p className="text-gray-600 mb-8">{t('dashboard.welcomeMessage')}</p>
            <Link href="/login" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl text-lg">
              🚀 {t('dashboard.loginToStart')}
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { name, role } = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Welcome Section */}
          <div className={`relative overflow-hidden ${
            role === 'business' 
              ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700' 
              : 'bg-gradient-to-br from-green-600 via-emerald-600 to-blue-600'
          } rounded-3xl shadow-2xl mb-12 border border-white/20`}>
            <div className="absolute inset-0 bg-blue-100/20"></div>
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    👋 {t('dashboard.welcomeBack', { name })}
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    {role === 'business' 
                      ? t('dashboard.businessWelcome')
                      : t('dashboard.userWelcome')}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                      <span className="text-white/90 text-sm">Account Type:</span>
                      <span className="text-white font-bold ml-2 text-lg">{role.toUpperCase()}</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                      <span className="text-white/90 text-sm">Status:</span>
                      <span className="text-green-300 font-bold ml-2">🟢 ACTIVE</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className={`${
                    role === 'business' ? 'bg-blue-500/30' : 'bg-green-500/30'
                  } rounded-full p-8 backdrop-blur-sm border border-white/30`}>
                    <span className="text-8xl">
                      {role === 'business' ? '🏢' : '👤'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {role === 'business' ? (
            // Enhanced Business Dashboard
            <div className="space-y-12">
              {/* Stats Cards with Animations */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <span className="mr-3">📊</span> Your Business Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <span className="text-4xl">📋</span>
                      </div>
                      <div className="text-right">
                        <p className="text-6xl font-bold text-white">{dashboardData?.totalSkills || 0}</p>
                        <p className="text-blue-100 font-medium">Active Services</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">My Services</h3>
                    <p className="text-blue-100 text-sm">Total listings on marketplace</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <span className="text-4xl">👥</span>
                      </div>
                      <div className="text-right">
                        <p className="text-6xl font-bold text-white">{dashboardData?.totalViews || 0}</p>
                        <p className="text-green-100 font-medium">Profile Views</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Total Visibility</h3>
                    <p className="text-green-100 text-sm">Customer profile visits</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <span className="text-4xl">💰</span>
                      </div>
                      <div className="text-right">
                        <p className="text-6xl font-bold text-white">₹{dashboardData?.avgPrice || 0}</p>
                        <p className="text-purple-100 font-medium">Average Price</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Pricing Strategy</h3>
                    <p className="text-purple-100 text-sm">Per service pricing</p>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <span className="mr-3">🚀</span> Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Link href="/post-skill" 
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-4xl text-white">➕</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('dashboard.postNewService')}</h3>
                      <p className="text-gray-600 mb-6">{t('dashboard.postNewServiceDesc')}</p>
                      <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-medium group-hover:bg-blue-100 transition-colors">
                        {t('dashboard.startPosting')} →
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/my-skills" 
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-green-300">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-4xl text-white">📄</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('dashboard.manageServices')}</h3>
                      <p className="text-gray-600 mb-6">{t('dashboard.manageServicesDesc')}</p>
                      <div className="bg-green-50 text-green-600 px-6 py-3 rounded-xl font-medium group-hover:bg-green-100 transition-colors">
                        {t('dashboard.manageNow')} →
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/profile" 
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-purple-300">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-4xl text-white">👤</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('dashboard.businessProfile')}</h3>
                      <p className="text-gray-600 mb-6">{t('dashboard.businessProfileDesc')}</p>
                      <div className="bg-purple-50 text-purple-600 px-6 py-3 rounded-xl font-medium group-hover:bg-purple-100 transition-colors">
                        {t('dashboard.editProfile')} →
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Services */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <span className="mr-3">📋</span> {t('dashboard.yourRecentServices')}
                </h2>
                {dashboardData?.recentSkills?.length > 0 ? (
                  <div className="space-y-6">
                    {dashboardData.recentSkills.map((skill, index) => (
                      <div key={skill._id} className="group bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-1 mb-4 md:mb-0">
                            <div className="flex items-center mb-3">
                              <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">
                                <span className="font-bold">#{index + 1}</span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-800">{skill.title}</h3>
                            </div>
                            <p className="text-gray-600 mb-3 flex items-center flex-wrap gap-4">
                              <span className="flex items-center">
                                <span className="mr-1">🏷️</span> {skill.category}
                              </span>
                              <span className="flex items-center">
                                <span className="mr-1">💰</span> ₹{skill.price}
                              </span>
                              <span className="flex items-center">
                                <span className="mr-1">📍</span> {skill.location}
                              </span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {skill.tags?.slice(0, 3).map((tag, tagIndex) => (
                                <span key={tagIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {tag}
                                </span>
                              ))}
                              {skill.tags?.length > 3 && (
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                                  +{skill.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-2">
                              <span className="font-medium">🟢 Active</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Posted: {new Date(skill.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                      <span className="text-6xl">📋</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-4">{t('dashboard.noServicesPosted')}</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Start by posting your first service to attract customers and grow your business!
                    </p>
                    <Link href="/post-skill" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl text-lg">
                      🚀 Post Your First Service
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Enhanced User Dashboard
            <div className="space-y-12">
              {/* Stats Cards */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <span className="mr-3">🎯</span> Discover Local Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <span className="text-4xl">🔍</span>
                      </div>
                      <div className="text-right">
                        <p className="text-6xl font-bold text-white">{dashboardData?.totalServices || 0}</p>
                        <p className="text-blue-100 font-medium">Services Available</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Book</h3>
                    <p className="text-blue-100 text-sm">Professional services in your area</p>
                  </div>
                  
                  <div className="group bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                        <span className="text-4xl">📍</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-white">{dashboardData?.userLocation || t('dashboard.locationNotSet')}</p>
                        <p className="text-green-100 font-medium">Your Location</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Location Settings</h3>
                    <p className="text-green-100 text-sm">Set for personalized results</p>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <span className="mr-3">⚡</span> Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Link href="/skills" 
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-blue-300">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-4xl text-white">🔍</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Browse Services</h3>
                      <p className="text-gray-600 mb-6">Find trusted local professionals</p>
                      <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-medium group-hover:bg-blue-100 transition-colors">
                        Explore Now →
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/skills?featured=true" 
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-yellow-300">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-4xl text-white">⭐</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">Popular Services</h3>
                      <p className="text-gray-600 mb-6">Most in-demand services</p>
                      <div className="bg-yellow-50 text-yellow-600 px-6 py-3 rounded-xl font-medium group-hover:bg-yellow-100 transition-colors">
                        View Popular →
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/profile" 
                        className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-purple-300">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 mx-auto w-20 h-20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <span className="text-4xl text-white">👤</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">My Profile</h3>
                      <p className="text-gray-600 mb-6">Update your preferences</p>
                      <div className="bg-purple-50 text-purple-600 px-6 py-3 rounded-xl font-medium group-hover:bg-purple-100 transition-colors">
                        Edit Profile →
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Featured Services */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <span className="mr-3">⭐</span> Featured Services
                </h2>
                {dashboardData?.featuredSkills?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dashboardData.featuredSkills.map((skill, index) => (
                      <div key={skill._id} className="group bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-blue-100 text-blue-600 rounded-lg px-3 py-1 text-sm font-bold">
                            #{index + 1}
                          </div>
                          <div className="text-2xl font-bold text-green-600">₹{skill.price}</div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                          {skill.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {skill.description.substring(0, 100)}...
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">📍</span>
                            <span>{skill.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">🏢</span>
                            <span className="font-medium">{skill.businessName}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200">
                            {skill.category}
                          </span>
                          <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg">
                            📞 Contact
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                      <span className="text-6xl">🔍</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-4">{t('dashboard.noServicesAvailable')}</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Be the first to discover amazing local services when they become available!
                    </p>
                    <Link href="/skills" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl text-lg">
                      🔍 Browse All Services
                    </Link>
                  </div>
                )}
              </div>

              {/* Popular Categories */}
              {dashboardData?.popularCategories?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="mr-3">🏷️</span> Popular Categories
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {dashboardData.popularCategories.map((cat, index) => (
                      <Link 
                        key={cat._id}
                        href={`/skills?category=${encodeURIComponent(cat._id)}`}
                        className="group bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 rounded-2xl text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 hover:border-purple-300"
                      >
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                          {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-purple-600 transition-colors">
                          {cat._id}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium">
                          {cat.count} services available
                        </p>
                        <div className="mt-4 bg-purple-100 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-purple-200 transition-colors">
                          Explore →
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
