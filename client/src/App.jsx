import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import React, { Suspense } from 'react';

// Providers and Layouts
import { useAuth } from '@/context/AuthContext';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import MainLayout from '@/components/layout/MainLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import ProtectedRoute from '@/components/routing/ProtectedRoute';
import RoleRoute from '@/components/routing/RoleRoute';

// Lazy Loaded Pages
const Landing = React.lazy(() => import('@/pages/Landing'));
const Login = React.lazy(() => import('@/features/auth/Login'));
const Register = React.lazy(() => import('@/features/auth/Register'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const SettingsPage = React.lazy(() => import('@/features/settings/SettingsPage'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Placeholders for migrating features
const Challenges = React.lazy(() => import('@/features/challenges/Challenges'));
const ChallengeDetail = React.lazy(() => import('@/features/challenges/ChallengeDetail'));
const RecruiterDashboard = React.lazy(() => import('@/features/recruiter/RecruiterDashboard'));
const AIAdvisor = React.lazy(() => import('@/features/ai/AIAdvisor'));
const Projects = React.lazy(() => import('@/pages/Projects'));
const SkillTrees = React.lazy(() => import('@/pages/SkillTrees'));
const Leaderboard = React.lazy(() => import('@/pages/Leaderboard'));

// Skeletons
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';
import { ChallengeSkeleton } from '@/components/skeletons/ChallengeSkeleton';
// (FallbackLoader serves as the default for other pages)

import PageLoader from '@/components/ui/PageLoader';

const FallbackLoader = () => <PageLoader />;

export default function App() {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) return <FallbackLoader />;

  return (
    <ErrorBoundary>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: 12 },
        duration: 3000,
      }} />
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<FallbackLoader />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Layout (No Sidebar) */}
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Main Layout (Navbar + Sidebar) */}
            <Route element={<MainLayout />}>
              {/* Protected Routes (Any logged in user) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>} />
                <Route path="/profile/:id" element={<Suspense fallback={<ProfileSkeleton />}><Profile /></Suspense>} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/challenges" element={<Suspense fallback={<ChallengeSkeleton />}><Challenges /></Suspense>} />
                <Route path="/challenges/:slug" element={<Suspense fallback={<ChallengeSkeleton />}><ChallengeDetail /></Suspense>} />
                <Route path="/ai-advisor" element={<AIAdvisor />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skill-trees" element={<SkillTrees />} />
                <Route path="/leaderboard" element={<Leaderboard />} />

                {/* Recruiter Only Routes */}
                <Route element={<RoleRoute allowedRoles={['recruiter']} />}>
                  <Route path="/recruiter" element={<RecruiterDashboard />} />
                  <Route path="/recruiter/talent" element={<RecruiterDashboard />} />
                </Route>
              </Route>
            </Route>

            {/* 404 Not Found Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
