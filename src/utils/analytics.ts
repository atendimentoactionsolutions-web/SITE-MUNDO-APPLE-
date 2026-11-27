export const DEFAULT_GA_ID = "G-E7RMZF7WHJ";
export const DEFAULT_GOOGLE_ADS_ID = "AW-11431143183";
export const GOOGLE_ADS_CONTATO_SEND_TO = "AW-11431143183/u_39CMjq4MAdEI_O5coq";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __adsContatoPageTrackedPath?: string;
  }
}

/**
 * Fires the Google Ads "Contato" conversion event (AW-11431143183/u_39CMjq4MAdEI_O5coq).
 */
export function trackGoogleAdsContatoConversion(
  sendTo: string = GOOGLE_ADS_CONTATO_SEND_TO
): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  window.gtag("event", "conversion", { send_to: sendTo });
  return true;
}

/**
 * Tracks outbound WhatsApp leads in GA4 and fires the Google Ads Contato conversion.
 */
export function trackWhatsAppLead(label: string, pagePath?: string): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "whatsapp_click", {
    event_category: "lead",
    event_label: label,
    page_path: pagePath || window.location.pathname,
  });
  trackGoogleAdsContatoConversion();
}
