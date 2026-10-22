import { Droplets, LogOut } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/zones', label: 'Zones' },
  { to: '/change-password', label: 'Change Password' },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 bg-white px-4 py-3">
        <div className="flex items-center gap-2 font-semibold text-sky-800">
          <Droplets className="h-5 w-5" aria-hidden="true" />
          Bhopal Smart Water
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'font-semibold text-sky-800' : 'text-slate-600'
              }
            >
              {link.label}
            </NavLink>
          ))}
          <span className="text-slate-500">{user?.loggedInName}</span>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-slate-50 px-2 py-1"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
