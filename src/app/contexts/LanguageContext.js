'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState({});

  const loadTranslations = async (locale, namespace = 'common') => {
    try {
      const response = await fetch(`/locales/${locale}/${namespace}.json`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English
      try {
        const fallback = await fetch(`/locales/en/${namespace}.json`);
        return await fallback.json();
      } catch (fallbackError) {
        console.error('Failed to load fallback translations:', fallbackError);
        return {};
      }
    }
  };

  const changeLanguage = async (newLocale) => {
    localStorage.setItem('preferred-language', newLocale);
    setLocale(newLocale);
    const newTranslations = await loadTranslations(newLocale);
    setTranslations(newTranslations);
  };

  useEffect(() => {
    // Initialize with saved language
    const savedLocale = localStorage.getItem('preferred-language') || 'en';
    setLocale(savedLocale);
    loadTranslations(savedLocale).then(setTranslations);
  }, []);

  const value = {
    locale,
    translations,
    changeLanguage,
    t: (key, params = {}) => {
      const keys = key.split('.');
      let result = translations;
      
      for (const k of keys) {
        result = result?.[k];
      }
      
      if (typeof result === 'string' && Object.keys(params).length > 0) {
        return result.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] !== undefined ? params[paramKey] : match;
        });
      }
      
      return result || key;
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
