import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/search/CommandPalette';
import FloatingChatbot from '@/components/ui/FloatingChatbot';
import { useState } from 'react';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <CommandPalette />
      <div className="app-layout">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className={`app-main ${['/', '/login', '/register'].includes(location.pathname) ? 'no-sidebar' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Global AI Assistant */}
      <FloatingChatbot />
    </>
  );
}
