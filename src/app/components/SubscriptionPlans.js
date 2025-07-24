'use client';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useSession } from 'next-auth/react';

export default function SubscriptionPlans() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: t('subscription.basic'),
      price: 99,
      duration: t('subscription.monthly'),
      features: [
        t('subscription.features.basicServices', { count: 5 }),
        t('subscription.features.basicSupport'),
        t('subscription.features.standardListing'),
        t('subscription.features.basicAnalytics')
      ],
      popular: false,
      color: 'blue'
    },
    {
      id: 'premium',
      name: t('subscription.premium'),
      price: 299,
      duration: t('subscription.monthly'),
      features: [
        t('subscription.features.unlimitedServices'),
        t('subscription.features.priorityListing'),
        t('subscription.features.prioritySupport'),
        t('subscription.features.advancedAnalytics'),
        t('subscription.features.verifiedBadge'),
        t('subscription.features.reducedCommission', { rate: '3%' })
      ],
      popular: true,
      color: 'green'
    },
    {
      id: 'enterprise',
      name: t('subscription.enterprise'),
      price: 999,
      duration: t('subscription.monthly'),
      features: [
        t('subscription.features.everythingPremium'),
        t('subscription.features.featuredBadge'),
        t('subscription.features.customAnalytics'),
        t('subscription.features.dedicatedSupport'),
        t('subscription.features.apiAccess'),
        t('subscription.features.whiteLabel'),
        t('subscription.features.zeroCommission')
      ],
      popular: false,
      color: 'purple'
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!session) {
      alert(t('subscription.loginRequired'));
      return;
    }

    setIsLoading(true);
    const plan = plans.find(p => p.id === planId);

    try {
      // Create subscription order
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.price
        })
      });

      const order = await response.json();

      // Razorpay payment for subscription
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: 'INR',
        name: 'LocalSkill',
        description: `${plan.name} Subscription`,
        order_id: order.id,
        handler: async function (response) {
          // Verify subscription payment
          await verifySubscription(response, planId);
        },
        prefill: {
          name: session.user.name,
          email: session.user.email
        },
        theme: {
          color: '#2563eb'
        },
        notes: {
          planId: plan.id,
          userId: session.user.id
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Subscription error:', error);
      alert(t('subscription.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const verifySubscription = async (paymentResponse, planId) => {
    try {
      const response = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentResponse,
          planId
        })
      });

      if (response.ok) {
        alert(t('subscription.success'));
        window.location.reload(); // Refresh to show updated plan
      } else {
        alert(t('subscription.failed'));
      }
    } catch (error) {
      console.error('Subscription verification failed:', error);
      alert(t('subscription.verificationFailed'));
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            💼 {t('subscription.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subscription.subtitle')}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all hover:scale-105 ${
                plan.popular ? 'border-green-500 ring-4 ring-green-100' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    🌟 {t('subscription.mostPopular')}
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold text-${plan.color}-600 mb-2`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-3">✅</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : `bg-${plan.color}-600 text-white hover:bg-${plan.color}-700`
                  } disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('subscription.processing')}
                    </span>
                  ) : (
                    `🚀 ${t('subscription.choosePlan')}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            📊 {t('subscription.comparison')}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-4 text-gray-900 font-semibold">{t('subscription.features.title')}</th>
                  <th className="pb-4 text-center text-blue-600 font-semibold">{t('subscription.basic')}</th>
                  <th className="pb-4 text-center text-green-600 font-semibold">{t('subscription.premium')}</th>
                  <th className="pb-4 text-center text-purple-600 font-semibold">{t('subscription.enterprise')}</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium">{t('subscription.features.servicesLimit')}</td>
                  <td className="py-4 text-center">5</td>
                  <td className="py-4 text-center text-green-600">♾️ {t('subscription.unlimited')}</td>
                  <td className="py-4 text-center text-green-600">♾️ {t('subscription.unlimited')}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium">{t('subscription.features.commission')}</td>
                  <td className="py-4 text-center">5%</td>
                  <td className="py-4 text-center text-green-600">3%</td>
                  <td className="py-4 text-center text-green-600">0%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium">{t('subscription.features.support')}</td>
                  <td className="py-4 text-center">{t('subscription.features.basic')}</td>
                  <td className="py-4 text-center text-green-600">{t('subscription.features.priority')}</td>
                  <td className="py-4 text-center text-green-600">{t('subscription.features.dedicated')}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-4 font-medium">{t('subscription.features.listing')}</td>
                  <td className="py-4 text-center">{t('subscription.features.standard')}</td>
                  <td className="py-4 text-center text-green-600">{t('subscription.features.priority')}</td>
                  <td className="py-4 text-center text-green-600">{t('subscription.features.featured')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center bg-green-50 rounded-xl p-8 border border-green-200">
          <div className="text-4xl mb-4">💰</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">
            {t('subscription.moneyBack')}
          </h3>
          <p className="text-green-700">
            {t('subscription.moneyBackDesc')}
          </p>
        </div>
      </div>
    </div>
  );
}
