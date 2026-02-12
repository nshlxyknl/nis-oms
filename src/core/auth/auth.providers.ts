// import GithubProvider from "next-auth/providers/github"
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";


export const authProviders = 
  [ 

     CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text", placeholder: "username" },
      password: { label: "Password", type: "password", placeholder: "password" }
    },

    async authorize(credentials) {
            if (!credentials?.username || !credentials?.password) return null;

const user = await prisma.user.findUnique({
        where: { username: credentials.username },
      });

       if (!user) {
    return null;
  }
  
     const isValid = await compare(credentials.password, user.password);
      if (!isValid) return null;

      return { id: user.id.toString(), name: user.username };
    }
  })

]


