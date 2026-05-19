import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { user, token, authStatus } = useSelector((s) => s.auth);
  const location = useLocation();

  // Wait for the initial /auth/me check before deciding
  if (authStatus === 'loading' || authStatus === 'idle') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-bolly-paper/60 text-sm">
        Loading…
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return children;
}
