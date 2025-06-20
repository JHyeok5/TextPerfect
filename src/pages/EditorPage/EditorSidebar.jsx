import React from 'react';
import PropTypes from 'prop-types';
import { SettingsPanel } from '../../components/editor';

export default function EditorSidebar({ purpose, onPurposeChange, options, onOptionsChange, debugId = 'SIDEBAR' }) {
  return (
    <SettingsPanel
      purpose={purpose}
      options={options}
      onPurposeChange={onPurposeChange}
      onOptionsChange={onOptionsChange}
      debugId={debugId}
    />
  );
}

EditorSidebar.propTypes = {
  purpose: PropTypes.string.isRequired,
  onPurposeChange: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  onOptionsChange: PropTypes.func.isRequired,
  debugId: PropTypes.string,
}; 