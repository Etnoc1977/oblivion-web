'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isLoggedIn, getUser, logout } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/verify', label: 'Verify', icon: '🔍' },
  { href: '/api-keys', label: 'API Keys', icon: '🔑' },
  { href: '/checkout', label: 'Plans', icon: '💳' },
];

const adminItems = [
  { href: '/admin', label: 'Admin', icon: '⚙️' },
];

export default function AppShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = getUser();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#090c16] flex items-center justify-center">
        <div className="text-[#1db4c8] text-lg">Loading...</div>
      </div>
    );
  }

  const allItems = user?.role === 'admin' ? [...navItems, ...adminItems] : navItems;

  return (
    <div className="min-h-screen bg-[#090c16]">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-[#111422] border-r border-[#1e3a8a]/30">
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#1e3a8a]/20">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1e3a8a] to-[#1db4c8] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">O</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg">OBLION</span>
            <div className="text-[#1db4c8] text-[10px]">Beyond doubt</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {allItems.map(item => (
            <a key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-[#1e3a8a]/30 text-[#1db4c8]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1e3a8a]/10'
              }`}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-[#1e3a8a]/20">
          <div className="px-4 py-2">
            <div className="text-white text-sm font-medium truncate">{user?.fullName || user?.email}</div>
            <div className="text-gray-500 text-xs truncate">{user?.email}</div>
          </div>
          <button onClick={logout}
            className="w-full text-left px-4 py-2 text-gray-500 text-sm hover:text-red-400 transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#111422] border-b border-[#1e3a8a]/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1e3a8a] to-[#1db4c8] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-white font-bold">OBLION</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white p-2">
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>

        {sidebarOpen && (
          <div className="bg-[#111422] border-t border-[#1e3a8a]/20 px-4 py-3">
            {allItems.map(item => (
              <a key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm ${
                  pathname === item.href ? 'bg-[#1e3a8a]/30 text-[#1db4c8]' : 'text-gray-400'
                }`}>
                <span>{item.icon}</span>{item.label}
              </a>
            ))}
            <div className="border-t border-[#1e3a8a]/20 mt-2 pt-2">
              <div className="px-4 py-2 text-gray-500 text-xs">{user?.email}</div>
              <button onClick={logout} className="w-full text-left px-4 py-2 text-red-400 text-sm">Sign out</button>
            </div>
          </div>
        )}
      </header>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111422] border-t border-[#1e3a8a]/30 safe-area-bottom">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map(item => (
            <a key={item.href} href={item.href}
              className={`flex flex-col items-center py-1 px-3 min-w-[60px] ${
                pathname === item.href ? 'text-[#1db4c8]' : 'text-gray-500'
              }`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="md:ml-64 pt-14 pb-20 md:pt-0 md:pb-0 p-4 md:p-8">{children}</main>
    </div>
  );
}
