export function WebsiteSchema() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreeCELPIPTest",
    url: "https://freecelpiptest.com",
    description: "Comprehensive CELPIP test preparation platform with practice tests, study guides, and expert tips for all 4 test sections to help you achieve your target score.",
    publisher: {
      "@type": "Organization",
      name: "FreeCELPIPTest",
      logo: {
        "@type": "ImageObject",
        url: "https://freecelpiptest.com/assets/logo-bg.png",
      },
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

