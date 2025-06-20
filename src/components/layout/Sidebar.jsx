import React from 'react';
import { useLocation } from 'react-router-dom';

// 나중에 페이지가 추가되면 여기에 사이드바 컴포넌트를 매핑합니다.
const sidebarConfig = {
  // '/editor': EditorSidebar, // 제거 - EditorPage에서 자체적으로 관리
};

export default function Sidebar() {
  const location = useLocation();
  const CurrentSidebar = sidebarConfig[location.pathname];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-4">
      {CurrentSidebar ? <CurrentSidebar /> : <div className="text-sm text-gray-500">이 페이지에는<br/>별도 옵션이 없습니다.</div>}
    </aside>
  );
} 