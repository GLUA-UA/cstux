import { NextResponse, NextRequest } from "next/server";

import { auth } from "@/lib/authentication";

async function wasFirstAdminUserCreated(requestUrl: string) {
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

const SIGNIN_PATH = "/auth/signin";
const SIGNUP_PATH = "/auth/signup";
const ADMIN_BASE_PATH = "/admin";
const PROTECTED_ROUTES = [
  ADMIN_BASE_PATH,
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ensure the first admin user is created by redirecting to the signup page
  const adminExists = await wasFirstAdminUserCreated(request.url);
  if (!adminExists) {
    if (pathname.startsWith(SIGNUP_PATH)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(SIGNUP_PATH, request.url));
  }

  if (adminExists && pathname.startsWith(SIGNUP_PATH)) {
    return NextResponse.redirect(new URL(SIGNIN_PATH, request.url));
  }

  const session = await auth();
  const isAuthenticated = !!session;
  const isAuthenticationPage = pathname.startsWith(SIGNIN_PATH) || pathname.startsWith(SIGNUP_PATH);
  
  // If the user is authenticated and tries to access the sign-in or sign-up page, redirect them to the admin page
  if (isAuthenticated && isAuthenticationPage) {
    return NextResponse.redirect(new URL(ADMIN_BASE_PATH, request.url));
  }
  
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  // If the user is not authenticated and tries to access a protected route, redirect them to the sign-in page
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL(SIGNIN_PATH, request.url));
  }

  // Allow other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image).*)"
  ],
};
