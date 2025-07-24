'use client';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useSession } from 'next-auth/react';

export default function BookingSystem({ service, onBook, onClose }) {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    address: '',
    requirements: '',
    paymentMethod: 'online',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Commission calculation
  const COMMISSION_RATE = 0.05; // 5% commission
  const PLATFORM_FEE_RATE = 0.02; // 2% platform fee
  
  const commission = Math.round(service.price * COMMISSION_RATE);
  const platformFee = Math.round(service.price * PLATFORM_FEE_RATE);
  const providerAmount = service.price - commission;
  const totalAmount = service.price + platformFee;

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = async () => {
    if (!session) {
      alert(t('booking.loginRequired'));
      return;
    }

    if (!bookingData.date || !bookingData.time || !bookingData.address || !bookingData.phone) {
      alert(t('booking.fillAllFields'));
      return;
    }

    setIsLoading(true);

    try {
      if (bookingData.paymentMethod === 'online') {
        // Razorpay payment integration
        await initiatePayment();
      } else {
        // Cash on delivery booking
        await createBooking();
      }
    } catch (error) {
      console.error('Booking failed:', error);
      alert(t('booking.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async () => {
    // Create order on backend
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalAmount,
        serviceId: service._id,
        bookingData
      })
    });

    const order = await response.json();

    // Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: 'INR',
      name: 'LocalSkill',
      description: `Booking for ${service.title}`,
      order_id: order.id,
      handler: async function (response) {
        // Verify payment and create booking
        await verifyPayment(response);
      },
      prefill: {
        name: session.user.name,
        email: session.user.email,
        contact: bookingData.phone
      },
      theme: {
        color: '#2563eb'
      },
      notes: {
        serviceId: service._id,
        providerId: service.userId
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const verifyPayment = async (paymentResponse) => {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...paymentResponse,
        bookingData,
        serviceId: service._id,
        amount: totalAmount
      })
    });

    if (response.ok) {
      alert(t('booking.success'));
      onBook();
      onClose();
    } else {
      alert(t('booking.paymentFailed'));
    }
  };

  const createBooking = async () => {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId: service._id,
        providerId: service.userId,
        customerId: session.user.id,
        bookingData,
        amount: service.price,
        commission,
        platformFee,
        providerAmount,
        paymentMethod: 'cod',
        status: 'pending'
      })
    });

    if (response.ok) {
      alert(t('booking.codSuccess'));
      onBook();
      onClose();
    } else {
      alert(t('booking.error'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">{t('booking.title')}</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Service Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800">{service.title}</h4>
            <p className="text-blue-600 text-sm">{service.category}</p>
            <p className="text-blue-800 font-bold text-lg">₹{service.price}</p>
          </div>

          {/* Booking Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.selectDate')} *
              </label>
              <input 
                type="date" 
                name="date"
                value={bookingData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.selectTime')} *
              </label>
              <select 
                name="time"
                value={bookingData.time}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">{t('booking.chooseTime')}</option>
                <option value="09:00">09:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">02:00 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="17:00">05:00 PM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.phoneNumber')} *
              </label>
              <input 
                type="tel" 
                name="phone"
                value={bookingData.phone}
                onChange={handleInputChange}
                placeholder="+91 98765 43210"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.address')} *
              </label>
              <textarea 
                name="address"
                value={bookingData.address}
                onChange={handleInputChange}
                placeholder={t('booking.enterAddress')}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('booking.requirements')}
              </label>
              <textarea 
                name="requirements"
                value={bookingData.requirements}
                onChange={handleInputChange}
                placeholder={t('booking.enterRequirements')}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Payment Method */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 text-gray-800">{t('booking.paymentMethod')}</h4>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={bookingData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                    className="mr-3" 
                  />
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center">
                      💳 {t('booking.payOnline')}
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
                      {t('booking.secure')} 🔒
                    </span>
                  </div>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-orange-50">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={bookingData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                    className="mr-3" 
                  />
                  <span className="flex items-center">
                    💰 {t('booking.payOnService')}
                  </span>
                </label>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-gray-800">{t('booking.priceBreakdown')}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('booking.servicePrice')}</span>
                  <span>₹{service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('booking.platformFee')}</span>
                  <span>₹{platformFee}</span>
                </div>
                {bookingData.paymentMethod === 'online' && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('booking.onlineDiscount')}</span>
                    <span>-₹{Math.round(totalAmount * 0.02)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t pt-2 text-blue-600">
                  <span>{t('booking.total')}</span>
                  <span>₹{bookingData.paymentMethod === 'online' ? totalAmount - Math.round(totalAmount * 0.02) : totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Book Button */}
            <button 
              onClick={handleBooking}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('booking.processing')}
                </span>
              ) : (
                <>🔒 {t('booking.confirmBooking')}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
