import { getSiteUrl, APP_NAME } from "@/lib/constants"

export function OrganizationSchema() {
  const siteUrl = getSiteUrl()
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_NAME,
    url: siteUrl,
    logo: `${siteUrl}/assets/logo-bg.png`,
    description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
    knowsAbout: [
      "CELPIP test preparation",
      "CELPIP Listening",
      "CELPIP Reading",
      "CELPIP Writing",
      "CELPIP Speaking",
      "CLB scoring",
      "Canadian immigration language requirements",
    ],
    sameAs: [
      // Add social media profile URLs when available (helps search + knowledge panels)
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: `${siteUrl}/contact`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

