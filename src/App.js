import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import UsageLimitModal from './components/UsageLimitModal';
import { useTextContext } from './context/TextContext';

function App() {
  const { error } = useTextContext();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      
      {error && error.includes('일일 사용량 한도') && <UsageLimitModal />}
    </div>
  );
}

export default App; 