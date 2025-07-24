'use client';
import Link from 'next/link';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white rounded-xl p-3 shadow-lg">
                <span className="text-xl font-bold">LS</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800">LocalSkill</span>
                <p className="text-blue-600 text-sm">{t('footer.tagline')}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-all shadow-lg hover:shadow-xl">
                <span className="text-lg">📘</span>
              </a>
              <a href="#" className="bg-sky-500 hover:bg-sky-600 p-3 rounded-lg transition-all shadow-lg hover:shadow-xl">
                <span className="text-lg">🐦</span>
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg transition-all shadow-lg hover:shadow-xl">
                <span className="text-lg">📷</span>
              </a>
              <a href="#" className="bg-green-600 hover:bg-green-700 p-3 rounded-lg transition-all shadow-lg hover:shadow-xl">
                <span className="text-lg">💬</span>
              </a>
            </div>
          </div>

          {/* Popular Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-blue-600 flex items-center">
              <span className="mr-2">🔧</span> {t('footer.topServices')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/skills?category=Cleaning" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50">
                  <span>🏠</span><span>{t('footer.houseCleaning')}</span>
                </Link>
              </li>
              <li>
                <Link href="/skills?category=Repair" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50">
                  <span>🔧</span><span>{t('footer.homeRepairs')}</span>
                </Link>
              </li>
              <li>
                <Link href="/skills?category=Beauty" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50">
                  <span>💅</span><span>{t('footer.beautyWellness')}</span>
                </Link>
              </li>
              <li>
                <Link href="/skills?category=Technology" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50">
                  <span>💻</span><span>{t('footer.techSupport')}</span>
                </Link>
              </li>
              <li>
                <Link href="/skills?category=Education" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-50">
                  <span>📚</span><span>{t('footer.tutoring')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-green-600 flex items-center">
              <span className="mr-2">⚡</span> {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/skills" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50">
                  <span>🔍</span><span>{t('footer.browseAllServices')}</span>
                </Link>
              </li>
              <li>
                <Link href="/post-skill" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50">
                  <span>➕</span><span>{t('footer.listYourService')}</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50">
                  <span>ℹ️</span><span>{t('footer.aboutLocalSkill')}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50">
                  <span>📞</span><span>{t('footer.contactSupport')}</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-green-600 transition-colors flex items-center space-x-2 p-2 rounded-lg hover:bg-green-50">
                  <span>❓</span><span>{t('footer.helpCenter')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Stats */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-purple-600 flex items-center">
              <span className="mr-2">📞</span> {t('footer.getInTouch')}
            </h3>
            <div className="space-y-4 text-sm">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-600 font-medium mb-2">📧 {t('footer.emailSupport')}</p>
                <p className="text-gray-700">support@localskill.com</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-green-600 font-medium mb-2">📱 {t('footer.phoneSupport')}</p>
                <p className="text-gray-700">+91 98765 43210</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-purple-600 font-medium mb-2">🕒 {t('footer.available')}</p>
                <p className="text-gray-700">{t('footer.support247')}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                <div className="text-lg font-bold text-blue-600">1000+</div>
                <div className="text-xs text-blue-500">{t('footer.services')}</div>
              </div>
              <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                <div className="text-lg font-bold text-green-600">500+</div>
                <div className="text-xs text-green-500">{t('footer.businesses')}</div>
              </div>
              <div className="bg-purple-100 rounded-lg p-3 border border-purple-300">
                <div className="text-lg font-bold text-purple-600">50+</div>
                <div className="text-xs text-purple-500">{t('footer.cities')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600 text-center md:text-left">
              {t('footer.copyright')}
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-blue-600 transition-colors hover:underline">{t('footer.privacyPolicy')}</Link>
              <Link href="/terms" className="hover:text-blue-600 transition-colors hover:underline">{t('footer.termsOfService')}</Link>
              <Link href="/cookies" className="hover:text-blue-600 transition-colors hover:underline">{t('footer.cookiePolicy')}</Link>
              <Link href="/refund" className="hover:text-blue-600 transition-colors hover:underline">{t('footer.refundPolicy')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
