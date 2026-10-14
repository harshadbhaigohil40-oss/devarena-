import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/search/CommandPalette';
import FloatingChatbot from '@/components/ui/FloatingChatbot';
import { useState, useEffect } from 'react';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open to prevent background scrolling
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <CommandPalette />
      <div className="app-layout">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className={`app-main ${['/', '/login', '/register', '/pricing'].includes(location.pathname) ? 'no-sidebar' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Global AI Assistant */}
      <FloatingChatbot />
    </>
  );
}
