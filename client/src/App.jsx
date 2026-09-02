import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRouter from './router.jsx';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import { loadUserThunk } from './redux/slices/authSlice.js';
import { loadTakes, setBalance } from './redux/slices/takesSlice.js';
import { migrateLocalThunk, loadServerHistory } from './redux/slices/historySlice.js';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const authStatus = useSelector((s) => s.auth.authStatus);
  const migrated = useRef(false);

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  // Takes balance: fetched once the auth check settles (the answer differs for
  // a signed-in user and an anonymous device), then kept current by every paid
  // response without a refetch.
  useEffect(() => {
    if (authStatus === 'ready') dispatch(loadTakes());
  }, [authStatus, user, dispatch]);

  useEffect(() => {
    const onTakes = (e) => dispatch(setBalance(e.detail));
    window.addEventListener('filmyaf:takes', onTakes);
    return () => window.removeEventListener('filmyaf:takes', onTakes);
  }, [dispatch]);

  useEffect(() => {
    if (authStatus === 'ready' && user && !migrated.current) {
      migrated.current = true;
      (async () => {
        await dispatch(migrateLocalThunk());
        dispatch(loadServerHistory());
      })();
    }
    if (!user) migrated.current = false;
  }, [authStatus, user, dispatch]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)' }}>
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
