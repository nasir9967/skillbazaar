'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';

export default function MyServices() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyServices = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/my-services?userId=${session.user.id}`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      } else {
        setError(t('myServices.errorFetching'));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(t('myServices.errorFetching'));
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, t]);

  useEffect(() => {
    fetchMyServices();
  }, [fetchMyServices]);

  const handleDelete = async (serviceId) => {
    if (!confirm(t('myServices.confirmDelete'))) return;

    try {
      const response = await fetch(`/api/skills/${serviceId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setServices(services.filter(service => service._id !== serviceId));
        alert(t('myServices.deleteSuccess'));
      } else {
        alert(t('myServices.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert(t('myServices.deleteError'));
    }
  };

  const handleEdit = (serviceId) => {
    router.push(`/edit-service/${serviceId}`);
  };

  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg">{t('common.loading')}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('myServices.loginRequired')}</h1>
            <p className="mb-6">{t('myServices.loginMessage')}</p>
            <button 
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {t('navigation.login')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (session.user.role !== 'business') {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t('myServices.businessOnly')}</h1>
            <p className="mb-6">{t('myServices.businessOnlyMessage')}</p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {t('postSkill.backToDashboard')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-6">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-blue-600 hover:underline mb-4"
            >
               {t('postSkill.backToDashboard')}
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t('myServices.title')}</h1>
                <p className="text-gray-600">{t('myServices.subtitle')}</p>
              </div>
              <button 
                onClick={() => router.push('/post-skill')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                + {t('myServices.addNewService')}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-lg">{t('myServices.loadingServices')}</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 text-lg font-semibold mb-2">❌ {t('myServices.error')}</div>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={fetchMyServices}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {t('myServices.tryAgain')}
              </button>
            </div>
          )}

          {/* Services List */}
          {!loading && !error && (
            <>
              {services.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2">{t('myServices.noServices')}</h3>
                  <p className="text-gray-600 mb-6">{t('myServices.noServicesMessage')}</p>
                  <button 
                    onClick={() => router.push('/post-skill')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                  >
                    {t('myServices.postFirstService')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-gray-600">
                    {t('myServices.showing')} {services.length} {services.length === 1 ? t('myServices.service') : t('myServices.services')}
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                      <div key={service._id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                              {service.title}
                            </h3>
                            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {t(`categories.${service.category?.toLowerCase()?.replace(/\s+/g, '')?.replace('&', '')}`)}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {service.description}
                          </p>
                          
                          <div className="space-y-2 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <span className="font-medium">💰 {t('myServices.price')}:</span>
                              <span className="ml-2">₹{service.price}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">📍 {t('myServices.location')}:</span>
                              <span className="ml-2">{service.location}</span>
                            </div>
                            {service.tags && service.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {service.tags.map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(service._id)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm"
                            >
                              ✏️ {t('myServices.edit')}
                            </button>
                            <button
                              onClick={() => handleDelete(service._id)}
                              className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 text-sm"
                            >
                              🗑️ {t('myServices.delete')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
