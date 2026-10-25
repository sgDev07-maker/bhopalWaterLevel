import { Droplets, Eye, EyeOff } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../types/api';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!userName.trim() || !password) {
      setError('Enter username and password.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await login(userName.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Invalid username or password',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="grid min-h-dvh place-items-center bg-sky-950 px-4"
      style={{
        paddingTop: 'calc(var(--safe-top) + 1rem)',
        paddingBottom: 'calc(var(--safe-bottom) + 1rem)',
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-5 shadow-lg sm:p-7"
      >
        <div className="flex items-center gap-3 text-sky-900">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100">
            <Droplets className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">Bhopal Smart Water</h1>
            <p className="text-sm text-slate-500">Municipal tank monitoring</p>
          </div>
        </div>

        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="h-12 w-full rounded-xl border border-slate-300 px-3 text-base"
        />

        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <div className="flex gap-2">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 min-w-0 flex-1 rounded-xl border border-slate-300 px-3 text-base"
          />
          <button
            type="button"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-300"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <ErrorMessage message={error} />

        <button
          type="submit"
          disabled={submitting}
          className="h-12 w-full rounded-xl bg-sky-800 text-base font-semibold text-white disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
