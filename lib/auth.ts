import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./prisma"

// Get Google OAuth credentials from environment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET

// Get NextAuth secret (v5 uses AUTH_SECRET, v4 uses NEXTAUTH_SECRET)
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000"

// Get redirect URI from env or construct from authUrl
// Priority: REDIRECT_URI > GOOGLE_REDIRECT_URI > auto-generated from authUrl
const redirectUri = process.env.REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || `${authUrl}/api/auth/callback/google`

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    "Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or CLIENT_ID and CLIENT_SECRET) in your .env file"
  )
}

if (!authSecret) {
  throw new Error(
    "Missing AUTH_SECRET. Please set AUTH_SECRET or NEXTAUTH_SECRET in your .env file. Generate one with: openssl rand -base64 32"
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: authSecret,
  basePath: "/api/auth",
  providers: [
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          redirect_uri: redirectUri,
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            // Create new user
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                googleId: account.providerAccountId,
                image: user.image,
              },
            })
          } else if (!existingUser.googleId) {
            // Update existing user with Google ID
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: account.providerAccountId,
                image: user.image || existingUser.image,
              },
            })
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        })
        if (dbUser && session.user) {
          session.user.id = dbUser.id
        }
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
})

