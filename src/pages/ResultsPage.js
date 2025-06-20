import React from 'react';
import { useTextContext } from '../contexts/TextContext';
import { Header, Footer, Button, Card } from '../components/common';
import { ComparisonView, AnalysisChart } from '../components/analytics';

export default function ResultsPage() {
  const { text } = useTextContext();

  // 샘플 분석 결과 데이터
  const analysisResult = {
    readability: { before: 65, after: 85 },
    clarity: { before: 70, after: 90 },
    professionalism: { before: 60, after: 80 },
    conciseness: { before: 55, after: 75 },
  };

  const originalText = text || "원본 텍스트가 여기에 표시됩니다.";
  const optimizedText = "최적화된 텍스트가 여기에 표시됩니다. AI가 개선한 내용으로 더욱 명확하고 읽기 쉽게 작성되었습니다.";

  return (
    <div className="max-w-7xl mx-auto">
      <Header 
        title="최적화 결과" 
        subtitle="AI가 분석하고 최적화한 텍스트 결과를 확인하세요." 
      />

      <div className="space-y-6">
        {/* 텍스트 비교 */}
        <ComparisonView 
          originalText={originalText}
          optimizedText={optimizedText}
        />

        {/* 분석 차트 */}
        <AnalysisChart data={analysisResult} />

        {/* 상세 분석 결과 */}
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">상세 분석 결과</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">주요 개선점</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 문장 구조가 더욱 명확해졌습니다</li>
                  <li>• 전문 용어 사용이 적절히 조정되었습니다</li>
                  <li>• 가독성이 20점 향상되었습니다</li>
                  <li>• 전체적인 글의 흐름이 개선되었습니다</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-3">품질 점수</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>전체 품질:</span>
                    <span className="font-bold text-green-600">A+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>개선도:</span>
                    <span className="font-bold text-blue-600">+18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>추천도:</span>
                    <span className="font-bold text-purple-600">95%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex justify-center gap-4">
          <Button variant="secondary">다시 최적화</Button>
          <Button variant="primary">결과 저장</Button>
          <Button variant="outline">공유하기</Button>
        </div>
      </div>

      <Footer />
    </div>
  );
} 