'use client';

import { RoleProtected } from '@/lib/RoleProtected';

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtected requiredRole="seller">
      <div className="min-h-screen bg-gray-50">{children}</div>
    </RoleProtected>
  );
}
