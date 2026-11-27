"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AUTO_REVEAL_SELECTOR = [
  "[data-reveal]",
  ".catalog-section .section-heading",
  ".catalog-section .catalog-toolbar",
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

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            const delay = el.dataset.revealDelay;
            if (delay && entry.isIntersecting) {
              el.style.transitionDelay = `${delay}ms`;
              const clearDelay = () => {
                el.style.transitionDelay = "";
                el.removeEventListener("transitionend", clearDelay);
              };
              el.addEventListener("transitionend", clearDelay, { once: true });
            }
            el.dataset.scrollState = "visible";
            observer.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -24px 0px", threshold: 0.02 }
    );

    const registerElements = () => {
      const candidates = document.querySelectorAll<HTMLElement>(AUTO_REVEAL_SELECTOR);
      candidates.forEach((el) => {
        if (observed.has(el)) return;
        if (el.closest(".product-card")) return;
        if (el.closest("[data-no-reveal]")) return;

        // Choreograph Hard Rule 1: never double-animate a child inside an animated container
        if (el.parentElement?.closest("[data-reveal]")) return;

        // If already in viewport on initial paint, reveal immediately without hiding
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0 && window.scrollY < 40) {
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

    let scanRaf = 0;
    const mutationObserver = new MutationObserver(() => {
      if (scanRaf) return;
      scanRaf = window.requestAnimationFrame(() => {
        scanRaf = 0;
        registerElements();
      });
    });
    const rootTarget = document.querySelector("main") || document.body;
    mutationObserver.observe(rootTarget, { childList: true, subtree: true });

    const onReduceChange = () => {
      if (prefersReduced.matches) {
        document.querySelectorAll<HTMLElement>("[data-scroll-state]").forEach((el) => {
          el.style.transitionDelay = "";
          el.dataset.scrollState = "visible";
        });
      }
    };
    prefersReduced.addEventListener("change", onReduceChange);

    return () => {
      if (scanRaf) window.cancelAnimationFrame(scanRaf);
      observer.disconnect();
      mutationObserver.disconnect();
      prefersReduced.removeEventListener("change", onReduceChange);
    };
  }, [pathname]);

  return null;
}
