import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Button } from '../components/common';
import { useAuth } from '../hooks/useAuth';

function GoogleIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoErrors, setShowDemoErrors] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle } = useAuth();

  // Redirect already-authenticated users away from /login
  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isLogin = mode === 'login';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when the user starts typing again
    if (authError) setAuthError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back to PathForge!');
      } else {
        await signUp(formData.email, formData.password, formData.username);
        toast.success('Account created! Check your email to confirm, then log in.');
        setMode('login');
      }
      navigate('/');
    } catch (err) {
      setAuthError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // OAuth redirects the browser — no navigate() needed here
    } catch (err) {
      setAuthError(err.message ?? 'Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setAuthError('');
  };

  return (
    <div className="min-h-[calc(100vh-14rem)] flex flex-col justify-center items-center py-6 px-4">
      {/* 1. Header above the card */}
      <div className="text-center mb-6 max-w-sm">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 mb-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-slate-950 via-primary-900 to-primary-700 dark:from-white dark:via-slate-100 dark:to-primary-300 bg-clip-text text-transparent">
            PathForge
          </span>
        </Link>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Follow a path built by learners, improved by learners.
        </p>
      </div>

      {/* 2. Main Auth Card (~400px max-width, ~90% on mobile) */}
      <div className="w-[92%] sm:w-full max-w-[400px]">
        <Card className="p-6 sm:p-7 shadow-lg">
          {/* Card Header with Tab Switcher */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isLogin ? 'Enter your credentials to continue' : 'Start your peer-learning journey'}
              </p>
            </div>

            {/* Mode text toggle */}
            <button
              type="button"
              onClick={toggleMode}
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 transition-colors cursor-pointer py-1 px-1.5 rounded"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field (Signup mode only) */}
            {!isLogin && (
              <div className="transition-all duration-200 animate-fade-in">
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="e.g. dev_learner"
                  value={formData.username}
                  onChange={handleChange}
                  required={!isLogin}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none transition-all duration-150 ${
                    showDemoErrors
                      ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  }`}
                />
                {showDemoErrors && (
                  <p className="text-xs text-danger-600 dark:text-danger-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Username must be at least 3 characters
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none transition-all duration-150 ${
                  showDemoErrors
                    ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                }`}
              />
              {showDemoErrors && (
                <p className="text-xs text-danger-600 dark:text-danger-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Enter a valid email address
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                {isLogin && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      toast('Password reset link sent to registered email');
                    }}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none transition-all duration-150 ${
                  showDemoErrors
                    ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                }`}
              />
              {showDemoErrors && (
                <p className="text-xs text-danger-600 dark:text-danger-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            {/* Confirm Password Field (Signup mode only) */}
            {!isLogin && (
              <div className="transition-all duration-200 animate-fade-in">
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm outline-none transition-all duration-150 ${
                    showDemoErrors
                      ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/20'
                      : 'border-slate-300 dark:border-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  }`}
                />
                {showDemoErrors && (
                  <p className="text-xs text-danger-600 dark:text-danger-400 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            {/* Real auth error banner */}
            {authError && (
              <div className="flex items-start gap-2 rounded-xl border border-danger-200 dark:border-danger-800 bg-danger-50 dark:bg-danger-950/50 px-3.5 py-2.5 text-sm text-danger-700 dark:text-danger-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Primary Action Button with Loading Spinner */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full shadow-md font-semibold"
                isLoading={isLoading}
              >
                {isLoading
                  ? isLogin
                    ? 'Logging in...'
                    : 'Creating account...'
                  : isLogin
                  ? 'Log in'
                  : 'Create account'}
              </Button>
            </div>

            {/* Divider with "or" */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500 font-medium">
                  or
                </span>
              </div>
            </div>

            {/* Continue with Google Button */}
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full font-medium"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              leftIcon={GoogleIcon}
            >
              Continue with Google
            </Button>
          </form>
        </Card>

        {/* 3. Below the Card: Switch Mode Link */}
        <div className="text-center mt-5 text-sm text-slate-600 dark:text-slate-400">
          {isLogin ? (
            <span>
              New here?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Create an account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Log in
              </button>
            </span>
          )}
        </div>

        {/* Validation Errors Preview Toggle for UI review */}
        <div className="mt-6 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setShowDemoErrors(!showDemoErrors)}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{showDemoErrors ? 'Hide demo error states' : 'Preview validation error states'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
