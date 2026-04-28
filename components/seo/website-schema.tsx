import { getSiteUrl, APP_NAME } from "@/lib/constants"

export function WebsiteSchema() {
  const siteUrl = getSiteUrl()
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: siteUrl,
    description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
    inLanguage: "en-CA",
    audience: {
      "@type": "Audience",
      audienceType: "CELPIP test takers, immigrants, international students",
    },
    about: [
      "CELPIP Listening",
      "CELPIP Reading",
      "CELPIP Writing",
      "CELPIP Speaking",
      "Canadian Language Benchmark (CLB)",
    ],
    publisher: {
      "@type": "Organization",
      name: APP_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/logo-bg.png`,
      },
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

