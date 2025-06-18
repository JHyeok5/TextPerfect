import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { AppProvider } from './contexts/AppContext';
import { AnalyticsProvider } from './contexts/AnalyticsContext';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import AnalysisPage from './pages/AnalysisPage';
import TemplatesPage from './pages/TemplatesPage';
import CoachingPage from './pages/CoachingPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import UsageLimitModal from './components/UsageLimitModal';
import { useTextContext } from './context/TextContext';

function App() {
  const { error } = useTextContext();

  return (
    <UserProvider>
      <AppProvider>
        <AnalyticsProvider>
          <Router>
            <Layout>
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/editor" element={<EditorPage />} />
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/coaching" element={<CoachingPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/subscription" element={<SubscriptionPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </Layout>
          </Router>
        </AnalyticsProvider>
      </AppProvider>
      
      {error && error.includes('일일 사용량 한도') && <UsageLimitModal />}
    </UserProvider>
  );
}

export default App; 