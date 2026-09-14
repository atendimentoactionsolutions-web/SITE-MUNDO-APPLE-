import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/common/FloatingWhatsApp";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { storeConfig } from "@/data/storeConfig";

export const metadata: Metadata = {
  metadataBase: new URL("https://mundoappledelivery.com"),
  title: {
    default: `${storeConfig.name} | Produtos Apple Novos, Troca & Assistência Especializada`,
    template: `%s | ${storeConfig.name}`,
  },
  description: "Compre iPhones, MacBooks, iPads e AirPods novos lacrados com 1 ano de garantia oficial Apple. Faça o Trade-in do seu usado ou venda com pagamento via PIX imediato em São Paulo.",
  keywords: [
    "Mundo Apple Delivery",
    "iPhone 17 Pro Max",
    "iPhone 16 Pro Max",
    "MacBook Pro M5",
    "MacBook Air M5",
    "iPad Pro M5",
    "AirPods Max",
    "Apple Watch Series 11",
    "Trade-in iPhone",
    "Troca de iPhone",
    "Comprar iPhone São Paulo",
    "Assistência Técnica Apple Santa Ifigênia",
    "Vender iPhone PIX",
  ],
  authors: [{ name: storeConfig.name }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://mundoappledelivery.com",
    title: "Mundo Apple Delivery | Produtos Apple Novos, Troca & Assistência",
    description: "iPhones e produtos Apple novos e lacrados com 1 ano de garantia oficial. Avaliação imediata do seu usado na troca e pagamento via PIX na hora.",
    siteName: "Mundo Apple Delivery",
    images: [
      {
        url: "https://mundoappledelivery.com/images/hero/hero-main.jpg",
        width: 1200,
        height: 630,
        alt: "Mundo Apple Delivery - Loja Oficial em São Paulo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mundo Apple Delivery | Produtos Apple Novos, Troca & Assistência",
    description: "iPhones e produtos Apple novos e lacrados com 1 ano de garantia oficial. Avaliação imediata do seu usado na troca e pagamento via PIX na hora.",
    images: ["https://mundoappledelivery.com/images/hero/hero-main.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mundoappledelivery.com",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "ElectronicsStore",
    "name": storeConfig.name,
    "image": `https://mundoappledelivery.com/images/hero/hero-main.jpg`,
    "telephone": storeConfig.contact.whatsappFormatted,
    "priceRange": "$$$",
    "url": "https://mundoappledelivery.com",
    "hasMap": storeConfig.address.googleMapsUrl,
    "sameAs": [
      storeConfig.contact.instagramUrl,
      storeConfig.address.googleMapsUrl
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": `${storeConfig.address.street} - ${storeConfig.address.storeNumber}`,
      "addressLocality": storeConfig.address.city,
      "addressRegion": storeConfig.address.state,
      "postalCode": storeConfig.address.zipCode,
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.5396,
      "longitude": -46.6394
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "15:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": storeConfig.socialProof.googleRating,
      "reviewCount": storeConfig.socialProof.googleReviewsCount,
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": storeConfig.name,
    "url": "https://mundoappledelivery.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://mundoappledelivery.com/produtos?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <GoogleAnalytics />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
