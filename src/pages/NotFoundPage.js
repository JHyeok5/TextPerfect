import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          찾으시려는 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
        </p>
        <Link to="/" className="btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 