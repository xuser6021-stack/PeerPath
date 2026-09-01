import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Skeleton from '../common/Skeleton';

/**
 * Wraps routes that require authentication.
 * - While auth state is loading, renders a full-page skeleton.
 * - If no user is authenticated, redirects to /login.
 * - Otherwise renders children.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-6 px-4">
        <Skeleton variant="rectangular" height={120} className="w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
        </div>
        <Skeleton variant="rectangular" height={200} className="w-full" />
        <Skeleton variant="rectangular" height={80} className="w-full" />
        <Skeleton variant="rectangular" height={80} className="w-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
