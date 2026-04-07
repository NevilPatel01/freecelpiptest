"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, User, LogOut, Bookmark, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileMenu } from "./mobile-menu"
import { ThemeToggle } from "./theme-toggle"
import { useAppwriteAuth } from "@/components/providers/appwrite-auth-provider"
import type { AppwriteUser } from "@/components/providers/appwrite-auth-provider"

function menuUserFromAppwrite(user: AppwriteUser | null) {
  if (!user) return null
  const picture =
    user.prefs &&
    typeof user.prefs === "object" &&
    "picture" in user.prefs &&
    typeof (user.prefs as Record<string, unknown>).picture === "string"
      ? String((user.prefs as Record<string, string>).picture)
      : null
  return {
    name: user.name ?? null,
    email: user.email ?? null,
    image: picture,
  }
}

export function Header() {
  const { user: appwriteUser, status, signInGoogle, signOut } = useAppwriteAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    {
      name: "Practice Tests",
      href: "/practice",
      submenu: [
        { name: "Listening", href: "/practice/listening" },
        { name: "Reading", href: "/practice/reading" },
        { name: "Writing", href: "/practice/writing" },
        { name: "Speaking", href: "/practice/speaking" },
      ],
    },
    { name: "Mock Tests", href: "/mock-tests" },
    { name: "Blog", href: "/blog" },
    { name: "Resources", href: "/resources" },
    {
      name: "Tools",
      href: "/celpip-score-calculator",
      submenu: [
        { name: "Score Calculator", href: "/celpip-score-calculator" },
        { name: "Vocabulary Grader", href: "/vocabulary-level-grader" },
      ],
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  const user = menuUserFromAppwrite(appwriteUser)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
      <nav className="container mx-auto flex h-16 items-center justify-between container-padding" aria-label="Main navigation">
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0" aria-label="FreeCELPIPTest Home">
          <img
            src="/assets/logo-bg.png"
            alt="FreeCELPIPTest"
            className="h-8 md:h-10 w-auto logo-max-width"
            loading="eager"
            fetchPriority="high"
            width="140"
            height="40"
            decoding="async"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2">
          {navigation.map((item) =>
            item.submenu ? (
              <DropdownMenu key={item.name}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`text-sm font-medium h-9 px-4 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10 font-semibold"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {item.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {item.submenu.map((subItem) => (
                    <DropdownMenuItem key={subItem.name} asChild>
                      <Link href={subItem.href} className="cursor-pointer">
                        {subItem.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium h-9 px-4 rounded-lg flex items-center transition-all duration-200 ${
                  isActive(item.href)
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-foreground/70 hover:text-primary hover:bg-primary/10"
                }`}
                aria-label={`Navigate to ${item.name}`}
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse hidden sm:block" aria-hidden />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[100]">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=saved" className="flex items-center">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved Articles
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    void signOut()
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex whitespace-nowrap"
              onClick={() => signInGoogle(pathname || "/")}
            >
              Sign in
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={(e) => {
              e.stopPropagation()
              setMobileMenuOpen(true)
            }}
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
        user={user}
        onSignInGoogle={() => signInGoogle(pathname || "/")}
        onSignOut={() => {
          void signOut()
        }}
      />
    </header>
  )
}
