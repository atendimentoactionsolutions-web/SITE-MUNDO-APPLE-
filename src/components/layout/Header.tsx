"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
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
  }, [pathname]);

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
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
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
    { label: "Suporte", href: "/sobre" },
  ];

  return (
    <>
      {/* ── Official Full-Width Dark GlobalNav Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-11 sm:h-12 bg-[rgba(22,22,23,0.8)] backdrop-blur-xl border-b border-white/[0.08] transition-all">
        <div className="max-w-[1024px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Logo Apple (Left) */}
          <Link
            href="/"
            aria-label="Mundo Apple Delivery — Página inicial"
            className="flex items-center gap-2 group opacity-80 hover:opacity-100 transition-opacity select-none py-1"
          >
            <AppleLogo className="w-4 h-4 text-white" />
            <span className="font-semibold text-xs tracking-tight text-white font-display hidden sm:inline-block">
              Mundo Apple
            </span>
          </Link>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-[12px] font-normal text-[#CECECF]">
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
          <div className="flex items-center gap-4 text-[#CECECF]">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="p-1 hover:text-white transition-colors"
              aria-label="Buscar produtos"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Shopping Bag / Atendimento */}
            <div className="relative" ref={bagRef}>
              <button
                type="button"
                onClick={() => setBagOpen(!bagOpen)}
                className="p-1 hover:text-white transition-colors relative"
                aria-label="Sacola de compras e pedidos"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>

              {/* Bag Dropdown */}
              {bagOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#1d1d1f] border border-white/10 rounded-2xl p-4 shadow-2xl z-50 text-white animate-in fade-in zoom-in-95 duration-150">
                  <h4 className="text-sm font-semibold mb-2">Sua Sacola Mundo Apple</h4>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    Entrega expressa hoje em São Paulo. Fale com um consultor para concluir seu pedido.
                  </p>
                  <a
                    href={getWhatsAppGeneralUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-semibold rounded-full transition-colors"
                  >
                    Atendimento no WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 hover:text-white transition-colors"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-11 bottom-0 bg-[#000000]/95 backdrop-blur-2xl z-40 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top duration-200">
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
              <p className="text-center text-xs text-zinc-500">
                Mundo Apple Delivery • 1 ano de garantia
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
};
