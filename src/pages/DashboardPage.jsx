import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/common';
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import SparklesIcon from '@heroicons/react/24/outline/SparklesIcon';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow transition hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function DashboardPage() {
  const { user } = useUser();

  const features = [
    {
      icon: <SparklesIcon className="h-6 w-6" />,
      title: 'AI 기반 텍스트 최적화',
      description: '클로드 3.5 Sonnet AI가 당신의 글을 더 명확하고, 전문적이며, 매력적으로 만듭니다.',
    },
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: '전후 성능 비교 분석',
      description: '최적화 이전과 이후의 가독성, 전문성, 명확성 점수를 한눈에 비교하여 개선점을 확인하세요.',
    },
    {
      icon: <PencilSquareIcon className="h-6 w-6" />,
      title: '다양한 목적의 글쓰기',
      description: '학술, 비즈니스, 기술 등 글의 목적에 맞게 톤과 스타일을 자유자재로 조절할 수 있습니다.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center bg-gray-50 p-8 rounded-lg">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">AI와 함께, 당신의 글을</span>
          <span className="block text-blue-600">완벽하게</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          TextPerfect는 최신 AI 기술을 활용하여 당신의 아이디어가 담긴 글을 한 단계 위로 끌어올리는 최고의 파트너입니다.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link to="/editor">
              <Button variant="primary" size="lg">
                지금 바로 시작하기 <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-6">핵심 기능</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
} 