import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./prisma"

// Helper function to get config (only throws at runtime, not build time)
function getAuthConfig() {
  // Get Google OAuth credentials from environment variables
  const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET

  // Get NextAuth secret (v5 uses AUTH_SECRET, v4 uses NEXTAUTH_SECRET)
  const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
  const authUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // Get redirect URI from env or construct from authUrl
  // Priority: REDIRECT_URI > GOOGLE_REDIRECT_URI > auto-generated from authUrl
  const redirectUri = process.env.REDIRECT_URI || process.env.GOOGLE_REDIRECT_URI || `${authUrl}/api/auth/callback/google`

  // Only throw errors at runtime (when actually using auth), not during build
  // During build, we'll use placeholder values if env vars are missing
  if (process.env.NODE_ENV === 'production' && (!googleClientId || !googleClientSecret)) {
    console.warn(
      "Warning: Missing Google OAuth credentials. Auth will not work. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment variables."
    )
  }

  if (process.env.NODE_ENV === 'production' && !authSecret) {
    console.warn(
      "Warning: Missing AUTH_SECRET. Auth will not work. Please set AUTH_SECRET or NEXTAUTH_SECRET in your environment variables."
    )
  }

  // Use placeholder values during build if env vars are missing
  const clientId = googleClientId || "placeholder-client-id"
  const clientSecret = googleClientSecret || "placeholder-client-secret"
  const secret = authSecret || "placeholder-secret-for-build"

  return {
    clientId,
    clientSecret,
    secret,
    authUrl,
    redirectUri,
  }
}

const config = getAuthConfig()

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: config.secret,
  basePath: "/api/auth",
  providers: [
    Google({
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authorization: {
        params: {
          redirect_uri: config.redirectUri,
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
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
    async session({ session }) {
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
    async jwt({ token, user }) {
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

