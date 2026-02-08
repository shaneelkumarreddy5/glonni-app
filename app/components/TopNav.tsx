'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/CartContext';

export default function TopNav() {
  const { totalItems } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center gap-6">
        <Link href="/" className="text-gray-900 hover:text-gray-600">
          Home
        </Link>
        <Link href="/cart" className="text-gray-900 hover:text-gray-600">
          My Cart
        </Link>
        <Link href="/orders" className="text-gray-900 hover:text-gray-600">
          Orders
        </Link>
        <Link href="/settings" className="text-gray-900 hover:text-gray-600">
          Settings
        </Link>
        <Link href="/cart" className="relative ml-auto flex items-center gap-2 text-gray-900">
          <span className="text-sm font-medium">Cart</span>
          {mounted && (
            <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
