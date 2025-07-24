'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';

export default function Header() {
  const { data: session } = useSession();
  const { t, locale, changeLanguage } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - More Compact */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-white text-blue-600 rounded-lg p-2 group-hover:scale-105 transition-transform shadow-lg">
                <span className="text-xl font-bold">LS</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">LocalSkill</span>
                <p className="text-blue-200 text-xs">{t('navigation.subtitle')}</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {session ? (
              <>
                <Link href="/dashboard" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                  🏠 <span className="hidden xl:inline">{t('navigation.dashboard')}</span>
                </Link>
                
                {session.user.role === 'business' ? (
                  <>
                    <Link href="/post-skill" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                      ➕ <span className="hidden xl:inline">{t('navigation.postSkill')}</span>
                    </Link>
                    <Link href="/my-services" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                      📋 <span className="hidden xl:inline">{t('navigation.myServices')}</span>
                    </Link>
                  </>
                ) : (
                  <Link href="/skills" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                    🔍 <span className="hidden xl:inline">{t('navigation.skills')}</span>
                  </Link>
                )}
                
                <Link href="/pricing" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                  💼 <span className="hidden xl:inline">{t('navigation.pricing')}</span>
                </Link>

                {/* Language Switcher */}
                <LanguageSwitcher currentLocale={locale} onLanguageChange={changeLanguage} />

                {/* User Menu - More Compact */}
                <div className="flex items-center space-x-2 ml-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                    <div className="text-xs text-white">
                      👋 <span className="font-medium">{session.user.name?.split(' ')[0]}</span>
                    </div>
                    <div className="text-xs text-blue-200">
                      <span className="bg-yellow-400 text-yellow-900 px-1 py-0.5 rounded text-xs font-medium">
                        {session.user.role}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-xs"
                    title={t('navigation.logout')}
                  >
                    🚪 <span className="hidden xl:inline">{t('navigation.logout')}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/skills" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                  🔍 <span className="hidden xl:inline">{t('navigation.skills')}</span>
                </Link>
                <Link href="/pricing" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                  💼 <span className="hidden xl:inline">{t('navigation.pricing')}</span>
                </Link>
                <LanguageSwitcher currentLocale={locale} onLanguageChange={changeLanguage} />
                <Link href="/login" className="text-white hover:text-blue-200 font-medium px-3 py-2 rounded-lg hover:bg-white/10 transition-all text-sm">
                  🔐 <span className="hidden xl:inline">{t('navigation.login')}</span>
                </Link>
                <Link href="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl text-sm">
                  📝 <span className="hidden xl:inline">{t('navigation.register')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-200 p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-2 bg-white/10 backdrop-blur-sm rounded-xl mt-2 border border-white/20">
              {session ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                    🏠 {t('navigation.dashboard')}
                  </Link>
                  
                  {session.user.role === 'business' ? (
                    <>
                      <Link href="/post-skill" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                        ➕ {t('navigation.postSkill')}
                      </Link>
                      <Link href="/my-services" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                        📋 {t('navigation.myServices')}
                      </Link>
                      <Link href="/pricing" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                        💼 {t('navigation.pricing')}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/skills" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                        🔍 {t('navigation.skills')}
                      </Link>
                      <Link href="/pricing" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                        💼 {t('navigation.pricing')}
                      </Link>
                    </>
                  )}
                  
                  <div className="px-4 py-3 text-sm text-blue-200 border-t border-white/20 mt-2">
                    👋 {session.user.name} ({session.user.role})
                  </div>
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="block w-full text-left px-4 py-3 text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                  >
                    🚪 {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                    🔐 {t('navigation.login')}
                  </Link>
                  <Link href="/register" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-all">
                    📝 {t('navigation.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
