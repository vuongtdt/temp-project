import React, { useEffect } from 'react';
import './Assets/style/style.scss';
import Router from './routes';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from "styled-components";
import { useChatStore } from './store/chatStore';
import { useTranslateStore } from './store/translateStore';
import { IntlProvider } from 'react-intl';
import { useLocalStorage } from './lib/component/Hook/useLocalStorage';
import { DarkTheme } from './themes/DarkTheme';
import { LightTheme } from './themes/LightTheme';
import messages_vi from "./translations/locales/vi.json";
import messages_en from "./translations/locales/en.json";

const App = () => {
  const { theme, changeTheme } = useChatStore();
  const { language, locale, translate } = useTranslateStore();
  const { setItem, getItem } = useLocalStorage();

  useEffect(() => {
    let locale = getItem('locale');
    if (!locale) {
      setItem('locale', 'vi');
    }
    if (locale === 'vi') {
      translate(messages_vi, locale);
    } else {
      translate(messages_en, locale);
    }
    getItem('theme') === 'DarkTheme' ? changeTheme(DarkTheme) : changeTheme(LightTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <IntlProvider locale={locale} messages={language}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router />
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;