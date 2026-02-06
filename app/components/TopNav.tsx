'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

const roleLinks: Record<string, { label: string; href: string }> = {
  user: { label: 'User', href: '/user' },
  affiliate: { label: 'Affiliate', href: '/affiliate' },
  seller: { label: 'Seller', href: '/seller' },
  admin: { label: 'Admin', href: '/admin' },
};

export default function TopNav() {
  const { isAuthenticated, role, loading } = useAuth();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="/" className="text-gray-900 hover:text-gray-600">
          Home
        </Link>

        {!loading && !isAuthenticated && (
          <>
            <Link href="/login" className="text-gray-900 hover:text-gray-600">
              Login
            </Link>
            <Link href="/register" className="text-gray-900 hover:text-gray-600">
              Register
            </Link>
          </>
        )}

        {!loading && isAuthenticated && role && roleLinks[role] && (
          <Link href={roleLinks[role].href} className="text-gray-900 hover:text-gray-600">
            {roleLinks[role].label}
          </Link>
        )}
      </div>
    </nav>
  );
}
