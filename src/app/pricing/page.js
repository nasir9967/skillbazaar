'use client';
import { useSession } from 'next-auth/react';
import { useTranslation } from '../hooks/useTranslation';
import SubscriptionPlans from '../components/SubscriptionPlans';
import Link from 'next/link';

export default function PricingPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">
            💼 {t('pricing.title')}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>
          
          {!session && (
            <div className="bg-white/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-white mb-4">{t('pricing.loginPrompt')}</p>
              <Link 
                href="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                {t('navigation.login')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Plans */}
      <SubscriptionPlans />

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          ❓ {t('pricing.faq.title')}
        </h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('pricing.faq.q1')}
            </h3>
            <p className="text-gray-600">
              {t('pricing.faq.a1')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('pricing.faq.q2')}
            </h3>
            <p className="text-gray-600">
              {t('pricing.faq.a2')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('pricing.faq.q3')}
            </h3>
            <p className="text-gray-600">
              {t('pricing.faq.a3')}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t('pricing.faq.q4')}
            </h3>
            <p className="text-gray-600">
              {t('pricing.faq.a4')}
            </p>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            🌟 {t('pricing.success.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">👨‍🔧</div>
                <h3 className="font-bold text-gray-900">{t('pricing.success.story1.name')}</h3>
                <p className="text-gray-600 text-sm">{t('pricing.success.story1.service')}</p>
              </div>
              <p className="text-gray-700 italic mb-4">
                "{t('pricing.success.story1.testimonial')}"
              </p>
              <div className="text-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ₹{t('pricing.success.story1.earnings')}/month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">👩‍💼</div>
                <h3 className="font-bold text-gray-900">{t('pricing.success.story2.name')}</h3>
                <p className="text-gray-600 text-sm">{t('pricing.success.story2.service')}</p>
              </div>
              <p className="text-gray-700 italic mb-4">
                "{t('pricing.success.story2.testimonial')}"
              </p>
              <div className="text-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ₹{t('pricing.success.story2.earnings')}/month
                </span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">👨‍🏫</div>
                <h3 className="font-bold text-gray-900">{t('pricing.success.story3.name')}</h3>
                <p className="text-gray-600 text-sm">{t('pricing.success.story3.service')}</p>
              </div>
              <p className="text-gray-700 italic mb-4">
                "{t('pricing.success.story3.testimonial')}"
              </p>
              <div className="text-center">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ₹{t('pricing.success.story3.earnings')}/month
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📞 {t('pricing.support.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('pricing.support.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-semibold text-blue-800 mb-2">{t('pricing.support.email')}</h3>
              <p className="text-blue-600">support@localskill.com</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold text-green-800 mb-2">{t('pricing.support.whatsapp')}</h3>
              <p className="text-green-600">+91 98765 43210</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="text-3xl mb-2">🕒</div>
              <h3 className="font-semibold text-purple-800 mb-2">{t('pricing.support.hours')}</h3>
              <p className="text-purple-600">{t('pricing.support.available')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
