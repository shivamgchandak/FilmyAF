import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './router.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import { loadUserThunk } from './redux/slices/authSlice.js';
import { migrateLocalThunk, loadServerHistory } from './redux/slices/historySlice.js';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const authStatus = useSelector((s) => s.auth.authStatus);
  const migrated = useRef(false);

  // Revalidate any persisted token on mount
  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  // The moment we have a user (fresh login OR resumed session), try to
  // migrate any anonymous local history into the account, then load
  // the server history. Only do this once per session.
  useEffect(() => {
    if (authStatus === 'ready' && user && !migrated.current) {
      migrated.current = true;
      (async () => {
        await dispatch(migrateLocalThunk());
        dispatch(loadServerHistory());
      })();
    }
    if (!user) {
      migrated.current = false;
    }
  }, [authStatus, user, dispatch]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
