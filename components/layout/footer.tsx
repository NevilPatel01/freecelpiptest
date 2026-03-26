"use client"

import Link from "next/link"
import { useState } from "react"
import { Mail, MessageSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { submitFeedback, submitNewsletterEmail } from "@/lib/appwrite/forms"

export function Footer() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  
  // Feedback form state
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    message: "",
    rating: 0,
    category: "general",
  })
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await submitNewsletterEmail(email)
      if (result.ok) {
        setMessage({ type: "success", text: "Successfully subscribed!" })
        setEmail("")
      } else {
        setMessage({
          type: "error",
          text:
            result.message === "Email already subscribed"
              ? "You are already on the list."
              : result.message,
        })
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingFeedback(true)
    setFeedbackMessage(null)

    try {
      const data = await submitFeedback({
        name: feedbackData.name,
        email: feedbackData.email,
        message: feedbackData.message,
        rating: feedbackData.rating || null,
        category: feedbackData.category,
      })

      if (data.ok) {
        setFeedbackMessage({ type: "success", text: data.message })
        setFeedbackData({ name: "", email: "", message: "", rating: 0, category: "general" })
        setTimeout(() => {
          setFeedbackOpen(false)
          setFeedbackMessage(null)
        }, 2000)
      } else {
        setFeedbackMessage({ type: "error", text: data.message })
      }
    } catch {
      setFeedbackMessage({ type: "error", text: "Something went wrong. Please try again." })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  const footerLinks = {
    Practice: [
      { name: "Listening", href: "/practice/listening" },
      { name: "Reading", href: "/practice/reading" },
      { name: "Writing", href: "/practice/writing" },
      { name: "Speaking", href: "/practice/speaking" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Study Resources", href: "/resources" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Contact", href: "/contact" },
    ],
  }

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto container-padding py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5">
              <span className="text-xl md:text-2xl font-bold text-gradient-primary tracking-tight">
                FreeCELPIPTest
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Master CELPIP with comprehensive practice tests, expert tips, and study resources designed to help you achieve your target score.
            </p>
            
            {/* Newsletter Signup */}
            <div>
              <h3 className="text-xs font-semibold mb-3 text-foreground">Get free CELPIP tips & test launch updates</h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 text-sm"
                  />
                  <Button type="submit" disabled={isSubmitting} size="sm">
                    <Mail className="h-3.5 w-3.5" />
                  </Button>
                </div>
                {message && (
                  <p
                    className={`text-xs ${
                      message.type === "success"
                        ? "text-primary"
                        : "text-destructive"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold mb-4 text-foreground">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors leading-relaxed"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FreeCELPIPTest. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Feedback Dialog */}
            <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <MessageSquare className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                  <span>Feedback</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Help Us Improve
                  </DialogTitle>
                  <DialogDescription>
                    Your feedback helps us make FreeCELPIPTest better. Share your thoughts, suggestions, or report issues.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 mt-4">
                  <div>
                    <label htmlFor="feedback-name" className="text-sm font-medium mb-2 block">
                      Name (optional)
                    </label>
                    <Input
                      id="feedback-name"
                      value={feedbackData.name}
                      onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-email" className="text-sm font-medium mb-2 block">
                      Email (optional)
                    </label>
                    <Input
                      id="feedback-email"
                      type="email"
                      value={feedbackData.email}
                      onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-category" className="text-sm font-medium mb-2 block">
                      Category
                    </label>
                    <select
                      id="feedback-category"
                      value={feedbackData.category}
                      onChange={(e) => setFeedbackData({ ...feedbackData, category: e.target.value })}
                      className="w-full p-2 rounded-lg border border-input bg-background text-sm"
                    >
                      <option value="general">General Feedback</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="content">Content Suggestion</option>
                      <option value="ui">UI/UX Improvement</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackData({ ...feedbackData, rating })}
                          className={`p-2 rounded-lg transition-colors ${
                            feedbackData.rating >= rating
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-primary"
                          }`}
                        >
                          <Star
                            className={`h-5 w-5 ${feedbackData.rating >= rating ? "fill-current" : ""}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="feedback-message" className="text-sm font-medium mb-2 block">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="feedback-message"
                      value={feedbackData.message}
                      onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                      required
                      rows={4}
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      className="w-full p-3 rounded-lg resize-none border border-input bg-background text-sm"
                    />
                  </div>
                  {feedbackMessage && (
                    <p
                      className={`text-sm ${
                        feedbackMessage.type === "success"
                          ? "text-primary"
                          : "text-destructive"
                      }`}
                    >
                      {feedbackMessage.text}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFeedbackOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmittingFeedback || !feedbackData.message.trim()} className="flex-1 whitespace-nowrap">
                      {isSubmittingFeedback ? (
                        "Submitting..."
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span>Submit Feedback</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Social Links */}
            {/* <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

