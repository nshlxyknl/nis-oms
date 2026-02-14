import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"

export const authCallbacks: NextAuthOptions["callbacks"] ={

  async signIn({ user }) {
    return true;
  },
   async jwt({ token, user }) {
    if (user) {
      token.role = user.role
      token.id = user.id
    }
    return token
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.role = token.role 
      session.user.id = token.id 
    }
    return session
  }
}

