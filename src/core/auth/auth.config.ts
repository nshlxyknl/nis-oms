import type { NextAuthOptions } from "next-auth"
import { authProviders } from "./auth.providers";
import { authCallbacks } from "./auth.callback";


export const authConfig: NextAuthOptions = {
  providers: authProviders,
  session: {
    strategy:"jwt"
  },

  callbacks: authCallbacks,

  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error:"/auth/error"
  }
}

