"use client";

import React, { useEffect } from "react";
import { X, CreditCard, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { calculateInstallments } from "@/utils/installments";
import { createWhatsAppLink } from "@/utils/whatsapp";

interface InstallmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  storage?: string;
  color?: string;
  cashPrice: number;
}

export const InstallmentsModal: React.FC<InstallmentsModalProps> = ({
  isOpen,
  onClose,
  productName,
  storage,
  color,
  cashPrice,
}) => {
  const installments = calculateInstallments(cashPrice);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleWhatsAppWithInstallment = (n: number, val: number, total: number) => {
    let msg = `Olá! Gostaria de consultar a compra do *${productName}*`;
    if (storage) msg += ` ${storage}`;
    if (color) msg += ` na cor ${color}`;
    msg += ` parcelado em *${n}x de ${formatCurrency(val)}* (Total no cartão: ${formatCurrency(total)}).\n`;
    msg += `Gostaria de prosseguir com o pagamento.`;
    const link = createWhatsAppLink(msg);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-[28px] border border-[#E5E7EB] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F5F5F7]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0071E3] border border-blue-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0F172A] font-display">
                Simulador de Parcelamento
              </h3>
              <p className="text-xs text-[#64748B]">
                {productName} {storage && `• ${storage}`} {color && `• ${color}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-[#0F172A] hover:bg-slate-200 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Price Summary Banner */}
        <div className="px-6 py-4 bg-white border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748B] block">
              Valor à vista no PIX
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] font-display">
              {formatCurrency(cashPrice)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Taxa base por venda: 2,69%
            </span>
          </div>
        </div>

        {/* Installment Table (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2 divide-y divide-slate-100">
          <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-[#64748B] pb-2 px-3">
            <span className="col-span-3">Parcelas</span>
            <span className="col-span-4 text-right">Valor da Parcela</span>
            <span className="col-span-3 text-right">Total no Cartão</span>
            <span className="col-span-2 text-right">Ação</span>
          </div>

          {installments.map((opt) => (
            <div
              key={opt.installments}
              className={`grid grid-cols-12 items-center py-2.5 px-3 rounded-xl transition-colors text-xs ${
                opt.installments === 12 || opt.installments === 18
                  ? "bg-blue-50/70 border border-blue-100"
                  : "hover:bg-[#F5F5F7]"
              }`}
            >
              {/* Parcelas */}
              <div className="col-span-3 font-bold text-[#0F172A] flex items-center gap-1.5">
                <span>{opt.installments}x</span>
                {(opt.installments === 12 || opt.installments === 18) && (
                  <span className="text-[9px] bg-[#0071E3] text-white px-1.5 py-0.5 rounded-full font-extrabold hidden sm:inline">
                    Popular
                  </span>
                )}
              </div>

              {/* Valor Parcela */}
              <div className="col-span-4 text-right font-extrabold text-[#0F172A] font-display text-sm">
                {formatCurrency(opt.installmentValue)}
              </div>

              {/* Total Cartão */}
              <div className="col-span-3 text-right text-[#475569] font-medium text-xs">
                {formatCurrency(opt.totalValue)}
              </div>

              {/* Ação WhatsApp */}
              <div className="col-span-2 text-right">
                <button
                  type="button"
                  onClick={() =>
                    handleWhatsAppWithInstallment(
                      opt.installments,
                      opt.installmentValue,
                      opt.totalValue
                    )
                  }
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#00C853] hover:bg-[#00B048] text-white text-[10px] font-bold rounded-lg transition-all"
                  title="Pedir nesta condição"
                >
                  <MessageCircle className="w-3 h-3 fill-white" />
                  <span className="hidden sm:inline">Pedir</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 bg-[#F5F5F7] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0071E3]" />
            <span>Passamos na maquininha na entrega ou na loja</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-white border border-[#E5E7EB] text-[#1D1D1F] font-bold rounded-full hover:bg-slate-100 transition-colors text-xs"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
