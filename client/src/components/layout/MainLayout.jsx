import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { CommandPalette } from '@/components/search/CommandPalette';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <CommandPalette />
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </>
  );
}
