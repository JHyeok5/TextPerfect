import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import ProgressBar from '../common/ProgressBar';

export default function Header() {
  const { user, subscription } = useUser();
  return (
    <header className="bg-white shadow flex items-center px-6 h-16 justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-xl text-blue-700">TextPerfect</Link>
        <nav className="hidden md:flex gap-4">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>대시보드</NavLink>
          <NavLink to="/editor" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>에디터</NavLink>
          <NavLink to="/analysis" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>분석</NavLink>
          <NavLink to="/templates" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>템플릿</NavLink>
          <NavLink to="/coaching" className={({isActive}) => isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'}>AI 코치</NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-xs text-gray-500 text-right">
          <div>Lv.{user.level} {user.nickname}</div>
          <ProgressBar value={user.exp} max={1000} color="bg-blue-500" height="h-2" />
        </div>
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100">
            <span className="font-semibold">프로필</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-50">내 프로필</Link>
            <Link to="/subscription" className="block px-4 py-2 hover:bg-gray-50">구독 관리</Link>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50">로그아웃</button>
          </div>
        </div>
      </div>
    </header>
  );
} 