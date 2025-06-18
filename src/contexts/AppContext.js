import React, { createContext, useContext, useState } from 'react';

const defaultUI = {
  loading: false,
  modal: null, // { type, props }
  notification: null, // { type, message }
};

const defaultNavigation = {
  currentPage: 'home',
  history: [],
};

const defaultMessages = {
  error: null,
  success: null,
};

const AppContext = createContext({
  ui: defaultUI,
  setUI: () => {},
  navigation: defaultNavigation,
  setNavigation: () => {},
  messages: defaultMessages,
  setMessages: () => {},
});

export function AppProvider({ children }) {
  const [ui, setUI] = useState(defaultUI);
  const [navigation, setNavigation] = useState(defaultNavigation);
  const [messages, setMessages] = useState(defaultMessages);

  return (
    <AppContext.Provider value={{ ui, setUI, navigation, setNavigation, messages, setMessages }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
} 