import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  PlusCircle,
  TrendingUp,
  Users,
  User,
  Home,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  LogIn,
  LogOut,
  Layers
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useTheme } from '../../context/useTheme';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Derive a display name from the user's email or user_metadata
  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.username ||
    (user?.email ? user.email.split('@')[0] : '');

  const handleSignOut = async () => {
    try {
      await signOut();
      toast('Logged out of session', { icon: '👋' });
      navigate('/login');
    } catch (err) {
      toast.error(err.message ?? 'Sign out failed');
    }
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Create', path: '/create', icon: PlusCircle },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary-500 selection:text-white transition-colors duration-200">
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-900 dark:text-slate-100 dark:border dark:border-slate-800 shadow-lg',
          duration: 3500,
        }}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Wordmark & Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-slate-950 via-primary-900 to-primary-700 dark:from-white dark:via-slate-100 dark:to-primary-300 bg-clip-text text-transparent">
                  PathForge
                </span>
              </div>
            </Link>

            {/* Middle: Desktop Nav Links (Hidden below md / 768px) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isExact = item.path === '/';
                const isItemActive = isExact
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path);

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={() =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isItemActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-300 font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-900'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Right: Theme Toggle & User Auth UI */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={`Current theme mode: ${theme}. Click to switch.`}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4" />
                ) : theme === 'light' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Laptop className="w-4 h-4" />
                )}
              </button>

              {/* User Avatar Circle + Log in / Log out */}
              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    title="View Profile"
                  >
                    <Avatar name={displayName || user.email} size="sm" status="online" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                      {displayName
                        ? displayName.split(' ')[0]
                        : user.email.split('@')[0]}
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    title="Log Out"
                    className="text-slate-500 hover:text-danger-600 dark:text-slate-400 dark:hover:text-danger-400 px-2"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  <Link to="/login">
                    <Button variant="primary" size="sm" leftIcon={LogIn}>
                      Log in
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button (Visible below md / 768px) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-1 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}

            {/* Mobile Auth & User Profile Section */}
            <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-3">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3"
                  >
                    <Avatar name={displayName || user.email} size="sm" status="online" />
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {displayName || user.email.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                    className="text-xs text-danger-600 dark:text-danger-400"
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full gap-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="primary" size="md" className="w-full" leftIcon={LogIn}>
                      Log in
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content Outlet */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            {/* Tagline & Brand */}
            <div className="max-w-md">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                  PathForge
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                "Don't search for what to learn. Follow a path built by learners, improved by learners."
              </p>
            </div>

            {/* Footer Placeholder Links */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/explore" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Explore Paths
              </Link>
              <Link to="/create" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Create Path
              </Link>
              <Link to="/community" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Community Guidelines
              </Link>
              <a href="#privacy" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Privacy
              </a>
              <a href="#terms" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Terms
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 dark:text-slate-500 gap-3">
            <p>&copy; {new Date().getFullYear()} PathForge. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted for collaborative lifelong learning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
