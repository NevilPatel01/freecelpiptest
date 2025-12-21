import { ContactPage } from "@/components/sections/contact-page"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | FreeCELPIPTest",
  description: "Get in touch with us. Have questions about CELPIP preparation? We're here to help!",
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactPageRoute() {
  return <ContactPage />
}

