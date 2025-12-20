"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote, Play } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Sarah Chen",
    location: "Toronto, Canada",
    score: "CLB 9",
    improvement: "+2 points",
    text: "FreeCELPIPTest helped me prepare effectively! The practice exercises and study tips were very helpful for my test preparation.",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Raj Patel",
    location: "Vancouver, Canada",
    score: "CLB 10",
    improvement: "+3 points",
    text: "I couldn't believe all the resources were free. The writing section practice especially helped me improve my score significantly. The email templates were a game-changer!",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Maria Garcia",
    location: "Calgary, Canada",
    score: "CLB 8",
    improvement: "+1 point",
    text: "As an international student, I was worried about the test. This platform gave me the confidence I needed. The speaking practice tips were particularly helpful. Highly recommend!",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Ahmed Hassan",
    location: "Montreal, Canada",
    score: "CLB 9",
    improvement: "+2 points",
    text: "The listening practice tests were spot-on. I felt well-prepared on test day. The free resources here are better than some paid courses I tried before.",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Li Wei",
    location: "Edmonton, Canada",
    score: "CLB 8",
    improvement: "+2 points",
    text: "I used the study guides and practice tests daily for 6 weeks. The improvement was remarkable. The reading comprehension strategies really helped me understand the passages better.",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
  {
    name: "Priya Sharma",
    location: "Ottawa, Canada",
    score: "CLB 10",
    improvement: "+3 points",
    text: "This is the best free resource I found. The blog posts with tips and strategies were incredibly useful. I achieved my target score and got my PR approved!",
    rating: 5,
    image: "/placeholder-avatar.png",
  },
]

export function TestimonialsPage() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div className="container mx-auto container-padding py-10 md:py-14">
      <motion.div
        className="text-center mb-12 md:mb-16"
        initial={sectionHeader.initial}
        animate={sectionHeader.animate}
        transition={sectionHeader.transition}
      >
        <h1 className="heading-2 mb-4 text-gradient-primary">Success Stories</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          See how students are achieving their CELPIP goals with our free practice materials.
        </p>
      </motion.div>

      <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={cardItem(index).initial}
            animate={isInView ? cardItem(index).animate : cardItem(index).initial}
            transition={cardItem(index).transition}
          >
            <Card className="card-hover h-full card-elevated">
              <CardContent className="p-5">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="h-7 w-7 text-primary/60 mb-4" />
                <p className="text-muted-foreground mb-6 italic line-clamp-4 leading-relaxed text-sm">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-base">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Achieved Score</p>
                      <div className="inline-block px-2.5 py-1 rounded-lg gradient-primary text-white text-xs font-semibold shadow-sm">
                        {testimonial.score}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Improvement</p>
                      <div className="inline-block px-2.5 py-1 rounded-lg gradient-primary text-white text-xs font-semibold shadow-sm">
                        {testimonial.improvement}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="card-modern rounded-xl p-6 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Share Your Success Story</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Did you achieve your CELPIP goal using our resources? We'd love to hear from you!
        </p>
        <Button>Contact Us to Share Your Story</Button>
      </motion.div>
    </div>
  )
}

