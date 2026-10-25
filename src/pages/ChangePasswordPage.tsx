import { FormEvent, useState } from 'react';
import { ErrorMessage } from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../services/authApi';
import { ApiError } from '../types/api';

export function ChangePasswordPage() {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }
    if (!user) {
      setError('You are not signed in.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
        userID: user.loggedInID,
      });
      setMessage('Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'Unable to change password.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-3 rounded-2xl border border-slate-200 bg-white p-5"
    >
      <h1 className="text-2xl font-semibold">Change Password</h1>
      <label htmlFor="current" className="block text-sm font-medium">
        Current Password
      </label>
      <input
        id="current"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
        className="h-12 w-full rounded-xl border border-slate-300 px-3 text-base"
      />
      <label htmlFor="next" className="block text-sm font-medium">
        New Password
      </label>
      <input
        id="next"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={6}
        className="h-12 w-full rounded-xl border border-slate-300 px-3 text-base"
      />
      <label htmlFor="confirm" className="block text-sm font-medium">
        Confirm New Password
      </label>
      <input
        id="confirm"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="h-12 w-full rounded-xl border border-slate-300 px-3 text-base"
      />
      <ErrorMessage message={error} />
      {message ? <p className="text-green-700">{message}</p> : null}
      <button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-xl bg-sky-800 font-semibold text-white disabled:opacity-60"
      >
        {submitting ? 'Saving...' : 'Update password'}
      </button>
    </form>
  );
}
