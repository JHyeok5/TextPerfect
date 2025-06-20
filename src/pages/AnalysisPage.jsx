import React, { useState } from 'react';
import { ComparisonView, AnalysisChart, SettingsPanel as AnalyticsSettingsPanel } from '../components/analytics';
import { Header, Footer } from '../components/common';

export default function AnalysisPage() {
  const [settings, setSettings] = useState({
    showComparison: true,
    showChart: true,
    chartType: 'progress'
  });

  const handleSettingsChange = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // 샘플 분석 데이터
  const sampleData = {
    readability: { before: 65, after: 85 },
    clarity: { before: 70, after: 90 },
    professionalism: { before: 60, after: 80 },
    conciseness: { before: 55, after: 75 },
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Header 
        title="텍스트 분석" 
        subtitle="AI가 분석한 텍스트 품질과 개선 사항을 확인하세요." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 설정 패널 */}
        <div className="lg:col-span-1">
          <AnalyticsSettingsPanel 
            {...settings}
            onSettingsChange={handleSettingsChange}
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-3 space-y-6">
          {settings.showComparison && (
            <ComparisonView 
              originalText="이것은 원본 텍스트입니다. 최적화가 필요한 내용이 포함되어 있습니다."
              optimizedText="이것은 최적화된 텍스트입니다. AI가 개선한 내용으로 더욱 명확하고 읽기 쉽게 작성되었습니다."
            />
          )}

          {settings.showChart && (
            <AnalysisChart data={sampleData} />
          )}

          {/* 분석 인사이트 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">AI 분석 인사이트</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">주요 개선점</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 문장 구조가 더욱 명확해졌습니다</li>
                  <li>• 전문 용어 사용이 적절히 조정되었습니다</li>
                  <li>• 가독성이 크게 향상되었습니다</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">품질 점수</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <div>전체 품질: <span className="font-bold">A+</span></div>
                  <div>개선도: <span className="font-bold">+18%</span></div>
                  <div>추천도: <span className="font-bold">95%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 