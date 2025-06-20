import React from 'react';
import PropTypes from 'prop-types';

const Header = ({ title, subtitle, className = '' }) => {
  return (
    <header className={`mb-6 ${className}`}>
      {title && (
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-gray-600">
          {subtitle}
        </p>
      )}
    </header>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default Header; 