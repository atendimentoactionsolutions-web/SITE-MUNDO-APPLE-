"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  MessageCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  BatteryCharging,
  Camera,
  Wifi,
  Volume2,
  Lock,
  Sliders,
} from "lucide-react";
import Image from "next/image";
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

export const SellWizard: React.FC<SellWizardProps> = ({ onCancel }) => {
  const totalSteps = 10;
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
  const [deviceColor, setDeviceColor] = useState("");

  // 13 Evaluation Criteria State
  // 1. Funcionamento Inicial
  const [powerOnStatus, setPowerOnStatus] = useState<string>("normal");
  // 13. Bloqueio iCloud
  const [icloudStatus, setIcloudStatus] = useState<string>("unlocked");

  // 2. Condição da Tela
  const [screenGlass, setScreenGlass] = useState<string>("perfect");
  const [screenDisplay, setScreenDisplay] = useState<string>("perfect");

  // 3. Estado da Carcaça
  const [bodyBackGlass, setBodyBackGlass] = useState<string>("perfect");
  const [bodySides, setBodySides] = useState<string>("perfect");

  // 4. Câmeras & 5. Face ID
  const [cameraFront, setCameraFront] = useState<string>("perfect");
  const [cameraRear, setCameraRear] = useState<string>("perfect");
  const [cameraGlass, setCameraGlass] = useState<string>("perfect");
  const [faceId, setFaceId] = useState<string>("perfect");

  // Saúde da Bateria & 9. Carregamento
  const [batteryHealth, setBatteryHealth] = useState<string>("good");
  const [charging, setCharging] = useState<string>("perfect");

  // 7. Áudio & 8. Conectividade
  const [audioSpeakers, setAudioSpeakers] = useState<string>("perfect");
  const [audioMicrophone, setAudioMicrophone] = useState<string>("perfect");
  const [networkWifi, setNetworkWifi] = useState<string>("perfect");
  const [networkCellular, setNetworkCellular] = useState<string>("perfect");

  // 10. Histórico Tela, 11. Bateria & 12. Outros Reparos
  const [screenHistory, setScreenHistory] = useState<string>("original");
  const [batteryHistory, setBatteryHistory] = useState<string>("never");
  const [otherRepairs, setOtherRepairs] = useState<string[]>(["none"]);

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
          if (!list.some((s: StorageOption) => s.id === selectedStorage?.id)) {
            setSelectedStorage(list[0]);
          }
        } else {
          const fallback = [
            { id: "storage-64gb", displayName: "64GB", capacityGb: 64 },
            { id: "storage-128gb", displayName: "128GB", capacityGb: 128 },
            { id: "storage-256gb", displayName: "256GB", capacityGb: 256 },
            { id: "storage-512gb", displayName: "512GB", capacityGb: 512 },
          ];
          setStorageOptions(fallback);
          setSelectedStorage(fallback[0]);
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

  const toggleOtherRepair = (item: string) => {
    if (item === "none") {
      setOtherRepairs(["none"]);
      return;
    }
    let next = otherRepairs.filter((r) => r !== "none");
    if (next.includes(item)) {
      next = next.filter((r) => r !== item);
    } else {
      next.push(item);
    }
    if (next.length === 0) next = ["none"];
    setOtherRepairs(next);
  };

  // Step Validation Checkers
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!selectedModel;
      case 2:
        return !!selectedStorage;
      case 3:
        return !!powerOnStatus && !!icloudStatus;
      case 4:
        return !!screenGlass && !!screenDisplay;
      case 5:
        return !!bodyBackGlass && !!bodySides;
      case 6:
        return !!cameraFront && !!cameraRear && !!faceId;
      case 7:
        return !!batteryHealth && !!charging;
      case 8:
        return !!networkWifi && !!networkCellular;
      case 9:
        return !!screenHistory && !!batteryHistory && otherRepairs.length > 0;
      case 10:
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
    cameraFront,
    cameraRear,
    cameraGlass,
    faceId,
    batteryHealth,
    charging,
    audioSpeakers,
    audioMicrophone,
    networkWifi,
    networkCellular,
    screenHistory,
    batteryHistory,
    otherRepairs,
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
          cameraFront,
          cameraRear,
          cameraGlass,
          faceId,
          batteryHealth,
          audioSpeakers,
          audioMicrophone,
          networkWifi,
          networkCellular,
          charging,
          screenHistory,
          batteryHistory,
          otherRepairs,
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
    setPowerOnStatus("normal");
    setIcloudStatus("unlocked");
    setScreenGlass("perfect");
    setScreenDisplay("perfect");
    setBodyBackGlass("perfect");
    setBodySides("perfect");
    setCameraFront("perfect");
    setCameraRear("perfect");
    setCameraGlass("perfect");
    setFaceId("perfect");
    setBatteryHealth("good");
    setCharging("perfect");
    setAudioSpeakers("perfect");
    setAudioMicrophone("perfect");
    setNetworkWifi("perfect");
    setNetworkCellular("perfect");
    setScreenHistory("original");
    setBatteryHistory("never");
    setOtherRepairs(["none"]);
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
CEP/Cidade: ${customerCep.trim() || "Não informado"}

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
    customerCep,
  ]);

  // Option Radio Card Component
  const OptionRadioCard: React.FC<{
    selected: boolean;
    onClick: () => void;
    title: string;
    subtitle?: string;
  }> = ({ selected, onClick, title, subtitle }) => {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
          selected
            ? "bg-apple-blue/5 border-apple-blue shadow-sm ring-1 ring-apple-blue/30"
            : "bg-white border-apple-border hover:bg-apple-gray/30"
        }`}
      >
        <div className="space-y-0.5">
          <div className="font-semibold text-apple-dark text-sm sm:text-base leading-snug">
            {title}
          </div>
          {subtitle && <p className="text-xs text-apple-muted leading-relaxed">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
              selected ? "bg-apple-blue border-apple-blue text-white" : "border-apple-border bg-white"
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
    const baseVal = quoteResult.calculation?.basePrice || 0;

    return (
      <div className="w-full max-w-2xl mx-auto py-4 px-4 sm:px-0 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-apple-border space-y-8 text-center">
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

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-apple-gray text-xs font-semibold text-apple-dark border border-apple-border">
              <span>Cotação de Venda:</span>
              <strong className="text-apple-blue font-bold tracking-wider">
                {quoteResult.quote?.publicCode}
              </strong>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-apple-dark">
              {isBlocked
                ? "Aparelho Não Elegível para Compra"
                : isManual
                ? "Avaliação Manual / Técnica Presencial"
                : "Proposta de Compra Concluída!"}
            </h2>

            <p className="text-xs sm:text-sm text-apple-muted max-w-md">
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
                Por diretrizes rigorosas de conformidade e segurança da Mundo Apple, não compramos nem aceitamos na troca aparelhos com bloqueio de ativação do iCloud ou sem acesso à senha original.
              </p>
            </div>
          ) : (
            <div className="space-y-6 text-left">
              {/* Card Preço PIX */}
              <div className="bg-gradient-to-br from-[#F5F5F7] via-white to-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-apple-border shadow-sm text-center space-y-3">
                <span className="text-xs font-bold text-apple-muted uppercase tracking-wider block">
                  Valor da Proposta com Pagamento no Pix:
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-emerald-600 tracking-tight">
                  {formatCurrency(finalVal)}
                </div>
                <p className="text-xs text-apple-muted">
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
              className="py-4 px-6 rounded-2xl font-bold border-apple-border text-apple-dark hover:bg-apple-gray transition-all"
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
        <div className="flex items-center justify-between text-xs font-semibold text-apple-muted">
          <span>Etapa {step} de {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% concluído</span>
        </div>
        <div className="w-full h-2 bg-apple-gray rounded-full overflow-hidden">
          <div
            className="h-full bg-apple-blue transition-all duration-300 rounded-full"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-apple-border space-y-6">
        {/* ----------------------------------------------------
            ETAPA 1 — MODELO DO APARELHO
        ---------------------------------------------------- */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 1: Modelo</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Qual iPhone você quer vender?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Selecione o modelo do aparelho para obter a cotação de compra imediata.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-apple-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Buscar modelo (ex: iPhone 13 Pro, iPhone 16...)"
                className="w-full pl-11 pr-4 py-3.5 bg-apple-gray/40 rounded-2xl text-sm font-medium border border-apple-border focus:border-apple-blue focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {loadingCatalog ? (
              <div className="py-12 flex flex-col items-center justify-center text-apple-muted space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
                <span className="text-xs font-medium">Carregando catálogo de modelos...</span>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
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
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-apple-blue/10 border-apple-blue shadow-sm"
                          : "bg-white border-apple-border hover:bg-apple-gray/30 hover:border-apple-dark/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center text-apple-dark">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-apple-dark text-sm sm:text-base">
                          {m.name}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-apple-muted" />
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
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 2: Capacidade e Cor</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Qual a capacidade e cor do seu {selectedModel?.name}?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Informe o armazenamento interno e a cor do aparelho.
              </p>
            </div>

            {loadingStorages ? (
              <div className="py-8 flex justify-center text-apple-muted">
                <Loader2 className="w-6 h-6 animate-spin text-apple-blue" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {storageOptions.map((so) => {
                  const isSelected = selectedStorage?.id === so.id;
                  return (
                    <button
                      key={so.id}
                      type="button"
                      onClick={() => setSelectedStorage(so)}
                      className={`py-4 px-3 rounded-2xl border text-center font-bold text-base sm:text-lg transition-all ${
                        isSelected
                          ? "bg-apple-dark text-white border-apple-dark shadow-md scale-[1.02]"
                          : "bg-white text-apple-dark border-apple-border hover:border-apple-dark/40 hover:bg-apple-gray/30"
                      }`}
                    >
                      {so.displayName}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-2 pt-2 border-t border-apple-border/60">
              <label className="block text-sm font-bold text-apple-dark">
                Qual a cor do aparelho?
              </label>
              <input
                type="text"
                value={deviceColor}
                onChange={(e) => setDeviceColor(e.target.value)}
                placeholder="Ex: Meia-noite, Estelar, Azul, Titânio Natural, Preto Espacial..."
                className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium border border-apple-border focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 3 — 1. FUNCIONAMENTO INICIAL & 13. ICLOUD
        ---------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 3: Inicialização &amp; Conta</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Como está o funcionamento inicial e a conta iCloud?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                1. Funcionamento Inicial e Bloqueio de iCloud da Tabela Oficial.
              </p>
            </div>

            {/* 1. Funcionamento Inicial */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Funcionamento Inicial do Aparelho
              </label>
              <OptionRadioCard
                selected={powerOnStatus === "normal"}
                onClick={() => setPowerOnStatus("normal")}
                title="Sim, liga e funciona normalmente"
                subtitle="Inicializa perfeitamente e opera sem travamentos ou reinicializações."
              />
              <OptionRadioCard
                selected={powerOnStatus === "glitches"}
                onClick={() => setPowerOnStatus("glitches")}
                title="Liga, mas apresenta falhas ou reinicializações"
                subtitle="Reinicia sozinho em poucos minutos ou trava durante o uso."
              />
              <OptionRadioCard
                selected={powerOnStatus === "recovery"}
                onClick={() => setPowerOnStatus("recovery")}
                title="Está travado na tela da Apple / modo de recuperação"
                subtitle="Travado no loop de logo da maçã ou tela de cabo do iTunes."
              />
              <OptionRadioCard
                selected={powerOnStatus === "no_power"}
                onClick={() => setPowerOnStatus("no_power")}
                title="Não liga"
                subtitle="Não dá sinal de vida ao conectar ao carregador ou pressionar botões."
              />
            </div>

            {/* 13. Bloqueio iCloud */}
            <div className="space-y-2.5 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-apple-blue" />
                Bloqueio de iCloud
              </label>
              <OptionRadioCard
                selected={icloudStatus === "unlocked"}
                onClick={() => setIcloudStatus("unlocked")}
                title="Aparelho totalmente desbloqueado e pronto para restauração"
                subtitle="Você possui o login e senha e o Buscar iPhone pode ser desativado."
              />
              <OptionRadioCard
                selected={icloudStatus === "locked"}
                onClick={() => setIcloudStatus("locked")}
                title="Aparelho bloqueado no iCloud ou sem senha"
                subtitle="NÃO COMPRAMOS / AVALIAÇÃO RECUSADA."
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 4 — 2. CONDIÇÃO DA TELA (VIDRO + DISPLAY)
        ---------------------------------------------------- */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 4: Tela</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Como está a tela do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Avalie o vidro frontal e a imagem interna do display.
              </p>
            </div>

            {/* Vidro da tela */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Como está o vidro frontal da tela?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <OptionRadioCard
                  selected={screenGlass === "perfect"}
                  onClick={() => setScreenGlass("perfect")}
                  title="Perfeito, sem riscos"
                />
                <OptionRadioCard
                  selected={screenGlass === "light_scratches"}
                  onClick={() => setScreenGlass("light_scratches")}
                  title="Arranhões leves"
                  subtitle="Marcas superficiais visíveis sob luz."
                />
                <OptionRadioCard
                  selected={screenGlass === "moderate_scratches"}
                  onClick={() => setScreenGlass("moderate_scratches")}
                  title="Arranhões moderados"
                  subtitle="Marcas visíveis durante o uso."
                />
                <OptionRadioCard
                  selected={screenGlass === "deep_scratches"}
                  onClick={() => setScreenGlass("deep_scratches")}
                  title="Arranhões profundos"
                  subtitle="Perceptíveis ao passar a unha."
                />
              </div>
              <OptionRadioCard
                selected={screenGlass === "cracked"}
                onClick={() => setScreenGlass("cracked")}
                title="Vidro trincado ou quebrado"
                subtitle="Fissuras, rachaduras ou vidro estilhaçado."
              />
            </div>

            {/* Imagem do Display */}
            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Como está a imagem do display interno?
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={screenDisplay === "perfect"}
                  onClick={() => setScreenDisplay("perfect")}
                  title="Perfeita, cores e toque 100%"
                />
                <OptionRadioCard
                  selected={screenDisplay === "spots"}
                  onClick={() => setScreenDisplay("spots")}
                  title="Possui manchas"
                  subtitle="Pontos pretos, manchas roxas ou amarelas no painel."
                />
                <OptionRadioCard
                  selected={screenDisplay === "lines"}
                  onClick={() => setScreenDisplay("lines")}
                  title="Possui linhas / listras"
                  subtitle="Linhas verticais ou horizontais (verdes, brancas ou coloridas)."
                />
                <OptionRadioCard
                  selected={screenDisplay === "dead_pixels"}
                  onClick={() => setScreenDisplay("dead_pixels")}
                  title="Possui pixels mortos"
                  subtitle="Pontinhos pretos fixos na tela."
                />
                <OptionRadioCard
                  selected={screenDisplay === "burn_in"}
                  onClick={() => setScreenDisplay("burn_in")}
                  title="Possui burn-in / imagem marcada"
                  subtitle="Sombras de ícones ou teclado fixadas no fundo."
                />
                <OptionRadioCard
                  selected={screenDisplay === "no_image"}
                  onClick={() => setScreenDisplay("no_image")}
                  title="Não apresenta imagem"
                  subtitle="Tela totalmente preta / apagada."
                />
              </div>

              <div className="p-3 bg-apple-gray/50 rounded-xl text-[11px] text-apple-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-apple-blue flex-shrink-0" />
                <span>
                  <strong>Regra Anti-Duplicação:</strong> Caso o vidro e display apresentem danos simultâneos que exijam a troca do conjunto, aplicamos apenas o maior abatimento.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 5 — 3. ESTADO DA CARCAÇA E ACABAMENTO
        ---------------------------------------------------- */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 5: Carcaça</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Como está a tampa traseira e as laterais?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Avalie o acabamento estético exterior do aparelho.
              </p>
            </div>

            {/* Tampa traseira */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Como está a tampa traseira?
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={bodyBackGlass === "perfect"}
                  onClick={() => setBodyBackGlass("perfect")}
                  title="Perfeita, sem marcas"
                />
                <OptionRadioCard
                  selected={bodyBackGlass === "light_marks"}
                  onClick={() => setBodyBackGlass("light_marks")}
                  title="Marcas de uso leves"
                  subtitle="Marcas suaves de capinha."
                />
                <OptionRadioCard
                  selected={bodyBackGlass === "heavy_marks"}
                  onClick={() => setBodyBackGlass("heavy_marks")}
                  title="Marcas fortes ou descascados"
                />
                <OptionRadioCard
                  selected={bodyBackGlass === "cracked"}
                  onClick={() => setBodyBackGlass("cracked")}
                  title="Trincada"
                  subtitle="Fissuras ou trincados no vidro traseiro."
                />
                <OptionRadioCard
                  selected={bodyBackGlass === "broken"}
                  onClick={() => setBodyBackGlass("broken")}
                  title="Quebrada com perda de material"
                  subtitle="Vidro estilhaçado com partes soltas."
                />
              </div>
            </div>

            {/* Laterais */}
            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Como estão as laterais (bordas)?
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={bodySides === "perfect"}
                  onClick={() => setBodySides("perfect")}
                  title="Perfeitas"
                />
                <OptionRadioCard
                  selected={bodySides === "light_scratches"}
                  onClick={() => setBodySides("light_scratches")}
                  title="Pequenos arranhões ou descascados"
                />
                <OptionRadioCard
                  selected={bodySides === "impact_marks"}
                  onClick={() => setBodySides("impact_marks")}
                  title="Marcas fortes de impacto"
                />
                <OptionRadioCard
                  selected={bodySides === "dents"}
                  onClick={() => setBodySides("dents")}
                  title="Amassados ou batidas visíveis"
                />
                <OptionRadioCard
                  selected={bodySides === "bent"}
                  onClick={() => setBodySides("bent")}
                  title="Estrutura empenada ou torta"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 6 — 4. CÂMERAS & 5. FACE ID
        ---------------------------------------------------- */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 6: Câmeras &amp; Biometria</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Como estão as câmeras e o Face ID?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Avaliação de fotos, foco, lentes externas e sensor facial.
              </p>
            </div>

            {/* Câmera Frontal */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Câmera Frontal (Selfie)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <OptionRadioCard
                  selected={cameraFront === "perfect"}
                  onClick={() => setCameraFront("perfect")}
                  title="Funciona perfeitamente"
                />
                <OptionRadioCard
                  selected={cameraFront === "spots"}
                  onClick={() => setCameraFront("spots")}
                  title="Apresenta manchas"
                />
                <OptionRadioCard
                  selected={cameraFront === "focus"}
                  onClick={() => setCameraFront("focus")}
                  title="Problemas de foco"
                />
                <OptionRadioCard
                  selected={cameraFront === "broken"}
                  onClick={() => setCameraFront("broken")}
                  title="Não funciona / tela preta"
                />
              </div>
            </div>

            {/* Câmeras Traseiras */}
            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Câmeras Traseiras
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={cameraRear === "perfect"}
                  onClick={() => setCameraRear("perfect")}
                  title="Funcionam perfeitamente (todas as lentes)"
                />
                <OptionRadioCard
                  selected={cameraRear === "spots"}
                  onClick={() => setCameraRear("spots")}
                  title="Manchas na imagem"
                />
                <OptionRadioCard
                  selected={cameraRear === "focus"}
                  onClick={() => setCameraRear("focus")}
                  title="Problemas de foco"
                />
                <OptionRadioCard
                  selected={cameraRear === "shaking"}
                  onClick={() => setCameraRear("shaking")}
                  title="Câmera tremendo ao abrir (estabilizador)"
                />
                <OptionRadioCard
                  selected={cameraRear === "one_broken"}
                  onClick={() => setCameraRear("one_broken")}
                  title="Uma das câmeras não funciona"
                />
                <OptionRadioCard
                  selected={cameraRear === "all_broken"}
                  onClick={() => setCameraRear("all_broken")}
                  title="Nenhuma câmera funciona"
                />
              </div>
            </div>

            {/* Face ID */}

            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Reconhecimento Facial (Face ID)
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={faceId === "perfect"}
                  onClick={() => setFaceId("perfect")}
                  title="Funciona normalmente"
                />
                <OptionRadioCard
                  selected={faceId === "glitches"}
                  onClick={() => setFaceId("glitches")}
                  title="Apresenta falhas intermitentes"
                />
                <OptionRadioCard
                  selected={faceId === "broken"}
                  onClick={() => setFaceId("broken")}
                  title="Não funciona"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 7 — 6. BATERIA & 9. CARREGAMENTO
        ---------------------------------------------------- */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 7: Bateria &amp; Carga</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Qual a saúde da bateria e como está o conector de carga?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Consulte em Ajustes &gt; Bateria &gt; Saúde da Bateria.
              </p>
            </div>

            {/* Saúde da Bateria */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <BatteryCharging className="w-3.5 h-3.5 text-apple-blue" />
                Saúde da Bateria
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={batteryHealth === "good"}
                  onClick={() => setBatteryHealth("good")}
                  title="85% a 100%"
                  subtitle="Excelente capacidade e autonomia normal."
                />
                <OptionRadioCard
                  selected={batteryHealth === "below_85"}
                  onClick={() => setBatteryHealth("below_85")}
                  title="Abaixo de 85%"
                  subtitle="Bateria desgastada por tempo de uso."
                />
                <OptionRadioCard
                  selected={batteryHealth === "service_unknown"}
                  onClick={() => setBatteryHealth("service_unknown")}
                  title="Mensagem de manutenção / Não é possível consultar a saúde"
                />
              </div>
            </div>

            {/* 9. Carregamento e Conector */}
            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Carregamento e Conector
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={charging === "perfect"}
                  onClick={() => setCharging("perfect")}
                  title="Carrega normalmente"
                />
                <OptionRadioCard
                  selected={charging === "specific_positions"}
                  onClick={() => setCharging("specific_positions")}
                  title="Carrega apenas em determinadas posições"
                />
                <OptionRadioCard
                  selected={charging === "bad_contact"}
                  onClick={() => setCharging("bad_contact")}
                  title="Apresenta mau contato frequente"
                />
                <OptionRadioCard
                  selected={charging === "broken"}
                  onClick={() => setCharging("broken")}
                  title="Não carrega"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 8 — 7. ÁUDIO & 8. REDE E CONECTIVIDADE
        ---------------------------------------------------- */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 8: Conectividade</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Como está a conectividade do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Conexão Wi-Fi estável e sinal de rede móvel da operadora.
              </p>
            </div>

            {/* Wi-Fi */}

            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Conexão Wi-Fi
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <OptionRadioCard
                  selected={networkWifi === "perfect"}
                  onClick={() => setNetworkWifi("perfect")}
                  title="Conecta normalmente"
                />
                <OptionRadioCard
                  selected={networkWifi === "glitches"}
                  onClick={() => setNetworkWifi("glitches")}
                  title="Quedas / sinal fraco"
                />
                <OptionRadioCard
                  selected={networkWifi === "broken"}
                  onClick={() => setNetworkWifi("broken")}
                  title="Não ativa / conecta"
                />
              </div>
            </div>

            {/* 8. Rede Móvel / Chip */}
            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Rede Móvel (Chip / eSIM)
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={networkCellular === "perfect"}
                  onClick={() => setNetworkCellular("perfect")}
                  title="Sinal normal (4G/5G estável)"
                />
                <OptionRadioCard
                  selected={networkCellular === "glitches"}
                  onClick={() => setNetworkCellular("glitches")}
                  title="Falhas de sinal frequentes"
                />
                <OptionRadioCard
                  selected={networkCellular === "no_sim"}
                  onClick={() => setNetworkCellular("no_sim")}
                  title="Não reconhece chip físico ou eSIM"
                />
                <OptionRadioCard
                  selected={networkCellular === "no_signal"}
                  onClick={() => setNetworkCellular("no_signal")}
                  title="Sem sinal de operadora constante (Sem Serviço)"
                />
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 9 — 10. HISTÓRICO TELA, 11. BATERIA & 12. OUTROS REPAROS
        ---------------------------------------------------- */}
        {step === 9 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 9: Manutenções Anteriores</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                O aparelho já passou por trocas de peças ou reparos?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Consulte em Ajustes &gt; Geral &gt; Sobre &gt; Histórico de Peças.
              </p>
            </div>

            {/* Histórico da Tela */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Histórico da Tela
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={screenHistory === "original"}
                  onClick={() => setScreenHistory("original")}
                  title="Tela original de fábrica"
                />
                <OptionRadioCard
                  selected={screenHistory === "apple_genuine"}
                  onClick={() => setScreenHistory("apple_genuine")}
                  title="Tela trocada genuína Apple (autorizada)"
                />
                <OptionRadioCard
                  selected={screenHistory === "original_pulled"}
                  onClick={() => setScreenHistory("original_pulled")}
                  title="Tela trocada original retirada de outro aparelho"
                />
                <OptionRadioCard
                  selected={screenHistory === "parallel"}
                  onClick={() => setScreenHistory("parallel")}
                  title="Tela trocada paralela / primeira linha"
                />
                <OptionRadioCard
                  selected={screenHistory === "unknown"}
                  onClick={() => setScreenHistory("unknown")}
                  title="Não sabe informar"
                />
              </div>
            </div>

            {/* Histórico da Bateria */}
            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Histórico da Bateria
              </label>
              <div className="space-y-2">
                <OptionRadioCard
                  selected={batteryHistory === "never"}
                  onClick={() => setBatteryHistory("never")}
                  title="Bateria nunca trocada (original de fábrica)"
                />
                <OptionRadioCard
                  selected={batteryHistory === "apple_genuine"}
                  onClick={() => setBatteryHistory("apple_genuine")}
                  title="Trocada por genuína Apple (autorizada)"
                />
                <OptionRadioCard
                  selected={batteryHistory === "original_pulled"}
                  onClick={() => setBatteryHistory("original_pulled")}
                  title="Trocada por original retirada"
                />
                <OptionRadioCard
                  selected={batteryHistory === "parallel"}
                  onClick={() => setBatteryHistory("parallel")}
                  title="Trocada por bateria paralela"
                />
                <OptionRadioCard
                  selected={batteryHistory === "unknown"}
                  onClick={() => setBatteryHistory("unknown")}
                  title="Não sabe informar"
                />
              </div>
            </div>

            {/* 12. Outros Reparos Já Realizados */}
            <div className="space-y-2 pt-3 border-t border-apple-border/60">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Outros Reparos Já Realizados
              </label>
              <div className="space-y-2">
                {[
                  { id: "none", title: "Nenhum outro reparo" },
                  { id: "back_glass", title: "Tampa traseira já reparada" },
                  { id: "rear_camera", title: "Câmera traseira já reparada" },
                  { id: "front_camera", title: "Câmera frontal já reparada" },
                  { id: "charging_port", title: "Conector de carga já reparado" },
                  { id: "speaker", title: "Alto-falante já reparado" },
                  { id: "microphone", title: "Microfone já reparado" },
                  { id: "motherboard", title: "Placa-mãe já reparada" },
                  { id: "other", title: "Outro reparo não listado" },
                ].map((rep) => {
                  const isChecked = otherRepairs.includes(rep.id);
                  return (
                    <OptionRadioCard
                      key={rep.id}
                      selected={isChecked}
                      onClick={() => toggleOtherRepair(rep.id)}
                      title={rep.title}
                      
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 10 — DADOS DO CLIENTE & CALCULAR
        ---------------------------------------------------- */}
        {step === 10 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 10: Seus Dados</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Onde enviamos a sua cotação de compra no Pix?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Preencha seus dados para gerar o código exclusivo e receber nossa equipe com pagamento na hora.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-apple-dark uppercase tracking-wider mb-1.5">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium border border-apple-border focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-dark uppercase tracking-wider mb-1.5">
                  WhatsApp com DDD *
                </label>
                <input
                  type="tel"
                  value={customerWhatsapp}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium border border-apple-border focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-apple-dark uppercase tracking-wider mb-1.5">
                  CEP ou Cidade (Opcional)
                </label>
                <input
                  type="text"
                  value={customerCep}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                  className="w-full px-4 py-3.5 bg-white rounded-2xl text-sm font-medium border border-apple-border focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs text-emerald-800">
                Pagamento garantido via PIX imediatamente após a conferência do aparelho. Sem intermediários.
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-apple-border/70">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleBack}
              disabled={submitting}
              className="py-3 px-5 rounded-2xl font-bold border-apple-border text-apple-dark hover:bg-apple-gray"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Voltar
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            onClick={handleNext}
            disabled={!isStepValid || submitting}
            className={`py-3 px-7 rounded-2xl font-bold text-white transition-all shadow-md ${
              isStepValid && !submitting
                ? "bg-apple-dark hover:bg-black scale-[1.01]"
                : "bg-apple-dark/40 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando Cotação...
              </span>
            ) : step === totalSteps ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Calcular Cotação PIX
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Avançar
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
