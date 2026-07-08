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
const Pricing = React.lazy(() => import('@/pages/Pricing'));

// Placeholders for migrating features
const Challenges = React.lazy(() => import('@/features/challenges/Challenges'));
const ChallengeDetail = React.lazy(() => import('@/features/challenges/ChallengeDetail'));
const RecruiterDashboard = React.lazy(() => import('@/features/recruiter/RecruiterDashboard'));
const AIAdvisor = React.lazy(() => import('@/features/ai/AIAdvisor'));
const Projects = React.lazy(() => import('@/pages/Projects'));
const SkillTrees = React.lazy(() => import('@/pages/SkillTrees'));
const Leaderboard = React.lazy(() => import('@/pages/Leaderboard'));
const AdminChallenges = React.lazy(() => import('@/pages/AdminChallenges'));

// Skeletons
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';
import { ChallengeSkeleton } from '@/components/skeletons/ChallengeSkeleton';
import { PageSkeleton } from '@/components/skeletons/PageSkeleton';

import PageLoader from '@/components/ui/PageLoader';
import PageTransition from '@/components/layout/PageTransition';

export default function App() {
  const location = useLocation();
  const { loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <ErrorBoundary>
      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-primary)', borderRadius: 12 },
        duration: 3000,
      }} />
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageSkeleton />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Layout (No Sidebar) */}
            <Route element={<AuthLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Suspense fallback={<PageSkeleton />}><Pricing /></Suspense>} />
            </Route>

            {/* Main Layout (Navbar + Sidebar) */}
            <Route element={<MainLayout />}>
              {/* Protected Routes (Any logged in user) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><PageTransition><Dashboard /></PageTransition></Suspense>} />
                <Route path="/profile/:id" element={<Suspense fallback={<ProfileSkeleton />}><PageTransition><Profile /></PageTransition></Suspense>} />
                <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
                <Route path="/challenges" element={<Suspense fallback={<ChallengeSkeleton />}><PageTransition><Challenges /></PageTransition></Suspense>} />
                <Route path="/challenges/:slug" element={<Suspense fallback={<ChallengeSkeleton />}><PageTransition><ChallengeDetail /></PageTransition></Suspense>} />
                <Route path="/ai-advisor" element={<PageTransition><AIAdvisor /></PageTransition>} />
                <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
                <Route path="/skill-trees" element={<PageTransition><SkillTrees /></PageTransition>} />
                <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />

                {/* Recruiter Only Routes */}
                <Route element={<RoleRoute allowedRoles={['recruiter']} />}>
                  <Route path="/recruiter" element={<PageTransition><RecruiterDashboard /></PageTransition>} />
                  <Route path="/recruiter/talent" element={<PageTransition><RecruiterDashboard /></PageTransition>} />
                </Route>

                {/* Admin Only Routes */}
                <Route element={<RoleRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/challenges" element={<Suspense fallback={<PageSkeleton />}><PageTransition><AdminChallenges /></PageTransition></Suspense>} />
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
