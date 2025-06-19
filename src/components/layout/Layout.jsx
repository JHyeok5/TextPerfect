import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 container mx-auto px-4 py-8 bg-gray-50">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
} 