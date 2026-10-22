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
    <main className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-3 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-sky-800">
          <Droplets className="h-6 w-6" aria-hidden="true" />
          <h1 className="text-2xl font-semibold">Bhopal Smart Water</h1>
        </div>
        <p className="text-sm text-slate-500">Municipal water tank monitoring</p>

        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="w-full rounded border border-slate-300 px-3 py-2"
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
            className="w-full rounded border border-slate-300 px-3 py-2"
          />
          <button
            type="button"
            className="rounded border border-slate-300 px-3"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <ErrorMessage message={error} />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-sky-800 px-3 py-2 text-white disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
