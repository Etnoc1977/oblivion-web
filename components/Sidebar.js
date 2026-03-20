'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUser, isAdmin, logout } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: 'My Deletions', icon: '🗑️' },
  { href: '/api-keys', label: 'API Keys', icon: '🔑' },
  { href: '/checkout', label: 'Plans & Billing', icon: '💳' },
];

const adminItems = [
  { href: '/admin', label: 'Admin Dashboard', icon: '📊' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = getUser();
  const admin = isAdmin();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-100 border-r border-navy-700 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-navy-700">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-navy-500 to-teal-400 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <div>
            <div className="text-white font-bold text-lg tracking-wide">OBLIVION</div>
            <div className="text-teal-400 text-xs">Secure Deletion Platform</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {admin && (
          <>
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-2">Admin</div>
            {adminItems.map(item => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  pathname === item.href
                    ? 'bg-navy-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-dark-50'
                }`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}

        <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Portal</div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              pathname === item.href
                ? 'bg-navy-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-50'
            }`}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}

        <Link href="/verify"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
            pathname === '/verify'
              ? 'bg-navy-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-dark-50'
          }`}>
          <span>✅</span>
          <span>Verify Deletion</span>
        </Link>
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-navy-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-navy-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.fullName?.[0] || user?.email?.[0] || '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">{user?.fullName || user?.email}</div>
            <div className="text-xs text-gray-500">{user?.plan} plan • {user?.role}</div>
          </div>
        </div>
        <button onClick={logout}
          className="w-full text-left text-sm text-gray-500 hover:text-red-400 px-3 py-2 rounded-lg hover:bg-dark-50 transition-all">
          Sign out
        </button>
      </div>
    </aside>
  );
}
