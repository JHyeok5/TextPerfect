import React from 'react';
import PropTypes from 'prop-types';

const Footer = ({ className = '', children }) => {
  if (children) {
    return (
      <footer className={`mt-8 pt-6 border-t border-gray-200 ${className}`}>
        {children}
      </footer>
    );
  }

  return (
    <footer className={`mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500 ${className}`}>
      <p>© 2024 TextPerfect. All rights reserved.</p>
    </footer>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Footer; 