import React, { createContext, useState, useEffect } from 'react';

// Create the language context with default values
export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {}
});

// Optional context provider component for easier usage
export const LanguageProvider = ({ children }) => {
  // Get saved language preference or default to 'en'
  const [language, setLanguage] = useState(
    localStorage.getItem('preferredLanguage') || 'en'
  );

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};