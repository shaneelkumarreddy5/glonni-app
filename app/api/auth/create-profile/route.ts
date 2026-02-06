import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      return NextResponse.json({ profile: existingProfile, created: false });
    }

    // Create profile with default role (no role assigned yet)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        role: 'user', // Default role
        full_name: user.user_metadata?.full_name || null,
      })
      .select()
      .single();

    if (profileError) {
      // Ignore conflict errors (profile already exists)
      if (profileError.code === '23505') {
        return NextResponse.json({ profile: { id: user.id }, created: false });
      }
      throw profileError;
    }

    return NextResponse.json({ profile, created: true });
  } catch (error: unknown) {
    console.error('Profile creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create profile';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
