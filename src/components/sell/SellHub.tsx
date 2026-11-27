"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  Loader2,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { SellWizard } from "./SellWizard";
import { createWhatsAppLink } from "@/utils/whatsapp";
import { trackGoogleAdsContatoConversion } from "@/utils/analytics";

type SellCategoryId = "iphone" | "macbook" | "ipad" | "watch" | "airpods";

interface CategoryCard {
  id: SellCategoryId;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryCard[] = [
  { id: "iphone", label: "iPhone", hint: "Cotação na hora", icon: Smartphone },
  { id: "macbook", label: "MacBook / Mac", hint: "Pro, Air, iMac, mini", icon: Laptop },
  { id: "ipad", label: "iPad", hint: "Pro, Air, mini", icon: Tablet },
  { id: "watch", label: "Apple Watch", hint: "Ultra, Series, SE", icon: Watch },
  { id: "airpods", label: "AirPods / Outros", hint: "Fones e acessórios", icon: Headphones },
];

const USAGE_TIME_OPTIONS = [
  "Novo Lacrado (Nunca aberto)",
  "Menos de 3 meses",
  "3 a 6 meses",
  "6 meses a 1 ano",
  "1 a 2 anos",
  "Mais de 2 anos",
];

const IPAD_MODELS = [
  "iPad Pro (M5 / M4)",
  "iPad Pro (M2 / M1)",
  "iPad Air (M4 / M3 / M2)",
  "iPad (11ª / 10ª Geração)",
  "iPad mini (7ª / 6ª Geração)",
  "Outro modelo de iPad",
];

const IPAD_SIZES = ['13"', '12.9"', '11"', '10.9"', '8.3"'];

const IPAD_COLORS = [
  "Preto-espacial (Space Black)",
  "Cinza-espacial (Space Gray)",
  "Prateado (Silver)",
  "Estelar (Starlight)",
  "Azul",
  "Roxo",
  "Rosa",
  "Amarelo",
];

const IPAD_STORAGES = [
  "64GB · Wi-Fi",
  "128GB · Wi-Fi",
  "256GB · Wi-Fi",
  "512GB · Wi-Fi",
  "1TB / 2TB · Wi-Fi",
  "128GB · Wi-Fi + Cellular",
  "256GB · Wi-Fi + Cellular",
  "512GB+ · Wi-Fi + Cellular",
];

const WATCH_MODELS = [
  "Apple Watch Ultra 4",
  "Apple Watch Ultra 3",
  "Apple Watch Ultra 2",
  "Apple Watch Ultra 1",
  "Apple Watch Series 12",
  "Apple Watch Series 11",
  "Apple Watch Series 10",
  "Apple Watch Series 9",
  "Apple Watch SE (3ª Geração)",
  "Apple Watch SE (2ª Geração)",
  "Outro Apple Watch",
];

const WATCH_MM_SIZES = ["40mm", "41mm", "42mm", "44mm", "45mm", "46mm", "49mm"];

const WATCH_COLORS = [
  "Titânio Natural",
  "Titânio Preto",
  "Preto / Meia-noite",
  "Preto Brilhante (Jet Black)",
  "Prateado",
  "Estelar",
  "Ouro Rosa / Dourado",
  "Azul / Ardósia",
];

const AIRPODS_MODELS = [
  "AirPods 5",
  "AirPods 4 (com ANC)",
  "AirPods 4",
  "AirPods Pro (3ª Geração)",
  "AirPods Pro (2ª Geração · USB-C)",
  "AirPods Max (USB-C)",
  "AirPods Max (Lightning)",
  "Apple Pencil Pro / 2ª Geração",
  "Magic Keyboard / Mouse / Trackpad",
  "Outro produto Apple",
];

const VALID_IDS = new Set<SellCategoryId>(["iphone", "macbook", "ipad", "watch", "airpods"]);

function normalizeCategory(raw: string | null): SellCategoryId {
  if (!raw) return "iphone";
  const clean = raw.toLowerCase().trim();
  if (clean === "mac") return "macbook";
  if (clean === "apple-watch") return "watch";
  if (clean === "acessorios" || clean === "accessories") return "airpods";
  if (VALID_IDS.has(clean as SellCategoryId)) return clean as SellCategoryId;
  return "iphone";
}

function formatBrazilPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

const INPUT_CLASS =
  "w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none transition-[background-color,border-color] duration-150";

const SELECT_CLASS =
  "w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-sm text-[#1D1D1F] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none transition-[background-color,border-color] duration-150 cursor-pointer";

function SelectField({
  label,
  required,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#1D1D1F]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${SELECT_CLASS} ${!value ? "text-[#86868B]" : "font-medium"}`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-[#1D1D1F]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function SellHub() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramCategory = searchParams.get("categoria");

  const [category, setCategory] = useState<SellCategoryId>(() => normalizeCategory(paramCategory));
  const [started, setStarted] = useState<boolean>(() => Boolean(paramCategory));
  // 3 clean stages for non-iPhone products: 1 = Aparelho, 2 = Uso & Defeito, 3 = WhatsApp
  const [subStep, setSubStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (paramCategory) {
      setCategory(normalizeCategory(paramCategory));
      setStarted(true);
    }
  }, [paramCategory]);

  // MacBook / Mac written inputs
  const [macModel, setMacModel] = useState("");
  const [macInches, setMacInches] = useState("");
  const [macStorage, setMacStorage] = useState("");
  const [macRam, setMacRam] = useState("");
  const [macColor, setMacColor] = useState("");

  // iPad exact fields
  const [ipadModel, setIpadModel] = useState("");
  const [ipadOtherModel, setIpadOtherModel] = useState("");
  const [ipadInches, setIpadInches] = useState("");
  const [ipadColor, setIpadColor] = useState("");
  const [ipadStorage, setIpadStorage] = useState("");

  // Apple Watch exact fields
  const [watchModel, setWatchModel] = useState("");
  const [watchOtherModel, setWatchOtherModel] = useState("");
  const [watchMm, setWatchMm] = useState("");
  const [watchConnectivity, setWatchConnectivity] = useState<"Somente GPS" | "GPS + Cellular" | "">("");
  const [watchColor, setWatchColor] = useState("");

  // AirPods & Outros exact fields
  const [airpodsModel, setAirpodsModel] = useState("");
  const [airpodsOtherModel, setAirpodsOtherModel] = useState("");

  // Etapa 2: Uso, defeito e iCloud (separado de Nome/WhatsApp)
  const [usageTime, setUsageTime] = useState("");
  const [hasDefect, setHasDefect] = useState<"no" | "yes" | "">("");
  const [defectDetails, setDefectDetails] = useState("");
  const [icloudClean, setIcloudClean] = useState<"yes" | "no" | "">("");

  // Etapa 3: Nome e WhatsApp para disparo automático
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quotePublicCode, setQuotePublicCode] = useState("");

  const resetFormFields = () => {
    setSubStep(1);
    setMacModel("");
    setMacInches("");
    setMacStorage("");
    setMacRam("");
    setMacColor("");
    setIpadModel("");
    setIpadOtherModel("");
    setIpadInches("");
    setIpadColor("");
    setIpadStorage("");
    setWatchModel("");
    setWatchOtherModel("");
    setWatchMm("");
    setWatchConnectivity("");
    setWatchColor("");
    setAirpodsModel("");
    setAirpodsOtherModel("");
    setUsageTime("");
    setHasDefect("");
    setDefectDetails("");
    setIcloudClean("");
    setCustomerName("");
    setCustomerWhatsapp("");
    setSubmitError("");
    setQuoteSuccess(false);
    setQuotePublicCode("");
  };

  const handleStartEvaluation = () => {
    setSubStep(1);
    setStarted(true);
    const url = `/vender?categoria=${category}`;
    router.replace(url, { scroll: false });
  };

  const handleBackToSelection = () => {
    setStarted(false);
    resetFormFields();
    router.replace("/vender", { scroll: false });
  };

  const resolvedIpadModel = ipadModel === "Outro modelo de iPad" ? ipadOtherModel.trim() : ipadModel;
  const resolvedWatchModel = watchModel === "Outro Apple Watch" ? watchOtherModel.trim() : watchModel;
  const resolvedAirpodsModel = airpodsModel === "Outro produto Apple" ? airpodsOtherModel.trim() : airpodsModel;

  // Step 1 validation (specs per device)
  const isStep1SpecsReady =
    category === "macbook"
      ? Boolean(macModel.trim() && macInches.trim() && macStorage.trim() && macRam.trim() && macColor.trim())
      : category === "ipad"
        ? Boolean(resolvedIpadModel && ipadInches && ipadColor)
        : category === "watch"
          ? Boolean(resolvedWatchModel && watchMm && watchConnectivity && watchColor)
          : Boolean(resolvedAirpodsModel);

  // Step 2 validation (tempo de uso + defeitos + iCloud quando aplicável)
  const isStep2ConditionReady = Boolean(
    usageTime &&
      hasDefect &&
      (hasDefect === "no" || defectDetails.trim()) &&
      (category === "airpods" || icloudClean === "yes")
  );

  // Step 3 validation (nome + whatsapp)
  const isPhoneValid = customerWhatsapp.replace(/\D/g, "").length >= 10;
  const isStep3ContactReady = Boolean(customerName.trim().length >= 2 && isPhoneValid);

  const activeCategoryMeta = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

  const getStructuredSummary = () => {
    const defectValue = hasDefect === "yes" ? defectDetails.trim() : "Nenhum (100% funcional)";
    let modelName = "";
    const details: Array<{ label: string; value: string }> = [];

    if (category === "macbook") {
      modelName = macModel.trim();
      details.push(
        { label: "Polegadas", value: macInches.trim() },
        { label: "Armazenamento", value: macStorage.trim() },
        { label: "Memória RAM", value: macRam.trim() },
        { label: "Cor", value: macColor.trim() },
        { label: "Tempo de uso", value: usageTime },
        { label: "Defeitos", value: defectValue },
        { label: "Conta Apple / iCloud", value: "100% Livre" }
      );
    } else if (category === "ipad") {
      modelName = resolvedIpadModel;
      details.push(
        { label: "Polegadas", value: ipadInches },
        { label: "Cor", value: ipadColor },
        ...(ipadStorage ? [{ label: "Armazenamento / Conexão", value: ipadStorage }] : []),
        { label: "Tempo de uso", value: usageTime },
        { label: "Defeitos", value: defectValue },
        { label: "Conta Apple / iCloud", value: "100% Livre" }
      );
    } else if (category === "watch") {
      modelName = resolvedWatchModel;
      details.push(
        { label: "Tamanho", value: watchMm },
        { label: "Conectividade", value: watchConnectivity },
        { label: "Cor", value: watchColor },
        { label: "Tempo de uso", value: usageTime },
        { label: "Defeitos", value: defectValue },
        { label: "Conta Apple / iCloud", value: "100% Livre" }
      );
    } else {
      modelName = resolvedAirpodsModel;
      details.push(
        { label: "Tempo de uso", value: usageTime },
        { label: "Defeitos", value: defectValue }
      );
    }

    return { modelName, details };
  };

  const buildWhatsappFallbackUrl = () => {
    const { modelName, details } = getStructuredSummary();
    const lines = [
      `Olá Mundo Apple! Segue minha avaliação de *${activeCategoryMeta.label}* (${quotePublicCode || "COT-AVAL"}):`,
      "",
      `- Modelo: ${modelName}`,
      ...details.map((d) => `- ${d.label}: ${d.value}`),
      `- Nome: ${customerName.trim()}`,
      `- WhatsApp: ${customerWhatsapp.trim()}`,
    ];
    return createWhatsAppLink(lines.join("\n"));
  };

  const handleSubmitCustomQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1SpecsReady || !isStep2ConditionReady || !isStep3ContactReady || submitting) return;

    try {
      setSubmitting(true);
      setSubmitError("");
      const { modelName, details } = getStructuredSummary();

      const res = await fetch("/api/sell/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customDevice: {
            category,
            categoryLabel: activeCategoryMeta.label,
            model: modelName,
            details,
          },
          customer: {
            name: customerName.trim(),
            whatsapp: customerWhatsapp.trim(),
          },
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success || !data.quote?.publicCode) {
        throw new Error(data.error || "Não foi possível enviar sua avaliação.");
      }

      setQuotePublicCode(data.quote.publicCode);
      setQuoteSuccess(true);
      trackGoogleAdsContatoConversion();
    } catch (err: any) {
      console.error("Erro ao registrar avaliação:", err);
      setSubmitError(err?.message || "Não foi possível enviar sua avaliação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Step 0: Clean minimalist landing without dumping products upfront
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[28px] border border-[#E5E5EA] p-6 sm:p-9 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.1)] space-y-6">
          <div className="space-y-1.5 text-left">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-[#1D1D1F] tracking-[-0.02em]">
              Qual aparelho você deseja avaliar?
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73]">
              Selecione a linha do seu produto e clique em avaliar meu aparelho.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const selected = cat.id === category;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-2xl border text-left transition-[background-color,border-color,box-shadow,transform] duration-150 active:scale-[0.98] cursor-pointer flex flex-col gap-2 ${
                    selected
                      ? "bg-[#1D1D1F] border-[#1D1D1F] text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)]"
                      : "bg-[#F5F5F7] hover:bg-[#ECECF0] border-transparent text-[#1D1D1F]"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selected ? "text-[#2997FF]" : "text-[#6E6E73]"}`} />
                  <div>
                    <span className="block text-sm font-semibold leading-tight">{cat.label}</span>
                    <span className={`block text-[11px] mt-0.5 ${selected ? "text-white/70" : "text-[#86868B]"}`}>
                      {cat.hint}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleStartEvaluation}
            className="w-full py-4 px-6 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-sm sm:text-base shadow-[0_10px_24px_-12px_rgba(0,113,227,0.55)] active:scale-[0.99] transition-[background-color,transform] duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Avaliar meu aparelho</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const subStepLabels: Record<1 | 2 | 3, string> = {
    1: "1. Aparelho",
    2: "2. Uso e Condição",
    3: "3. Seu WhatsApp",
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={handleBackToSelection}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] py-1.5 px-3 rounded-full bg-white border border-[#E5E5EA] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Trocar aparelho</span>
        </button>

        <span className="text-xs font-semibold text-[#1D1D1F] px-3 py-1.5 rounded-full bg-white border border-[#E5E5EA]">
          {activeCategoryMeta.label}
        </span>
      </div>

      {/* Category 1: Exact iPhone DB 8-step Wizard */}
      {category === "iphone" ? (
        <SellWizard />
      ) : quoteSuccess ? (
        /* Final Confirmation View */
        <div className="animate-result-reveal bg-white rounded-[28px] border border-[#E5E5EA] p-6 sm:p-8 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.1)] space-y-5">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 text-left">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Enviamos os detalhes desta avaliação para o seu WhatsApp (<strong>{customerWhatsapp}</strong>)!
            </span>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0071E3]/[0.07] to-[#0071E3]/[0.02] border border-[#0071E3]/20 text-center space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#0071E3]/20 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
              <Sparkles className="w-3.5 h-3.5" />
              Cotação Registrada · {quotePublicCode}
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-[-0.03em]">
              Proposta em análise para pagamento no PIX
            </h2>
            <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
              Você já recebeu nossa confirmação automática no WhatsApp. Nossa equipe enviará a proposta final em instantes.
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] text-left space-y-2 text-xs">
            <span className="font-semibold text-[#1D1D1F] block text-[11px] uppercase tracking-[0.08em]">
              Resumo da Avaliação Registrada
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#6E6E73]">
              <div>• <strong className="text-[#1D1D1F]">Produto:</strong> {activeCategoryMeta.label}</div>
              <div>• <strong className="text-[#1D1D1F]">Modelo:</strong> {getStructuredSummary().modelName}</div>
              {getStructuredSummary().details.map((d) => (
                <div key={d.label}>
                  • <strong className="text-[#1D1D1F]">{d.label}:</strong> {d.value}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 text-center">
            <a
              href={buildWhatsappFallbackUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm sm:text-base rounded-full shadow-[0_12px_28px_-12px_rgba(22,163,74,0.55)] flex items-center justify-center gap-2 transition-[background-color,transform] duration-150 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Abrir WhatsApp da Loja</span>
            </a>

            <button
              type="button"
              onClick={resetFormFields}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] py-2 px-3 rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fazer nova avaliação</span>
            </button>
          </div>
        </div>
      ) : (
        /* Categories 2-5: Clean 3-Stage Stepper (1. Specs -> 2. Uso/Defeito -> 3. Nome/WhatsApp) */
        <div
          key={category}
          className="bg-white rounded-[28px] border border-[#E5E5EA] p-6 sm:p-8 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.1)] space-y-6"
        >
          {/* Minimal 3-step Progress Header */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#86868B] mb-2.5">
              <span className="uppercase tracking-[0.08em] tabular-nums">Etapa {subStep} de 3</span>
              <span className="text-[#0071E3] font-semibold">{subStepLabels[subStep]}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={s >= subStep}
                  onClick={() => s < subStep && setSubStep(s as 1 | 2 | 3)}
                  className={`h-2 rounded-full transition-colors duration-200 ${
                    s <= subStep ? "bg-[#0071E3]" : "bg-[#EFEFF4]"
                  } ${s < subStep ? "cursor-pointer" : "cursor-default"}`}
                  aria-label={subStepLabels[s as 1 | 2 | 3]}
                />
              ))}
            </div>
          </div>

          {/* STAGE 1: APARELHO & CONFIGURAÇÃO */}
          {subStep === 1 && (
            <div key="custom-step-1" className="animate-step-forward space-y-5">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F] tracking-[-0.025em]">
                  Dados do seu {activeCategoryMeta.label}
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                  Informe as especificações principais do aparelho.
                </p>
              </div>

              {category === "macbook" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1D1D1F]">
                      Modelo do MacBook ou Mac <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={macModel}
                      onChange={(e) => setMacModel(e.target.value)}
                      placeholder="Ex: MacBook Pro M4, MacBook Air M3, iMac, Mac mini"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1D1D1F]">
                      Polegadas <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={macInches}
                      onChange={(e) => setMacInches(e.target.value)}
                      placeholder='Ex: 13", 14", 15", 16", 24"'
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1D1D1F]">
                      Memória de Armazenamento <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={macStorage}
                      onChange={(e) => setMacStorage(e.target.value)}
                      placeholder="Ex: 256GB, 512GB, 1TB, 2TB"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1D1D1F]">
                      Memória RAM <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={macRam}
                      onChange={(e) => setMacRam(e.target.value)}
                      placeholder="Ex: 8GB, 16GB, 24GB, 32GB"
                      className={INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1D1D1F]">
                      Cor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={macColor}
                      onChange={(e) => setMacColor(e.target.value)}
                      placeholder="Ex: Preto-espacial, Prata, Meia-noite"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>
              )}

              {category === "ipad" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <SelectField
                      label="Modelo do iPad"
                      required
                      value={ipadModel}
                      onChange={setIpadModel}
                      placeholder="Selecione o modelo do iPad..."
                      options={IPAD_MODELS}
                    />
                    {ipadModel === "Outro modelo de iPad" && (
                      <input
                        type="text"
                        value={ipadOtherModel}
                        onChange={(e) => setIpadOtherModel(e.target.value)}
                        placeholder="Digite o modelo exato do iPad"
                        className={INPUT_CLASS}
                      />
                    )}
                  </div>

                  <SelectField
                    label="Polegadas"
                    required
                    value={ipadInches}
                    onChange={setIpadInches}
                    placeholder="Selecione as polegadas..."
                    options={IPAD_SIZES}
                  />

                  <SelectField
                    label="Cor"
                    required
                    value={ipadColor}
                    onChange={setIpadColor}
                    placeholder="Selecione a cor..."
                    options={IPAD_COLORS}
                  />

                  <div className="sm:col-span-2">
                    <SelectField
                      label="Armazenamento e Conexão (opcional)"
                      value={ipadStorage}
                      onChange={setIpadStorage}
                      placeholder="Selecione capacidade / Wi-Fi..."
                      options={IPAD_STORAGES}
                    />
                  </div>
                </div>
              )}

              {category === "watch" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <SelectField
                      label="Modelo do Apple Watch"
                      required
                      value={watchModel}
                      onChange={setWatchModel}
                      placeholder="Selecione o modelo..."
                      options={WATCH_MODELS}
                    />
                    {watchModel === "Outro Apple Watch" && (
                      <input
                        type="text"
                        value={watchOtherModel}
                        onChange={(e) => setWatchOtherModel(e.target.value)}
                        placeholder="Digite o modelo do Apple Watch"
                        className={INPUT_CLASS}
                      />
                    )}
                  </div>

                  <SelectField
                    label="Tamanho (Milímetros)"
                    required
                    value={watchMm}
                    onChange={setWatchMm}
                    placeholder="Selecione (ex: 41mm, 45mm, 49mm)..."
                    options={WATCH_MM_SIZES}
                  />

                  <SelectField
                    label="Cor"
                    required
                    value={watchColor}
                    onChange={setWatchColor}
                    placeholder="Selecione a cor..."
                    options={WATCH_COLORS}
                  />

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-xs font-semibold text-[#1D1D1F]">
                      Conectividade <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {(["Somente GPS", "GPS + Cellular"] as const).map((conn) => {
                        const selected = watchConnectivity === conn;
                        return (
                          <button
                            key={conn}
                            type="button"
                            onClick={() => setWatchConnectivity(conn)}
                            className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-[background-color,border-color] duration-150 ${
                              selected
                                ? "bg-[#0071E3]/[0.07] border-[#0071E3] text-[#0071E3] ring-1 ring-[#0071E3]"
                                : "bg-[#F5F5F7] hover:bg-[#ECECF0] border-transparent text-[#1D1D1F]"
                            }`}
                          >
                            <span>{conn}</span>
                            {selected && <Check className="w-4 h-4 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {category === "airpods" && (
                <div className="space-y-3">
                  <SelectField
                    label="Modelo (AirPods ou Outro Produto Apple)"
                    required
                    value={airpodsModel}
                    onChange={setAirpodsModel}
                    placeholder="Selecione o modelo..."
                    options={AIRPODS_MODELS}
                  />
                  {airpodsModel === "Outro produto Apple" && (
                    <input
                      type="text"
                      value={airpodsOtherModel}
                      onChange={(e) => setAirpodsOtherModel(e.target.value)}
                      placeholder="Escreva o modelo exato do aparelho"
                      className={INPUT_CLASS}
                    />
                  )}
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-[#F2F2F7]">
                <button
                  type="button"
                  disabled={!isStep1SpecsReady}
                  onClick={() => setSubStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-[#E5E5EA] disabled:text-[#86868B] disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-full transition-[background-color,transform] duration-150 cursor-pointer"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: TEMPO DE USO & DEFEITOS (Aba separada antes de Nome e WhatsApp) */}
          {subStep === 2 && (
            <div key="custom-step-2" className="animate-step-forward space-y-5">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F] tracking-[-0.025em]">
                  Tempo de uso e condição
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                  Conte há quanto tempo usa o aparelho e se há algum detalhe ou defeito.
                </p>
              </div>

              <SelectField
                label="Tempo de uso"
                required
                value={usageTime}
                onChange={setUsageTime}
                placeholder="Selecione há quanto tempo usa o aparelho..."
                options={USAGE_TIME_OPTIONS}
              />

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#1D1D1F]">
                  O aparelho possui algum defeito? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setHasDefect("no");
                      setDefectDetails("");
                    }}
                    className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-[background-color,border-color] duration-150 ${
                      hasDefect === "no"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500/30"
                        : "bg-[#F5F5F7] hover:bg-[#ECECF0] border-transparent text-[#1D1D1F]"
                    }`}
                  >
                    <span>Não, sem defeitos</span>
                    {hasDefect === "no" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasDefect("yes")}
                    className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-[background-color,border-color] duration-150 ${
                      hasDefect === "yes"
                        ? "bg-[#0071E3]/[0.07] border-[#0071E3] text-[#0071E3] ring-1 ring-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#ECECF0] border-transparent text-[#1D1D1F]"
                    }`}
                  >
                    <span>Sim, possui defeito</span>
                    {hasDefect === "yes" && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                </div>
                {hasDefect === "yes" && (
                  <input
                    type="text"
                    value={defectDetails}
                    onChange={(e) => setDefectDetails(e.target.value)}
                    placeholder="Descreva qual o defeito (ex: bateria viciada, risco, tecla falhando...)"
                    className={INPUT_CLASS}
                  />
                )}
              </div>

              {category !== "airpods" && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    Conta Apple (iCloud) livre? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setIcloudClean("yes")}
                      className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-[background-color,border-color] duration-150 ${
                        icloudClean === "yes"
                          ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500/30"
                          : "bg-[#F5F5F7] hover:bg-[#ECECF0] border-transparent text-[#1D1D1F]"
                      }`}
                    >
                      <span>Sim, 100% livre</span>
                      {icloudClean === "yes" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIcloudClean("no")}
                      className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between cursor-pointer transition-[background-color,border-color] duration-150 ${
                        icloudClean === "no"
                          ? "bg-red-50 border-red-400 text-red-800"
                          : "bg-[#F5F5F7] hover:bg-[#ECECF0] border-transparent text-[#1D1D1F]"
                      }`}
                    >
                      <span>Possui bloqueio</span>
                    </button>
                  </div>
                  {icloudClean === "no" && (
                    <p className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-xl p-2.5 leading-relaxed">
                      Não compramos aparelhos vinculados a iCloud, MDM ou bloqueio de ativação.
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-[#F2F2F7]">
                <button
                  type="button"
                  onClick={() => setSubStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  disabled={!isStep2ConditionReady}
                  onClick={() => setSubStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-[#E5E5EA] disabled:text-[#86868B] disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-full transition-[background-color,transform] duration-150 cursor-pointer"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: APENAS NOME & WHATSAPP + ENVIO AUTOMÁTICO */}
          {subStep === 3 && (
            <form key="custom-step-3" onSubmit={handleSubmitCustomQuote} className="animate-step-forward space-y-5">
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#1D1D1F] tracking-[-0.025em]">
                  Para onde enviamos sua simulação?
                </h2>
                <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                  Informe seu nome e WhatsApp para receber automaticamente a avaliação completa.
                </p>
              </div>

              {/* Compact Summary Strip */}
              <div className="p-3.5 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-[#1D1D1F]">
                <span className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                  {getStructuredSummary().modelName}
                </span>
                {getStructuredSummary().details.map((d) => (
                  <span key={d.label} className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                    {d.label}: {d.value}
                  </span>
                ))}
              </div>

              {submitError && (
                <p role="alert" className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs sm:text-sm text-red-700">
                  {submitError}
                </p>
              )}

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    Nome Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1D1D1F]">
                    WhatsApp com DDD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(formatBrazilPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className={`${INPUT_CLASS} tabular-nums`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#F2F2F7]">
                <button
                  type="button"
                  onClick={() => setSubStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>

                <button
                  type="submit"
                  disabled={!isStep3ContactReady || submitting}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#E5E5EA] disabled:text-[#86868B] disabled:cursor-not-allowed text-white font-semibold text-sm shadow-[0_10px_24px_-12px_rgba(22,163,74,0.55)] disabled:shadow-none active:scale-[0.98] transition-[background-color,transform] duration-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Enviando no WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <span>Ver Simulação e Receber no WhatsApp</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6E6E73] pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Pagamento imediato via PIX na loja ou coleta em São Paulo.</span>
          </div>
        </div>
      )}
    </div>
  );
}
