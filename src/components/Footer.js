import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-primary-700">
              TextPerfect
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              목적에 맞는 최적의 텍스트를 제공합니다
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8">
            <Link to="/about" className="text-gray-600 hover:text-primary-600 mb-2 md:mb-0">
              소개
            </Link>
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 mb-2 md:mb-0"
              onClick={(e) => {
                e.preventDefault();
                alert('서비스 이용약관 준비 중입니다.');
              }}
            >
              이용약관
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-primary-600 mb-2 md:mb-0"
              onClick={(e) => {
                e.preventDefault();
                alert('개인정보 처리방침 준비 중입니다.');
              }}
            >
              개인정보 처리방침
            </a>
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TextPerfect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 