import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { AppProvider } from './contexts/AppContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import { TextContextProvider } from './contexts/TextContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import AnalysisPage from './pages/AnalysisPage';
import TemplatesPage from './pages/TemplatesPage';
import CoachingPage from './pages/CoachingPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import UsageLimitModal from './components/common/UsageLimitModal';

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

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <UserProvider>
          <AnalyticsProvider>
            <TextContextProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/editor" element={<EditorPage />} />
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/coaching" element={<CoachingPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                </Routes>
                <UsageLimitModal />
              </Layout>
            </TextContextProvider>
          </AnalyticsProvider>
        </UserProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App; 