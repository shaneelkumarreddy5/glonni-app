import { ReactNode } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleProtectedProps {
  children: ReactNode;
  requiredRole: string;
}

export function RoleProtected({ children, requiredRole }: RoleProtectedProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Not authenticated
    if (!user) {
      router.push('/login');
      return;
    }

    // No role or wrong role
    if (!role) {
      router.push('/auth/select-role');
      return;
    }

    if (role !== requiredRole) {
      const roleRoutes: Record<string, string> = {
        user: '/user',
        seller: '/seller',
        affiliate: '/affiliate',
        admin: '/admin',
      };

      router.push(roleRoutes[role] || '/auth/select-role');
    }
  }, [user, role, loading, requiredRole, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-900">Loading...</p>
      </main>
    );
  }

  // User has correct role
  if (user && role === requiredRole) {
    return <>{children}</>;
  }

  // Wrong role or not authenticated (will redirect)
  return null;
}
