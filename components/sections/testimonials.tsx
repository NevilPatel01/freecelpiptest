"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import { sectionHeader, cardItem } from "@/lib/animations"

const testimonials = [
  {
    name: "Sarah Chen",
    location: "Toronto, Canada",
    score: "CLB 9",
    text: "FreeCELPIPTest helped me achieve my target score! The practice tests were incredibly realistic and the study tips were invaluable.",
    rating: 5,
  },
  {
    name: "Raj Patel",
    location: "Vancouver, Canada",
    score: "CLB 10",
    text: "I couldn't believe all the resources were free. The writing section practice especially helped me improve my score significantly.",
    rating: 5,
  },
  {
    name: "Maria Garcia",
    location: "Calgary, Canada",
    score: "CLB 8",
    text: "As an international student, I was worried about the test. This platform gave me the confidence I needed. Highly recommend!",
    rating: 5,
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <motion.div
          className="text-center mb-12"
          initial={sectionHeader.initial}
          animate={isInView ? sectionHeader.animate : sectionHeader.initial}
          transition={sectionHeader.transition}
        >
          <h2 className="heading-2 mb-3 text-gradient-primary">Success Stories</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See how students are achieving their CELPIP goals with our free resources.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={cardItem(index).initial}
              animate={isInView ? cardItem(index).animate : cardItem(index).initial}
              transition={cardItem(index).transition}
            >
              <Card className="card-hover h-full card-elevated">
                <CardContent className="p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-primary/60 mb-3" />
                  <p className="text-muted-foreground mb-4 italic leading-relaxed text-sm">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-3 space-y-1.5">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    <div className="inline-block px-2.5 py-0.5 rounded-md gradient-primary text-white text-xs font-semibold shadow-sm">
                      {testimonial.score}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

