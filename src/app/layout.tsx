import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { storeConfig } from "@/data/storeConfig";

export const revalidate = 60; // Revalidação a cada 60 segundos com o buscador em tempo real

export const metadata: Metadata = {
  metadataBase: new URL("https://mundoappledelivery.com"),
  title: {
    default: `${storeConfig.name} | Produtos Apple Novos, Troca & Assistência Especializada`,
    template: `%s | ${storeConfig.name}`,
  },
  description: "Compre iPhones, MacBooks, iPads, Apple Watch e AirPods novos e lacrados com 1 ano de garantia oficial Apple e entrega rápida em São Paulo. Faça Upgrade dando seu iPhone usado na troca ou venda seu aparelho com pagamento via PIX imediato.",
  keywords: [
    "Mundo Apple Delivery",
    "Mundo Apple São Paulo",
    "Loja Apple São Paulo",
    "Loja Apple Santa Ifigênia",
    "Comprar iPhone São Paulo",
    "Comprar iPhone Lacrado SP",
    "iPhone Entrega Rápida SP",
    "iPhone Motoboy São Paulo",
    "iPhone 17 Pro Max preço",
    "iPhone 17 Pro preço",
    "iPhone 17 Air",
    "iPhone 17e",
    "iPhone 17",
    "iPhone 16 Pro Max preço SP",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 16e",
    "iPhone 15 novo lacrado",
    "Vender iPhone usado SP",
    "Vender iPhone pagamento na hora PIX",
    "Onde vender iPhone usado em São Paulo",
    "Compramos seu iPhone usado SP",
    "Avaliação de iPhone online",
    "Upgrade de iPhone SP",
    "Dar iPhone usado na troca",
    "Troca de iPhone São Paulo",
    "Trade-in iPhone Apple SP",
    "Simulador de troca iPhone",
    "MacBook Air M4 preço",
    "MacBook Pro M4",
    "MacBook Pro M5",
    "MacBook Air M5",
    "Comprar MacBook São Paulo",
    "iPad Pro M4",
    "iPad Pro M5",
    "iPad Air M3",
    "Apple Watch Series 11",
    "Apple Watch Ultra 3",
    "AirPods Pro 2",
    "AirPods 4",
    "AirPods Max",
    "Assistência Técnica Apple Santa Ifigênia",
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Como funciona para vender meu iPhone usado na Mundo Apple?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Você faz a avaliação online em menos de 1 minuto no nosso site informando modelo, capacidade, saúde da bateria e estado do aparelho. O pagamento é feito à vista via PIX imediatamente após a conferência presencial em São Paulo."
        }
      },
      {
        "@type": "Question",
        "name": "Posso dar meu iPhone usado como entrada na troca (Upgrade) por um novo lacrado?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! No programa de Upgrade (Trade-In) da Mundo Apple Delivery, seu iPhone usado entra como parte do pagamento na compra de qualquer iPhone, MacBook, iPad ou Apple Watch novo lacrado, e você paga apenas a diferença no PIX ou em até 18x no cartão."
        }
      },
      {
        "@type": "Question",
        "name": "Os aparelhos novos possuem garantia oficial da Apple?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, todos os produtos novos são 100% originais, lacrados de fábrica e contam com 1 ano de garantia oficial Apple Brasil."
        }
      },
      {
        "@type": "Question",
        "name": "A Mundo Apple faz entrega rápida em São Paulo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, realizamos entrega expressa via motoboy/portador credenciado em São Paulo e região, inclusive com retirada simultânea do seu aparelho usado na troca."
        }
      }
    ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <GoogleAnalytics />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
