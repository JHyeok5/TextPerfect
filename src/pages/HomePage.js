import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            목적에 맞는 텍스트 최적화
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            TextPerfect는 Claude AI 기술을 활용하여 어떤 상황에든 최적화된 텍스트를 제공합니다. 
            학술, 비즈니스, 기술 문서까지 모든 텍스트를 더 효과적으로 만들어 보세요.
          </p>
          <Link to="/editor" className="btn-primary text-lg px-8 py-3">
            지금 시작하기
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            주요 기능
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                목적별 최적화
              </h3>
              <p className="text-gray-600">
                학술, 비즈니스, 기술, 일반 등 다양한 목적에 맞는 텍스트 최적화를 제공합니다.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                상세 분석
              </h3>
              <p className="text-gray-600">
                가독성, 전문성, 명확성 등 텍스트 품질을 다각도로 분석하고 시각화합니다.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                변경 사항 비교
              </h3>
              <p className="text-gray-600">
                원문과 최적화된 텍스트를 비교하여 각 변경 사항의 이유를 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            이용 방법
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                텍스트 입력
              </h3>
              <p className="text-gray-600 text-center">
                최적화하려는 텍스트를 입력하고 목적과 세부 옵션을 선택합니다.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                AI 최적화
              </h3>
              <p className="text-gray-600 text-center">
                Claude AI가 선택한 목적과 옵션에 맞게 텍스트를 분석하고 최적화합니다.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                결과 확인
              </h3>
              <p className="text-gray-600 text-center">
                최적화된 텍스트와 상세 분석 결과를 확인하고 필요한 형식으로 저장합니다.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/editor" className="btn-primary">
              무료로 시작하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 