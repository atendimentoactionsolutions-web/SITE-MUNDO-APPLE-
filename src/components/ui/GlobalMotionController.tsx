"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AUTO_REVEAL_SELECTOR = [
  "[data-reveal]",
  "main section article:not(.product-card)",
  ".catalog-section .section-heading",
  ".catalog-section .catalog-toolbar",
  "footer > div",
].join(", ");

export function GlobalMotionController() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches || !("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>("[data-scroll-state]").forEach((el) => {
        el.dataset.scrollState = "visible";
      });
      return;
    }

    const observed = new WeakSet<HTMLElement>();
    const firstHeroArticle = document.querySelector<HTMLElement>(
      "main section:first-of-type article:first-of-type"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            const delay = el.dataset.revealDelay;
            if (delay) {
              el.style.transitionDelay = `${delay}ms`;
            }
            el.dataset.scrollState = "visible";
            observer.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -36px 0px", threshold: 0.04 }
    );

    const registerElements = () => {
      const candidates = document.querySelectorAll<HTMLElement>(AUTO_REVEAL_SELECTOR);
      candidates.forEach((el) => {
        if (observed.has(el)) return;
        if (el.closest(".product-card")) return;
        if (el.closest("[data-no-reveal]")) return;

        // Keep the very first hero immediately visible for crisp LCP
        if (el === firstHeroArticle) {
          el.dataset.scrollState = "visible";
          observed.add(el);
          return;
        }

        // If already in the top portion of viewport on initial paint, gently reveal without hiding
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0 && window.scrollY < 40) {
          el.dataset.scrollState = "visible";
          observed.add(el);
          return;
        }

        if (!el.dataset.reveal) {
          el.dataset.reveal = "up";
        }
        el.dataset.scrollState = "hidden";
        observed.add(el);
        observer.observe(el);
      });
    };

    registerElements();

    const mutationObserver = new MutationObserver(() => {
      registerElements();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    const onReduceChange = () => {
      if (prefersReduced.matches) {
        document.querySelectorAll<HTMLElement>("[data-scroll-state]").forEach((el) => {
          el.dataset.scrollState = "visible";
        });
      }
    };
    prefersReduced.addEventListener("change", onReduceChange);

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      prefersReduced.removeEventListener("change", onReduceChange);
    };
  }, [pathname]);

  return null;
}
