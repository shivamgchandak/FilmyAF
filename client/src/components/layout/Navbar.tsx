import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../hooks/useTheme';
import { useTakes } from '../../hooks/useTakes';
import { logout } from '../../redux/slices/authSlice.js';
import TakesCounter from '../ui/TakesCounter';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  ['mono-label transition-colors', isActive ? 'text-[var(--t1)]' : 'text-[var(--t3)] hover:text-[var(--t1)]'].join(' ');

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggle } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { balance, known, anonymous } = useTakes();

  const onLogout = () => {
    dispatch(logout());
    setAvatarOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)]" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-baseline gap-1">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.01em', lineHeight: 1 }} className="text-[var(--t1)]">
            FILMY
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.01em', lineHeight: 1 }} className="text-[#D6294B]">
            AF
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>Browse</NavLink>
          <NavLink to="/generate" className={linkClass}>Generate</NavLink>
          <NavLink to="/history" className={linkClass}>My Scripts</NavLink>
        </div>

        <div className="flex items-center gap-3">
          {/* The icon shows the destination, not the current state: in the
              dark theme you see a sun, because that is what clicking gets you. */}
          <button
            onClick={toggle}
            title={isDark ? 'Light mode' : 'Dark mode'}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="hidden md:flex items-center justify-center w-7 h-7 border border-[var(--border)] rounded-[2px] text-[var(--t3)] hover:text-[var(--t1)] hover:border-[var(--border-strong)] transition-colors"
          >
            <Icon name={isDark ? 'sun' : 'moon'} size={14} />
          </button>

          {isAuthenticated ? (
            <>
              {known && (
                <Link
                  to="/generate"
                  title="Takes left. Tap to spend some"
                  className="inline-flex items-center px-2 py-1 border border-[var(--border)] rounded-[2px] hover:border-[var(--border-strong)] transition-colors"
                >
                  <TakesCounter remaining={balance!} anonymous={anonymous} compact />
                </Link>
              )}
              <div className="relative">
                <button onClick={() => setAvatarOpen((v) => !v)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                  <Avatar
                    emoji={user?.avatarEmoji}
                    handle={user?.username}
                    name={[user?.firstName, user?.lastName].filter(Boolean).join(' ')}
                    size="sm"
                  />
                </button>

                {avatarOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 border border-[var(--border-strong)] rounded-[2px] bg-[var(--bg)] shadow-[var(--shadow-md)] z-50"
                    onMouseLeave={() => setAvatarOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="mono-label text-[var(--t1)]">{[user?.firstName, user?.lastName].filter(Boolean).join(' ')}</p>
                      <p className="body-sm text-[var(--t3)] mt-0.5">@{user?.username}</p>
                    </div>
                    <div className="py-1">
                      <Link to={`/profile/${user?.username}`} onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 mono-label text-[var(--t2)] hover:bg-[var(--surface)] hover:text-[var(--t1)] transition-colors">
                        Profile
                      </Link>
                      <Link to="/history" onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 mono-label text-[var(--t2)] hover:bg-[var(--surface)] hover:text-[var(--t1)] transition-colors">
                        My Scripts
                      </Link>
                      <Link to="/generate" onClick={() => setAvatarOpen(false)} className="block px-4 py-2.5 mono-label text-[var(--t2)] hover:bg-[var(--surface)] hover:text-[var(--t1)] transition-colors">
                        Generate
                      </Link>
                    </div>
                    <div className="border-t border-[var(--border)] py-1">
                      <button onClick={onLogout} className="w-full text-left px-4 py-2.5 mono-label text-[#D6294B] hover:bg-[var(--accent-sub)] transition-colors">
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:block mono-label text-[var(--t2)] hover:text-[var(--t1)] transition-colors">
                Log in
              </Link>
              <Button size="sm" onClick={() => navigate('/signup')}>Sign up</Button>
            </>
          )}

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-[var(--t2)] hover:text-[var(--t1)] w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-[2px] transition-colors"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={15} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="px-6 py-4 flex flex-col gap-4">
            <NavLink to="/" end onClick={() => setMenuOpen(false)} className={linkClass}>Browse</NavLink>
            <NavLink to="/generate" onClick={() => setMenuOpen(false)} className={linkClass}>Generate</NavLink>
            <NavLink to="/history" onClick={() => setMenuOpen(false)} className={linkClass}>My Scripts</NavLink>
            {known && (
              <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                <span className="mono-label text-[var(--t3)]">Takes left</span>
                <TakesCounter remaining={balance!} anonymous={anonymous} />
              </div>
            )}
            <button onClick={toggle} className="flex items-center gap-2 text-left mono-label text-[var(--t2)]">
              <Icon name={isDark ? 'sun' : 'moon'} size={14} />
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
            {!isAuthenticated && (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="mono-label text-[var(--t2)]">Log in</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="mono-label text-[#D6294B]">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
