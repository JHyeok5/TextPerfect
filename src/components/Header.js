import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTextContext } from '../context/TextContext';

const Header = () => {
  const { usageInfo } = useTextContext();
  const usagePercentage = 100 - (usageInfo.dailyRemaining / 1000) * 100;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-700">TextPerfect</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? "text-primary-700 font-medium" : "text-gray-600 hover:text-primary-600"
              }
              end
            >
              홈
            </NavLink>
            <NavLink 
              to="/editor" 
              className={({ isActive }) => 
                isActive ? "text-primary-700 font-medium" : "text-gray-600 hover:text-primary-600"
              }
            >
              텍스트 에디터
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive ? "text-primary-700 font-medium" : "text-gray-600 hover:text-primary-600"
              }
            >
              소개
            </NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">일일 사용량:</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${usagePercentage > 80 ? 'bg-red-500' : 'bg-primary-500'}`}
                    style={{ width: `${usagePercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {usageInfo.dailyRemaining.toLocaleString()}자 남음
                </span>
              </div>
            </div>
            <Link to="/editor" className="btn-primary text-sm">
              시작하기
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 