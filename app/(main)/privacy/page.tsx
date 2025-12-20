import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | FreeCELPIPTest",
  description: "Privacy Policy for FreeCELPIPTest. Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "/privacy",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto container-padding py-10 md:py-14 max-w-4xl">
      <div className="mb-8">
        <h1 className="heading-2 mb-4 text-gradient-primary">Privacy Policy</h1>
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
        
        <h2>1. Introduction</h2>
        <p>
          FreeCELPIPTest ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website freecelpiptest.com (the "Service").
        </p>
        <p>
          By using our Service, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2>2. Information We Collect</h2>
        
        <h3>2.1 Information You Provide</h3>
        <ul>
          <li>Account information (name, email address) when you sign up using Google OAuth</li>
          <li>Newsletter subscription email addresses</li>
          <li>Feedback and contact form submissions</li>
          <li>Any other information you voluntarily provide</li>
        </ul>

        <h3>2.2 Automatically Collected Information</h3>
        <ul>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>IP address</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To provide and maintain our Service</li>
          <li>To send you newsletters and updates (with your consent)</li>
          <li>To respond to your inquiries and provide customer support</li>
          <li>To improve our website and user experience</li>
          <li>To analyze usage patterns and trends</li>
          <li>To detect and prevent fraud or abuse</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          We use third-party services that may collect information used to identify you:
        </p>
        <ul>
          <li><strong>Google OAuth:</strong> For authentication. Please review Google's Privacy Policy.</li>
          <li><strong>Analytics:</strong> We may use analytics services to understand website usage.</li>
          <li><strong>Hosting:</strong> Our website is hosted on third-party servers that may process your data.</li>
        </ul>

        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your personal information</li>
          <li>Opt-out of marketing communications</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>8. Children's Privacy</h2>
        <p>
          Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
        </p>

        <h2>9. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <p>
          <Link href="/contact">Through our contact form</Link>
        </p>
      </div>
    </div>
  )
}

