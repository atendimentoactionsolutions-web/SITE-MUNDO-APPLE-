"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { SearchModal } from "@/components/layout/SearchModal";
import { AppleLogo } from "@/components/ui/AppleLogo";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [bagOpen, setBagOpen] = useState(false);
  const bagRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menus on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
    setBagOpen(false);
    setSearchModalOpen(false);
  }, [pathname]);

  // Keep the page still while the mobile navigation is open.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileMenuOpen]);

  // Close bag when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bagRef.current && !bagRef.current.contains(event.target as Node)) {
        setBagOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBagOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setMobileMenuOpen(false);
        setBagOpen(false);
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems = [
    { label: "Loja", href: "/#catalogo" },
    { label: "Mac", href: "/mac" },
    { label: "iPad", href: "/ipad" },
    { label: "iPhone", href: "/iphone" },
    { label: "Watch", href: "/apple-watch" },
    { label: "AirPods", href: "/airpods" },
    { label: "Upgrade / Troca", href: "/troca" },
    { label: "Vender", href: "/vender" },
    { label: "Acessórios", href: "/acessorios" },
  ];

  return (
    <>
      {/* ── Official Full-Width Dark GlobalNav Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-11 sm:h-12 bg-[rgba(22,22,23,0.8)] backdrop-blur-xl border-b border-white/[0.08] transition-all">
        <div className="max-w-[1024px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo Apple (Left) */}
          <Link
            href="/"
            aria-label="Página inicial"
            className="flex items-center group opacity-80 hover:opacity-100 transition-opacity select-none py-1"
          >
            <AppleLogo className="w-4 h-4 text-white" />
          </Link>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center gap-4 text-[12px] font-normal text-[#CECECF]">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`hover:text-white transition-colors duration-200 tracking-tight whitespace-nowrap ${
                    isActive ? "text-white font-medium" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Search + Bag + Mobile Menu) */}
          <div className="flex items-center gap-0 sm:gap-1 text-[#CECECF]">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setBagOpen(false); setSearchModalOpen(true); }}
              className="w-11 h-11 flex items-center justify-center hover:text-white transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => { setBagOpen(false); setMobileMenuOpen(!mobileMenuOpen); }}
              className="lg:hidden w-11 h-11 flex items-center justify-center hover:text-white transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </header>

        {/* Mobile Fullscreen Navigation Dropdown */}
        {mobileMenuOpen && (
          <div id="mobile-navigation" className="lg:hidden fixed inset-x-0 top-11 sm:top-12 bottom-0 bg-[#000000]/95 backdrop-blur-2xl z-40 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-4 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-medium text-zinc-200 hover:text-white transition-colors flex items-center justify-between py-1 border-b border-white/5"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-3 bg-[#0071E3] text-white text-sm font-medium rounded-full"
              >
                Falar com Consultor no WhatsApp
              </a>

            </div>
          </div>
        )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};
