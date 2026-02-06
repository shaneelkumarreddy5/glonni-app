'use client';

import { RoleProtected } from '@/lib/RoleProtected';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtected requiredRole="admin">
      <div className="min-h-screen bg-gray-50">{children}</div>
    </RoleProtected>
  );
}
