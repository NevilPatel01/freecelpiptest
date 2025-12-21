export function OrganizationSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreeCELPIPTest",
    url: "https://freecelpiptest.com",
    logo: "https://freecelpiptest.com/assets/logo-bg.png",
    description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
    sameAs: [
      // Add social media links if available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: "https://freecelpiptest.com/contact",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://freecelpiptest.com/blog?search={search_term_string}",
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

