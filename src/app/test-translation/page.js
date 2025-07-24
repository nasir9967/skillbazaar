'use client';
import { useTranslation } from '../hooks/useTranslation';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function TranslationTest() {
  const { t, locale, changeLanguage } = useTranslation();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Translation Test</h1>
          <LanguageSwitcher currentLocale={locale} onLanguageChange={changeLanguage} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-blue-600">Navigation</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Home:</strong> {t('navigation.home')}</p>
              <p><strong>Login:</strong> {t('navigation.login')}</p>
              <p><strong>Register:</strong> {t('navigation.register')}</p>
              <p><strong>Dashboard:</strong> {t('navigation.dashboard')}</p>
              <p><strong>Skills:</strong> {t('navigation.skills')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-green-600">Categories</h2>
            <div className="space-y-2 text-sm">
              <p><strong>All:</strong> {t('categories.all')}</p>
              <p><strong>Cleaning:</strong> {t('categories.cleaning')}</p>
              <p><strong>Construction:</strong> {t('categories.construction')}</p>
              <p><strong>Wedding:</strong> {t('categories.wedding')}</p>
              <p><strong>Agriculture:</strong> {t('categories.agriculture')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-purple-600">Skills Page</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Title:</strong> {t('skills.title')}</p>
              <p><strong>Search:</strong> {t('skills.searchPlaceholder')}</p>
              <p><strong>Contact:</strong> {t('skills.contactNow')}</p>
              <p><strong>Location:</strong> {t('skills.location')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-orange-600">Common</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Loading:</strong> {t('common.loading')}</p>
              <p><strong>Please Wait:</strong> {t('common.pleaseWait')}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Current Language:</strong> {locale} | 
            <strong> Test Status:</strong> <span className="text-green-600">✅ Working</span>
          </p>
        </div>
      </div>
    </div>
  );
}
