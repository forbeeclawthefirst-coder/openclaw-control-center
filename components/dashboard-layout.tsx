'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/agents', label: 'Agents', icon: '🤖' },
    { href: '/sessions', label: 'Sessions', icon: '💬' },
    { href: '/tasks', label: 'Tasks', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🦾</span>
            <span className="text-xl font-bold text-gray-900">OpenClaw</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {session?.user?.email?.[0].toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.name || session?.user?.email}
              </p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
