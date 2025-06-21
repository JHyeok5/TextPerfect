import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Button, LoadingSpinner } from '../common';
import SocialLogin from './SocialLogin';

// 환경별 로깅 함수
const logDebug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const logError = (...args) => {
  console.error(...args);
};

export default function LoginForm({ onClose, onSwitchToSignup, onSwitchToForgotPassword }) {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logDebug('Login form submitted', { email: formData.email, password: '***' });
    setError('');
    setLoading(true);

    try {
      logDebug('Calling loginUser API...');
      await login(formData.email, formData.password);
      logDebug('Login API result: success');
      
      // 모달 닫기
      if (onClose) onClose();
    } catch (err) {
      logError('Login error:', err);
      setError(err.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLoginSuccess = (userData) => {
    // 소셜 로그인 성공 시 처리
    onClose();
  };

  const handleSocialLoginError = (error) => {
    setError(error);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? <LoadingSpinner size="sm" /> : '로그인'}
        </Button>
      </form>

      {/* 소셜 로그인 */}
      <SocialLogin 
        onSuccess={handleSocialLoginSuccess}
        onError={handleSocialLoginError}
      />

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={onSwitchToForgotPassword}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          비밀번호를 잊으셨나요?
        </button>
        
        <div className="text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
} 