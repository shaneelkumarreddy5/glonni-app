'use client';

import { RoleProtected } from '@/lib/RoleProtected';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtected requiredRole="user">
      <div className="min-h-screen bg-gray-50">{children}</div>
    </RoleProtected>
  );
}
