import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WebsiteSchema } from "@/components/seo/website-schema";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { APP_NAME, getSiteUrl } from "@/lib/constants";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${APP_NAME} - CELPIP Practice Tests & Expert Tips`,
    template: `%s | ${APP_NAME}`,
  },
  description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
  keywords: ["CELPIP", "CELPIP test", "CELPIP practice", "CELPIP preparation", "free CELPIP", "CELPIP listening", "CELPIP reading", "CELPIP writing", "CELPIP speaking"],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any", type: "image/png" },
      { url: "/assets/logo-bg.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/logo-bg.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/assets/logo-bg.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: APP_NAME,
    title: `${APP_NAME} - Master CELPIP with Free Practice Tests`,
    description: "Free CELPIP test preparation platform with practice tests and expert tips.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} - Master CELPIP with Free Practice Tests`,
    description: "Free CELPIP test preparation platform with practice tests and expert tips.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: getSiteUrl(),
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <WebsiteSchema />
      </head>
      <body className={inter.variable}>
        <GoogleAnalytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

