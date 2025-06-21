import React, { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { AppProvider } from './contexts/AppContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { TextContextProvider } from './contexts/TextContext';
import Layout from './components/layout/Layout';
import { LoadingSpinner } from './components/common';
import UsageLimitModal from './components/common/UsageLimitModal';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PWA Utils
import { registerServiceWorker, handleInstallPrompt } from './utils/pwa';

// 라우트 기반 코드 스플리팅
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
const AnalysisPage = React.lazy(() => import('./pages/AnalysisPage'));
const TemplatesPage = React.lazy(() => import('./pages/TemplatesPage'));
const CoachingPage = React.lazy(() => import('./pages/CoachingPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const SubscriptionPage = React.lazy(() => import('./pages/SubscriptionPage'));
const SubscriptionSuccessPage = React.lazy(() => import('./pages/SubscriptionSuccessPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const HistoryPage = React.lazy(() => import('./pages/HistoryPage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try refreshing the page.</div>;
    }
    return this.props.children;
  }
}

// 로딩 컴포넌트
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner />
  </div>
);

function App() {
  useEffect(() => {
    // PWA 초기화
    const initializePWA = () => {
      try {
        // 서비스 워커 등록
        registerServiceWorker();
        
        // 앱 설치 프롬프트 처리
        handleInstallPrompt();
        
        console.log('PWA initialized successfully');
      } catch (error) {
        console.error('PWA initialization failed:', error);
      }
    };

    initializePWA();
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <UserProvider>
          <AnalyticsProvider>
            <TextContextProvider>
              <Layout>
                <Suspense fallback={<PageLoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/analysis" element={<AnalysisPage />} />
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/coaching" element={<CoachingPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
                <UsageLimitModal />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </Layout>
            </TextContextProvider>
          </AnalyticsProvider>
        </UserProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App; 