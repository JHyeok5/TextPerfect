import React, { createContext, useContext, useState } from 'react';

const TextContext = createContext({
  text: '',
  setText: () => {},
  error: null,
  setError: () => {},
});

export function TextContextProvider({ children }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  return (
    <TextContext.Provider value={{ text, setText, error, setError }}>
      {children}
    </TextContext.Provider>
  );
}

export function useTextContext() {
  return useContext(TextContext);
}

export default TextContext; 