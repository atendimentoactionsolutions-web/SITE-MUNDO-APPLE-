"use client";

import React, { useEffect, useRef, useState } from "react";

const SESSION_KEY = "mundoapple_intro_seen";

type IntroPhase = "idle" | "playing" | "exiting" | "done";

export function BrandIntroSplash() {
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const hasTriggeredExitRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams(window.location.search);
    const forceReplay = params.get("intro") === "1";

    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      alreadySeen = false;
    }

    if (prefersReduced || (alreadySeen && !forceReplay)) {
      setPhase("done");
      return;
    }

    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Ignore storage quota or private-mode restrictions
    }

    setPhase("playing");

    const startExit = () => {
      if (hasTriggeredExitRef.current) return;
      hasTriggeredExitRef.current = true;
      if (exitTimerRef.current) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      setPhase("exiting");
      unmountTimerRef.current = setTimeout(() => {
        setPhase("done");
      }, 490);
    };

    // Choreographed beat: scooter (0-480ms) -> wordmark (140-580ms) -> subtitle (240-600ms)
    // Short 240ms settle beat -> exit begins at 840ms, curtain sweeps clear by ~1.31s
    exitTimerRef.current = setTimeout(startExit, 840);

    const handleEarlyDismiss = () => startExit();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        startExit();
      }
    };

    window.addEventListener("wheel", handleEarlyDismiss, { passive: true, once: true });
    window.addEventListener("touchmove", handleEarlyDismiss, { passive: true, once: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
      window.removeEventListener("wheel", handleEarlyDismiss);
      window.removeEventListener("touchmove", handleEarlyDismiss);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleTapDismiss = () => {
    if (hasTriggeredExitRef.current || phase !== "playing") return;
    hasTriggeredExitRef.current = true;
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    setPhase("exiting");
    unmountTimerRef.current = setTimeout(() => {
      setPhase("done");
    }, 490);
  };

  if (phase === "idle" || phase === "done") return null;

  const isExiting = phase === "exiting";

  return (
    <div
      role="presentation"
      aria-hidden="true"
      onClick={handleTapDismiss}
      className={`fixed inset-0 z-[9990] h-[100dvh] w-full bg-white flex items-center justify-center select-none intro-curtain ${
        isExiting ? "is-exiting pointer-events-none" : "cursor-pointer"
      }`}
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className={`intro-lockup flex flex-col items-center ${isExiting ? "is-exiting" : ""}`}>
        <div className="flex items-center gap-3.5 sm:gap-4">
          {/* Lead: Scooter icon glides into place with physical delivery momentum */}
          <img
            src="/images/brand/logo-icon.png?v=2"
            alt=""
            className="intro-scooter w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
          />

          <div className="flex flex-col items-start">
            {/* Support 1: Masked line reveal for the brand wordmark */}
            <div className="overflow-hidden py-0.5">
              <span className="intro-wordmark block font-display font-bold text-[24px] sm:text-[32px] leading-none tracking-[-0.03em] text-[#1D1D1F]">
                MUNDO APPLE
              </span>
            </div>

            {/* Decoration: Hairline accent synced to wordmark arrival */}
            <span className="intro-line block h-[1.5px] w-full bg-gradient-to-r from-[#1D1D1F] via-[#86868B]/60 to-transparent rounded-full mt-1.5" />

            {/* Support 2: Tracked DELIVERY label with shrinking stagger gap */}
            <span className="intro-subtitle block text-[10px] sm:text-[11px] font-semibold tracking-[0.26em] uppercase text-[#86868B] mt-1.5">
              DELIVERY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
