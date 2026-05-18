import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRouter from './router.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import { loadUserThunk } from './redux/slices/authSlice.js';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Revalidate any persisted token on mount
    dispatch(loadUserThunk());
  }, [dispatch]);

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
