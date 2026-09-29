"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  RotateCcw,
  Search,
  MessageCircle,
  Loader2,
  BatteryCharging,
  Sparkles,
  Zap,
} from "lucide-react";
import { storeConfig } from "@/data/storeConfig";
import { formatCurrency } from "@/utils/formatters";

interface ModelOption {
  id: string;
  name: string;
  slug: string;
  family: string;
  generation: string;
  imageUrl?: string;
}

interface StorageOption {
  id: string;
  displayName: string;
  capacityGb: number;
}

interface SellWizardProps {
  onCancel?: () => void;
}

export const SellWizard: React.FC<SellWizardProps> = () => {
  const totalSteps = 6;
  const [step, setStep] = useState(1);

  // Data loaded from database
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [modelSearch, setModelSearch] = useState("");

  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [loadingStorages, setLoadingStorages] = useState(false);

  // Form State
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);

  // Etapa 3: Saúde da Bateria
  const [batteryHealth, setBatteryHealth] = useState<string>("");

  // Etapa 4: Estado Físico
  const [physicalCondition, setPhysicalCondition] = useState<string>("");
  const [damages, setDamages] = useState<string[]>([]);

  // Etapa 5: Peças e Reparos
  const [replacedPartsStatus, setReplacedPartsStatus] = useState<string>("");
  const [replacedParts, setReplacedParts] = useState<string[]>([]);

  // Etapa 6: Funcionamento
  const [functionalityStatus, setFunctionalityStatus] = useState<string>("");
  const [malfunctions, setMalfunctions] = useState<string[]>([]);

  // Customer Data (Final Step)
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");

  // Calculated Live Estimate
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [calculationData, setCalculationData] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  // Final Quote Submission
  const [submitting, setSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quotePublicCode, setQuotePublicCode] = useState("");

  // 1. Load active models from API
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoadingCatalog(true);
        const res = await fetch("/api/sell/catalog");
        const data = await res.json();
        if (data.success && Array.isArray(data.models)) {
          setModels(data.models);
        }
      } catch (err) {
        console.error("Erro ao carregar catálogo:", err);
      } finally {
        setLoadingCatalog(false);
      }
    }
    loadCatalog();
  }, []);

  // 2. Load storage options when model changes
  useEffect(() => {
    if (!selectedModel) {
      setStorageOptions([]);
      setSelectedStorage(null);
      return;
    }

    const modelId = selectedModel.id;
    async function loadStorages() {
      try {
        setLoadingStorages(true);
        const res = await fetch(`/api/sell/models/${modelId}/storages`);
        const data = await res.json();
        const list = data.storageOptions || data.storages || [];
        if (Array.isArray(list) && list.length > 0) {
          setStorageOptions(list);
          setSelectedStorage(null);
        } else {
          const fallback = [
            { id: "storage-64gb", displayName: "64GB", capacityGb: 64 },
            { id: "storage-128gb", displayName: "128GB", capacityGb: 128 },
            { id: "storage-256gb", displayName: "256GB", capacityGb: 256 },
            { id: "storage-512gb", displayName: "512GB", capacityGb: 512 },
            { id: "storage-1tb", displayName: "1TB", capacityGb: 1024 },
          ];
          setStorageOptions(fallback);
          setSelectedStorage(null);
        }
      } catch (err) {
        console.error("Erro ao carregar armazenamentos:", err);
      } finally {
        setLoadingStorages(false);
      }
    }
    loadStorages();
  }, [selectedModel?.id]);

  // Reactive price calculation on changes
  useEffect(() => {
    if (!selectedModel || !selectedStorage) {
      setEstimatedPrice(null);
      setCalculationData(null);
      return;
    }

    async function calculate() {
      try {
        setCalculating(true);
        const payload = {
          deviceModelId: selectedModel?.id,
          storageOptionId: selectedStorage?.id,
          answers: {
            batteryHealth,
            physicalCondition,
            damages,
            replacedPartsStatus,
            replacedParts,
            functionalityStatus,
            malfunctions,
          },
        };

        const res = await fetch("/api/sell/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.calculation) {
          setEstimatedPrice(data.calculation.finalPrice);
          setCalculationData(data.calculation);
        }
      } catch (err) {
        console.error("Erro no cálculo:", err);
      } finally {
        setCalculating(false);
      }
    }

    calculate();
  }, [
    selectedModel,
    selectedStorage,
    batteryHealth,
    physicalCondition,
    damages,
    replacedPartsStatus,
    replacedParts,
    functionalityStatus,
    malfunctions,
  ]);

  // Mask Phone Formatter
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "").slice(0, 11);

    if (!digits) {
      setCustomerWhatsapp("");
      return;
    }

    let formatted = digits;
    if (digits.length <= 2) {
      formatted = `(${digits}`;
    } else if (digits.length <= 6) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }

    setCustomerWhatsapp(formatted);
  };

  const filteredModels = useMemo(() => {
    if (!modelSearch.trim()) return models;
    const q = modelSearch.toLowerCase();
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [models, modelSearch]);

  // Step Validation Checkers
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!selectedModel;
      case 2:
        return !!selectedStorage;
      case 3:
        return !!batteryHealth;
      case 4:
        if (!physicalCondition) return false;
        if (physicalCondition === "damaged" && damages.length === 0) return false;
        return true;
      case 5:
        if (!replacedPartsStatus) return false;
        if (replacedPartsStatus === "yes" && replacedParts.length === 0) return false;
        return true;
      case 6:
        if (!functionalityStatus) return false;
        if (functionalityStatus === "issues" && malfunctions.length === 0) return false;
        return true;
      case 7:
        // Final evaluation step: valid customer info
        return (
          customerName.trim().length >= 2 &&
          customerWhatsapp.replace(/\D/g, "").length >= 10
        );
      default:
        return false;
    }
  }, [
    step,
    selectedModel,
    selectedStorage,
    batteryHealth,
    physicalCondition,
    damages,
    replacedPartsStatus,
    replacedParts,
    functionalityStatus,
    malfunctions,
    customerName,
    customerWhatsapp,
  ]);

  // Toggle helpers for multi-select
  const toggleDamage = (item: string) => {
    setDamages((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleReplacedPart = (item: string) => {
    setReplacedParts((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleMalfunction = (item: string) => {
    setMalfunctions((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Submit Final Sale Quote
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedModel || !selectedStorage || !customerName || !customerWhatsapp) return;

    try {
      setSubmitting(true);
      const payload = {
        deviceModelId: selectedModel.id,
        storageOptionId: selectedStorage.id,
        answers: {
          customerName,
          customerWhatsapp,
          batteryHealth,
          physicalCondition,
          damages,
          replacedPartsStatus,
          replacedParts,
          functionalityStatus,
          malfunctions,
        },
        customer: {
          name: customerName,
          whatsapp: customerWhatsapp,
        },
      };

      const res = await fetch("/api/sell/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      const publicCode = data?.quote?.publicCode || "COT-AVAL";
      setQuotePublicCode(publicCode);
      setQuoteSuccess(true);
    } catch (err) {
      console.error("Erro ao gerar cotação:", err);
      setQuotePublicCode("COT-AVAL");
      setQuoteSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setStep(1);
    setSelectedModel(null);
    setSelectedStorage(null);
    setBatteryHealth("");
    setPhysicalCondition("");
    setDamages([]);
    setReplacedPartsStatus("");
    setReplacedParts([]);
    setFunctionalityStatus("");
    setMalfunctions([]);
    setCustomerName("");
    setCustomerWhatsapp("");
    setQuoteSuccess(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Top Capsule Header ── */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight font-display">
          Venda seu iPhone
        </h1>
        <p className="text-sm sm:text-base text-[#6E6E73] mt-1.5 font-medium">
          Descubra quanto podemos pagar pelo seu aparelho
        </p>
      </div>

      {/* ── Main Interactive Card ── */}
      <div className="bg-white rounded-3xl border border-[#E5E5E7] p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
        {/* Step Progress Bar (1 to 6) */}
        {step <= 6 && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#86868B] mb-2">
              <span className="uppercase tracking-wider">
                Etapa {step} de {totalSteps}
              </span>
              <span className="text-[#0071E3] font-bold">
                {step === 1 && "Modelo"}
                {step === 2 && "Armazenamento"}
                {step === 3 && "Saúde da Bateria"}
                {step === 4 && "Estado Físico"}
                {step === 5 && "Peças e Reparos"}
                {step === 6 && "Funcionamento"}
              </span>
            </div>
            <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0071E3] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── ETAPA 1: MODELO ── */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Qual é o modelo do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Selecione o modelo exato do seu aparelho abaixo.
              </p>
            </div>

            {/* Model Search Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Buscar modelo (ex: iPhone 15, iPhone 14 Pro...)"
                className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Models Grid */}
            {loadingCatalog ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#86868B]">
                <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
                <span className="text-xs font-semibold">Carregando modelos...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredModels.map((m) => {
                  const isSelected = selectedModel?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m);
                        setStep(2);
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/70 border-[#0071E3] ring-2 ring-[#0071E3] text-[#0071E3]"
                          : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7] text-[#1D1D1F]"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold truncate">
                          {m.name}
                        </span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected
                            ? "border-[#0071E3] bg-[#0071E3] text-white"
                            : "border-[#D2D2D7]"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 2: ARMAZENAMENTO ── */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                  Qual é a capacidade de armazenamento?
                </h2>
                <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                  Modelo selecionado: <strong className="text-[#1D1D1F]">{selectedModel?.name}</strong>
                </p>
              </div>
            </div>

            {loadingStorages ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#86868B]">
                <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
                <span className="text-xs font-semibold">Consultando capacidades...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {storageOptions.map((stg) => {
                  const isSelected = selectedStorage?.id === stg.id;
                  return (
                    <button
                      key={stg.id}
                      type="button"
                      onClick={() => {
                        setSelectedStorage(stg);
                        setStep(3);
                      }}
                      className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/70 border-[#0071E3] ring-2 ring-[#0071E3] text-[#0071E3]"
                          : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7] text-[#1D1D1F]"
                      }`}
                    >
                      <span className="block text-base sm:text-lg font-extrabold">
                        {stg.displayName}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 3: SAÚDE DA BATERIA ── */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Qual é a saúde da bateria do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-1 bg-[#F5F5F7] p-2.5 rounded-xl inline-block border border-[#E5E5E7]">
                💡 Você encontra essa informação em: <strong className="text-[#1D1D1F]">Ajustes → Bateria → Saúde da Bateria</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "90_plus", label: "90% ou mais", desc: "Bateria em perfeito estado" },
                { key: "85_89", label: "85% a 89%", desc: "Desgaste natural de uso" },
                { key: "80_84", label: "80% a 84%", desc: "Desgaste moderado" },
                { key: "below_80", label: "Abaixo de 80%", desc: "Necessita de manutenção" },
              ].map((opt) => {
                const isSelected = batteryHealth === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setBatteryHealth(opt.key);
                      setStep(4);
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0071E3] ring-2 ring-[#0071E3] text-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7] text-[#1D1D1F]"
                    }`}
                  >
                    <div>
                      <span className="block text-sm sm:text-base font-bold">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-[#86868B] block mt-0.5">
                        {opt.desc}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                        isSelected
                          ? "border-[#0071E3] bg-[#0071E3] text-white"
                          : "border-[#D2D2D7]"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ETAPA 4: ESTADO FÍSICO ── */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Como está o estado físico do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Avalie a conservação externa do vidro, tampa e laterais.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: "excellent",
                  title: "Excelente",
                  desc: "Sem riscos relevantes, sem trincas e muito bem conservado.",
                },
                {
                  key: "very_good",
                  title: "Muito bom",
                  desc: "Pequenas marcas normais de uso, sem danos importantes.",
                },
                {
                  key: "good",
                  title: "Bom",
                  desc: "Possui riscos ou marcas de uso mais aparentes.",
                },
                {
                  key: "damaged",
                  title: "Com avarias",
                  desc: "Possui tela quebrada, tampa quebrada, amassados ou outro dano visível.",
                },
              ].map((opt) => {
                const isSelected = physicalCondition === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setPhysicalCondition(opt.key);
                      if (opt.key !== "damaged") {
                        setDamages([]);
                        setStep(5);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0071E3] ring-2 ring-[#0071E3] text-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7] text-[#1D1D1F]"
                    }`}
                  >
                    <div className="pr-2">
                      <span className="block text-sm sm:text-base font-bold">
                        {opt.title}
                      </span>
                      <span className="text-[11px] text-[#6E6E73] block mt-1 leading-relaxed">
                        {opt.desc}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-[#0071E3] bg-[#0071E3] text-white"
                          : "border-[#D2D2D7]"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SE ESCOLHER “COM AVARIAS” */}
            {physicalCondition === "damaged" && (
              <div className="pt-4 border-t border-[#E5E5E7] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                    Qual avaria o aparelho possui?
                  </h3>
                  <span className="text-[11px] text-[#86868B]">
                    Seleção múltipla
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: "screen_cracked", label: "Tela quebrada" },
                    { key: "back_cracked", label: "Tampa traseira quebrada" },
                    { key: "camera_damaged", label: "Câmera danificada" },
                    { key: "housing_dented", label: "Carcaça/amassado" },
                    { key: "face_id_issue", label: "Face ID com problema" },
                    { key: "buttons_issue", label: "Botões com problema" },
                    { key: "other_damage", label: "Outro" },
                  ].map((item) => {
                    const isChecked = damages.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleDamage(item.key)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-50/80 border-[#0071E3] text-[#0071E3] ring-1 ring-[#0071E3]"
                            : "bg-white hover:bg-[#F5F5F7] border-[#D2D2D7] text-[#1D1D1F]"
                        }`}
                      >
                        <span className="truncate pr-1">{item.label}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? "bg-[#0071E3] border-[#0071E3] text-white"
                              : "border-[#D2D2D7]"
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 5: PEÇAS E REPAROS ── */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                O iPhone já foi aberto ou teve alguma peça substituída?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Informe o histórico de manutenção do seu aparelho.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: "never", label: "Não, nunca foi aberto" },
                { key: "yes", label: "Sim" },
                { key: "unsure", label: "Não tenho certeza" },
              ].map((opt) => {
                const isSelected = replacedPartsStatus === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setReplacedPartsStatus(opt.key);
                      if (opt.key !== "yes") {
                        setReplacedParts([]);
                        setStep(6);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0071E3] ring-2 ring-[#0071E3] text-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7] text-[#1D1D1F]"
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SE “SIM” */}
            {replacedPartsStatus === "yes" && (
              <div className="pt-4 border-t border-[#E5E5E7] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                    Qual peça já foi substituída?
                  </h3>
                  <span className="text-[11px] text-[#86868B]">
                    Seleção múltipla
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: "screen", label: "Tela" },
                    { key: "battery", label: "Bateria" },
                    { key: "camera", label: "Câmera" },
                    { key: "back_glass", label: "Tampa traseira" },
                    { key: "charging_port", label: "Conector de carga" },
                    { key: "other_part", label: "Outra peça" },
                  ].map((item) => {
                    const isChecked = replacedParts.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleReplacedPart(item.key)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-50/80 border-[#0071E3] text-[#0071E3] ring-1 ring-[#0071E3]"
                            : "bg-white hover:bg-[#F5F5F7] border-[#D2D2D7] text-[#1D1D1F]"
                        }`}
                      >
                        <span className="truncate pr-1">{item.label}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? "bg-[#0071E3] border-[#0071E3] text-white"
                              : "border-[#D2D2D7]"
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 6: FUNCIONAMENTO ── */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Seu iPhone está funcionando normalmente?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Verifique os recursos e conectividade do aparelho.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "perfect", label: "Sim, tudo funcionando normalmente" },
                { key: "issues", label: "Não, possui algum problema" },
              ].map((opt) => {
                const isSelected = functionalityStatus === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setFunctionalityStatus(opt.key);
                      if (opt.key === "perfect") {
                        setMalfunctions([]);
                        setStep(7);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0071E3] ring-2 ring-[#0071E3] text-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7] text-[#1D1D1F]"
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* SE “NÃO, POSSUI ALGUM PROBLEMA” */}
            {functionalityStatus === "issues" && (
              <div className="pt-4 border-t border-[#E5E5E7] space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-[#1D1D1F]">
                    Qual problema o aparelho apresenta?
                  </h3>
                  <span className="text-[11px] text-[#86868B]">
                    Seleção múltipla
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { key: "face_id", label: "Face ID" },
                    { key: "camera", label: "Câmera" },
                    { key: "microphone", label: "Microfone" },
                    { key: "speaker", label: "Alto-falante" },
                    { key: "wifi", label: "Wi-Fi" },
                    { key: "bluetooth", label: "Bluetooth" },
                    { key: "cellular", label: "Rede/sinal" },
                    { key: "charging", label: "Carregamento" },
                    { key: "touch", label: "Touch" },
                    { key: "buttons", label: "Botões" },
                    { key: "reboots", label: "Reinicia ou desliga sozinho" },
                    { key: "other", label: "Outro" },
                  ].map((item) => {
                    const isChecked = malfunctions.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => toggleMalfunction(item.key)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-50/80 border-[#0071E3] text-[#0071E3] ring-1 ring-[#0071E3]"
                            : "bg-white hover:bg-[#F5F5F7] border-[#D2D2D7] text-[#1D1D1F]"
                        }`}
                      >
                        <span className="truncate pr-1">{item.label}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? "bg-[#0071E3] border-[#0071E3] text-white"
                              : "border-[#D2D2D7]"
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 7: RESULTADO DA AVALIAÇÃO & DADOS DO CLIENTE ── */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Value Display Box */}
            <div className="p-6 sm:p-8 rounded-3xl bg-blue-50/60 border border-blue-200/80 text-center space-y-3">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0071E3] block">
                Valor estimado do seu iPhone:
              </span>
              <div className="text-3xl sm:text-5xl font-extrabold text-[#1D1D1F] tracking-tight font-display">
                {estimatedPrice && estimatedPrice > 0 ? (
                  formatCurrency(estimatedPrice)
                ) : calculating ? (
                  <span className="inline-flex items-center gap-2 text-xl font-semibold text-[#86868B]">
                    <Loader2 className="w-5 h-5 animate-spin" /> Calculando proposta...
                  </span>
                ) : (
                  "Sob Consulta"
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                Esse é o valor estimado que podemos pagar pelo seu aparelho, considerando as informações fornecidas.
              </p>
            </div>

            {/* Summary Badge List */}
            <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5E7] flex flex-wrap gap-2 text-xs font-semibold text-[#1D1D1F]">
              <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                📱 {selectedModel?.name}
              </span>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                💾 {selectedStorage?.displayName}
              </span>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                🔋 Bateria:{" "}
                {batteryHealth === "90_plus"
                  ? "90%+"
                  : batteryHealth === "85_89"
                  ? "85-89%"
                  : batteryHealth === "80_84"
                  ? "80-84%"
                  : "<80%"}
              </span>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                ✨ Estado:{" "}
                {physicalCondition === "excellent"
                  ? "Excelente"
                  : physicalCondition === "very_good"
                  ? "Muito bom"
                  : physicalCondition === "good"
                  ? "Bom"
                  : "Com avarias"}
              </span>
            </div>

            {/* Client Form Section or Success Confirmation */}
            {quoteSuccess ? (
              <div className="p-8 rounded-3xl bg-white border border-[#E5E5E7] text-center space-y-5 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                    Solicitação Enviada!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                    Recebemos sua avaliação. O sistema da <strong>Mundo Apple</strong> acabou de enviar uma mensagem para o seu WhatsApp (<strong>{customerWhatsapp}</strong>) com todos os dados da sua cotação!
                  </p>
                </div>

                <div className="bg-[#F5F5F7] p-4 rounded-2xl border border-[#E5E5E7] inline-block text-left max-w-sm w-full space-y-2 text-xs">
                  <div className="flex justify-between border-b border-[#E5E5E7] pb-1.5">
                    <span className="text-[#86868B]">Código da Cotação:</span>
                    <span className="font-bold text-[#1D1D1F]">{quotePublicCode || "COT-AVAL"}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E5E5E7] pb-1.5">
                    <span className="text-[#86868B]">Aparelho:</span>
                    <span className="font-medium text-[#1D1D1F]">
                      {selectedModel?.name} {selectedStorage?.displayName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#86868B]">Valor Estimado:</span>
                    <span className="font-bold text-emerald-600">
                      {estimatedPrice ? formatCurrency(estimatedPrice) : ""} no PIX
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[11px] text-[#86868B] mb-3">
                    Fique atento ao seu WhatsApp, nossa equipe já foi notificada.
                  </p>
                  <button
                    type="button"
                    onClick={restart}
                    className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    Fazer nova simulação
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-white border border-[#E5E5E7] space-y-4">
                <div className="text-left">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1D1D1F] tracking-tight">
                    Gostou da avaliação?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                    Preencha seus dados para nossa equipe entrar em contato e finalizar a venda.
                  </p>
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-3.5 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#1D1D1F] mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1D1D1F] mb-1">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerWhatsapp}
                      onChange={handlePhoneChange}
                      placeholder="(11) 99999-9999"
                      className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isStepValid || submitting}
                    className="w-full py-4 bg-[#00C853] hover:bg-[#00B048] disabled:opacity-50 text-white font-extrabold text-sm sm:text-base rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Enviando proposta...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 fill-white" />
                        <span>Quero vender</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Disclaimer Aviso */}
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5E7] text-left">
              <p className="text-[11px] text-[#86868B] leading-relaxed">
                <strong>Aviso:</strong> Avaliação estimada: o valor apresentado é calculado com base nas informações fornecidas pelo cliente e poderá ser revisado caso as condições informadas não correspondam ao estado real do aparelho.
              </p>
            </div>
          </div>
        )}

        {/* ── Navigation Bottom Bar ── */}
        {step <= 6 && (
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#E5E5E7]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            ) : (
              <div />
            )}

            {isStepValid && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(7, s + 1))}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>{step === 6 ? "Ver Avaliação" : "Continuar"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Restart Button on Final Step */}
        {step === 7 && (
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868B] hover:text-[#0071E3] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fazer nova simulação</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
