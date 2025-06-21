import React, { useState } from 'react';
import { Button } from '../common';
import { toast } from 'react-toastify';

export default function ForgotPasswordForm({ onClose, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 임시 비밀번호 찾기 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 실제 구현에서는 여기서 비밀번호 재설정 이메일 발송 API 호출
      setSent(true);
      toast.success('비밀번호 재설정 링크가 이메일로 발송되었습니다.');
      
    } catch (error) {
      toast.error('이메일 발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="text-green-600 text-6xl mb-4">✉️</div>
        <h3 className="text-lg font-semibold text-gray-900">이메일을 확인해주세요</h3>
        <p className="text-gray-600 mb-6">
          <strong>{email}</strong>로 비밀번호 재설정 링크를 발송했습니다.
          <br />
          이메일을 확인하고 링크를 클릭하여 새 비밀번호를 설정해주세요.
        </p>
        <div className="space-y-3">
          <Button 
            variant="primary" 
            className="w-full"
            onClick={onClose}
          >
            확인
          </Button>
          <button 
            type="button" 
            onClick={onBackToLogin}
            className="w-full text-sm text-blue-600 hover:text-blue-500"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">비밀번호 찾기</h3>
        <p className="text-gray-600 text-sm">
          가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>
      
      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">이메일 주소</label>
        <input
          type="email"
          id="reset-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="가입하신 이메일을 입력하세요"
        />
      </div>
      
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? '발송 중...' : '비밀번호 재설정 링크 발송'}
      </Button>
      
      <div className="text-center">
        <button 
          type="button" 
          onClick={onBackToLogin}
          className="text-sm text-gray-600 hover:text-gray-500"
        >
          ← 로그인으로 돌아가기
        </button>
      </div>
    </form>
  );
} 