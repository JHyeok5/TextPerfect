import React, { useRef } from 'react';
import { useTextContext } from '../context/TextContext';

const ComparisonView = () => {
  const { originalText, optimizedText, changes } = useTextContext();
  const originalRef = useRef(null);
  const optimizedRef = useRef(null);
  
  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(`${type} 텍스트가 클립보드에 복사되었습니다.`);
      })
      .catch(err => {
        console.error('텍스트 복사 중 오류가 발생했습니다:', err);
        alert('텍스트 복사에 실패했습니다.');
      });
  };
  
  const handleDownloadText = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Highlight changes in optimized text
  const renderHighlightedText = (text, textType) => {
    if (!text) return null;
    
    // If no changes or original text, just return the plain text
    if (textType === 'original' || !changes || changes.length === 0) {
      return <div className="whitespace-pre-wrap">{text}</div>;
    }
    
    // Sort changes by position for proper highlighting
    const sortedChanges = [...changes].sort((a, b) => a.position[0] - b.position[0]);
    
    let lastIndex = 0;
    const textParts = [];
    
    sortedChanges.forEach((change, index) => {
      const [start, end] = change.position;
      
      // Text before the change
      if (start > lastIndex) {
        textParts.push(
          <span key={`text-${index}-before`}>
            {text.substring(lastIndex, start)}
          </span>
        );
      }
      
      // The changed text with appropriate highlighting
      const highlightClass = 
        change.type === 'replacement' ? 'bg-yellow-200' :
        change.type === 'addition' ? 'bg-green-200' :
        change.type === 'removal' ? 'bg-red-200' : '';
      
      textParts.push(
        <span 
          key={`change-${index}`} 
          className={`${highlightClass} relative group cursor-pointer`}
          title={change.reason}
        >
          {text.substring(start, end)}
          <span className="invisible group-hover:visible absolute bottom-full left-0 bg-gray-800 text-white text-xs rounded p-2 w-48 z-10">
            {change.reason}
          </span>
        </span>
      );
      
      lastIndex = end;
    });
    
    // Text after the last change
    if (lastIndex < text.length) {
      textParts.push(
        <span key="text-last">
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return <div className="whitespace-pre-wrap">{textParts}</div>;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">원본 텍스트</h2>
          <div className="flex space-x-2">
            <button 
              className="text-sm text-gray-600 hover:text-primary-600"
              onClick={() => handleCopyText(originalText, '원본')}
            >
              복사
            </button>
            <button 
              className="text-sm text-gray-600 hover:text-primary-600"
              onClick={() => handleDownloadText(originalText, 'original_text.txt')}
            >
              다운로드
            </button>
          </div>
        </div>
        
        <div 
          ref={originalRef}
          className="bg-gray-50 p-4 rounded-md font-mono text-sm h-80 overflow-auto border border-gray-200"
        >
          {renderHighlightedText(originalText, 'original')}
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">최적화된 텍스트</h2>
          <div className="flex space-x-2">
            <button 
              className="text-sm text-gray-600 hover:text-primary-600"
              onClick={() => handleCopyText(optimizedText, '최적화된')}
            >
              복사
            </button>
            <button 
              className="text-sm text-gray-600 hover:text-primary-600"
              onClick={() => handleDownloadText(optimizedText, 'optimized_text.txt')}
            >
              다운로드
            </button>
          </div>
        </div>
        
        <div 
          ref={optimizedRef}
          className="bg-gray-50 p-4 rounded-md font-mono text-sm h-80 overflow-auto border border-gray-200"
        >
          {renderHighlightedText(optimizedText, 'optimized')}
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-700 mb-2">변경 사항 범례:</h3>
          <div className="flex space-x-4 text-xs">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-200 mr-1"></span>
              <span>대체</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-green-200 mr-1"></span>
              <span>추가</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-200 mr-1"></span>
              <span>제거</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            * 변경 부분에 마우스를 올리면 변경 이유를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView; 