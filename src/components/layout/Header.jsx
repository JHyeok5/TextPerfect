import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { ProgressBar, Button, Modal } from '../common';
import { LoginForm, SignupForm, ForgotPasswordForm } from '../auth';
import PWAInstallButton from '../common/PWAInstallButton';

// 환경별 로깅 함수
const logDebug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

// 더미 유저 정보 제거 (실제 인증 시스템 구현 완료)

export default function Header() {
  const { user, isAuthenticated, login, logout } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  const openLoginModal = () => {
    logDebug('Opening login modal');
    setIsSignupModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openSignupModal = () => {
    logDebug('Opening signup modal');
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const openForgotPasswordModal = () => {
    logDebug('Opening forgot password modal');
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
    setIsForgotPasswordModalOpen(true);
  };

  const handleLoginClick = () => {
    logDebug('Login button clicked');
    openLoginModal();
  };

  const handleSignupClick = () => {
    logDebug('Signup button clicked');
    openSignupModal();
  };

  return (
    <header className="bg-white shadow-sm flex items-center px-6 h-16 justify-between z-40">
      <div className="flex items-center gap-6">
        <Link to="/" className="font-bold text-xl text-blue-700">TextPerfect</Link>
        <nav className="hidden md:flex gap-4">
          <NavLink to="/" className={({isActive}) => `py-2 border-b-2 ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>대시보드</NavLink>
          <NavLink to="/editor" className={({isActive}) => `py-2 border-b-2 ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>에디터</NavLink>
          <NavLink to="/templates" className={({isActive}) => `py-2 border-b-2 ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>템플릿</NavLink>
          <NavLink to="/coaching" className={({isActive}) => `py-2 border-b-2 ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>AI 코치</NavLink>
          <NavLink to="/community" className={({isActive}) => `py-2 border-b-2 ${isActive ? 'text-blue-600 border-blue-600' : 'text-gray-600 border-transparent hover:text-blue-600'}`}>커뮤니티</NavLink>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <PWAInstallButton className="hidden sm:flex" />
        
        {isAuthenticated && user ? (
          <>
            <div className="hidden md:block text-sm text-gray-600 text-right">
              <div>Lv.{user.level} <span className="font-semibold">{user.nickname}</span></div>
              <ProgressBar value={user.exp} max={1000} />
            </div>
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-1">
                <div className="px-4 py-2 border-b">
                  <p className="font-bold">{user.nickname}</p>
                  <p className="text-sm text-gray-500">Lv.{user.level}</p>
                </div>
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">프로필</Link>
                <Link to="/history" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">분석 히스토리</Link>
                <Link to="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">구독 관리</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">로그아웃</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button onClick={handleLoginClick} variant="secondary">로그인</Button>
            <Button onClick={handleSignupClick} variant="primary">회원가입</Button>
          </div>
        )}
      </div>

      <Modal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="로그인">
        <LoginForm 
          onClose={() => setIsLoginModalOpen(false)} 
          onSwitchToSignup={openSignupModal}
          onSwitchToForgotPassword={openForgotPasswordModal}
        />
      </Modal>

      <Modal open={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} title="회원가입">
        <SignupForm 
          onClose={() => setIsSignupModalOpen(false)}
          onSwitchToLogin={openLoginModal}
        />
      </Modal>

      <Modal open={isForgotPasswordModalOpen} onClose={() => setIsForgotPasswordModalOpen(false)} title="비밀번호 찾기">
        <ForgotPasswordForm 
          onClose={() => setIsForgotPasswordModalOpen(false)}
          onBackToLogin={openLoginModal}
        />
      </Modal>
    </header>
  );
} 