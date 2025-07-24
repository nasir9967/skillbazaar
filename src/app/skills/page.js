'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingSystem from '../components/BookingSystem';
import { useTranslation } from '../hooks/useTranslation';

export default function Skills() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Translated categories
  const getCategories = () => [
    { key: 'All', label: t('categories.all') },
    { key: 'Cleaning', label: t('categories.cleaning') },
    { key: 'Repair & Maintenance', label: t('categories.repair') },
    { key: 'Beauty & Wellness', label: t('categories.beauty') },
    { key: 'Technology', label: t('categories.technology') },
    { key: 'Education', label: t('categories.education') },
    { key: 'Health & Fitness', label: t('categories.health') },
    { key: 'Food & Catering', label: t('categories.food') },
    { key: 'Transportation', label: t('categories.transportation') },
    { key: 'Construction & Labor', label: t('categories.construction') },
    { key: 'Wedding & Event Planning', label: t('categories.wedding') },
    { key: 'Textile & Tailoring', label: t('categories.textile') },
    { key: 'Security Services', label: t('categories.security') },
    { key: 'Other', label: t('categories.other') }
  ];

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
      return;
    }

    fetchSkills();
  }, [session, status, router]);

  const handleBookService = (skill) => {
    setSelectedService(skill);
    setShowBookingModal(true);
  };

  const handleBookingComplete = () => {
    setShowBookingModal(false);
    setSelectedService(null);
    // You can add success notification here
    alert(t('booking.successMessage'));
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setSelectedService(null);
  };

  useEffect(() => {
    // Filter skills based on search term and category
    let filtered = skills;

    if (searchTerm) {
      filtered = filtered.filter(skill => 
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(skill => skill.category === selectedCategory);
    }

    setFilteredSkills(filtered);
  }, [skills, searchTerm, selectedCategory]);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border border-blue-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('common.loading')}</h3>
            <p className="text-gray-500">{t('common.pleaseWait')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border border-blue-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t('common.loadingServices')}</h3>
            <p className="text-gray-500">{t('common.discoveringProfessionals')}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl shadow-2xl mb-12 border border-white/20">
            <div className="absolute inset-0 bg-blue-100/20"></div>
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors group"
                  >
                    <span className="mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform">←</span>
                    {t('skills.backToDashboard')}
                  </button>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    🔍 {t('skills.title')}
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    {t('skills.subtitle')}
                  </p>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30 inline-block">
                    <span className="text-white/90 text-sm">{t('skills.availableServices')}:</span>
                    <span className="text-white font-bold ml-2 text-lg">{skills.length}</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="bg-blue-500/30 rounded-full p-8 backdrop-blur-sm border border-white/30">
                    <span className="text-8xl">🏪</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-200">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('skills.findPerfectService')}</h2>
                <p className="text-gray-600">{t('skills.searchDescription')}</p>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <input
                      type="text"
                      placeholder={t('skills.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg"
                    />
                  </div>
                </div>
                <div className="lg:w-80">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-2xl">🏷️</span>
                    </div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-lg appearance-none bg-white"
                    >
                      {getCategories().map(cat => (
                        <option key={cat.key} value={cat.key === 'All' ? '' : cat.key}>
                          {cat.key === 'All' ? `🌟 ${cat.label}` : cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-6 py-4 border border-blue-200">
                <div className="text-sm font-medium text-gray-700">
                  📊 {t('skills.showing')} <span className="text-blue-600 font-bold">{filteredSkills.length}</span> {t('skills.of')} <span className="text-purple-600 font-bold">{skills.length}</span> {t('skills.services')}
                </div>
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    🗑️ {t('skills.clearFilters')}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          {filteredSkills.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-200">
              <div className="text-center">
                <div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
                  <span className="text-6xl">
                    {skills.length === 0 ? '🏪' : '🔍'}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-600 mb-4">
                  {skills.length === 0 ? t('skills.noServicesYet') : t('skills.noResults')}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">
                  {skills.length === 0 
                    ? 'Be the first to discover amazing services when they become available!' 
                    : 'Try adjusting your search criteria or browse all categories.'}
                </p>
                {skills.length === 0 ? (
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    🏠 {t('skills.backToDashboard')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    🗑️ {t('skills.clearAllFilters')}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSkills.map((skill, index) => (
                <div key={skill._id} className="group bg-white border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex justify-between items-start mb-3">
                      <div className="bg-white/20 rounded-lg px-3 py-1 text-sm font-bold backdrop-blur-sm">
                        #{index + 1}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{t('skills.pricePrefix')}{skill.price}</div>
                        <div className="text-white/80 text-sm">{t('skills.perService')}</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold group-hover:scale-105 transition-transform">
                      {skill.title}
                    </h3>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                      {skill.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm">
                        <div className="bg-blue-100 rounded-lg p-2 mr-3">
                          <span>📍</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{t('skills.location')}:</span>
                          <span className="ml-2 text-gray-600">{skill.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <div className="bg-green-100 rounded-lg p-2 mr-3">
                          <span>🏢</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{t('skills.business')}:</span>
                          <span className="ml-2 text-gray-600">{skill.businessName}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <div className="bg-purple-100 rounded-lg p-2 mr-3">
                          <span>📂</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">{t('skills.category')}:</span>
                          <span className="ml-2 text-gray-600">{skill.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {skill.tags && skill.tags.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {skill.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span 
                              key={tagIndex}
                              className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs rounded-full font-medium border border-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                          {skill.tags.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                              +{skill.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-400">
                        📅 {t('skills.posted')} {new Date(skill.createdAt).toLocaleDateString()}
                      </div>
                      <button 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105"
                        onClick={() => handleBookService(skill)}
                      >
                        � {t('skills.bookNow')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingSystem 
          service={selectedService}
          onBook={handleBookingComplete}
          onClose={handleCloseBooking}
        />
      )}
    </div>
  );
}
