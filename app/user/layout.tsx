'use client';

import { RoleProtected } from '@/lib/RoleProtected';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtected requiredRole="user">
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">User Dashboard</h2>
        </header>
        {children}
      </div>
    </RoleProtected>
  );
}
