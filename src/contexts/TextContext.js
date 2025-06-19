import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const TextContext = createContext();

export const TextContextProvider = ({ children }) => {
  const [text, setText] = useState('');
  const [purpose, setPurpose] = useState('general');
  const [options, setOptions] = useState({
    formality: 50,
    conciseness: 50,
    terminology: 'basic'
  });

  const value = {
    text,
    setText,
    purpose,
    setPurpose,
    options,
    setOptions
  };

  return (
    <TextContext.Provider value={value}>
      {children}
    </TextContext.Provider>
  );
};

TextContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useTextContext = () => {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useTextContext must be used within a TextContextProvider');
  }
  return context;
};

export default TextContext; 