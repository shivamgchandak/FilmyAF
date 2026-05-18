import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth.js';
import { logout } from '../../redux/slices/authSlice.js';

const navClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg transition-colors ${
    isActive ? 'bg-white/10 text-bolly-saffron' : 'text-bolly-paper/80 hover:text-bolly-saffron'
  }`;

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-lg bg-bolly-ink/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="heading text-3xl tracking-wider">
          <span className="text-bolly-paper">Filmy</span>
          <span className="text-bolly-red">AF</span>
          <span className="text-xl ml-1">🎬</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={navClass}>Feed</NavLink>
          <NavLink to="/generate" className={navClass}>Generate</NavLink>
          <NavLink to="/history" className={navClass}>History</NavLink>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to={`/profile/${user?.username}`}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span>{user?.avatarEmoji || '🎬'}</span>
                <span className="text-sm font-medium">{user?.firstName}</span>
              </Link>
              <button onClick={onLogout} className="btn-ghost text-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/signup" className="btn-primary text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex justify-around border-t border-white/5 py-1">
        <NavLink to="/" end className={navClass}>Feed</NavLink>
        <NavLink to="/generate" className={navClass}>Generate</NavLink>
        <NavLink to="/history" className={navClass}>History</NavLink>
      </div>
    </nav>
  );
}
