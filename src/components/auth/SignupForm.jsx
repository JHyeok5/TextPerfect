import React, { useState } from 'react';
import { Button } from '../common';
import { useUser } from '../../contexts/UserContext';
import { signupUser } from '../../utils/api';

export default function SignupForm({ onClose, onSwitchToLogin }) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Signup form submitted', { nickname, email, password: '***' });
    setError('');
    setLoading(true);

    // 비밀번호 확인 체크
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      console.log('Calling signupUser API...');
      // 실제 API 호출
      const result = await signupUser({ 
        nickname, 
        email, 
        password,
        passwordConfirm 
      });
      console.log('Signup API result:', result);
      
      if (result.success) {
        // 토큰 저장
        localStorage.setItem('authToken', result.data.token);
        console.log('Token saved to localStorage');
        
        // 가입 성공 시, 자동 로그인 처리
        login(result.data.user);
        console.log('User context updated');
        
        // 모달 닫기
        if (onClose) onClose();
      } else {
        // 서버에서 반환한 에러 메시지 표시
        if (result.details && Array.isArray(result.details)) {
          setError(result.details.join(' '));
        } else {
          setError(result.message || '회원가입에 실패했습니다.');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
      
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">닉네임</label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700">이메일 주소</label>
        <input
          type="email"
          id="email-signup"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          type="password"
          id="password-signup"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
        <input
          type="password"
          id="password-confirm"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? '가입 중...' : '가입하기'}
      </Button>

      <div className="text-sm text-center">
        이미 계정이 있으신가요?{' '}
        <button 
          type="button" 
          onClick={onSwitchToLogin}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          로그인
        </button>
      </div>
    </form>
  );
} 