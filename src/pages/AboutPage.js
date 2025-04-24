import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">TextPerfect 소개</h1>
        <p className="text-gray-600 mt-2">
          TextPerfect는 Anthropic의 Claude AI를 활용한 텍스트 최적화 서비스입니다.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2">
          <div className="card h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">목표와 비전</h2>
            
            <p className="text-gray-700 mb-4">
              TextPerfect는 단순한 맞춤법/문법 검사를 넘어, 텍스트의 목적과 맥락을 이해하고 
              최적의 표현과 구조로 변환하는 서비스를 제공합니다. 이를 통해 사용자들이 
              더 효과적으로 의사소통할 수 있도록 돕습니다.
            </p>
            
            <p className="text-gray-700 mb-4">
              우리는 다음과 같은 가치를 중요하게 생각합니다:
            </p>
            
            <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
              <li>
                <strong>목적 중심:</strong> 텍스트의 목적과 대상 독자를 최우선으로 고려합니다.
              </li>
              <li>
                <strong>맥락 이해:</strong> 단순 규칙 기반이 아닌, 텍스트의 맥락과 의도를 고려한 최적화를 제공합니다.
              </li>
              <li>
                <strong>투명성:</strong> 최적화 과정에서 변경된 내용과 그 이유를 명확하게 제시합니다.
              </li>
              <li>
                <strong>사용자 주도:</strong> 사용자가 원하는 스타일과 톤을 직접 선택할 수 있도록 합니다.
              </li>
            </ul>
            
            <p className="text-gray-700">
              TextPerfect는 학생, 연구자, 비즈니스 전문가, 콘텐츠 크리에이터 등 다양한 
              분야의 사용자들이 더 나은 텍스트를 작성할 수 있도록 도움을 드리고자 합니다.
            </p>
          </div>
        </div>
        
        <div className="card h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">기술 스택</h2>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-0.5">
                AI
              </span>
              <div>
                <p className="font-medium">Claude API</p>
                <p className="text-sm text-gray-600">맥락 인식 텍스트 최적화</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-0.5">
                Frontend
              </span>
              <div>
                <p className="font-medium">React</p>
                <p className="text-sm text-gray-600">사용자 인터페이스</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-0.5">
                Styling
              </span>
              <div>
                <p className="font-medium">TailwindCSS</p>
                <p className="text-sm text-gray-600">반응형 UI 디자인</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-0.5">
                Backend
              </span>
              <div>
                <p className="font-medium">Netlify Functions</p>
                <p className="text-sm text-gray-600">서버리스 API 처리</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-0.5">
                Hosting
              </span>
              <div>
                <p className="font-medium">GitHub Pages</p>
                <p className="text-sm text-gray-600">프론트엔드 호스팅</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 mt-0.5">
                Visualization
              </span>
              <div>
                <p className="font-medium">Chart.js</p>
                <p className="text-sm text-gray-600">데이터 시각화</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="card mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">주요 기능</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-gray-700 mb-2">목적별 텍스트 최적화</h3>
            <p className="text-gray-600">
              학술, 비즈니스, 기술, 일반 등 다양한 목적에 맞는 텍스트 최적화 기능을 제공합니다.
              각 목적별로 최적화 알고리즘과 평가 기준이 다르게 적용됩니다.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-2">세부 설정 조정</h3>
            <p className="text-gray-600">
              형식성, 간결성, 용어 수준 등 사용자가 원하는 텍스트 스타일을 세밀하게 조정할 수 있습니다.
              이를 통해 상황과 대상 독자에 가장 적합한 텍스트를 생성할 수 있습니다.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-2">변경 사항 비교 및 설명</h3>
            <p className="text-gray-600">
              원본 텍스트와 최적화된 텍스트를 비교하고, 각 변경 사항에 대한 이유를 확인할 수 있습니다.
              이를 통해 텍스트 최적화의 원리를 이해하고 더 나은 글쓰기 능력을 기를 수 있습니다.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-700 mb-2">텍스트 분석 시각화</h3>
            <p className="text-gray-600">
              가독성, 전문성, 명확성 등 다양한 측면에서 텍스트 품질을 분석하고, 이를 직관적인 
              차트와 그래프로 시각화합니다.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <Link to="/editor" className="btn-primary px-8 py-3">
          지금 시작하기
        </Link>
      </div>
    </div>
  );
};

export default AboutPage; 