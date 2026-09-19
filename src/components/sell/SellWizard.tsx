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
  Lock,
  BatteryCharging,
  Camera,
  Wifi,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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
  const totalSteps = 15;
  const [step, setStep] = useState(1);

  // Data loaded from database
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [modelSearch, setModelSearch] = useState("");

  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [loadingStorages, setLoadingStorages] = useState(false);

  // Form State — NO PRE-SELECTION (all default to empty string)
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [deviceColor, setDeviceColor] = useState("");

  // Single Question Answers (empty by default)
  const [powerOnStatus, setPowerOnStatus] = useState<string>("");
  const [icloudStatus, setIcloudStatus] = useState<string>("");
  const [screenGlass, setScreenGlass] = useState<string>("");
  const [screenDisplay, setScreenDisplay] = useState<string>("");
  const [bodyBackGlass, setBodyBackGlass] = useState<string>("");
  const [bodySides, setBodySides] = useState<string>("");
  const [cameraRear, setCameraRear] = useState<string>("");
  const [faceId, setFaceId] = useState<string>("");
  const [batteryHealth, setBatteryHealth] = useState<string>("");
  const [charging, setCharging] = useState<string>("");
  const [networkWifi, setNetworkWifi] = useState<string>("");
  const [screenHistory, setScreenHistory] = useState<string>("");

  // Customer Data
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerCep, setCustomerCep] = useState("");

  // Submission & Result
  const [submitting, setSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{
    quote: any;
    calculation: any;
  } | null>(null);

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

    async function loadStorages() {
      try {
        setLoadingStorages(true);
        const res = await fetch(`/api/sell/models/${selectedModel?.id}/storages`);
        const data = await res.json();
        const list = data.storageOptions || data.storages || [];
        if (Array.isArray(list) && list.length > 0) {
          setStorageOptions(list);
          setSelectedStorage(null); // NO PRE-SELECTION
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

  // Mask Formatters
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setCustomerWhatsapp(value);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setCustomerCep(value);
  };

  const filteredModels = useMemo(() => {
    if (!modelSearch.trim()) return models;
    const q = modelSearch.toLowerCase();
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [models, modelSearch]);

  // Step Validation Checkers — Requires user to actually answer
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!selectedModel;
      case 2:
        return !!selectedStorage;
      case 3:
        return !!powerOnStatus;
      case 4:
        return !!icloudStatus;
      case 5:
        return !!screenGlass;
      case 6:
        return !!screenDisplay;
      case 7:
        return !!bodyBackGlass;
      case 8:
        return !!bodySides;
      case 9:
        return !!cameraRear;
      case 10:
        return !!faceId;
      case 11:
        return !!batteryHealth;
      case 12:
        return !!charging;
      case 13:
        return !!networkWifi;
      case 14:
        return !!screenHistory;
      case 15:
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
    powerOnStatus,
    icloudStatus,
    screenGlass,
    screenDisplay,
    bodyBackGlass,
    bodySides,
    cameraRear,
    faceId,
    batteryHealth,
    charging,
    networkWifi,
    screenHistory,
    customerName,
    customerWhatsapp,
  ]);

  // Submit Final Quote
  const handleFinalSubmit = async () => {
    if (!selectedModel || !selectedStorage || !isStepValid) return;

    try {
      setSubmitting(true);
      const payload = {
        deviceModelId: selectedModel.id,
        storageOptionId: selectedStorage.id,
        answers: {
          deviceColor: deviceColor.trim() || "Não informada",
          powerOnStatus,
          icloudStatus,
          screenGlass,
          screenDisplay,
          bodyBackGlass,
          bodySides,
          cameraFront: "perfect",
          cameraRear,
          cameraGlass: "perfect",
          faceId,
          batteryHealth,
          audioSpeakers: "perfect",
          audioMicrophone: "perfect",
          networkWifi,
          networkCellular: networkWifi,
          charging,
          screenHistory,
          batteryHistory: "never",
          otherRepairs: ["none"],
          customerName: customerName.trim(),
          customerWhatsapp: customerWhatsapp.trim(),
          customerCep: customerCep.trim(),
        },
        customer: {
          name: customerName.trim(),
          whatsapp: customerWhatsapp.trim(),
          cep: customerCep.trim(),
        },
      };

      const res = await fetch("/api/sell/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setQuoteResult(data);
      } else {
        alert(data.error || "Ocorreu um erro ao calcular a cotação.");
      }
    } catch (err) {
      console.error("Erro ao enviar cotação:", err);
      alert("Falha na conexão ao gerar cotação. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedModel(null);
    setSelectedStorage(null);
    setDeviceColor("");
    setPowerOnStatus("");
    setIcloudStatus("");
    setScreenGlass("");
    setScreenDisplay("");
    setBodyBackGlass("");
    setBodySides("");
    setCameraRear("");
    setFaceId("");
    setBatteryHealth("");
    setCharging("");
    setNetworkWifi("");
    setScreenHistory("");
    setQuoteResult(null);
    setCustomerName("");
    setCustomerWhatsapp("");
    setCustomerCep("");
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Helper to select option
  const selectOptionAndAdvance = (setter: (val: string) => void, val: string) => {
    setter(val);
  };

  // WhatsApp formatted string
  const whatsappUrl = useMemo(() => {
    if (!quoteResult || !selectedModel || !selectedStorage) return "#";

    const code = quoteResult.quote?.publicCode || "COT-AVAL";
    const finalPrice = formatCurrency(quoteResult.calculation?.finalPrice || 0);

    const message = `Olá! Gostaria de vender meu iPhone para a Mundo Apple Delivery:

Código da Cotação: ${code}

📱 APARELHO AVALIADO:
• Modelo: ${selectedModel.name}
• Armazenamento: ${selectedStorage.displayName}
• Cor: ${deviceColor.trim() || "Não informada"}
• Funcionamento: ${powerOnStatus === "normal" ? "Liga e funciona 100%" : powerOnStatus}
• Bateria: ${batteryHealth === "good" ? "85% a 100%" : batteryHealth === "below_85" ? "Abaixo de 85%" : "Manutenção"}
• iCloud: ${icloudStatus === "unlocked" ? "Desbloqueado" : "Bloqueado"}
• Cotação para pagamento via Pix: ${finalPrice}

👤 DADOS PARA CONTATO:
Nome: ${customerName.trim()}
WhatsApp: ${customerWhatsapp.trim()}

Gostaria de agendar a avaliação presencial / entrega com pagamento no ato!`;

    return `https://wa.me/${storeConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [
    quoteResult,
    selectedModel,
    selectedStorage,
    deviceColor,
    powerOnStatus,
    batteryHealth,
    icloudStatus,
    customerName,
    customerWhatsapp,
  ]);

  // Option Click Card Component
  const OptionCard: React.FC<{
    selected: boolean;
    onClick: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    badge?: string;
  }> = ({ selected, onClick, title, subtitle, icon, badge }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-200 cursor-pointer ${
          selected
            ? "bg-blue-50/80 border-[#0071E3] shadow-md ring-2 ring-[#0071E3]/30 scale-[1.01]"
            : "bg-white border-[#D2D2D7] hover:border-[#86868B] hover:bg-[#F5F5F7] shadow-xs"
        }`}
      >
        <div className="flex items-center gap-3.5">
          {icon && (
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                selected ? "bg-[#0071E3] text-white" : "bg-[#F5F5F7] text-[#1D1D1F]"
              }`}
            >
              {icon}
            </div>
          )}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1D1D1F] text-sm sm:text-base leading-snug">
                {title}
              </span>
              {badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-[#6E6E73] leading-relaxed">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
              selected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7] bg-white"
            }`}
          >
            {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
        </div>
      </button>
    );
  };

  // ----------------------------------------------------
  // RESULT SCREEN
  // ----------------------------------------------------
  if (quoteResult) {
    const isBlocked = quoteResult.calculation?.blocked;
    const isManual = quoteResult.calculation?.manualReview;
    const finalVal = quoteResult.calculation?.finalPrice || 0;

    return (
      <div className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-0 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#D2D2D7] space-y-8 text-center">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${
                isBlocked
                  ? "bg-red-50 text-red-600"
                  : isManual
                  ? "bg-amber-50 text-amber-600"
                  : "bg-emerald-50 text-emerald-600"
              }`}
            >
              {isBlocked ? (
                <AlertCircle className="w-8 h-8" />
              ) : isManual ? (
                <ShieldCheck className="w-8 h-8" />
              ) : (
                <CheckCircle2 className="w-8 h-8" />
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] border border-[#D2D2D7]">
              <span>Cotação de Venda:</span>
              <strong className="text-[#0071E3] font-bold tracking-wider">
                {quoteResult.quote?.publicCode}
              </strong>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
              {isBlocked
                ? "Aparelho Não Elegível para Compra"
                : isManual
                ? "Avaliação Manual / Técnica Presencial"
                : "Proposta de Compra Concluída!"}
            </h2>

            <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md">
              {isBlocked
                ? "Identificamos que o aparelho possui restrição ou bloqueio de iCloud ativo."
                : isManual
                ? "Pelo estado técnico informado, este aparelho necessita de checagem física detalhada por nossa equipe especializada."
                : "Avaliamos seu iPhone com base na nossa tabela oficial com pagamento imediato via Pix."}
            </p>
          </div>

          {isBlocked ? (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-left space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>Política de Segurança — Bloqueio de iCloud</span>
              </div>
              <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                Por diretrizes rigorosas de conformidade e segurança da Mundo Apple, não compramos aparelhos com bloqueio de ativação do iCloud ou sem acesso à senha original.
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              <div className="bg-gradient-to-br from-[#F5F5F7] via-white to-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-[#D2D2D7] shadow-sm text-center space-y-3">
                <span className="text-xs font-bold text-[#6E6E73] uppercase tracking-wider block">
                  Valor da Proposta com Pagamento no Pix:
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight">
                  {formatCurrency(finalVal)}
                </div>
                <p className="text-xs text-[#6E6E73]">
                  {selectedModel?.name} · {selectedStorage?.displayName} · Cor: {deviceColor || "Padrão"}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Dinheiro na conta na hora da entrega</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {!isBlocked && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Receber Proposta e Agendar Pix</span>
              </a>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="py-4 px-6 rounded-2xl font-bold border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Nova Cotação</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-0">
      {/* Wizard Progress Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#6E6E73]">
          <span>Pergunta {step} de {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% concluído</span>
        </div>
        <div className="w-full h-2 bg-[#E5E5E7] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0071E3] transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#D2D2D7] space-y-6">
        {/* ----------------------------------------------------
            ETAPA 1 — MODELO DO APARELHO
        ---------------------------------------------------- */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 1: Modelo</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Qual iPhone você quer vender?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Selecione o modelo do seu iPhone para iniciar a avaliação.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Buscar modelo (ex: iPhone 14 Pro, iPhone 13...)"
                className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0071E3] focus:bg-white transition-all text-[#1D1D1F]"
              />
            </div>

            {loadingCatalog ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-[#6E6E73]">
                <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
                <p className="text-xs font-semibold">Carregando catálogo de modelos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredModels.map((m) => {
                  const isSel = selectedModel?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m);
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isSel
                          ? "bg-blue-50/80 border-[#0071E3] shadow-sm ring-1 ring-[#0071E3]/30"
                          : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F5F5F7] flex items-center justify-center text-[#1D1D1F]">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-[#1D1D1F] text-xs sm:text-sm">
                          {m.name}
                        </span>
                      </div>
                      {isSel && <Check className="w-4 h-4 text-[#0071E3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 2 — ARMAZENAMENTO E COR
        ---------------------------------------------------- */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 2: Capacidade</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Qual é a capacidade de memória?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                {selectedModel?.name} — selecione a memória interna do seu iPhone.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {storageOptions.map((st) => {
                const isSel = selectedStorage?.id === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSelectedStorage(st);
                    }}
                    className={`py-4 px-4 rounded-2xl border text-center font-bold text-sm sm:text-base transition-all cursor-pointer ${
                      isSel
                        ? "bg-[#0071E3] text-white border-[#0071E3] shadow-md ring-2 ring-[#0071E3]/30"
                        : "bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7]"
                    }`}
                  >
                    {st.displayName}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#E5E5E7]">
              <label className="text-xs font-semibold text-[#1D1D1F] block">
                Cor do aparelho (opcional):
              </label>
              <input
                type="text"
                value={deviceColor}
                onChange={(e) => setDeviceColor(e.target.value)}
                placeholder="Ex: Preto, Azul, Dourado, Branco..."
                className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 3 — FUNCIONAMENTO INICIAL
        ---------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 3: Funcionamento</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                O iPhone liga e funciona normalmente?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Responda sobre o estado geral de inicialização do aparelho.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={powerOnStatus === "normal"}
                onClick={() => selectOptionAndAdvance(setPowerOnStatus, "normal")}
                title="Liga perfeitamente e acessa a tela inicial"
                subtitle="Sistema inicia normalmente sem travamentos ou reinicializações."
                icon={<Zap className="w-5 h-5" />}
                badge="100% Funcional"
              />
              <OptionCard
                selected={powerOnStatus === "glitches"}
                onClick={() => selectOptionAndAdvance(setPowerOnStatus, "glitches")}
                title="Liga, mas reinicia ou trava com frequência"
                subtitle="Apresenta desligamento repentino ou travamento ocasional."
                icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              />
              <OptionCard
                selected={powerOnStatus === "no_power"}
                onClick={() => selectOptionAndAdvance(setPowerOnStatus, "no_power")}
                title="Não liga ou fica preso na maçã"
                subtitle="Aparelho não dá sinal de imagem ou travado em modo de recuperação."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 4 — CONTA ICLOUD
        ---------------------------------------------------- */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 4: Segurança</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                A conta do iCloud está liberada para remoção?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Você possui a senha para desvincular o iCloud e formatar o aparelho na entrega?
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={icloudStatus === "unlocked"}
                onClick={() => selectOptionAndAdvance(setIcloudStatus, "unlocked")}
                title="Sim, iCloud desbloqueado / tenho a senha"
                subtitle="O aparelho pode ser desvinculado e formatado de fábrica normalmente."
                icon={<Lock className="w-5 h-5 text-emerald-600" />}
                badge="Elegível"
              />
              <OptionCard
                selected={icloudStatus === "locked"}
                onClick={() => selectOptionAndAdvance(setIcloudStatus, "locked")}
                title="Não, possui bloqueio de ativação ou não sei a senha"
                subtitle="Aparelho bloqueado por conta iCloud anterior ou sem senha."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 5 — VIDRO FRONTAL DA TELA
        ---------------------------------------------------- */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 5: Vidro Frontal</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Como está o vidro frontal da tela?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Avalie o estado do vidro touch exterior da tela.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={screenGlass === "perfect"}
                onClick={() => selectOptionAndAdvance(setScreenGlass, "perfect")}
                title="Perfeito, sem riscos ou trincados"
                subtitle="Vidro impecável, sem arranhões visíveis."
                icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={screenGlass === "light_scratches"}
                onClick={() => selectOptionAndAdvance(setScreenGlass, "light_scratches")}
                title="Riscos leves superficiais"
                subtitle="Pequenas marcas de uso perceptíveis apenas contra a luz."
                icon={<Smartphone className="w-5 h-5 text-blue-600" />}
              />
              <OptionCard
                selected={screenGlass === "deep_scratches"}
                onClick={() => selectOptionAndAdvance(setScreenGlass, "deep_scratches")}
                title="Riscos profundos"
                subtitle="Arranhões mais evidentes sentidos ao passar a unha."
                icon={<Smartphone className="w-5 h-5 text-amber-600" />}
              />
              <OptionCard
                selected={screenGlass === "cracked"}
                onClick={() => selectOptionAndAdvance(setScreenGlass, "cracked")}
                title="Vidro trincado ou quebrado"
                subtitle="Fissuras, rachaduras ou vidro quebrado."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 6 — DISPLAY E TOUCH
        ---------------------------------------------------- */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 6: Imagem e Touch</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                A imagem e o toque (touch) da tela estão perfeitos?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Verifique se o display não possui manchas, linhas ou toques fantasmas.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={screenDisplay === "perfect"}
                onClick={() => selectOptionAndAdvance(setScreenDisplay, "perfect")}
                title="Display 100% perfeito e touch respondendo perfeitamente"
                subtitle="Sem manchas escuras, linhas coloridas ou falhas de toque."
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={screenDisplay === "spots"}
                onClick={() => selectOptionAndAdvance(setScreenDisplay, "spots")}
                title="Possui manchas escuras ou pixels mortos"
                subtitle="Pequenos pontos pretos ou vazamento de cristal líquido."
                icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              />
              <OptionCard
                selected={screenDisplay === "lines"}
                onClick={() => selectOptionAndAdvance(setScreenDisplay, "lines")}
                title="Possui listras verticais/horizontais ou touch falhando"
                subtitle="Linhas coloridas na imagem ou partes da tela que não respondem ao toque."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 7 — VIDRO TRASEIRO
        ---------------------------------------------------- */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 7: Traseira</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Como está o vidro ou acabamento da tampa traseira?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Avalie o verso do seu aparelho.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={bodyBackGlass === "perfect"}
                onClick={() => selectOptionAndAdvance(setBodyBackGlass, "perfect")}
                title="Traseira impecável, sem marcas ou trincados"
                subtitle="Vidro traseiro e logo da Apple em perfeito estado."
                icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={bodyBackGlass === "light_marks"}
                onClick={() => selectOptionAndAdvance(setBodyBackGlass, "light_marks")}
                title="Marcas leves de uso ou capinha"
                subtitle="Pequenas marcas normais de atrito do dia a dia."
                icon={<Smartphone className="w-5 h-5 text-blue-600" />}
              />
              <OptionCard
                selected={bodyBackGlass === "cracked"}
                onClick={() => selectOptionAndAdvance(setBodyBackGlass, "cracked")}
                title="Vidro traseiro trincado ou quebrado"
                subtitle="Fissuras ou quebras na tampa traseira."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 8 — LATERAIS E CARCAÇA
        ---------------------------------------------------- */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 8: Laterais</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Como estão as laterais e quinas do iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Verifique a borda de alumínio ou titânio do aparelho.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={bodySides === "perfect"}
                onClick={() => selectOptionAndAdvance(setBodySides, "perfect")}
                title="Laterais impecáveis, sem amassados ou riscos"
                subtitle="Estrutura 100% íntegra, sem amassados de queda."
                icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={bodySides === "light_scratches"}
                onClick={() => selectOptionAndAdvance(setBodySides, "light_scratches")}
                title="Pequenos riscos ou marcas leves"
                subtitle="Marcas de uso superficiais nas bordas."
                icon={<Smartphone className="w-5 h-5 text-blue-600" />}
              />
              <OptionCard
                selected={bodySides === "dents"}
                onClick={() => selectOptionAndAdvance(setBodySides, "dents")}
                title="Amassados ou marcas de queda nas quinas"
                subtitle="Batidas evidentes ou carcaça empenada."
                icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 9 — CÂMERAS
        ---------------------------------------------------- */}
        {step === 9 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 9: Câmeras</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                As câmeras e lentes traseiras estão funcionando?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Foco, zoom de 0.5x a 5x e vidro das câmeras.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={cameraRear === "perfect"}
                onClick={() => selectOptionAndAdvance(setCameraRear, "perfect")}
                title="Câmeras e lentes 100% perfeitas"
                subtitle="Foco rápido, fotos nítidas e vidro das lentes sem riscos."
                icon={<Camera className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={cameraRear === "spots"}
                onClick={() => selectOptionAndAdvance(setCameraRear, "spots")}
                title="Manchas pretas ou foco tremendo"
                subtitle="Fotos saem com pequenas manchas ou vibração no foco."
                icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              />
              <OptionCard
                selected={cameraRear === "broken"}
                onClick={() => selectOptionAndAdvance(setCameraRear, "broken")}
                title="Lente trincada ou câmera não abre"
                subtitle="Vidro da câmera quebrado ou tela preta ao abrir a câmera."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 10 — FACE ID / BIOMETRIA
        ---------------------------------------------------- */}
        {step === 10 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 10: Face ID</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                O Face ID (desbloqueio facial) está funcionando?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Sensor de reconhecimento facial original da Apple.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={faceId === "perfect"}
                onClick={() => selectOptionAndAdvance(setFaceId, "perfect")}
                title="Face ID funciona perfeitamente"
                subtitle="Desbloqueia instantaneamente com o rosto."
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={faceId === "broken"}
                onClick={() => selectOptionAndAdvance(setFaceId, "broken")}
                title="Face ID não funciona ou apresenta erro"
                subtitle="Aparece 'Face ID indisponível' nos ajustes."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 11 — SAÚDE DA BATERIA
        ---------------------------------------------------- */}
        {step === 11 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 11: Bateria</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Qual é a saúde da bateria em Ajustes &gt; Bateria?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Verifique a porcentagem de capacidade máxima nos Ajustes do iOS.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={batteryHealth === "good"}
                onClick={() => selectOptionAndAdvance(setBatteryHealth, "good")}
                title="Excelente — 85% a 100%"
                subtitle="Saúde ótima com capacidade de desempenho máxima."
                icon={<BatteryCharging className="w-5 h-5 text-emerald-600" />}
                badge="Alta Saúde"
              />
              <OptionCard
                selected={batteryHealth === "below_85"}
                onClick={() => selectOptionAndAdvance(setBatteryHealth, "below_85")}
                title="Intermediária — 80% a 84%"
                subtitle="Bateria original ainda em funcionamento sem aviso de serviço."
                icon={<BatteryCharging className="w-5 h-5 text-blue-600" />}
              />
              <OptionCard
                selected={batteryHealth === "service_unknown"}
                onClick={() => selectOptionAndAdvance(setBatteryHealth, "service_unknown")}
                title="Abaixo de 80% ou mensagem de 'Manutenção'"
                subtitle="Necessita de troca ou apresenta aviso de peça desconhecida."
                icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 12 — CARREGAMENTO
        ---------------------------------------------------- */}
        {step === 12 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 12: Conector</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                O conector de carga e carregamento funcionam bem?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Entrada Lightning / USB-C e carregamento sem fio.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={charging === "perfect"}
                onClick={() => selectOptionAndAdvance(setCharging, "perfect")}
                title="Carrega normalmente pelo cabo e sem fio"
                subtitle="Encaixe firme e carregamento contínuo sem mau contato."
                icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={charging === "bad_contact"}
                onClick={() => selectOptionAndAdvance(setCharging, "bad_contact")}
                title="Possui mau contato no cabo"
                subtitle="Precisa posicionar o cabo em uma posição específica para carregar."
                icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              />
              <OptionCard
                selected={charging === "broken"}
                onClick={() => selectOptionAndAdvance(setCharging, "broken")}
                title="Não carrega de jeito nenhum"
                subtitle="Entrada danificada ou conector rompido."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 13 — CONECTIVIDADE (WI-FI & CHIP)
        ---------------------------------------------------- */}
        {step === 13 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 13: Conexões</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Wi-Fi, Bluetooth e sinal de operadora funcionam normais?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Conexão com redes sem fio e sinal 4G/5G do chip.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={networkWifi === "perfect"}
                onClick={() => selectOptionAndAdvance(setNetworkWifi, "perfect")}
                title="Tudo funciona perfeitamente (Wi-Fi, Bluetooth e 4G/5G)"
                subtitle="Conecta em redes e faz chamadas normalmente."
                icon={<Wifi className="w-5 h-5 text-emerald-600" />}
              />
              <OptionCard
                selected={networkWifi === "broken"}
                onClick={() => selectOptionAndAdvance(setNetworkWifi, "broken")}
                title="Possui falha no Wi-Fi, Bluetooth ou sinal de operadora"
                subtitle="Wi-Fi desabilitado (cinza) ou 'Sem Serviço' permanente."
                icon={<AlertCircle className="w-5 h-5 text-red-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 14 — HISTÓRICO DE REPAROS
        ---------------------------------------------------- */}
        {step === 14 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 14: Histórico</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                A tela ou bateria já foram trocadas alguma vez?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Peças originais de fábrica garantem maior valorização na compra.
              </p>
            </div>

            <div className="space-y-3">
              <OptionCard
                selected={screenHistory === "original"}
                onClick={() => selectOptionAndAdvance(setScreenHistory, "original")}
                title="Nunca foi aberto — Todas as peças originais de fábrica"
                subtitle="Aparelho 100% original sem trocas de tela, bateria ou carcaça."
                icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
                badge="Máxima Valorização"
              />
              <OptionCard
                selected={screenHistory === "apple_genuine"}
                onClick={() => selectOptionAndAdvance(setScreenHistory, "apple_genuine")}
                title="Já teve peça trocada em Autorizada Apple (Original)"
                subtitle="Substituição oficial com registro nos Ajustes do iOS."
                icon={<CheckCircle2 className="w-5 h-5 text-blue-600" />}
              />
              <OptionCard
                selected={screenHistory === "parallel"}
                onClick={() => selectOptionAndAdvance(setScreenHistory, "parallel")}
                title="Já teve peça trocada em assistência comum / paralela"
                subtitle="Tela ou bateria trocada de primeira linha ou paralela."
                icon={<AlertCircle className="w-5 h-5 text-amber-600" />}
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 15 — DADOS DO CLIENTE
        ---------------------------------------------------- */}
        {step === 15 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Último Passo: Seus Dados</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Para onde enviamos sua cotação Pix na hora?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Preencha seu nome e WhatsApp para ver o valor final e agendar o pagamento.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Seu Nome Completo: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-sm text-[#1D1D1F] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  WhatsApp com DDD: <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerWhatsapp}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-sm text-[#1D1D1F] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            NAVIGATION BUTTONS
        ---------------------------------------------------- */}
        <div className="pt-4 border-t border-[#E5E5E7] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[#D2D2D7] text-xs font-bold text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid || submitting}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
              isStepValid && !submitting
                ? "bg-[#0071E3] hover:bg-[#0077ED] active:scale-95"
                : "bg-gray-300 cursor-not-allowed opacity-60"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Calculando Cotação Pix...</span>
              </>
            ) : step === totalSteps ? (
              <>
                <span>Ver Cotação no Pix</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
