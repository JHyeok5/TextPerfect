import React, { useState } from 'react';
import { Header, Footer, Card, Button, ProgressBar } from '../components/common';

export default function CoachingPage() {
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  const levels = [
    { id: 'beginner', name: '초급', description: '글쓰기 기초부터 차근차근' },
    { id: 'intermediate', name: '중급', description: '논리적 구성과 표현력 향상' },
    { id: 'advanced', name: '고급', description: '전문적 글쓰기와 스타일 완성' },
  ];

  const coachingPrograms = [
    {
      id: 1,
      title: '논리적 글쓰기 기초',
      level: 'beginner',
      duration: '4주',
      progress: 0,
      description: '논리적이고 명확한 글쓰기의 기본 원칙을 배웁니다.',
      lessons: [
        '글의 구조 이해하기',
        '주제 문장 작성법',
        '논리적 전개 방법',
        '결론 도출하기'
      ]
    },
    {
      id: 2,
      title: '비즈니스 글쓰기 마스터',
      level: 'intermediate',
      duration: '6주',
      progress: 30,
      description: '업무에 필요한 다양한 비즈니스 문서 작성법을 익힙니다.',
      lessons: [
        '이메일 작성법',
        '보고서 구조화',
        '제안서 작성',
        '프레젠테이션 스크립트'
      ]
    },
    {
      id: 3,
      title: '창작 글쓰기 워크샵',
      level: 'advanced',
      duration: '8주',
      progress: 75,
      description: '창의적이고 매력적인 글쓰기 기법을 마스터합니다.',
      lessons: [
        '캐릭터 개발',
        '플롯 구성',
        '문체와 톤',
        '독자 몰입 기법'
      ]
    }
  ];

  const filteredPrograms = coachingPrograms.filter(
    program => program.level === selectedLevel
  );

  const dailyTips = [
    {
      title: '오늘의 글쓰기 팁',
      content: '첫 문장은 독자의 관심을 끌 수 있도록 간결하고 강렬하게 작성하세요.',
      category: '구조'
    },
    {
      title: '어휘 개선 제안',
      content: '"매우"라는 부사 대신 더 구체적인 형용사를 사용해보세요.',
      category: '어휘'
    },
    {
      title: '문법 포인트',
      content: '긴 문장은 두 개의 짧은 문장으로 나누면 가독성이 향상됩니다.',
      category: '문법'
    }
  ];

  const coachingTips = [
    {
      id: 1,
      title: '명확한 문장 구조 만들기',
      description: '주어, 서술어, 목적어를 명확히 하여 읽기 쉬운 문장을 작성하세요.',
      level: 'beginner',
      progress: 85
    },
    {
      id: 2,
      title: '전문 용어 적절히 사용하기',
      description: '독자의 수준에 맞는 전문 용어를 선택하여 이해도를 높이세요.',
      level: 'intermediate',
      progress: 60
    },
    {
      id: 3,
      title: '논리적 흐름 구성하기',
      description: '아이디어 간의 연결을 명확히 하여 설득력 있는 글을 작성하세요.',
      level: 'advanced',
      progress: 30
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level) => {
    switch (level) {
      case 'beginner': return '초급';
      case 'intermediate': return '중급';
      case 'advanced': return '고급';
      default: return '기본';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Header 
        title="AI 글쓰기 코치" 
        subtitle="개인 맞춤형 글쓰기 훈련으로 실력을 향상시켜보세요." 
      />

      {/* 레벨 선택 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">학습 레벨 선택</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map(level => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedLevel === level.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-lg">{level.name}</h3>
              <p className="text-gray-600 text-sm">{level.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 코칭 프로그램 */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-6">추천 코칭 프로그램</h2>
          <div className="space-y-6">
            {filteredPrograms.map(program => (
              <Card key={program.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{program.title}</h3>
                    <p className="text-gray-600 text-sm">{program.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {program.duration}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>진행률</span>
                    <span>{program.progress}%</span>
                  </div>
                  <ProgressBar value={program.progress} max={100} />
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">커리큘럼</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {program.lessons.map((lesson, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    {program.progress > 0 ? '계속하기' : '시작하기'}
                  </Button>
                  <Button variant="outline">
                    상세보기
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 오늘의 팁 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">오늘의 글쓰기 가이드</h3>
            <div className="space-y-4">
              {dailyTips.map((tip, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {tip.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{tip.content}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* 학습 통계 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">나의 학습 현황</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">완료한 레슨</span>
                <span className="font-semibold">12/24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">학습 시간</span>
                <span className="font-semibold">18시간</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">연속 학습일</span>
                <span className="font-semibold">7일</span>
              </div>
            </div>
          </Card>

          {/* 개인 맞춤 추천 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">맞춤 추천</h3>
            <p className="text-sm text-gray-600 mb-3">
              최근 작성한 글을 분석한 결과, 문단 구성 연습이 필요해 보입니다.
            </p>
            <Button variant="primary" size="sm" className="w-full">
              맞춤 연습 시작
            </Button>
          </Card>
        </div>
      </div>

      {/* 전체 진행도 */}
      <Card className="mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">전체 학습 진행도</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <ProgressBar value={58} max={100} />
            </div>
            <div className="text-sm text-gray-600">58% 완료</div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            3개 중 1개 코스 완료 • 다음 목표: 중급 과정 60% 달성
          </div>
        </div>
      </Card>

      {/* 코칭 팁 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {coachingTips.map(tip => (
          <Card key={tip.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900">{tip.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(tip.level)}`}>
                  {getLevelText(tip.level)}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {tip.description}
              </p>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">진행도</span>
                  <span className="text-sm font-semibold">{tip.progress}%</span>
                </div>
                <ProgressBar value={tip.progress} max={100} />
              </div>
              <Button variant="primary" size="sm" className="w-full">
                학습 계속하기
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* AI 피드백 섹션 */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">최근 AI 피드백</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">2시간 전</div>
                  <p className="text-gray-800">
                    "최근 작성하신 문서에서 문장의 길이가 일정하게 유지되어 읽기 좋았습니다. 
                    다음에는 연결어를 더 다양하게 사용해보시면 글의 흐름이 더욱 자연스러워질 것 같아요."
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600 mb-1">1일 전</div>
                  <p className="text-gray-800">
                    "전문 용어 사용이 적절했습니다! 독자가 이해하기 쉽도록 설명을 추가하신 부분이 특히 좋았어요."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Footer />
    </div>
  );
} 