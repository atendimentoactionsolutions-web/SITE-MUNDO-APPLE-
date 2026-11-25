"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const DEFAULT_GA_ID = "G-E7RMZF7WHJ";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface GoogleAnalyticsProps {
  gaId?: string;
}

export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  gaId = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID,
}) => {
  const pathname = usePathname();

  // Track client-side route transitions in Next.js App Router
  useEffect(() => {
    if (!gaId || typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("config", gaId, {
      page_path: pathname,
    });
  }, [gaId, pathname]);

  // Track outbound WhatsApp clicks for lead conversion reporting
  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        window.gtag?.("event", "whatsapp_click", {
          event_category: "lead",
          event_label: anchor.textContent?.trim() || "WhatsApp",
          page_path: window.location.pathname,
        });
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [gaId]);

  if (!gaId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};
