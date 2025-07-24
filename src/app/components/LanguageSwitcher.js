'use client';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', native: 'हिंदी' },
  { code: 'bho', name: 'Bhojpuri', flag: '🏛️', native: 'भोजपुरी' },
  { code: 'mai', name: 'Maithili', flag: '📿', native: 'मैथिली' }
];

export default function LanguageSwitcher({ currentLocale, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === currentLocale) || languages[0];

  const handleLanguageChange = (langCode) => {
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
      >
        <span className="text-sm">{currentLang.flag}</span>
        <span className="font-medium text-white text-sm hidden sm:block">{currentLang.native}</span>
        <span className={`transform transition-transform text-white text-xs ${isOpen ? 'rotate-180' : ''}`}>
          ⬇️
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 min-w-40">
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 hover:bg-blue-50 transition-colors flex items-center space-x-2 text-sm ${
                    lang.code === currentLocale ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{lang.native}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                  </div>
                  {lang.code === currentLocale && (
                    <span className="text-blue-600 text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
