"use client"

import { motion } from "framer-motion"
import { Clock, Mail, TrendingUp, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface ComingSoonProps {
  title: string
  description: string
  features?: string[]
  showNewsletter?: boolean
  relatedLinks?: Array<{ name: string; href: string; description: string }>
}

export function ComingSoon({
  title,
  description,
  features = [],
  showNewsletter = true,
  relatedLinks = [],
}: ComingSoonProps) {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="heading-2 mb-4 text-gradient-primary">{title}</h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>

      {features.length > 0 && (
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="card-modern card-elevated">
            <CardHeader>
              <CardTitle className="text-xl font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                What's Coming
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {showNewsletter && (
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="card-modern card-elevated border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg font-semibold">Get Notified When Available</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Be the first to know when we launch. Sign up for updates and get early access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full sm:w-auto" asChild>
                <Link href="/contact">Sign Up for Updates</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {relatedLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Explore Our Available Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedLinks.map((link, index) => (
              <Card key={index} className="card-hover card-elevated">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">{link.name}</CardTitle>
                  <CardDescription className="text-sm">{link.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={link.href}>Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

