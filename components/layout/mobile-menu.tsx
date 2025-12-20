"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigation: Array<{
    name: string
    href: string
    submenu?: Array<{ name: string; href: string }>
  }>
  session: any
}

export function MobileMenu({ isOpen, onClose, navigation, session }: MobileMenuProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.paddingRight = "0px"
    } else {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [isOpen])

  // Handle escape key to close menu
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  if (!mounted || !isOpen) return null

  const menuContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed right-0 top-0 h-screen w-[320px] max-w-[85vw] bg-background z-[9999] shadow-2xl border-l border-border flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <span className="text-lg font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
            type="button"
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                    }
                    className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-medium hover:bg-accent rounded-md transition-colors text-left"
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform flex-shrink-0 ${
                        openSubmenu === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSubmenu === item.name && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={onClose}
                          className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block py-2.5 px-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-accent"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2 flex-shrink-0">
          {session?.user ? (
            <>
              <Link href="/dashboard" onClick={onClose} className="block">
                <Button variant="outline" className="w-full">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  signOut()
                  onClose()
                }}
                type="button"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              className="w-full"
              onClick={() => {
                signIn("google")
                onClose()
              }}
              type="button"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </>
  )

  // Render to portal to avoid parent constraints
  return createPortal(menuContent, document.body)
}
