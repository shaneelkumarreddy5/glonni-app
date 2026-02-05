'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  role: string;
  created_at: string;
  full_name: string | null;
}

export default function AdminDashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, role, created_at, full_name')
            .eq('id', user.id)
            .single();

          if (!error && data) {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage platform operations
        </p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      ) : profile ? (
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Profile Info</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium text-gray-700">ID:</span> <span className="text-gray-600">{profile.id}</span></p>
            <p><span className="font-medium text-gray-700">Role:</span> <span className="text-gray-600">{profile.role}</span></p>
            <p><span className="font-medium text-gray-700">Created:</span> <span className="text-gray-600">{new Date(profile.created_at).toLocaleDateString()}</span></p>
            {profile.full_name && <p><span className="font-medium text-gray-700">Name:</span> <span className="text-gray-600">{profile.full_name}</span></p>}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500">Sellers</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500">Affiliates</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">0</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">$0</p>
        </div>
      </div>
    </div>
  );
}
