import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | FreeCELPIPTest",
  description: "Terms of Service for FreeCELPIPTest. Read our terms and conditions for using our CELPIP test preparation platform.",
  alternates: {
    canonical: "/terms",
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14 max-w-4xl">
      <div className="mb-8">
        <h1 className="heading-2 mb-4 text-gradient-primary">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-foreground 
        prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-10 prose-h1:scroll-mt-20 prose-h1:leading-tight
        prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:scroll-mt-20 prose-h2:leading-tight
        prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:scroll-mt-20 prose-h3:leading-tight
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-ul:space-y-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6 prose-ol:space-y-2
        prose-li:mb-2 prose-li:text-foreground/90 prose-li:leading-relaxed">
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using FreeCELPIPTest ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
        </p>

        <h2>2. Disclaimer</h2>
        <p>
          <strong>Important:</strong> FreeCELPIPTest is NOT affiliated with, endorsed by, or connected to CELPIP (Canadian English Language Proficiency Index Program) or Paragon Testing Enterprises. We are an independent educational resource providing practice materials and study guides.
        </p>
        <ul>
          <li>Our practice materials are for educational purposes only</li>
          <li>We do not guarantee that our practice tests reflect the exact format or difficulty of the official CELPIP test</li>
          <li>Test scores and results from our practice materials are not official and should not be used as a guarantee of actual test performance</li>
          <li>We are not responsible for any decisions made based on information from our website</li>
        </ul>

        <h2>3. Use of Service</h2>
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul>
          <li>Use the Service in any way that violates any applicable law or regulation</li>
          <li>Attempt to gain unauthorized access to any portion of the Service</li>
          <li>Reproduce, duplicate, copy, or sell any portion of the Service without permission</li>
          <li>Use automated systems (bots, scrapers) to access the Service</li>
          <li>Interfere with or disrupt the Service or servers connected to the Service</li>
          <li>Transmit any viruses, malware, or other harmful code</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          The Service and its original content, features, and functionality are owned by FreeCELPIPTest and are protected by international copyright, trademark, and other intellectual property laws.
        </p>
        <p>
          You may not modify, reproduce, distribute, create derivative works, publicly display, or commercially exploit any content from the Service without our express written permission.
        </p>

        <h2>5. User Accounts</h2>
        <p>
          When you create an account using Google OAuth, you are responsible for:
        </p>
        <ul>
          <li>Maintaining the security of your account</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use</li>
        </ul>
        <p>
          We reserve the right to suspend or terminate accounts that violate these Terms.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, FreeCELPIPTest shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including:
        </p>
        <ul>
          <li>Loss of profits, data, or other intangible losses</li>
          <li>Damages resulting from your use or inability to use the Service</li>
          <li>Any errors or omissions in the content</li>
          <li>Any decisions made based on information from our Service</li>
        </ul>

        <h2>7. Termination</h2>
        <p>
          We may terminate or suspend your access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after changes become effective constitutes acceptance of the new terms.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.
        </p>

        <h2>10. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us:
        </p>
        <p>
          <Link href="/contact">Through our contact form</Link>
        </p>
      </div>
    </div>
  )
}

