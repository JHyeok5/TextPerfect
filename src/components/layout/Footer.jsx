import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 text-center py-4 text-sm text-gray-500">
      &copy; {new Date().getFullYear()} TextPerfect. All rights reserved.
    </footer>
  );
} 