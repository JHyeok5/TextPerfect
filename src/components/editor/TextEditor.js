import React, { useState, useCallback } from 'react';
import { useTextContext } from '../../contexts/TextContext';
import SettingsPanel from './SettingsPanel';
import EditorPane from './EditorPane';
import AnalysisIndicators from './AnalysisIndicators';

const TextEditor = () => {
  const context = useTextContext();
  
  // Context가 없는 경우 early return
  if (!context) {
    return null;
  }

  const { text, setText, purpose, setPurpose, options, setOptions } = context;
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleTextChange = useCallback((newText) => {
    setText(newText);
    setError(null);
  }, [setText]);

  const handlePurposeChange = useCallback((newPurpose) => {
    setPurpose(newPurpose);
  }, [setPurpose]);

  const handleOptionsChange = useCallback((newOptions) => {
    setOptions(newOptions);
  }, [setOptions]);

  const handleOptimize = useCallback(async () => {
    if (!text.trim()) {
      setError('텍스트를 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // TODO: API 호출 구현
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 지연
    } catch (err) {
      setError('텍스트 최적화 중 오류가 발생했습니다.');
      console.error('Optimization error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [text]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <SettingsPanel
        purpose={purpose}
        options={options}
        onPurposeChange={handlePurposeChange}
        onOptionsChange={handleOptionsChange}
      />
      <EditorPane
        text={text}
        onChange={handleTextChange}
        isProcessing={isProcessing}
        error={error}
        onOptimize={handleOptimize}
      />
      <AnalysisIndicators text={text} />
    </div>
  );
};

export default TextEditor; 