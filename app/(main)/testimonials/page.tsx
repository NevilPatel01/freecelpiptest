import type { Metadata } from "next"
import { ComingSoon } from "@/components/ui/coming-soon"

export const metadata: Metadata = {
  title: "Testimonials Coming Soon | FreeCELPIPTest",
  description: "Student testimonials and success stories will be added soon. Check back later!",
  alternates: {
    canonical: "/testimonials",
  },
}

export default function TestimonialsPageRoute() {
  return (
    <ComingSoon
      title="Testimonials Coming Soon"
      description="We'll be adding real student testimonials and success stories once we have verified feedback from CELPIP test takers."
      showNewsletter={false}
    />
  )
}

