import { useEffect, useRef } from "react";

type Entrance = { revealed: boolean; animation?: Animation };
const cards = new Map<HTMLElement, Entrance>();
let observer: IntersectionObserver | undefined;
let motion: MediaQueryList | undefined;

function showCard(card: HTMLElement) {
  const state = cards.get(card);
  if (!state) return;
  state.revealed = true;
  state.animation?.cancel();
  state.animation = undefined;
  card.dataset.cardReveal = "visible";
  observer?.unobserve(card);
}

function reduceMotion() {
  if (motion?.matches) cards.forEach((_state, card) => showCard(card));
}

function animateCardIn(element: HTMLElement, state: Entrance) {
  const grid = element.parentElement;
  const siblings = grid
    ? [...grid.children].filter((item) => item.matches(".product-card"))
    : [element];
  const rawCols = grid ? getComputedStyle(grid).gridTemplateColumns.trim() : "";
  const columns = rawCols ? rawCols.split(/\s+/).length : 1;
  const index = Math.max(0, siblings.indexOf(element));
  const column = index % Math.max(1, columns);
  const direction = column < columns / 2 ? -1 : 1;

  // Responsive travel distance: smooth and crisp on both phones and desktops
  const isMobile = window.innerWidth <= 767;
  const distance = isMobile
    ? Math.min(48, Math.max(28, window.innerWidth * 0.1))
    : Math.min(88, Math.max(44, window.innerWidth * 0.065));

  // Subtle stagger within the same row for an effortless Apple-like cascade
  const distanceFromEdge = direction < 0 ? column : Math.max(0, columns - 1 - column);
  const delay = Math.min(180, distanceFromEdge * (isMobile ? 65 : 70));

  state.revealed = true;
  element.dataset.cardReveal = "entering";
  observer?.unobserve(element);

  state.animation = element.animate(
    [
      {
        transform: `translate3d(${direction * distance}px, 14px, 0) scale(0.985)`,
        opacity: 0,
      },
      {
        transform: "translate3d(0, 0, 0) scale(1)",
        opacity: 1,
      },
    ],
    {
      duration: isMobile ? 620 : 740,
      delay,
      fill: "both",
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    }
  );

  state.animation.onfinish = () => {
    state.animation?.cancel();
    state.animation = undefined;
    element.dataset.cardReveal = "visible";
  };
}

function observeCard(card: HTMLElement) {
  if (
    !card.parentElement?.classList.contains("product-grid") ||
    !("IntersectionObserver" in window) ||
    !card.animate
  ) {
    card.dataset.cardReveal = "visible";
    return () => {};
  }

  if (!observer) {
    motion = matchMedia("(prefers-reduced-motion: reduce)");
    motion.addEventListener("change", reduceMotion);
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const element = entry.target as HTMLElement;
          const state = cards.get(element);
          if (!state || state.revealed) continue;
          if (motion?.matches) {
            showCard(element);
            continue;
          }
          if (!entry.isIntersecting) {
            // If the user already scrolled past it, show it immediately
            if (entry.boundingClientRect.bottom < 0) {
              showCard(element);
            } else {
              element.dataset.cardReveal = "waiting";
            }
            continue;
          }
          if (element.closest("[inert]")) {
            element.dataset.cardReveal = "preview";
            continue;
          }
          animateCardIn(element, state);
        }
      },
      { rootMargin: "0px 0px -24px 0px", threshold: 0.02 }
    );
  }

  cards.set(card, { revealed: false });
  if (motion?.matches) {
    showCard(card);
  } else {
    card.dataset.cardReveal = "waiting";
    observer.observe(card);
  }

  const onFocus = () => showCard(card);
  card.addEventListener("focusin", onFocus);

  return () => {
    cards.get(card)?.animation?.cancel();
    cards.delete(card);
    observer?.unobserve(card);
    card.removeEventListener("focusin", onFocus);
    delete card.dataset.cardReveal;
    if (!cards.size) {
      observer?.disconnect();
      observer = undefined;
      motion?.removeEventListener("change", reduceMotion);
      motion = undefined;
    }
  };
}

export function useCardEntrance() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? observeCard(ref.current) : undefined), []);
  return ref;
}
