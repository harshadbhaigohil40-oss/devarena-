import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/search/CommandPalette';
import { useState } from 'react';

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Navbar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <CommandPalette />
      <div className="app-layout">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}
    </>
  );
}
