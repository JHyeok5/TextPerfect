import React from 'react';

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">분석 히스토리</h1>
      <p className="text-gray-600">지금까지 분석한 텍스트의 기록을 확인하세요.</p>
      
      <div className="mt-8 text-center py-12">
        <div className="mb-6">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">아직 분석한 텍스트가 없습니다</h2>
        <p className="text-gray-600 mb-6">에디터에서 텍스트를 분석해보세요.</p>
      </div>
    </div>
  );
}
