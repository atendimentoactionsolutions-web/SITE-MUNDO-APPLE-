import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/data/storeConfig";
import { Instagram, MessageCircle, MapPin, Clock, Star, Zap } from "lucide-react";
import { getWhatsAppGeneralUrl } from "@/utils/whatsapp";
import { AppleLogo } from "@/components/ui/AppleLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F5F5F7] text-[#1D1D1F] text-xs sm:text-sm pt-16 sm:pt-20 pb-12 border-t border-[#D2D2D7]">
      <Container size="large">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
          {/* Brand & Store Info (Col 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              href="/"
              aria-label="Mundo Apple Delivery — Página inicial"
              className="flex items-center gap-2 group transition-opacity hover:opacity-80 select-none"
            >
              <AppleLogo className="w-6 h-6 text-[#1D1D1F]" />
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-base sm:text-lg text-[#1D1D1F] tracking-tight font-display">
                  MUNDO APPLE
                </span>
                <span className="text-[9px] text-[#86868B] font-semibold tracking-widest uppercase">
                  DELIVERY
                </span>
              </div>
            </Link>

            <p className="text-[#6E6E73] text-xs leading-relaxed max-w-sm">
              {storeConfig.description}
            </p>

            {/* Social Proof Google Review Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D2D2D7]/80 text-xs text-[#1D1D1F] shadow-2xs">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-bold text-[#1D1D1F]">5.0</span>
              <span>•</span>
              <span className="text-[#6E6E73]">{storeConfig.socialProof.googleReviewsLabel}</span>
            </div>

            {/* Address & Hours */}
            <div className="space-y-2 pt-1 text-xs text-[#6E6E73]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
                <span>{storeConfig.address.fullAddress} ({storeConfig.address.complement})</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#0071E3] shrink-0" />
                <span>{storeConfig.openingHours.weekdays} | {storeConfig.openingHours.saturday}</span>
              </div>
            </div>
          </div>

          {/* Institutional Links (Col 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-[#1D1D1F] text-xs uppercase tracking-widest font-display">
              Institucional
            </h3>
            <ul className="space-y-2.5 text-[#6E6E73] text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-[#0071E3] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-[#0071E3] transition-colors">
                  Sobre a Loja
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="hover:text-[#0071E3] transition-colors font-semibold text-emerald-700">
                  Garantia & Procedência
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-[#0071E3] transition-colors">
                  Perguntas Frequentes (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-[#0071E3] transition-colors">
                  Contato & Localização
                </Link>
              </li>
              <li>
                <Link href="/servicos" className="hover:text-[#0071E3] transition-colors">
                  Assistência Técnica
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias de Produtos (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-bold text-[#1D1D1F] text-xs uppercase tracking-widest font-display">
              Catálogo Apple
            </h3>
            <ul className="space-y-2.5 text-[#6E6E73] text-xs font-medium">
              <li>
                <Link href="/iphone" className="hover:text-[#0071E3] transition-colors">
                  iPhones Novos & Seminovos
                </Link>
              </li>
              <li>
                <Link href="/mac" className="hover:text-[#0071E3] transition-colors">
                  MacBooks (Air, Pro, M4/M5)
                </Link>
              </li>
              <li>
                <Link href="/ipad" className="hover:text-[#0071E3] transition-colors">
                  iPads (Pro, Air e 11ª Ger)
                </Link>
              </li>
              <li>
                <Link href="/apple-watch" className="hover:text-[#0071E3] transition-colors">
                  Apple Watch (Series, Ultra, SE)
                </Link>
              </li>
              <li>
                <Link href="/airpods" className="hover:text-[#0071E3] transition-colors">
                  AirPods (4, Pro e Max)
                </Link>
              </li>
              <li>
                <Link href="/mac" className="hover:text-[#0071E3] transition-colors">
                  iMac & Mac mini
                </Link>
              </li>
              <li>
                <Link href="/produtos?categoria=accessories" className="hover:text-[#0071E3] transition-colors">
                  Acessórios Originais
                </Link>
              </li>
            </ul>
          </div>

          {/* Venda & Troca / WhatsApp (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-bold text-[#1D1D1F] text-xs uppercase tracking-widest font-display">
              Venda & Troca
            </h3>
            <ul className="space-y-2.5 text-[#6E6E73] text-xs font-medium mb-5">
              <li>
                <Link href="/vender" className="hover:text-emerald-700 transition-colors text-emerald-700 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-emerald-700" />
                  <span>Vender meu iPhone (PIX na Hora)</span>
                </Link>
              </li>
              <li>
                <Link href="/troca" className="hover:text-[#0071E3] transition-colors">
                  Simulação de Trade-in
                </Link>
              </li>
            </ul>

            <div className="space-y-2.5 pt-2">
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#00C853] hover:bg-[#00B048] text-white font-bold rounded-full text-xs shadow-sm hover:shadow transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp: {storeConfig.contact.whatsappFormatted}</span>
              </a>

              <a
                href={storeConfig.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-[#E8E8ED] text-[#1D1D1F] font-semibold rounded-full text-xs border border-[#D2D2D7]/80 transition-all shadow-2xs"
              >
                <Instagram className="w-4 h-4" />
                <span>{storeConfig.contact.instagramHandle}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D2D2D7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E6E73]">
          <p>© {new Date().getFullYear()} {storeConfig.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <span>Rua Santa Ifigênia, 361 • Loja 24 • São Paulo - SP</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
