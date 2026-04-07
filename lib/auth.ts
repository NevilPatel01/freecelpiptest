import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./prisma"
import { isAdminEmail } from "./admin-email"

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || ""
  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET || ""
  const secret =
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-secret-change-me"
  return { clientId, clientSecret, secret }
}

const { clientId, clientSecret, secret } = getGoogleConfig()

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret,
  basePath: "/api/auth",
  providers: [
    Google({
      clientId: clientId || "placeholder-client-id",
      clientSecret: clientSecret || "placeholder-client-secret",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          await prisma.user.upsert({
            where: { email: user.email },
            create: {
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
              image: user.image,
            },
            update: {
              name: user.name,
              googleId: account.providerAccountId,
              image: user.image ?? undefined,
            },
          })
        } catch (e) {
          console.error("signIn prisma error:", e)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (user.email) token.email = user.email
        if (user.name) token.name = user.name
      }
      const email = token.email as string | undefined
      if (email) {
        token.isAdmin = isAdminEmail(email)
      }
      if (account?.provider === "google" && email) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
        })
        if (dbUser) token.sub = dbUser.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) || ""
        session.user.isAdmin = Boolean(token.isAdmin)
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
})
