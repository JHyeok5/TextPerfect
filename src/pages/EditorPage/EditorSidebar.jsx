import React, { useState } from 'react';
import SettingsPanel from '../../../components/editor/SettingsPanel';

export default function EditorSidebar() {
  // 임시 상태. 추후에 Context API나 다른 상태 관리 로직과 연결해야 합니다.
  const [purpose, setPurpose] = useState('general');
  const [options, setOptions] = useState({
    formality: 50,
    conciseness: 50,
    terminology: 'basic',
  });

  return (
    <SettingsPanel
      purpose={purpose}
      options={options}
      onPurposeChange={setPurpose}
      onOptionsChange={setOptions}
    />
  );
} 