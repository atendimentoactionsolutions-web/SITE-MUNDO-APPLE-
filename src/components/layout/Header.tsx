"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Menu, X, ChevronDown, Search, ArrowRight } from "lucide-react";
import { storeConfig } from "@/data/storeConfig";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";
import { SearchModal } from "@/components/layout/SearchModal";
import { AppleLogo } from "@/components/ui/AppleLogo";

const catalogCategories = [
  { label: "iPhone", href: "/iphone", description: "Linha completa novos e seminovos" },
  { label: "MacBook", href: "/mac", description: "MacBook Air e Pro com M4/M5" },
  { label: "iPad", href: "/ipad", description: "iPad Pro, Air, mini e 11ª geração" },
  { label: "Apple Watch", href: "/apple-watch", description: "Series 11, Ultra 3 e SE" },
  { label: "AirPods", href: "/airpods", description: "AirPods 4, Pro e Max" },
  { label: "Mac", href: "/mac", description: "iMac e Mac mini de alta potência" },
  { label: "Acessórios", href: "/acessorios", description: "Magic Mouse, Apple Pencil e AirTag originais" },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCatalogDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on navigate
  useEffect(() => {
    setMobileMenuOpen(false);
    setCatalogDropdownOpen(false);
  }, [pathname]);

  // Global shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {/* ── Fixed Clean White Capsule Header Container ── */}
      <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none flex justify-center">
        <div
          className={`pointer-events-auto w-full max-w-[1220px] h-[64px] sm:h-[68px] bg-white/90 backdrop-blur-xl border border-[#D2D2D7]/80 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 px-4 sm:px-6 flex items-center justify-between ${
            scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-white/95 border-[#D2D2D7]" : ""
          }`}
        >
          {/* Logo (Left) */}
          <Link
            href="/"
            aria-label="Mundo Apple Delivery — Página inicial"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80 select-none shrink-0"
          >
            {/* Apple Icon */}
            <AppleLogo className="w-5 h-5 text-[#1D1D1F]" />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-sm sm:text-base text-[#1D1D1F] tracking-tight font-display">
                MUNDO APPLE
              </span>
              <span className="text-[8px] sm:text-[9px] text-[#86868B] font-semibold tracking-widest uppercase">
                DELIVERY
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-semibold text-[#1D1D1F]">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname === "/" ? "text-[#0071E3] bg-[#F5F5F7]" : "hover:text-[#0071E3] hover:bg-[#F5F5F7]"
              }`}
            >
              Home
            </Link>

            <Link
              href="/sobre"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname === "/sobre" ? "text-[#0071E3] bg-[#F5F5F7]" : "hover:text-[#0071E3] hover:bg-[#F5F5F7]"
              }`}
            >
              Sobre nós
            </Link>

            {/* Catálogos Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                className={`px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1 ${
                  catalogDropdownOpen || pathname.startsWith("/produtos") || pathname === "/iphone" || pathname === "/mac" || pathname === "/ipad" || pathname === "/apple-watch" || pathname === "/airpods" || pathname === "/acessorios"
                    ? "text-[#0071E3] bg-[#F5F5F7]"
                    : "hover:text-[#0071E3] hover:bg-[#F5F5F7]"
                }`}
              >
                <span>Catálogos</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catalogDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {catalogDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white border border-[#D2D2D7]/80 rounded-3xl p-3 shadow-[0_8px_40px_rgba(0,0,0,0.15)] space-y-1 animate-in fade-in zoom-in-95 duration-150 z-[9999]">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#86868B] font-semibold border-b border-[#E5E5E7] mb-1">
                    Linha Apple Completa
                  </div>
                  {catalogCategories.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setCatalogDropdownOpen(false)}
                      className="block px-3 py-2 rounded-2xl hover:bg-[#F5F5F7] transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1D1D1F] text-xs sm:text-sm group-hover:text-[#0071E3] transition-colors tracking-[-0.011em]">
                          {cat.label}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <p className="text-[10px] text-[#6E6E73] mt-0.5 leading-tight">
                        {cat.description}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/garantia"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname === "/garantia" ? "text-[#0071E3] bg-[#F5F5F7]" : "hover:text-[#0071E3] hover:bg-[#F5F5F7]"
              }`}
            >
              Garantia
            </Link>

            <Link
              href="/vender"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                pathname === "/vender" ? "text-emerald-700 bg-emerald-50 font-bold" : "hover:text-emerald-700 hover:bg-emerald-50"
              }`}
            >
              Vender iPhone
            </Link>

            <Link
              href="/#faq"
              className="px-3 py-1.5 rounded-full transition-colors hover:text-[#0071E3] hover:bg-[#F5F5F7]"
            >
              FAQ
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-full transition-colors flex items-center gap-1.5 text-xs font-semibold"
              aria-label="Pesquisar produtos"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px] text-[#86868B] bg-[#F5F5F7] border border-[#D2D2D7]/80 px-1.5 py-0.5 rounded-md">
                ⌘K
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#1D1D1F] hover:bg-[#F5F5F7] rounded-full transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Modal Overlay (Clean White) ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl pt-24 px-6 pb-8 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Navegação
            </div>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-lg font-bold text-[#1D1D1F] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-lg font-bold text-[#1D1D1F] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Sobre nós</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/vender"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-lg font-bold text-emerald-700 border-b border-slate-100 flex items-center justify-between"
              >
                <span>⚡ Vender meu iPhone (PIX na Hora)</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </Link>
              <Link
                href="/troca"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-lg font-bold text-[#1D1D1F] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Troca de Aparelho (Trade-In)</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/garantia"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-lg font-bold text-[#1D1D1F] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Garantia & Procedência</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link
                href="/#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-lg font-bold text-[#1D1D1F] border-b border-slate-100 flex items-center justify-between"
              >
                <span>Perguntas Frequentes (FAQ)</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Link>
            </nav>

            <div className="pt-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                Categorias de Produtos
              </div>
              <div className="grid grid-cols-2 gap-2">
                {catalogCategories.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#F5F5F7] border border-[#E5E7EB] rounded-2xl text-xs font-bold text-[#1D1D1F] hover:bg-slate-200 transition-colors"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-3">
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#00C853] text-white font-bold rounded-2xl text-sm shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chamar no WhatsApp ({storeConfig.contact.whatsappFormatted})</span>
            </a>
            <p className="text-center text-[11px] text-gray-500">
              {storeConfig.address.fullAddress}
            </p>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};
