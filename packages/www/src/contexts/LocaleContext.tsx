import { createContext, ReactNode, useLayoutEffect, useState } from 'react';
import Cookies from 'js-cookie';

import { Locale, defaultLocale, isLocale } from '~utils/locale';

const LocaleContext = createContext({
  locale: defaultLocale,
  setLocale: (locale: Locale) => {},
});

interface Props {
  children: ReactNode;
}

export const LocaleProvider = ({ children }: Props) => {
  const [localeState, setLocaleState] = useState(defaultLocale);

  const setLocale = (locale: Locale) => {
    setLocaleState(locale);
    Cookies.set('locale', locale, { expires: 365, path: '/' });
    localStorage.setItem('locale', locale);
  };

  useLayoutEffect(() => {
    const storedLocale = localStorage.getItem('locale');
    if (storedLocale && isLocale(storedLocale)) {
      setLocale(storedLocale);
    }
  }, []);

  return (
    <LocaleContext.Provider value={{ locale: localeState, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleContext;
