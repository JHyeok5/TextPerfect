import React from 'react';
import { useUser } from '../contexts/UserContext';
import { Header, Footer, Card, Button, ProgressBar } from '../components/common';

export default function ProfilePage() {
  const { user, isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <Header title="프로필" />
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">로그인이 필요합니다.</p>
          <Button variant="primary">로그인하기</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Header 
        title="프로필" 
        subtitle="계정 정보와 활동 현황을 확인하세요." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 기본 정보 */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <input 
                  type="text" 
                  value={user?.nickname || ''} 
                  className="w-full p-2 border rounded-md" 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  className="w-full p-2 border rounded-md" 
                  readOnly 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                <input 
                  type="text" 
                  value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : ''} 
                  className="w-full p-2 border rounded-md" 
                  readOnly 
                />
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="primary">정보 수정</Button>
              <Button variant="secondary">비밀번호 변경</Button>
            </div>
          </div>
        </Card>

        {/* 레벨 정보 */}
        <Card>
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">레벨 정보</h3>
            <div className="mb-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">Lv.{user?.level || 1}</div>
              <div className="text-sm text-gray-600">{user?.nickname || 'User'}</div>
            </div>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">경험치</div>
              <ProgressBar value={user?.exp || 0} max={1000} />
              <div className="text-xs text-gray-500 mt-1">
                {user?.exp || 0} / 1000 XP
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <div>다음 레벨까지 {1000 - (user?.exp || 0)}XP</div>
            </div>
          </div>
        </Card>

        {/* 활동 통계 */}
        <Card className="lg:col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">활동 통계</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{user?.stats?.optimizedDocs || 0}</div>
                <div className="text-sm text-gray-600">최적화한 문서</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{user?.stats?.improvedSentences || 0}</div>
                <div className="text-sm text-gray-600">개선한 문장</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{user?.stats?.avgImprovement || 0}%</div>
                <div className="text-sm text-gray-600">평균 개선도</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{user?.stats?.consecutiveDays || 0}</div>
                <div className="text-sm text-gray-600">연속 사용일</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
} 