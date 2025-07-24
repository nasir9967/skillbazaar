'use client';
import { useState, useEffect, useCallback } from 'react';

export function useTranslation(namespace = 'common') {
  const [translations, setTranslations] = useState({});
  const [locale, setLocale] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  const loadTranslations = useCallback(async (locale, namespace) => {
    try {
      setIsLoading(true);
      console.log(`Loading translations for locale: ${locale}, namespace: ${namespace}`);
      const response = await fetch(`/locales/${locale}/${namespace}.json`);
      const data = await response.json();
      console.log(`Translations loaded:`, data);
      setTranslations(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English
      try {
        const fallback = await fetch(`/locales/en/${namespace}.json`);
        const fallbackData = await fallback.json();
        setTranslations(fallbackData);
        setIsLoading(false);
      } catch (fallbackError) {
        console.error('Failed to load fallback translations:', fallbackError);
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // Get locale from localStorage or default to English
    const savedLocale = localStorage.getItem('preferred-language') || 'en';
    setLocale(savedLocale);
    loadTranslations(savedLocale, namespace);
  }, [namespace, loadTranslations]);

  useEffect(() => {
    // Listen for language changes from other components
    const handleLanguageChange = (e) => {
      const newLocale = e.detail;
      console.log('Language change event received:', newLocale);
      setLocale(newLocale);
      loadTranslations(newLocale, namespace);
    };

    window.addEventListener('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, [namespace, loadTranslations]);

  const changeLanguage = useCallback((newLocale) => {
    console.log('Changing language to:', newLocale);
    localStorage.setItem('preferred-language', newLocale);
    setLocale(newLocale);
    loadTranslations(newLocale, namespace);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLocale }));
  }, [namespace, loadTranslations]);

  const t = useCallback((key, params = {}) => {
    if (!translations || !key) {
      console.warn(`Translation not ready or key missing: ${key}, translations loaded:`, !!translations);
      return key;
    }
    
    let translation = key.split('.').reduce((obj, keyPart) => {
      return obj?.[keyPart];
    }, translations);

    if (!translation) {
      console.warn(`Translation key not found: ${key} in namespace: ${namespace}`, translations);
      return key;
    }

    // Replace placeholders with parameters
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }

    return translation;
  }, [translations, namespace]);

  return { t, locale, changeLanguage, isLoading };
}
