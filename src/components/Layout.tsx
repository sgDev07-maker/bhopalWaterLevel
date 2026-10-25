import { Droplets, KeyRound, LayoutDashboard, LogOut, MapPinned } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/zones', label: 'Zones', icon: MapPinned },
  { to: '/change-password', label: 'Password', icon: KeyRound },
];

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-dvh bg-[#e8eef3] text-slate-800">
      <header
        className="sticky top-0 z-40 border-b border-sky-900/10 bg-sky-900 text-white"
        style={{ paddingTop: 'var(--safe-top)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 font-semibold">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15">
              <Droplets className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="truncate">Bhopal Smart Water</span>
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            <nav className="flex items-center gap-1 text-sm">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 ${
                      isActive ? 'bg-white/15 font-semibold' : 'text-sky-100'
                    }`
                  }
                >
                  {link.label === 'Password' ? 'Change Password' : link.label}
                </NavLink>
              ))}
            </nav>
            <span className="max-w-32 truncate text-sky-100">{user?.loggedInName}</span>
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex min-h-11 items-center gap-1 rounded-lg bg-white/10 px-3 py-2"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </div>
          <p className="truncate text-sm text-sky-100 lg:hidden">{user?.loggedInName}</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 pb-[calc(var(--app-tabbar)+var(--safe-bottom)+1rem)] lg:pb-8">
        <Outlet />
      </main>

      <nav
        className="fixed right-0 bottom-0 left-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: 'var(--safe-bottom)' }}
        aria-label="Main"
      >
        <div className="grid grid-cols-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-1 text-xs ${
                    isActive ? 'font-semibold text-sky-800' : 'text-slate-500'
                  }`
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {link.label}
              </NavLink>
            );
          })}
          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-14 flex-col items-center justify-center gap-1 text-xs text-slate-500"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}
