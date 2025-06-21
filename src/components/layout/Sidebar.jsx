import React from 'react';
import { useLocation } from 'react-router-dom';
import EditorSidebar from '../../pages/EditorPage/EditorSidebar';
import { useTextContext } from '../../contexts/TextContext';

// 사이드바를 표시할 페이지 설정
const sidebarConfig = {
  '/editor': 'EditorSidebar', // 문자열로 표시하여 조건부 렌더링
};

// 사이드바를 숨길 페이지들
const hideSidebarPages = ['/profile', '/subscription'];

export default function Sidebar() {
  const location = useLocation();
  const currentSidebarType = sidebarConfig[location.pathname];
  
  // 특정 페이지에서는 사이드바를 숨김
  if (hideSidebarPages.includes(location.pathname)) {
    return null;
  }
  
  // EditorPage용 Context 사용
  const { 
    purpose, 
    setPurpose, 
    options, 
    setOptions 
  } = useTextContext();

  // 안전한 함수 래퍼
  const handlePurposeChange = (newPurpose) => {
    if (typeof setPurpose === 'function') {
      setPurpose(newPurpose);
    }
  };

  const handleOptionsChange = (newOptions) => {
    if (typeof setOptions === 'function') {
      setOptions(newOptions);
    }
  };

  const renderSidebarContent = () => {
    if (currentSidebarType === 'EditorSidebar') {
      return (
        <EditorSidebar
          purpose={purpose || 'general'}
          onPurposeChange={handlePurposeChange}
          options={options || { formality: 50, conciseness: 50, terminology: 'basic' }}
          onOptionsChange={handleOptionsChange}
        />
      );
    }
    
    return (
      <div className="text-sm text-gray-500">
        이 페이지에는<br/>별도 옵션이 없습니다.
      </div>
    );
  };

  return (
    <aside className="hidden md:flex flex-col w-80 bg-white border-r border-gray-100 p-4">
      {renderSidebarContent()}
    </aside>
  );
} 