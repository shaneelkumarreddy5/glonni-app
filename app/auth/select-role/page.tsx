'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SelectRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = async (role: string) => {
    setSelectedRole(role);
    setLoading(true);
    setError('');

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Not authenticated');
        return;
      }

      // 1. Update profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Create role-specific record
      if (role === 'seller') {
        const { error: sellerError } = await supabase.from('sellers').upsert(
          {
            user_id: user.id,
            status: 'pending',
          },
          { onConflict: 'user_id' }
        );

        if (sellerError && sellerError.code !== '23505') {
          // Ignore duplicate key errors
          throw sellerError;
        }
      } else if (role === 'affiliate') {
        // Generate unique referral code
        const referralCode = `ref_${user.id.slice(0, 8)}_${Math.random().toString(36).substring(2, 8)}`;

        const { error: affiliateError } = await supabase.from('affiliates').upsert(
          {
            user_id: user.id,
            referral_code: referralCode,
          },
          { onConflict: 'user_id' }
        );

        if (affiliateError && affiliateError.code !== '23505') {
          // Ignore duplicate key errors
          throw affiliateError;
        }
      }

      // 3. Redirect to dashboard
      const roleToRoute: Record<string, string> = {
        user: '/user',
        seller: '/seller',
        affiliate: '/affiliate',
        admin: '/admin',
      };

      router.push(roleToRoute[role] || '/');
    } catch (err: any) {
      console.error('Role selection error:', err);
      setError(err.message || 'Failed to select role');
    } finally {
      setLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
          Select Your Role
        </h1>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleRoleSelect('user')}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
          >
            {selectedRole === 'user' && loading ? 'Setting up...' : 'User'}
          </button>

          <button
            onClick={() => handleRoleSelect('seller')}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
          >
            {selectedRole === 'seller' && loading ? 'Setting up...' : 'Seller'}
          </button>

          <button
            onClick={() => handleRoleSelect('affiliate')}
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
          >
            {selectedRole === 'affiliate' && loading ? 'Setting up...' : 'Affiliate'}
          </button>
        </div>
      </div>
    </main>
  );
}
