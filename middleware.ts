import { NextResponse, NextRequest } from "next/server";

import { auth } from "@/lib/authentication";

/**
 * Checks if the first admin user has been created by making an API request
 * @param requestUrl - The current request URL
 * @returns Promise<boolean> - True if admin exists or if there was an error, false otherwise
 */
async function wasFirstAdminUserCreated(requestUrl: string): Promise<boolean> {
  const url = new URL("/api/v1/admin-initialization", requestUrl);

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch admin status:", response.statusText);
      return true;
    }

    const data = await response.json();
    return data.adminExists ?? true;
  } catch (error) {
    console.error("Error fetching admin status:", error);
    return true;
  }
}

// Route constants
const ROUTES = {
  SIGNIN: "/auth/signin",
  SIGNUP: "/auth/signup",
  ADMIN: "/admin",
} as const;

// Protected routes that require authentication
const PROTECTED_ROUTES = [ROUTES.ADMIN];

/**
 * Middleware function that handles authentication and route protection
 * - Ensures first admin user creation
 * - Manages authentication flow
 * - Protects admin routes
 * @param request - The incoming request
 * @returns NextResponse - The response to be sent
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Handle first admin user creation flow
  const adminExists = await wasFirstAdminUserCreated(request.url);
  if (!adminExists) {
    if (pathname.startsWith(ROUTES.SIGNUP)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(ROUTES.SIGNUP, request.url));
  }

  if (adminExists && pathname.startsWith(ROUTES.SIGNUP)) {
    return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
  }

  // Handle authentication flow
  const session = await auth();
  const isAuthenticated = !!session;
  const isAuthenticationPage = 
    pathname.startsWith(ROUTES.SIGNIN) || 
    pathname.startsWith(ROUTES.SIGNUP);
  
  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthenticationPage) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN, request.url));
  }
  
  // Protect admin routes
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => 
    pathname.startsWith(route)
  );

  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL(ROUTES.SIGNIN, request.url));
  }

  return NextResponse.next();
}

// Configure middleware to run on all routes except API, static files, and images
export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
