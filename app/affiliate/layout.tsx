'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/affiliate' },
  { label: 'Referral Links', href: '/affiliate/referrals' },
  { label: 'Earnings', href: '/affiliate/earnings' },
  { label: 'Payouts', href: '/affiliate/payouts' },
  { label: 'Settings', href: '/affiliate/settings' },
];

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/affiliate') return pathname === '/affiliate';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
            Glonni – Affiliate
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-6 pt-20">
        <aside className="hidden w-60 shrink-0 md:block">
          <nav className="sticky top-20 space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2 font-medium transition ${
                  isActive(item.href)
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                <span className={isActive(item.href) ? 'text-white/70' : 'text-slate-300'}>
                  ›
                </span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-10">
          <nav className="mb-4 flex gap-3 overflow-x-auto md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  isActive(item.href)
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
