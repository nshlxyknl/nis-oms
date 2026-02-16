import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Role-based route map
// const roleRoutes: Record<string, string[]> = {
//   '/dashboard/admin': ['ADMIN'],
//   '/dashboard/employee': ['EMPLOYEE'],
//   '/dashboard/intern': ['INTERN'],
// };

// Auth pages
const authPages = ['/auth'];

export async function rbacMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  /* =========================
     1️⃣ Logged-in user on auth pages
     ========================= */
  if (isLoggedIn && authPages.includes(pathname)) {
    return redirectToDashboard(req, token.role);
  }

//   /* =========================
//      2️⃣ Not logged-in user
//      ========================= */
//   const isProtectedRoute = Object.keys(roleRoutes).some((route) => pathname.startsWith(route));

//   if (!isLoggedIn && isProtectedRoute) {
//     return redirectToLogin(req);
//   }

  /* =========================
     3️⃣ Role-based access
     ========================= */
//   if (isLoggedIn) {
//     const allowedRoles = Object.entries(roleRoutes).find(([route]) =>
//       pathname.startsWith(route)
//     )?.[1];

//     if (allowedRoles && !allowedRoles.includes(token.role)) {
//       return redirectToDashboard(req, token.role);
//     }
//   }

//   return NextResponse.next();
// }

/* =========================
   Helpers
   ========================= */

// function redirectToLogin(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   url.pathname = '/auth/login';
//   return NextResponse.redirect(url);
// }

function redirectToDashboard(req: NextRequest, role?: string) {
  const url = req.nextUrl.clone();
  url.pathname = `/dashboard`;
  return NextResponse.redirect(url);
}
}