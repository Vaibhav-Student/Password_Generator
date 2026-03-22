import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M3 12L12 3l9 9M5 10v9a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1v-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'generator',
    label: 'Generator',
    href: '/generator',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 7V7a3 3 0 0 1 6 0v2H9Z" fill="currentColor" />
      </svg>
    )
  },
  {
    id: 'pattern-generator',
    label: 'Patterns',
    href: '/pattern-generator',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M4 7h6M14 7h6M4 12h4M10 12h4M16 12h4M4 17h6M14 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'smart-generator',
    label: 'Smart Gen',
    href: '/smart-generator',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M12 3a7 7 0 0 1 7 7c0 2.2-1.01 4.17-2.6 5.46V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.54A6.96 6.96 0 0 1 5 10a7 7 0 0 1 7-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'passphrase',
    label: 'Passphrase',
    href: '/passphrase',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'fun-password',
    label: 'Fun Mode',
    href: '/fun-password',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  },
  {
    id: 'usernames',
    label: 'Usernames',
    href: '/usernames',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M8 3h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm0 0v4m8-4v4M6 10h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m4 16 2 2m14-2-2 2m-7-1h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'qr-share',
    label: 'QR Share',
    href: '/qr-share',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 15h2v2h-2zM19 15h1v1h-1zM18 18h2v2h-2zM14 19h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'qr-extractor',
    label: 'QR Extract',
    href: '/qr-extractor',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'analyzer',
    label: 'Analyzer',
    href: '/analyzer',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'crack-time',
    label: 'Crack Time',
    href: '/crack-time',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M12 6v6l4 2M3 12a9 9 0 1 0 9-9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'pin-generator',
    label: 'PIN Gen',
    href: '/pin-generator',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01M12 16h.01" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'mutation-tool',
    label: 'Mutator',
    href: '/mutation-tool',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M4 7h8M4 12h5M4 17h9M15 10l2 2 4-4M13 4h7v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'memory-score',
    label: 'Memory',
    href: '/memory-score',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2m6-16h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2M9 4a3 3 0 0 1 6 0M9 4a3 3 0 0 0-3 3v1h12V7a3 3 0 0 0-3-3M9 12h.01M15 12h.01M12 15h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'rotation-generator',
    label: 'Rotation',
    href: '/rotation-generator',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M4 4v6h6M20 20v-6h-6M6.5 9a7 7 0 0 1 11.95 2M17.5 15a7 7 0 0 1-11.95-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'history',
    label: 'History',
    href: '/history',
    icon: (
      <svg className="nav-icon" viewBox="0 0 24 24" fill="none" role="presentation">
        <path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3M3 5v3h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle sidebar"
      >
        <span />
        <span />
        <span />
      </button>

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" role="presentation">
              <path
                d="M12 2a5 5 0 0 0-5 5v2H6a2 2 0 0 0-2 2v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 7V7a3 3 0 0 1 6 0v2H9Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div>
            <p className="brand-title">SecurePass</p>
            <p className="brand-subtitle">White Glow Edition</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setOpen(false)}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <button
        type="button"
        className={`sidebar-backdrop ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
        aria-label="Close sidebar"
      />
    </>
  );
}

export default Navbar;

