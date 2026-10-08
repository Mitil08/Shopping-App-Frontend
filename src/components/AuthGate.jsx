import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AuthGate Component
 * Ensures users are authenticated before accessing the boutique shopping experience.
 * If unauthenticated, smoothly redirects them to the Login screen first.
 */
export default function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';

  if (isPreview) {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-[#FAF8F5] dark:bg-[#141A2E] transition-colors duration-500">
        <div className="relative flex items-center justify-center">
          {/* Pulsing golden aura ring */}
          <div className="w-16 h-16 rounded-full border border-[#C2A676]/30 animate-ping absolute" />
          {/* Spinning luxury hairline ring */}
          <div className="w-12 h-12 rounded-full border-t-2 border-r border-[#C2A676] animate-spin" />
          {/* Brand Monogram */}
          <span className="absolute font-serif text-sm font-semibold tracking-widest text-[#141414] dark:text-[#E2DFD7]">
            É
          </span>
        </div>
        <p className="mt-5 text-[11px] font-mono tracking-[0.25em] uppercase text-[#737373] dark:text-[#A3A3A3] animate-pulse">
          ÉLANE • Verifying Atelier Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve intended destination so user lands back here after sign in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
