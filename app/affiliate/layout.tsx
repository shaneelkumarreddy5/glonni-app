'use client';

import { RoleProtected } from '@/lib/RoleProtected';

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtected requiredRole="affiliate">
      <div className="min-h-screen bg-gray-50">{children}</div>
    </RoleProtected>
  );
}
