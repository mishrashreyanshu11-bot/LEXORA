import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SupportedLanguageCode,
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  LANGUAGE_MAP,
  UI_TRANSLATIONS,
  UiDictionary,
} from '../data/languages';
import { useAuth } from './AuthContext';

interface LanguageContextType {
  // Independent UI/Home Menu language
  uiLanguage: SupportedLanguageCode;
  setUiLanguage: (lang: SupportedLanguageCode) => void;
  t: UiDictionary;
  translate: (key: string, fallback?: string) => string;

  // Independent Reading language
  readingLanguage: SupportedLanguageCode;
  setReadingLanguage: (lang: SupportedLanguageCode) => void;

  // Independent Writing language
  writingLanguage: SupportedLanguageCode;
  setWritingLanguage: (lang: SupportedLanguageCode) => void;

  // Metadata helpers
  languages: SupportedLanguage[];
  getLanguage: (code: string) => SupportedLanguage | undefined;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY_UI_LANG = 'lexora_ui_language_v1';
const STORAGE_KEY_READING_LANG = 'lexora_reading_language_v1';
const STORAGE_KEY_WRITING_LANG = 'lexora_writing_language_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, updateLanguagePreference } = useAuth();

  // 1. UI / Home Menu Language (Independent)
  const [uiLanguage, setUiLanguageState] = useState<SupportedLanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UI_LANG);
      if (saved && LANGUAGE_MAP.has(saved as SupportedLanguageCode)) {
        return saved as SupportedLanguageCode;
      }
      return (currentUser?.preferredUiLanguage as SupportedLanguageCode) || 'en';
    } catch {
      return 'en';
    }
  });

  // 2. Reading Studio Language (Independent)
  const [readingLanguage, setReadingLanguageState] = useState<SupportedLanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_READING_LANG);
      if (saved && LANGUAGE_MAP.has(saved as SupportedLanguageCode)) {
        return saved as SupportedLanguageCode;
      }
      return (currentUser?.preferredReadingLanguage as SupportedLanguageCode) || 'en';
    } catch {
      return 'en';
    }
  });

  // 3. Writing Studio Language (Independent)
  const [writingLanguage, setWritingLanguageState] = useState<SupportedLanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WRITING_LANG);
      if (saved && LANGUAGE_MAP.has(saved as SupportedLanguageCode)) {
        return saved as SupportedLanguageCode;
      }
      return (currentUser?.preferredWritingLanguage as SupportedLanguageCode) || 'en';
    } catch {
      return 'en';
    }
  });

  // Keep in sync with user profile if user logs in
  useEffect(() => {
    if (currentUser?.preferredUiLanguage && LANGUAGE_MAP.has(currentUser.preferredUiLanguage as SupportedLanguageCode)) {
      setUiLanguageState(currentUser.preferredUiLanguage as SupportedLanguageCode);
    }
    if (currentUser?.preferredReadingLanguage && LANGUAGE_MAP.has(currentUser.preferredReadingLanguage as SupportedLanguageCode)) {
      setReadingLanguageState(currentUser.preferredReadingLanguage as SupportedLanguageCode);
    }
    if (currentUser?.preferredWritingLanguage && LANGUAGE_MAP.has(currentUser.preferredWritingLanguage as SupportedLanguageCode)) {
      setWritingLanguageState(currentUser.preferredWritingLanguage as SupportedLanguageCode);
    }
  }, [currentUser?.id]);

  const setUiLanguage = (lang: SupportedLanguageCode) => {
    setUiLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_UI_LANG, lang);
    updateLanguagePreference('ui', lang);
  };

  const setReadingLanguage = (lang: SupportedLanguageCode) => {
    setReadingLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_READING_LANG, lang);
    updateLanguagePreference('reading', lang);
  };

  const setWritingLanguage = (lang: SupportedLanguageCode) => {
    setWritingLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_WRITING_LANG, lang);
    updateLanguagePreference('writing', lang);
  };

  const activeDict = UI_TRANSLATIONS[uiLanguage] || UI_TRANSLATIONS.en;
  const t: UiDictionary = {
    ...UI_TRANSLATIONS.en,
    ...activeDict,
  };

  const translate = (key: string, fallback?: string): string => {
    return t[key] || fallback || key;
  };

  const getLanguage = (code: string) => {
    return LANGUAGE_MAP.get(code as SupportedLanguageCode);
  };

  return (
    <LanguageContext.Provider
      value={{
        uiLanguage,
        setUiLanguage,
        t,
        translate,
        readingLanguage,
        setReadingLanguage,
        writingLanguage,
        setWritingLanguage,
        languages: SUPPORTED_LANGUAGES,
        getLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
