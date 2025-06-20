import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          홈페이지로 돌아가서 다시 시도해 보세요.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button variant="primary" size="lg">
              홈페이지로 돌아가기
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            또는{' '}
            <Link to="/editor" className="text-blue-600 hover:text-blue-800 underline">
              에디터 페이지
            </Link>
            {' '}로 이동하세요
          </div>
        </div>
      </div>
    </div>
  );
} 