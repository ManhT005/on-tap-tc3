import { Link, NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/learn', label: 'Learn' },
  { to: '/review', label: 'Review' },
  { to: '/practice', label: 'Practice' },
  { to: '/progress', label: 'Progress' },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng
      </a>
      <header className="app-header">
        <Link className="brand" to="/" aria-label="Ôn tiếng Hàn Trung cấp 3, trang chủ">
          <span className="brand-mark" aria-hidden="true">
            한
          </span>
          <span>
            Ôn tiếng Hàn <strong>TC3</strong>
          </span>
        </Link>
        <nav className="primary-nav" aria-label="Điều hướng chính">
          {navigationItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main id="main-content" className="page-content">
        <Outlet />
      </main>
      <div className="toast-viewport" aria-live="polite" aria-atomic="true" />
    </div>
  );
}
