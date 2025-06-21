import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import Layout from '../components/layout/Layout';
import { Card, Button, ProgressBar, Modal, LoadingSpinner } from '../components/common';
import { toast } from 'react-toastify';

// 프로필 편집 모달 컴포넌트
const ProfileEditModal = ({ isOpen, onClose, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    nickname: user?.nickname || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: API 호출로 프로필 업데이트
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      toast.success('프로필이 성공적으로 업데이트되었습니다.');
      onUpdate(formData);
      onClose();
    } catch (error) {
      toast.error('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="프로필 편집">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            닉네임
          </label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? <LoadingSpinner size="sm" /> : '저장'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            취소
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// 비밀번호 변경 모달 컴포넌트
const PasswordChangeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: API 호출로 비밀번호 변경
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      
      toast.success('비밀번호가 성공적으로 변경되었습니다.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      onClose();
    } catch (error) {
      toast.error('비밀번호 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="비밀번호 변경">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            현재 비밀번호
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            새 비밀번호
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={8}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength={8}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="flex-1"
          >
            {loading ? <LoadingSpinner size="sm" /> : '변경'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            취소
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(user);

  // 사용자 정보 업데이트 핸들러
  const handleProfileUpdate = (updatedInfo) => {
    setUserInfo({ ...userInfo, ...updatedInfo });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
            <p className="text-gray-600 mb-6">프로필을 보려면 먼저 로그인해주세요.</p>
            <Button variant="primary">로그인하기</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentUser = userInfo || user;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">프로필</h1>
          <p className="text-gray-600">계정 정보와 활동 현황을 확인하고 관리하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 기본 정보 */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">기본 정보</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  편집
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                  <div className="p-3 bg-gray-50 border rounded-md">
                    {currentUser?.nickname || '설정되지 않음'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <div className="p-3 bg-gray-50 border rounded-md">
                    {currentUser?.email || '설정되지 않음'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                  <div className="p-3 bg-gray-50 border rounded-md">
                    {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '정보 없음'}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-medium text-gray-900 mb-4">보안</h4>
                <Button 
                  variant="secondary"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  비밀번호 변경
                </Button>
              </div>
            </div>
          </Card>

          {/* 레벨 정보 */}
          <Card>
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">레벨 정보</h3>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  Lv.{currentUser?.level || 1}
                </div>
                <div className="text-gray-600">{currentUser?.nickname || '사용자'}</div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">경험치</div>
                <ProgressBar value={currentUser?.exp || 0} max={1000} />
                <div className="text-xs text-gray-500 mt-1">
                  {currentUser?.exp || 0} / 1000 XP
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <div>다음 레벨까지 {1000 - (currentUser?.exp || 0)}XP</div>
              </div>
            </div>
          </Card>

          {/* 활동 통계 */}
          <Card className="lg:col-span-3">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">활동 통계</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {currentUser?.stats?.optimizedDocs || 0}
                  </div>
                  <div className="text-sm text-gray-600">최적화한 문서</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {currentUser?.stats?.improvedSentences || 0}
                  </div>
                  <div className="text-sm text-gray-600">개선한 문장</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {currentUser?.stats?.avgImprovement || 0}%
                  </div>
                  <div className="text-sm text-gray-600">평균 개선도</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {currentUser?.stats?.consecutiveDays || 0}
                  </div>
                  <div className="text-sm text-gray-600">연속 사용일</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 모달들 */}
        <ProfileEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={currentUser}
          onUpdate={handleProfileUpdate}
        />

        <PasswordChangeModal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      </div>
    </Layout>
  );
} 