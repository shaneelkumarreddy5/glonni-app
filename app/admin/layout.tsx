'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleProtected } from '@/lib/RoleProtected';

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Users', href: '/admin/users' },
  { label: 'Vendors', href: '/admin/vendors' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Returns', href: '/admin/returns' },
  { label: 'Payments', href: '/admin/payments' },
  { label: 'Wallets', href: '/admin/wallets' },
  { label: 'Settlements', href: '/admin/settlements' },
  { label: 'Reports', href: '/admin/reports' },
  { label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <RoleProtected requiredRole="admin">
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-200">
              Glonni – Admin
            </div>
            <button
              type="button"
              className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl gap-6 px-6 pt-20">
          <aside className="hidden w-64 shrink-0 lg:block">
            <nav className="sticky top-20 space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition ${
                    isActive(item.href)
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={isActive(item.href) ? 'text-slate-600' : 'text-slate-500'}>
                    ›
                  </span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="min-w-0 flex-1 pb-10">{children}</main>
        </div>
      </div>
    </RoleProtected>
  );
}
