import { ReactNode, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import {
  getAdminUsersServerSnapshot,
  getAdminUsersSnapshot,
  subscribeToAdminUsers,
} from '@/lib/adminUsers';
import {
  getAdminVendorsServerSnapshot,
  getAdminVendorsSnapshot,
  subscribeToAdminVendors,
} from '@/lib/adminVendors';

interface RoleProtectedProps {
  children: ReactNode;
  requiredRole: string;
}

export function RoleProtected({ children, requiredRole }: RoleProtectedProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const adminUsers = useSyncExternalStore(
    subscribeToAdminUsers,
    getAdminUsersSnapshot,
    getAdminUsersServerSnapshot
  );
  const adminVendors = useSyncExternalStore(
    subscribeToAdminVendors,
    getAdminVendorsSnapshot,
    getAdminVendorsServerSnapshot
  );

  const accessProfile = useMemo(() => {
    if (!user) {
      return { role, status: 'Active' } as const;
    }
    const match = adminUsers.find(
      (entry) => entry.email === user.email || entry.id === user.id
    );
    return {
      role: match?.role ?? role,
      status: match?.status ?? 'Active',
    } as const;
  }, [adminUsers, role, user]);

  const vendorAccess = useMemo(() => {
    if (!user) return null;
    return (
      adminVendors.find((vendor) => vendor.ownerEmail === user.email) || null
    );
  }, [adminVendors, user]);

  const allowAdminPreview = useMemo(() => {
    if (requiredRole !== 'admin') return false;
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const previewParam = params.get('preview') === 'admin';
    if (previewParam) {
      window.localStorage.setItem('glonni_admin_preview', 'true');
    }
    return previewParam || window.localStorage.getItem('glonni_admin_preview') === 'true';
  }, [requiredRole]);

  useEffect(() => {
    if (loading) return;

    if (allowAdminPreview) return;

    // Not authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // No role or wrong role
    if (!accessProfile.role) {
      router.push('/auth/select-role');
      return;
    }

    if (
      accessProfile.status === 'Suspended' &&
      (requiredRole === 'seller' || requiredRole === 'affiliate' || requiredRole === 'admin')
    ) {
      router.push('/');
      return;
    }


    if (accessProfile.role !== requiredRole) {
      const roleRoutes: Record<string, string> = {
        user: '/user',
        seller: '/seller',
        affiliate: '/affiliate',
        admin: '/admin',
      };

      if (requiredRole === 'admin') {
        router.push('/');
        return;
      }

      router.push(roleRoutes[accessProfile.role] || '/auth/select-role');
    }
  }, [user, accessProfile, loading, requiredRole, router, allowAdminPreview]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-900">Loading...</p>
      </main>
    );
  }

  // User has correct role
  if (user && accessProfile.role === requiredRole) {
    if (requiredRole === 'seller') {
      if (!vendorAccess) {
        return (
          <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-sm font-semibold text-slate-600">
              Your vendor profile is pending approval.
            </p>
          </main>
        );
      }

      if (vendorAccess.storeStatus === 'Rejected') {
        return (
          <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-sm font-semibold text-rose-600">
              Your vendor application was rejected. Please contact support.
            </p>
          </main>
        );
      }

      if (vendorAccess.storeStatus === 'Suspended') {
        return (
          <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-sm font-semibold text-rose-600">
              Your vendor account is suspended.
            </p>
          </main>
        );
      }

      if (vendorAccess.storeStatus !== 'Approved') {
        return (
          <main className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-sm font-semibold text-slate-600">
              Your vendor profile is pending approval.
            </p>
          </main>
        );
      }
    }
    return <>{children}</>;
  }

  if (allowAdminPreview) {
    return <>{children}</>;
  }

  // Wrong role or not authenticated (will redirect)
  return null;
}
