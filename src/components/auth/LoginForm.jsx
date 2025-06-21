import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button } from '../common';
import { loginUser } from '../../utils/api';

export default function LoginForm({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 실제 API 호출
      const result = await loginUser({ email, password });
      
      if (result.success) {
        // 토큰 저장
        localStorage.setItem('authToken', result.data.token);
        
        // UserContext를 통해 로그인 상태 업데이트
        login(result.data.user);
        
        // 모달 닫기
        if (onClose) onClose();
      } else {
        setError(result.message || '로그인에 실패했습니다.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일 주소</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="password"className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>
      
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </Button>
      
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>

      <div>
        {/* TODO: 소셜 로그인 버튼 구현 */}
        <Button variant="secondary" className="w-full">Google 계정으로 로그인</Button>
      </div>

      <div className="text-sm text-center">
        계정이 없으신가요?{' '}
        <button 
          type="button" 
          onClick={onSwitchToSignup}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          회원가입
        </button>
      </div>
    </form>
  );
} 