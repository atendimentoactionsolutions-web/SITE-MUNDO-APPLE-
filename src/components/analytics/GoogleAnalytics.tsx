"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
  DEFAULT_GA_ID,
  DEFAULT_GOOGLE_ADS_ID,
  GOOGLE_ADS_CONTATO_SEND_TO,
  trackGoogleAdsContatoConversion,
  trackWhatsAppLead,
} from "@/utils/analytics";

interface GoogleAnalyticsProps {
  gaId?: string;
  adsId?: string;
}

function isContatoPath(path: string): boolean {
  return path === "/contato" || path === "/contato/";
}

export const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  gaId = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID,
  adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || DEFAULT_GOOGLE_ADS_ID,
}) => {
  const pathname = usePathname();
  const primaryTagId = gaId || adsId;

  // Track client-side route transitions and /contato conversion page visits
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isContatoPath(pathname)) {
      window.__adsContatoPageTrackedPath = undefined;
    }

    if (typeof window.gtag !== "function") return;

    if (gaId) {
      window.gtag("config", gaId, {
        page_path: pathname,
      });
    }

    if (adsId && isContatoPath(pathname) && window.__adsContatoPageTrackedPath !== pathname) {
      window.__adsContatoPageTrackedPath = pathname;
      trackGoogleAdsContatoConversion();
    }
  }, [gaId, adsId, pathname]);

  // Track outbound WhatsApp clicks and window.open calls for lead & Google Ads conversion reporting
  useEffect(() => {
    if (!primaryTagId || typeof window === "undefined") return;
    const isWhatsAppUrl = (href: string) =>
      href.includes("wa.me") || href.includes("api.whatsapp.com");

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (isWhatsAppUrl(href)) {
        trackWhatsAppLead(anchor.textContent?.trim() || "WhatsApp", window.location.pathname);
      }
    };

    const originalOpen = window.open;
    window.open = function (url?: string | URL, target?: string, features?: string) {
      const urlStr = typeof url === "string" ? url : url?.toString() || "";
      if (isWhatsAppUrl(urlStr)) {
        trackWhatsAppLead("WhatsApp Button", window.location.pathname);
      }
      return originalOpen.call(window, url, target, features);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      window.open = originalOpen;
    };
  }, [primaryTagId]);

  if (!primaryTagId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryTagId}`}
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
            ${gaId ? `gtag('config', '${gaId}', { page_path: window.location.pathname });` : ""}
            ${adsId ? `gtag('config', '${adsId}');` : ""}
            if (window.location.pathname === '/contato' || window.location.pathname === '/contato/') {
              window.__adsContatoPageTrackedPath = window.location.pathname;
              gtag('event', 'conversion', {'send_to': '${GOOGLE_ADS_CONTATO_SEND_TO}'});
            }
          `,
        }}
      />
    </>
  );
};
