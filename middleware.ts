import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, serialize } from '@supabase/ssr';

const protectedRoutes = ['/user', '/seller', '/affiliate', '/admin', '/auth/select-role'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public routes
  if (pathname === '/' || pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete(name);
        },
      },
    }
  );

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If user is not authenticated
    if (!session) {
      // Allow access to auth pages
      if (authRoutes.includes(pathname)) {
        return response;
      }

      // Redirect protected routes to login
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return response;
    }

    // If user is authenticated but trying to access auth pages, redirect to home
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // If user is trying to access protected dashboard routes, verify role
    const dashboardRoutes: Record<string, string> = {
      '/user': 'user',
      '/seller': 'seller',
      '/affiliate': 'affiliate',
      '/admin': 'admin',
    };

    const accessedRoute = Object.keys(dashboardRoutes).find((route) => pathname.startsWith(route));

    if (accessedRoute) {
      const requiredRole = dashboardRoutes[accessedRoute];

      // Fetch user profile to check role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) {
        // No profile found, redirect to role selection
        return NextResponse.redirect(new URL('/auth/select-role', request.url));
      }

      // Check if user has the correct role
      if (profile.role !== requiredRole) {
        // Unauthorized role, redirect to role selection
        return NextResponse.redirect(new URL('/auth/select-role', request.url));
      }
    }

    return response;
  } catch (error) {
    // If there's an error checking session, redirect to login for protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
