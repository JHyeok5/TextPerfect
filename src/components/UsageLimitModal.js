import React, { useState } from 'react';
import { useTextContext } from '../context/TextContext';

const UsageLimitModal = () => {
  const { error, resetState } = useTextContext();
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    resetState();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 m-4">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          사용량 한도 도달
        </h2>
        
        <p className="text-gray-700 mb-6">
          {error}
        </p>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-900 mb-2">사용 가능한 옵션:</h3>
          <ul className="list-disc list-inside text-gray-600 mb-4 pl-2">
            <li>내일 다시 방문하여 무료 사용량 한도 갱신</li>
            <li>프리미엄 플랜으로 업그레이드하여 더 많은 텍스트 처리</li>
          </ul>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button 
            className="btn-outline"
            onClick={handleClose}
          >
            닫기
          </button>
          <button 
            className="btn-primary"
            onClick={() => {
              alert('준비 중인 기능입니다.');
              handleClose();
            }}
          >
            프리미엄으로 업그레이드
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal; 