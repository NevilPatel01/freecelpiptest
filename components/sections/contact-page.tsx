"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MessageSquare, HelpCircle, Send, CheckCircle2 } from "lucide-react"
import { sectionHeader, slideUp } from "@/lib/animations"

const faqs = [
  {
    question: "Is FreeCELPIPTest really free?",
    answer: "Yes! All our practice tests, study guides, and resources are completely free. We're committed to providing free CELPIP preparation materials forever.",
  },
  {
    question: "Do I need to create an account?",
    answer: "Creating an account is optional but recommended. It allows you to save your progress, bookmark articles, and get notified when new features are available.",
  },
  {
    question: "Are the practice tests similar to the real CELPIP test?",
    answer: "Our practice tests are designed to mirror the format and difficulty of the actual CELPIP test. However, we are not affiliated with CELPIP, so these are practice materials only.",
  },
  {
    question: "When will full mock tests be available?",
    answer: "We're working on complete mock tests with scoring. Sign up for our newsletter to get notified when they're ready!",
  },
  {
    question: "Can I use this website on mobile?",
    answer: "Yes! Our website is fully responsive and works great on mobile devices, tablets, and desktops.",
  },
  {
    question: "How can I improve my CELPIP score?",
    answer: "Practice regularly with our materials, focus on your weakest sections, read our blog for tips and strategies, and take full-length practice tests to build stamina.",
  },
]

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })

    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div className="container mx-auto container-padding py-12 md:py-16">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-4 text-gradient-primary">Contact Us</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Have questions? We'd love to hear from you. Get in touch and we'll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card className="card-modern card-elevated">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Send us a Message</CardTitle>
              <CardDescription className="text-sm">
                Fill out the form below and we'll get back to you within 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-md">
                    <CheckCircle2 className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-base font-semibold mb-1.5 text-gradient-primary">Message Sent!</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We've received your message and will get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium mb-2 block">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium mb-2 block">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      className="w-full p-4 rounded-lg resize-none border border-input bg-background"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full whitespace-nowrap">
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span>Send Message</span>
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <div>
          <Card className="card-modern card-elevated">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Email</p>
                  <p className="text-xs text-muted-foreground">contact@freecelpiptest.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Response Time</p>
                  <p className="text-xs text-muted-foreground">24-48 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQs Below Contact Form */}
      <motion.div
        initial={slideUp.initial}
        animate={slideUp.animate}
        transition={{ ...slideUp.transition, delay: 0.3 }}
        className="mt-12"
      >
        <Card className="card-modern card-elevated">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription className="text-sm">
              Find answers to common questions about FreeCELPIPTest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <p className="font-semibold text-sm mb-2">{faq.question}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

