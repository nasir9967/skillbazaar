'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../hooks/useTranslation';

export default function PostSkill() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    tags: ''
  });

  if (status === 'loading') return (
    <>
      <Header />
      <div className="p-4 min-h-screen flex items-center justify-center">
        <p>⏳ Loading...</p>
      </div>
      <Footer />
    </>
  );

  if (!session || session.user.role !== 'business') {
    return (
      <>
        <Header />
        <div className="p-6 max-w-xl mx-auto text-center min-h-screen flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-red-600">{t('postSkill.accessDenied')}</h1>
          <p>{t('postSkill.onlyBusinessUsers')}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            {t('postSkill.backToDashboard')}
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          businessId: session.user.id,
          businessName: session.user.name,
          businessEmail: session.user.email,
        }),
      });

      if (response.ok) {
        alert(t('postSkill.successMessage'));
        router.push('/dashboard');
      } else {
        alert(t('postSkill.errorMessage'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t('postSkill.generalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-2xl mx-auto min-h-screen">
      <div className="mb-6">
        <button 
          onClick={() => router.push('/dashboard')}
          className="text-blue-600 hover:underline"
        >
           {t('postSkill.backToDashboard')}
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">{t('postSkill.title')}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">{t('postSkill.serviceTitle')} *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder={t('postSkill.serviceTitlePlaceholder')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('postSkill.description')} *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={t('postSkill.descriptionPlaceholder')}
            className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('postSkill.price')} (₹) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="500"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('postSkill.category')} *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t('postSkill.selectCategory')}</option>
              <option value="Cleaning">{t('categories.cleaning')}</option>
              <option value="Repair & Maintenance">{t('categories.repair')}</option>
              <option value="Beauty & Wellness">{t('categories.beauty')}</option>
              <option value="Technology">{t('categories.technology')}</option>
              <option value="Education">{t('categories.education')}</option>
              <option value="Health & Fitness">{t('categories.health')}</option>
              <option value="Food & Catering">{t('categories.food')}</option>
              <option value="Transportation">{t('categories.transportation')}</option>
              <option value="Other">{t('categories.other')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('postSkill.location')} *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder={t('postSkill.locationPlaceholder')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t('postSkill.tags')}</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder={t('postSkill.tagsPlaceholder')}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">{t('postSkill.tagsHelp')}</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t('postSkill.posting') : t('postSkill.postButton')}
        </button>
      </form>
      </div>
      <Footer />
    </>
  );
}
