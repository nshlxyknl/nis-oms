import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';



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
const isProtectedRoute =
    pathname.startsWith('/dashboard');
  if (!isLoggedIn && isProtectedRoute) {
    return redirectToLogin(req);
  }

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

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/auth';
  return NextResponse.redirect(url);
}

function redirectToDashboard(req: NextRequest, role?: string) {
  const url = req.nextUrl.clone();
  url.pathname = `/dashboard`;
  return NextResponse.redirect(url);
}
}