import { NextRequest } from "next/server"
import { rbacMiddleware } from "./core/middleware/rbac"

export { default } from "next-auth/middleware"


export async function proxy(req:NextRequest) {
  return rbacMiddleware(req);
}
export const config = {
  matcher: [ "/user/:path*", "/admin/:path*", '/auth/:path*'], 

}

