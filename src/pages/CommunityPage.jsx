import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Card, Button, Modal, LoadingSpinner } from '../components/common';
import { toast } from 'react-toastify';

const CommunityPage = () => {
  const { user, isAuthenticated } = useUser();
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareContent, setShareContent] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadCommunityData();
    }
  }, [isAuthenticated]);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      
      // 병렬로 데이터 로드
      const [challengesRes, leaderboardRes, statsRes] = await Promise.all([
        fetch('/.netlify/functions/get-challenges'),
        fetch('/.netlify/functions/get-leaderboard'),
        fetch('/.netlify/functions/get-user-stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      ]);

      if (challengesRes.ok) {
        const challengesData = await challengesRes.json();
        setChallenges(challengesData.challenges || []);
      }

      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json();
        setLeaderboard(leaderboardData.leaderboard || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setUserStats(statsData.stats || null);
      }
    } catch (error) {
      console.error('Failed to load community data:', error);
      toast.error('커뮤니티 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      const response = await fetch('/.netlify/functions/join-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ challengeId })
      });

      if (response.ok) {
        toast.success('챌린지에 참여했습니다!');
        loadCommunityData();
      } else {
        toast.error('챌린지 참여에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to join challenge:', error);
      toast.error('챌린지 참여 중 오류가 발생했습니다.');
    }
  };

  const shareAnalysis = async () => {
    try {
      const response = await fetch('/.netlify/functions/share-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          content: shareContent,
          type: 'achievement'
        })
      });

      if (response.ok) {
        toast.success('분석 결과를 공유했습니다!');
        setShowShareModal(false);
        setShareContent('');
      } else {
        toast.error('공유에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to share analysis:', error);
      toast.error('공유 중 오류가 발생했습니다.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            커뮤니티 참여하기
          </h2>
          <p className="text-gray-600 mb-6">
            로그인하여 글쓰기 챌린지에 참여하고 다른 사용자들과 경쟁해보세요!
          </p>
          <Button variant="primary">로그인하기</Button>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* 헤더 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          TextPerfect 커뮤니티
        </h1>
        <p className="text-gray-600">
          함께 글쓰기 실력을 향상시키고 성과를 공유해보세요
        </p>
      </div>

      {/* 사용자 통계 */}
      {userStats && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.documentsThisMonth}</div>
              <div className="text-blue-100">이번 달 문서</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.averageScore}점</div>
              <div className="text-blue-100">평균 점수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">#{userStats.rank}</div>
              <div className="text-blue-100">전체 순위</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.badges}</div>
              <div className="text-blue-100">획득 배지</div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 현재 챌린지 */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                🏆 현재 진행 중인 챌린지
              </h2>
              <Button 
                variant="outline"
                onClick={() => setShowShareModal(true)}
              >
                성과 공유하기
              </Button>
            </div>

            <div className="space-y-4">
              {challenges.length > 0 ? challenges.map((challenge) => (
                <div key={challenge.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {challenge.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>참여자: {challenge.participants}명</span>
                        <span>기간: {challenge.duration}</span>
                        <span>보상: {challenge.reward}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {challenge.joined ? (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          참여 중
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => joinChallenge(challenge.id)}
                        >
                          참여하기
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {challenge.joined && challenge.progress && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>진행률</span>
                        <span>{challenge.progress.current}/{challenge.progress.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(challenge.progress.current / challenge.progress.target) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  현재 진행 중인 챌린지가 없습니다.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* 리더보드 */}
        <div>
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              🥇 이번 달 리더보드
            </h2>

            <div className="space-y-3">
              {leaderboard.length > 0 ? leaderboard.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {user.nickname}
                      {user.id === user?.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          나
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.documents}개 문서 • 평균 {user.averageScore}점
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-800">{user.totalScore}점</div>
                    {index < 3 && (
                      <div className="text-xs text-orange-600">🏆 배지 획득</div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  리더보드 데이터가 없습니다.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 공유 모달 */}
      <Modal 
        open={showShareModal} 
        onClose={() => setShowShareModal(false)}
        title="성과 공유하기"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              공유할 내용을 작성해주세요
            </label>
            <textarea
              value={shareContent}
              onChange={(e) => setShareContent(e.target.value)}
              placeholder="오늘의 글쓰기 성과나 팁을 공유해보세요..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowShareModal(false)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={shareAnalysis}
              disabled={!shareContent.trim()}
            >
              공유하기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CommunityPage; 