import { prisma } from "@/lib/prisma"
import { NextAuthOptions } from "next-auth"

export const authCallbacks: NextAuthOptions["callbacks"] ={

  async signIn({ credentials, user }) {
    const isAllowedToSignIn = true
    if (isAllowedToSignIn) {
      return true
    } else {
      // Return false to display a default error message
      return false
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    }


    // const dbUser = await prisma.user.findUnique({
    //     where: {username: user.username}
    // })
  }
}

