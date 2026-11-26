"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  MessageCircle,
  Loader2,
  BatteryCharging,
  Lock,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  X,
  Smartphone,
  Sparkles,
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
  // 8 etapas de triagem + Etapa 9 de Resultado/Dados
  const totalQuestionSteps = 8;
  const [step, setStep] = useState(1);
  const [stepDirection, setStepDirection] = useState<1 | -1>(1);
  const [hasNavigated, setHasNavigated] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Catálogo
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [modelSearch, setModelSearch] = useState("");
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>("all");

  const clearPendingAdvance = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  };

  useEffect(() => () => clearPendingAdvance(), []);

  const goToStep = (nextStep: number) => {
    clearPendingAdvance();
    setStepDirection(nextStep >= step ? 1 : -1);
    setHasNavigated(true);
    setStep(nextStep);
  };

  // Show tactile selection confirmation (155ms beat) before gliding to the next step
  const advanceWithBeat = (nextStep: number) => {
    clearPendingAdvance();
    advanceTimerRef.current = setTimeout(() => {
      setStepDirection(1);
      setHasNavigated(true);
      setStep(nextStep);
      advanceTimerRef.current = null;
    }, 155);
  };

  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [loadingStorages, setLoadingStorages] = useState(false);

  // 2. Respostas
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [batteryHealth, setBatteryHealth] = useState<string>("");
  const [screenCondition, setScreenCondition] = useState<string>("");
  const [backCondition, setBackCondition] = useState<string>("");
  const [sidesCondition, setSidesCondition] = useState<string>("");

  // Peças trocadas (Seleção direta de peças)
  const [replacedPartsStatus, setReplacedPartsStatus] = useState<string>(""); // "no" | "yes"
  const [selectedReplacedParts, setSelectedReplacedParts] = useState<string[]>([]);

  // Triagem Crítica (Anti-Bucha)
  const [boardStatus, setBoardStatus] = useState<string>(""); // "board_ok" | "board_issue"
  const [icloudStatus, setIcloudStatus] = useState<string>(""); // "unlocked" | "locked"

  // Dados do Cliente
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");

  // Cálculo
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [calculationData, setCalculationData] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quotePublicCode, setQuotePublicCode] = useState("");

  // Lista ampliada de peças selecionáveis
  const availablePartsList = [
    { key: "screen", label: "Tela / Display", desc: "Display frontal substituído" },
    { key: "battery", label: "Bateria", desc: "Bateria trocada" },
    { key: "back_glass", label: "Tampa / Vidro Traseiro", desc: "Vidro traseiro trocado" },
    { key: "housing", label: "Carcaça completa / Chassi", desc: "Estrutura externa trocada" },
    { key: "camera_rear", label: "Câmera Traseira", desc: "Módulo de câmera traseira" },
    { key: "camera_front", label: "Câmera Frontal (Selfie)", desc: "Módulo TrueDepth / frontal" },
    { key: "camera_glass", label: "Vidro da Câmera", desc: "Lente protetora externa da câmera" },
    { key: "charging_port", label: "Conector de Carga", desc: "Entrada Lightning ou USB-C" },
    { key: "speaker", label: "Alto-falante", desc: "Auricular ou alto-falante inferior" },
    { key: "microphone", label: "Microfone", desc: "Módulo de microfone" },
    { key: "buttons", label: "Botões físicos", desc: "Power, Volume ou Botão de Ação" },
    { key: "wifi_antenna", label: "Antena / Módulo Wi-Fi", desc: "Conectividade Wi-Fi ou Bluetooth" },
    { key: "sim_tray", label: "Gaveta de Chip", desc: "Bandeja do cartão SIM" },
    { key: "other", label: "Outro componente", desc: "Outro componente interno" },
  ];

  // Carregar catálogo de modelos
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

  // Carregar opções de armazenamento
  useEffect(() => {
    if (!selectedModel) {
      setStorageOptions([]);
      setSelectedStorage(null);
      return;
    }

    let cancelled = false;
    setStorageOptions([]);
    setSelectedStorage(null);
    const modelId = selectedModel.id;
    async function loadStorages() {
      try {
        setLoadingStorages(true);
        const res = await fetch(`/api/sell/models/${encodeURIComponent(modelId)}/storages`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.success) throw new Error("Falha ao carregar capacidades");
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
        if (!cancelled) setLoadingStorages(false);
      }
    }
    loadStorages();
    return () => { cancelled = true; };
  }, [selectedModel?.id]);

  const togglePartSelection = (key: string) => {
    setSelectedReplacedParts((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Cálculo de Preço Reativo
  useEffect(() => {
    if (!selectedModel || !selectedStorage) {
      setCalculating(false);
      setEstimatedPrice(null);
      setCalculationData(null);
      return;
    }

    if (boardStatus === "board_issue" || icloudStatus === "locked") {
      setCalculating(false);
      setEstimatedPrice(0);
      setCalculationData({ blocked: true, finalPrice: 0 });
      return;
    }

    let cancelled = false;
    setEstimatedPrice(null);
    setCalculationData(null);
    async function calculate() {
      try {
        setCalculating(true);
        const payload = {
          deviceModelId: selectedModel?.id,
          storageOptionId: selectedStorage?.id,
          answers: {
            batteryHealth,
            screenGlass:
              screenCondition === "cracked"
                ? "cracked"
                : screenCondition === "deep_scratches"
                ? "deep_scratches"
                : screenCondition === "light_scratches"
                ? "light_scratches"
                : "perfect",
            screenDisplay: screenCondition === "display_damaged" ? "spots" : "perfect",
            bodyBackGlass:
              backCondition === "cracked"
                ? "cracked"
                : backCondition === "light_marks"
                ? "light_marks"
                : "perfect",
            cameraGlass: backCondition === "camera_broken" ? "cracked" : "perfect",
            bodySides:
              sidesCondition === "dents"
                ? "dents"
                : sidesCondition === "light_scratches"
                ? "light_scratches"
                : "perfect",
            replacedPartsStatus: replacedPartsStatus === "yes" ? "yes" : "no",
            replacedParts: selectedReplacedParts,
            replacedPartsList: selectedReplacedParts,
            boardProblem: boardStatus === "board_issue",
            motherboardRepaired: boardStatus === "board_issue",
            powerOn: boardStatus !== "board_issue",
            powerOnStatus: boardStatus === "board_issue" ? "board_issue" : "normal",
            icloudStatus: icloudStatus === "locked" ? "locked" : "unlocked",
            icloudClear: icloudStatus === "unlocked",
            imeiRegular: icloudStatus === "unlocked",
          },
        };

        const res = await fetch("/api/sell/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!cancelled && res.ok && data.success && data.calculation) {
          setEstimatedPrice(data.calculation.finalPrice);
          setCalculationData(data.calculation);
        }
      } catch (err) {
        console.error("Erro no cálculo:", err);
      } finally {
        if (!cancelled) setCalculating(false);
      }
    }

    calculate();
    return () => { cancelled = true; };
  }, [
    selectedModel,
    selectedStorage,
    batteryHealth,
    screenCondition,
    backCondition,
    sidesCondition,
    replacedPartsStatus,
    selectedReplacedParts,
    boardStatus,
    icloudStatus,
  ]);

  // Máscara Telefone
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

  const modelGenerations = useMemo(() => {
    const gens = new Set<string>();
    for (const m of models) {
      const match = m.name.match(/iPhone\s+(\d+|SE|X[RS]?|Air)/i);
      if (match) gens.add(match[1].toUpperCase());
    }
    return Array.from(gens).sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return nb - na;
      if (!Number.isNaN(na)) return -1;
      if (!Number.isNaN(nb)) return 1;
      return a.localeCompare(b);
    });
  }, [models]);

  const filteredModels = useMemo(() => {
    let list = models;
    if (selectedFamilyFilter !== "all" && !modelSearch.trim()) {
      const re = new RegExp(`iPhone\\s+${selectedFamilyFilter}(?:\\b|\\s|$)`, "i");
      list = list.filter((m) => re.test(m.name));
    }
    if (!modelSearch.trim()) return list;
    const q = modelSearch.toLowerCase().trim();
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [models, modelSearch, selectedFamilyFilter]);

  // Validação por etapa
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!selectedModel;
      case 2:
        return !!selectedStorage;
      case 3:
        return !!batteryHealth;
      case 4:
        return !!screenCondition;
      case 5:
        return !!backCondition;
      case 6:
        return !!sidesCondition;
      case 7:
        if (!replacedPartsStatus) return false;
        if (replacedPartsStatus === "yes" && selectedReplacedParts.length === 0) return false;
        return true;
      case 8:
        return icloudStatus === "unlocked";
      case 9:
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
    screenCondition,
    backCondition,
    sidesCondition,
    replacedPartsStatus,
    selectedReplacedParts,
    boardStatus,
    icloudStatus,
    customerName,
    customerWhatsapp,
  ]);

  // Submit Final
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitting) return;
    setSubmitError("");
    if (!selectedModel || !selectedStorage || !customerName || !customerWhatsapp) return;
    if (boardStatus === "board_issue" || icloudStatus === "locked") return;

    try {
      setSubmitting(true);
      const payload = {
        deviceModelId: selectedModel.id,
        storageOptionId: selectedStorage.id,
        answers: {
          customerName,
          customerWhatsapp,
          batteryHealth,
          screenCondition,
          backCondition,
          sidesCondition,
          screenGlass:
            screenCondition === "cracked"
              ? "cracked"
              : screenCondition === "deep_scratches"
              ? "deep_scratches"
              : screenCondition === "light_scratches"
              ? "light_scratches"
              : "perfect",
          screenDisplay: screenCondition === "display_damaged" ? "spots" : "perfect",
          bodyBackGlass:
            backCondition === "cracked"
              ? "cracked"
              : backCondition === "light_marks"
              ? "light_marks"
              : "perfect",
          cameraGlass: backCondition === "camera_broken" ? "cracked" : "perfect",
          bodySides:
            sidesCondition === "dents"
              ? "dents"
              : sidesCondition === "light_scratches"
              ? "light_scratches"
              : "perfect",
          replacedPartsStatus: replacedPartsStatus === "yes" ? "yes" : "no",
          replacedParts: selectedReplacedParts,
          replacedPartsList: selectedReplacedParts,
          boardProblem: false,
          motherboardRepaired: false,
          powerOn: true,
          powerOnStatus: "normal",
          icloudStatus: "unlocked",
          icloudClear: true,
          imeiRegular: true,
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
      if (!res.ok || !data.success || !data.quote?.publicCode) {
        throw new Error("Não foi possível salvar sua cotação. Tente novamente.");
      }
      const publicCode = data.quote.publicCode;
      setQuotePublicCode(publicCode);
      setQuoteSuccess(true);
    } catch (err) {
      console.error("Erro ao gerar cotação:", err);
      setSubmitError("Não foi possível salvar sua cotação. Confira sua conexão e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Rótulos de Resumo (sem emojis)
  const batteryHealthText = useMemo(() => {
    switch (batteryHealth) {
      case "90_plus":
        return "90% a 100% (Excelente)";
      case "85_89":
        return "85% a 89% (Boa)";
      case "80_84":
        return "80% a 84% (Moderada)";
      case "below_80":
        return "Abaixo de 80% ou Manutenção";
      default:
        return "Não informada";
    }
  }, [batteryHealth]);

  const screenConditionText = useMemo(() => {
    switch (screenCondition) {
      case "perfect":
        return "Impecável / Sem riscos";
      case "light_scratches":
        return "Riscos leves superficiais";
      case "deep_scratches":
        return "Riscos profundos";
      case "cracked":
        return "Vidro trincado ou quebrado";
      case "display_damaged":
        return "Display danificado / Manchas ou listras";
      default:
        return "Não informada";
    }
  }, [screenCondition]);

  const backConditionText = useMemo(() => {
    switch (backCondition) {
      case "perfect":
        return "Impecável / Sem marcas";
      case "light_marks":
        return "Riscos leves / Marcas de capinha";
      case "cracked":
        return "Vidro traseiro trincado ou quebrado";
      case "camera_broken":
        return "Lente da câmera trincada ou arranhada";
      default:
        return "Não informada";
    }
  }, [backCondition]);

  const sidesConditionText = useMemo(() => {
    switch (sidesCondition) {
      case "perfect":
        return "Impecáveis / Sem detalhes";
      case "light_scratches":
        return "Marcas leves de uso";
      case "dents":
        return "Amassados, batidas ou marcas de queda";
      default:
        return "Não informada";
    }
  }, [sidesCondition]);

  const replacedPartsSummaryText = useMemo(() => {
    if (replacedPartsStatus === "no") return "100% Original de fábrica (Nunca aberto)";
    if (selectedReplacedParts.length === 0) return "Nenhuma selecionada";

    const labels = selectedReplacedParts.map((k) => {
      const found = availablePartsList.find((p) => p.key === k);
      return found ? found.label : k;
    });

    return labels.join(", ");
  }, [replacedPartsStatus, selectedReplacedParts, availablePartsList]);

  const whatsappSaleUrl = () => {
    const code = quotePublicCode || "COT-AVAL";
    const val = estimatedPrice && estimatedPrice > 0 ? formatCurrency(estimatedPrice) : "A combinar";
    const message = `Olá Mundo Apple! Acabei de fazer uma avaliação para venda do meu iPhone:

Código da Cotação: ${code}

DADOS DO APARELHO:
- Modelo: ${selectedModel?.name}
- Armazenamento: ${selectedStorage?.displayName}
- Saúde da Bateria: ${batteryHealthText}
- Condição da Tela: ${screenConditionText}
- Condição da Traseira: ${backConditionText}
- Condição das Laterais: ${sidesConditionText}
- Peças Trocadas: ${replacedPartsSummaryText}
- Placa-Mãe: 100% Original e Intacta
- iCloud e IMEI: Liberados para formatação

Valor Pré-Avaliado: ${val} no PIX

DADOS DO CLIENTE:
- Nome: ${customerName.trim()}
- WhatsApp: ${customerWhatsapp.trim()}

CHECKLIST DE CONFERÊNCIA PRESENCIAL:
[ ] 1. Remover iCloud no ato da entrega
[ ] 2. Testar Face ID e Câmeras
[ ] 3. Checar aviso de Peça Desconhecida em Ajustes > Geral > Sobre
[ ] 4. Conferir integridade física dos vidros e carcaça

Gostaria de agendar a avaliação e retirada em SP!`;

    return `https://wa.me/${storeConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  const restart = () => {
    clearPendingAdvance();
    setStepDirection(-1);
    setHasNavigated(true);
    setStep(1);
    setSelectedFamilyFilter("all");
    setModelSearch("");
    setSelectedModel(null);
    setSelectedStorage(null);
    setBatteryHealth("");
    setScreenCondition("");
    setBackCondition("");
    setSidesCondition("");
    setReplacedPartsStatus("");
    setSelectedReplacedParts([]);
    setBoardStatus("");
    setIcloudStatus("");
    setCustomerName("");
    setCustomerWhatsapp("");
    setQuoteSuccess(false);
  };

  const stepMeta = [
    { num: 1, label: "Modelo" },
    { num: 2, label: "Armazenamento" },
    { num: 3, label: "Saúde da Bateria" },
    { num: 4, label: "Tela" },
    { num: 5, label: "Traseira" },
    { num: 6, label: "Laterais" },
    { num: 7, label: "Peças Trocadas" },
    { num: 8, label: "Procedência" },
  ];

  const currentStepTitle = stepMeta[step - 1]?.label ?? "";
  const stepAnimClass = !hasNavigated
    ? ""
    : stepDirection > 0
      ? "animate-step-forward"
      : "animate-step-backward";

  const selectedChips = useMemo(() => {
    const items: Array<{ targetStep: number; label: string }> = [];
    if (selectedModel) items.push({ targetStep: 1, label: selectedModel.name });
    if (selectedStorage) items.push({ targetStep: 2, label: selectedStorage.displayName });
    if (batteryHealth) {
      const shortMap: Record<string, string> = {
        "90_plus": "Bat. 90%+",
        "85_89": "Bat. 85–89%",
        "80_84": "Bat. 80–84%",
        below_80: "Bat. <80%",
      };
      items.push({ targetStep: 3, label: shortMap[batteryHealth] || batteryHealth });
    }
    if (screenCondition) {
      const shortMap: Record<string, string> = {
        perfect: "Tela impecável",
        light_scratches: "Tela riscos leves",
        deep_scratches: "Tela riscos prof.",
        cracked: "Tela trincada",
        display_damaged: "Display danif.",
      };
      items.push({ targetStep: 4, label: shortMap[screenCondition] || screenCondition });
    }
    if (backCondition) {
      const shortMap: Record<string, string> = {
        perfect: "Traseira impecável",
        light_marks: "Traseira marcas leves",
        cracked: "Traseira trincada",
        camera_broken: "Lente danif.",
      };
      items.push({ targetStep: 5, label: shortMap[backCondition] || backCondition });
    }
    if (sidesCondition) {
      const shortMap: Record<string, string> = {
        perfect: "Bordas impecáveis",
        light_scratches: "Bordas marcas leves",
        dents: "Bordas amassadas",
      };
      items.push({ targetStep: 6, label: shortMap[sidesCondition] || sidesCondition });
    }
    if (replacedPartsStatus) {
      items.push({
        targetStep: 7,
        label:
          replacedPartsStatus === "no"
            ? "100% Original"
            : `${selectedReplacedParts.length} peça${selectedReplacedParts.length === 1 ? "" : "s"} trocada${selectedReplacedParts.length === 1 ? "" : "s"}`,
      });
    }
    return items;
  }, [
    selectedModel,
    selectedStorage,
    batteryHealth,
    screenCondition,
    backCondition,
    sidesCondition,
    replacedPartsStatus,
    selectedReplacedParts.length,
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Card Principal Interativo (Apple / Emil Design-Eng) ── */}
      <div className="bg-white rounded-[28px] border border-[#E5E5EA] p-5 sm:p-8 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Barra de Progresso Segmentada Interativa (Passos 1 a 8) */}
        {step <= totalQuestionSteps && (
          <div className="mb-6 sm:mb-7">
            <div className="flex items-center justify-between text-xs font-semibold text-[#86868B] mb-2.5">
              <span className="uppercase tracking-[0.08em] tabular-nums">
                Etapa {step} de {totalQuestionSteps}
              </span>
              <span
                key={`step-label-${step}`}
                className="text-[#0071E3] font-semibold animate-chip-in"
              >
                {step}. {currentStepTitle}
              </span>
            </div>

            {/* 8-segment GPU scaleX progress bar (tap any completed step to jump back) */}
            <div
              className="grid grid-cols-8 gap-1.5"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={totalQuestionSteps}
              aria-label={`Etapa ${step} de ${totalQuestionSteps}: ${currentStepTitle}`}
            >
              {stepMeta.map((s) => {
                const isCompleted = s.num < step;
                const isCurrent = s.num === step;
                const canJump = isCompleted;
                return (
                  <button
                    key={s.num}
                    type="button"
                    disabled={!canJump}
                    onClick={() => canJump && goToStep(s.num)}
                    title={canJump ? `Voltar para ${s.num}. ${s.label}` : `${s.num}. ${s.label}`}
                    aria-label={`${s.num}. ${s.label}`}
                    className={`group relative h-2 rounded-full bg-[#EFEFF4] overflow-hidden ${
                      canJump ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <span
                      className={`absolute inset-0 rounded-full origin-left transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                        isCompleted
                          ? "bg-[#0071E3] scale-x-100"
                          : isCurrent
                            ? "bg-[#0071E3] scale-x-100 opacity-90"
                            : "bg-[#0071E3] scale-x-0"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Live Spec Breadcrumb Pills (Spatial Continuity + 1-tap edit) */}
            {selectedChips.length > 0 && step > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3.5 pt-3.5 border-t border-[#F2F2F7]">
                {selectedChips.map((chip) => (
                  <button
                    key={`${chip.targetStep}-${chip.label}`}
                    type="button"
                    onClick={() => goToStep(chip.targetStep)}
                    title="Clique para alterar"
                    className="animate-chip-in inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F5F5F7] hover:bg-[#E8E8ED] border border-[#E5E5EA] text-[11px] font-semibold text-[#1D1D1F] transition-[background-color,border-color,transform] duration-150 active:scale-95 cursor-pointer"
                  >
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 1: MODELO ── */}
        {step === 1 && (
          <div key="step-1" className={`space-y-4 ${stepAnimClass}`}>
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                Qual é o modelo do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Filtre pela linha ou busque pelo nome do aparelho.
              </p>
            </div>

            {/* Campo de Busca (Mobile-Native: sem zoom no Safari + botão limpar) */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B] pointer-events-none" />
              <input
                type="search"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Buscar modelo (ex: iPhone 15 Pro, iPhone 14, iPhone 13...)"
                className="w-full pl-10 pr-10 py-3 bg-[#F5F5F7] rounded-2xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] outline-none transition-[background-color,border-color,box-shadow] duration-200"
              />
              {modelSearch && (
                <button
                  type="button"
                  onClick={() => setModelSearch("")}
                  aria-label="Limpar busca"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5EA] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Pílulas Rápidas de Geração (evita rolagem longa) */}
            {!loadingCatalog && modelGenerations.length > 1 && !modelSearch.trim() && (
              <div
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5"
                style={{ overscrollBehaviorX: "contain", touchAction: "pan-x" }}
                role="tablist"
                aria-label="Filtrar por geração"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedFamilyFilter === "all"}
                  onClick={() => setSelectedFamilyFilter("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-[background-color,color,border-color,transform] duration-150 active:scale-95 cursor-pointer border ${
                    selectedFamilyFilter === "all"
                      ? "bg-[#1D1D1F] text-white border-[#1D1D1F]"
                      : "bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA] hover:text-[#1D1D1F]"
                  }`}
                >
                  Todos ({models.length})
                </button>
                {modelGenerations.map((gen) => {
                  const active = selectedFamilyFilter === gen;
                  return (
                    <button
                      key={gen}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedFamilyFilter(gen)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-[background-color,color,border-color,transform] duration-150 active:scale-95 cursor-pointer border ${
                        active
                          ? "bg-[#1D1D1F] text-white border-[#1D1D1F]"
                          : "bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA] hover:text-[#1D1D1F]"
                      }`}
                    >
                      iPhone {gen}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Grid de Modelos com Fade Mask Suave (sem corte brusco) */}
            {loadingCatalog ? (
              <div className="py-14 flex flex-col items-center justify-center gap-2.5 text-[#86868B]">
                <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
                <span className="text-xs font-medium">Carregando catálogo de iPhones...</span>
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="py-12 px-4 rounded-2xl bg-[#F5F5F7] border border-dashed border-[#D2D2D7] text-center space-y-2.5">
                <Smartphone className="w-6 h-6 text-[#86868B] mx-auto" />
                <p className="text-sm font-semibold text-[#1D1D1F]">
                  Nenhum modelo encontrado para &ldquo;{modelSearch}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setModelSearch("");
                    setSelectedFamilyFilter("all");
                  }}
                  className="px-4 py-2 rounded-full bg-white border border-[#D2D2D7] text-xs font-semibold text-[#0071E3] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                >
                  Mostrar todos os modelos
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-2.5 ${
                  filteredModels.length > 9 ? "max-h-[368px] overflow-y-auto pr-1.5 pb-8 wizard-scroll-mask" : "pb-1"
                }`}
              >
                {filteredModels.map((m, idx) => {
                  const isSelected = selectedModel?.id === m.id;
                  const delayMs = Math.min(idx, 7) * 18;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      style={{ animationDelay: `${delayMs}ms` }}
                      onClick={() => {
                        setSelectedModel(m);
                        advanceWithBeat(2);
                      }}
                      className={`wizard-option animate-wizard-item p-3.5 sm:p-4 rounded-2xl border text-left flex items-center justify-between min-h-[60px] cursor-pointer ${
                        isSelected
                          ? "bg-[#0071E3]/[0.06] border-[#0071E3] ring-1 ring-[#0071E3] shadow-[0_6px_18px_-10px_rgba(0,113,227,0.4)]"
                          : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                      }`}
                    >
                      <span
                        className={`font-semibold text-xs sm:text-[13.5px] leading-snug tracking-[-0.01em] ${
                          isSelected ? "text-[#0071E3]" : "text-[#1D1D1F]"
                        }`}
                      >
                        {m.name}
                      </span>
                      <div
                        className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 ml-2 transition-[background-color,border-color] duration-150 ${
                          isSelected
                            ? "bg-[#0071E3] border-[#0071E3] text-white"
                            : "border-[#D2D2D7] bg-[#F5F5F7]"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 2: ARMAZENAMENTO (GB) ── */}
        {step === 2 && (
          <div key="step-2" className={`space-y-5 ${stepAnimClass}`}>
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                Qual a capacidade de armazenamento?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Consulte em <span className="font-medium text-[#1D1D1F]">Ajustes &gt; Geral &gt; Sobre</span> no seu {selectedModel?.name}.
              </p>
            </div>

            {loadingStorages ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-[#86868B]">
                <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
                <span className="text-xs font-medium">Carregando capacidades...</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {storageOptions.map((stg, idx) => {
                  const isSelected = selectedStorage?.id === stg.id;
                  const delays = [0, 26, 48, 66, 80];
                  return (
                    <button
                      key={stg.id}
                      type="button"
                      style={{ animationDelay: `${delays[Math.min(idx, delays.length - 1)]}ms` }}
                      onClick={() => {
                        setSelectedStorage(stg);
                        advanceWithBeat(3);
                      }}
                      className={`wizard-option animate-wizard-item relative p-5 rounded-2xl border text-center cursor-pointer min-h-[82px] flex flex-col items-center justify-center ${
                        isSelected
                          ? "bg-[#0071E3]/[0.06] border-[#0071E3] ring-1 ring-[#0071E3] shadow-[0_6px_18px_-10px_rgba(0,113,227,0.4)]"
                          : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#0071E3] text-white flex items-center justify-center animate-check-pop">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                      <span
                        className={`block text-lg sm:text-xl font-bold tracking-tight tabular-nums ${
                          isSelected ? "text-[#0071E3]" : "text-[#1D1D1F]"
                        }`}
                      >
                        {stg.displayName}
                      </span>
                      <span className="text-[11px] text-[#86868B] font-medium mt-0.5">Capacidade</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 3: PORCENTAGEM DA BATERIA ── */}
        {step === 3 && (
          <div key="step-3" className={`space-y-5 ${stepAnimClass}`}>
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight flex items-center gap-2">
                <BatteryCharging className="w-5 h-5 text-[#0071E3] shrink-0" />
                <span>Qual a saúde da bateria?</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Consulte em <strong className="font-medium text-[#1D1D1F]">Ajustes &gt; Bateria &gt; Saúde da Bateria</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: "90_plus",
                  title: "90% a 100%",
                  badge: "Excelente",
                  dot: "bg-emerald-500",
                  desc: "Bateria original com alta capacidade e autonomia máxima.",
                },
                {
                  key: "85_89",
                  title: "85% a 89%",
                  badge: "Boa",
                  dot: "bg-[#0071E3]",
                  desc: "Autonomia padrão para o uso diário regular.",
                },
                {
                  key: "80_84",
                  title: "80% a 84%",
                  badge: "Moderada",
                  dot: "bg-amber-500",
                  desc: "Desgaste natural decorrente do tempo de uso.",
                },
                {
                  key: "below_80",
                  title: "Abaixo de 80%",
                  badge: "Manutenção",
                  dot: "bg-rose-500",
                  desc: "Bateria degradada ou com aviso de manutenção do sistema.",
                },
              ].map((opt, idx) => {
                const isSelected = batteryHealth === opt.key;
                const delays = [0, 26, 48, 66];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    style={{ animationDelay: `${delays[idx]}ms` }}
                    onClick={() => {
                      setBatteryHealth(opt.key);
                      advanceWithBeat(4);
                    }}
                    className={`wizard-option animate-wizard-item p-4 rounded-2xl border text-left flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-[#0071E3]/[0.06] border-[#0071E3] ring-1 ring-[#0071E3] shadow-[0_6px_18px_-10px_rgba(0,113,227,0.4)]"
                        : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} aria-hidden="true" />
                        <span className="font-bold text-sm text-[#1D1D1F] tabular-nums">
                          {opt.title}
                        </span>
                        <span className="text-[11px] font-semibold text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-full">
                          {opt.badge}
                        </span>
                      </div>
                      <div
                        className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                          isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7] bg-[#F5F5F7]"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#6E6E73] leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ETAPA 4: COMO ESTÁ A TELA? ── */}
        {step === 4 && (
          <div key="step-4" className={`space-y-5 ${stepAnimClass}`}>
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                Como está a tela do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Avalie o vidro frontal e o painel de exibição (display).
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "perfect",
                  dot: "bg-emerald-500",
                  title: "Impecável / Sem riscos",
                  desc: "Vidro perfeito sem arranhões e exibição de imagem 100% nítida.",
                },
                {
                  key: "light_scratches",
                  dot: "bg-[#0071E3]",
                  title: "Riscos leves superficiais",
                  desc: "Marcas sutis de uso comum, imperceptíveis com a tela ligada.",
                },
                {
                  key: "deep_scratches",
                  dot: "bg-amber-500",
                  title: "Riscos profundos",
                  desc: "Arranhões fortes perceptíveis ao toque ou ao passar a unha.",
                },
                {
                  key: "cracked",
                  dot: "bg-orange-500",
                  title: "Vidro trincado ou quebrado",
                  desc: "Vidro frontal rachado, porém touch e imagem funcionando perfeitamente.",
                },
                {
                  key: "display_damaged",
                  dot: "bg-rose-500",
                  title: "Display danificado / Manchas ou listras",
                  desc: "Manchas pretas, linhas coloridas, falha no touch ou tela sem imagem.",
                },
              ].map((opt, idx) => {
                const isSelected = screenCondition === opt.key;
                const delays = [0, 22, 40, 55, 68];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    style={{ animationDelay: `${delays[idx]}ms` }}
                    onClick={() => {
                      setScreenCondition(opt.key);
                      advanceWithBeat(5);
                    }}
                    className={`wizard-option animate-wizard-item w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#0071E3]/[0.06] border-[#0071E3] ring-1 ring-[#0071E3] shadow-[0_6px_18px_-10px_rgba(0,113,227,0.4)]"
                        : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${opt.dot}`} aria-hidden="true" />
                      <div>
                        <span className="block text-sm font-semibold text-[#1D1D1F]">
                          {opt.title}
                        </span>
                        <span className="block text-xs text-[#6E6E73] mt-0.5 leading-relaxed">{opt.desc}</span>
                      </div>
                    </div>
                    <div
                      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                        isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7] bg-[#F5F5F7]"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ETAPA 5: COMO ESTÁ A TRASEIRA? ── */}
        {step === 5 && (
          <div key="step-5" className={`space-y-5 ${stepAnimClass}`}>
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                Como está a traseira e as lentes?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Avalie o vidro traseiro e as lentes externas das câmeras.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "perfect",
                  dot: "bg-emerald-500",
                  title: "Impecável / Sem marcas",
                  desc: "Vidro traseiro e lentes sem nenhum arranhão ou detalhe.",
                },
                {
                  key: "light_marks",
                  dot: "bg-[#0071E3]",
                  title: "Riscos leves / Marcas de capinha",
                  desc: "Marcas sutis causadas por poeira ou atrito com a capa de proteção.",
                },
                {
                  key: "cracked",
                  dot: "bg-orange-500",
                  title: "Vidro traseiro trincado ou quebrado",
                  desc: "Trincas, rachaduras ou estilhaçamento no vidro traseiro.",
                },
                {
                  key: "camera_broken",
                  dot: "bg-rose-500",
                  title: "Lente da câmera trincada ou arranhada",
                  desc: "Vidro protetor de alguma das câmeras danificado.",
                },
              ].map((opt, idx) => {
                const isSelected = backCondition === opt.key;
                const delays = [0, 22, 40, 55];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    style={{ animationDelay: `${delays[idx]}ms` }}
                    onClick={() => {
                      setBackCondition(opt.key);
                      advanceWithBeat(6);
                    }}
                    className={`wizard-option animate-wizard-item w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#0071E3]/[0.06] border-[#0071E3] ring-1 ring-[#0071E3] shadow-[0_6px_18px_-10px_rgba(0,113,227,0.4)]"
                        : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${opt.dot}`} aria-hidden="true" />
                      <div>
                        <span className="block text-sm font-semibold text-[#1D1D1F]">
                          {opt.title}
                        </span>
                        <span className="block text-xs text-[#6E6E73] mt-0.5 leading-relaxed">{opt.desc}</span>
                      </div>
                    </div>
                    <div
                      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                        isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7] bg-[#F5F5F7]"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ETAPA 6: COMO ESTÃO AS LATERAIS? ── */}
        {step === 6 && (
          <div key="step-6" className={`space-y-5 ${stepAnimClass}`}>
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                Como estão as laterais e bordas?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Estrutura de alumínio, aço ou titânio do chassi do aparelho.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "perfect",
                  dot: "bg-emerald-500",
                  title: "Impecáveis / Sem detalhes",
                  desc: "Bordas perfeitas, sem batidas, marcas de impacto ou amassados.",
                },
                {
                  key: "light_scratches",
                  dot: "bg-[#0071E3]",
                  title: "Marcas leves de uso",
                  desc: "Pequenos arranhões ou desgaste suave na pintura das quinas.",
                },
                {
                  key: "dents",
                  dot: "bg-orange-500",
                  title: "Amassados, batidas ou marcas de queda",
                  desc: "Quinas batidas, amassados no aro ou marcas fortes de impacto.",
                },
              ].map((opt, idx) => {
                const isSelected = sidesCondition === opt.key;
                const delays = [0, 24, 44];
                return (
                  <button
                    key={opt.key}
                    type="button"
                    style={{ animationDelay: `${delays[idx]}ms` }}
                    onClick={() => {
                      setSidesCondition(opt.key);
                      advanceWithBeat(7);
                    }}
                    className={`wizard-option animate-wizard-item w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-[#0071E3]/[0.06] border-[#0071E3] ring-1 ring-[#0071E3] shadow-[0_6px_18px_-10px_rgba(0,113,227,0.4)]"
                        : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${opt.dot}`} aria-hidden="true" />
                      <div>
                        <span className="block text-sm font-semibold text-[#1D1D1F]">
                          {opt.title}
                        </span>
                        <span className="block text-xs text-[#6E6E73] mt-0.5 leading-relaxed">{opt.desc}</span>
                      </div>
                    </div>
                    <div
                      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                        isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7] bg-[#F5F5F7]"
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ETAPA 7: PEÇAS TROCADAS (SELEÇÃO AMPLA E DIRETA DE PEÇAS) ── */}
        {step === 7 && (
          <div key="step-7" className={`space-y-5 ${stepAnimClass}`}>
            <div className="text-left">
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                Alguma peça já foi substituída ou o aparelho já foi aberto?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                Selecione abaixo se o seu iPhone já passou por alguma troca de componente.
              </p>
            </div>

            {/* Opções Iniciais: Não ou Sim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setReplacedPartsStatus("no");
                  setSelectedReplacedParts([]);
                  advanceWithBeat(8);
                }}
                className={`wizard-option animate-wizard-item p-4 rounded-2xl border text-left cursor-pointer ${
                  replacedPartsStatus === "no"
                    ? "bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500/40 shadow-[0_6px_18px_-10px_rgba(16,185,129,0.35)]"
                    : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-[#1D1D1F]">
                    Não, 100% original de fábrica
                  </span>
                  <div
                    className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                      replacedPartsStatus === "no"
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-[#D2D2D7] bg-[#F5F5F7]"
                    }`}
                  >
                    {replacedPartsStatus === "no" && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                  </div>
                </div>
                <p className="text-xs text-[#6E6E73] mt-1.5 leading-relaxed">
                  Aparelho nunca foi aberto; todas as peças são originais de fábrica.
                </p>
              </button>

              <button
                type="button"
                style={{ animationDelay: "28ms" }}
                onClick={() => setReplacedPartsStatus("yes")}
                className={`wizard-option animate-wizard-item p-4 rounded-2xl border text-left cursor-pointer ${
                  replacedPartsStatus === "yes"
                    ? "bg-[#0071E3]/[0.06] border-[#0071E3] ring-1 ring-[#0071E3] shadow-[0_6px_18px_-10px_rgba(0,113,227,0.4)]"
                    : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA] hover:border-[#C7C7CC]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm text-[#1D1D1F]">
                    Sim, já foi trocada peça
                  </span>
                  <div
                    className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                      replacedPartsStatus === "yes"
                        ? "bg-[#0071E3] border-[#0071E3] text-white"
                        : "border-[#D2D2D7] bg-[#F5F5F7]"
                    }`}
                  >
                    {replacedPartsStatus === "yes" && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                  </div>
                </div>
                <p className="text-xs text-[#6E6E73] mt-1.5 leading-relaxed">
                  Já passou por troca de tela, bateria, tampa ou outros componentes.
                </p>
              </button>
            </div>

            {/* SE "SIM", PAINEL DE PEÇAS EXPANDINDO SUAVEMENTE */}
            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                replacedPartsStatus === "yes" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
              }`}
              aria-hidden={replacedPartsStatus !== "yes"}
            >
              <div className="overflow-hidden">
                <div className="p-4 sm:p-5 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] space-y-4 text-left">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-[#1D1D1F]">
                      Selecione quais peças foram trocadas:
                    </span>
                    {selectedReplacedParts.length > 0 && (
                      <span
                        key={selectedReplacedParts.length}
                        className="animate-price-pop text-[11px] font-semibold text-[#0071E3] bg-white px-2.5 py-0.5 rounded-full border border-[#0071E3]/25 tabular-nums"
                      >
                        {selectedReplacedParts.length}{" "}
                        {selectedReplacedParts.length === 1 ? "peça selecionada" : "peças selecionadas"}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availablePartsList.map((item) => {
                      const isChecked = selectedReplacedParts.includes(item.key);
                      return (
                        <button
                          key={item.key}
                          type="button"
                          tabIndex={replacedPartsStatus === "yes" ? 0 : -1}
                          onClick={() => togglePartSelection(item.key)}
                          className={`wizard-option p-3.5 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer ${
                            isChecked
                              ? "bg-[#0071E3]/[0.07] border-[#0071E3] ring-1 ring-[#0071E3]"
                              : "bg-white hover:bg-[#FAFAFC] border-[#E5E5EA]"
                          }`}
                        >
                          <div>
                            <span className={`block text-xs font-semibold ${isChecked ? "text-[#0071E3]" : "text-[#1D1D1F]"}`}>
                              {item.label}
                            </span>
                            <span className="block text-[11px] text-[#6E6E73] mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                          <div
                            className={`w-[18px] h-[18px] rounded-md border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                              isChecked ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7] bg-[#F5F5F7]"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3] animate-check-pop" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ETAPA 8: TRIAGEM CRÍTICA DE PROCEDÊNCIA & ICLOUD ── */}
        {step === 8 && (
          <div key="step-8" className={`space-y-5 text-left ${stepAnimClass}`}>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-1 rounded-full inline-block mb-2">
                Verificação de Procedência
              </span>
              <h2 className="font-display text-xl sm:text-[24px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                Triagem de Segurança e Procedência
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73] mt-1">
                A Mundo Apple <strong className="font-semibold text-[#1D1D1F]">não compra</strong> aparelhos com bloqueio de ativação ou restrição de operadora/IMEI.
              </p>
            </div>

            {/* Pergunta: iCloud e IMEI */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] space-y-3.5">
              <label className="text-xs sm:text-sm font-semibold text-[#1D1D1F] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#0071E3] shrink-0" />
                <span>O iCloud está livre para remoção no ato e o IMEI totalmente limpo?</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIcloudStatus("unlocked")}
                  className={`wizard-option p-4 rounded-xl border text-left cursor-pointer ${
                    icloudStatus === "unlocked"
                      ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/40 text-emerald-950"
                      : "bg-white border-[#E5E5EA] hover:border-[#C7C7CC] text-[#1D1D1F]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">Sim, 100% Livre</span>
                    <div
                      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                        icloudStatus === "unlocked"
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-[#D2D2D7] bg-[#F5F5F7]"
                      }`}
                    >
                      {icloudStatus === "unlocked" && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                    </div>
                  </div>
                  <span className="block text-xs text-[#6E6E73] mt-1 leading-relaxed">
                    Sem vínculo, pronto para formatar e IMEI nacional regular.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIcloudStatus("locked")}
                  className={`wizard-option p-4 rounded-xl border text-left cursor-pointer ${
                    icloudStatus === "locked"
                      ? "bg-red-50 border-red-500 ring-1 ring-red-500/40 text-red-950"
                      : "bg-white border-[#E5E5EA] hover:border-[#C7C7CC] text-[#1D1D1F]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-red-700">Não, possui bloqueio</span>
                    <div
                      className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-[background-color,border-color] duration-150 ${
                        icloudStatus === "locked"
                          ? "bg-red-600 border-red-600 text-white"
                          : "border-[#D2D2D7] bg-[#F5F5F7]"
                      }`}
                    >
                      {icloudStatus === "locked" && <Check className="w-2.5 h-2.5 stroke-[3] animate-check-pop" />}
                    </div>
                  </div>
                  <span className="block text-xs text-red-600/90 mt-1 leading-relaxed">
                    iCloud preso, senha esquecida ou restrição de operadora.
                  </span>
                </button>
              </div>

              {/* BLOQUEIO DE ICLOUD (expansão suave) */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  icloudStatus === "locked" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-900">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-bold block text-sm text-red-800">
                        Aparelho com Bloqueio de Ativação
                      </span>
                      <p className="leading-relaxed">
                        Não adquirimos sob nenhuma hipótese aparelhos vinculados ao iCloud ou com restrições de operadora/IMEI.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ETAPA 9: RESULTADO & DADOS DO CLIENTE ── */}
        {step === 9 && (
          <div key="step-9" className={`space-y-6 ${stepAnimClass}`}>
            {quoteSuccess ? (
              /* RESULTADO FINAL (Delight Tier — Rare / Celebration) */
              <div className="space-y-5 animate-result-reveal">
                {/* Banner de confirmação WhatsApp */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 text-left">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Enviamos os dados completos e o valor desta avaliação para o seu WhatsApp (
                    <strong>{customerWhatsapp}</strong>)!
                  </span>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0071E3]/[0.07] to-[#0071E3]/[0.02] border border-[#0071E3]/20 text-center space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#0071E3]/20 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#0071E3]">
                    <Sparkles className="w-3.5 h-3.5" />
                    Valor Pré-Avaliado do seu iPhone
                  </span>
                  <div className="text-3xl sm:text-5xl font-bold text-[#1D1D1F] tracking-[-0.03em] font-display tabular-nums">
                    {estimatedPrice && estimatedPrice > 0 ? (
                      formatCurrency(estimatedPrice)
                    ) : calculating ? (
                      <span className="inline-flex items-center gap-2 text-xl font-semibold text-[#86868B]">
                        <Loader2 className="w-5 h-5 animate-spin" /> Calculando proposta...
                      </span>
                    ) : (
                      "Sob Consulta"
                    )}
                    {estimatedPrice && estimatedPrice > 0 ? (
                      <span className="text-lg sm:text-2xl text-emerald-600 font-bold ml-2">no PIX</span>
                    ) : null}
                  </div>
                  <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                    Pagamento imediato via PIX no ato da retirada presencial em São Paulo e região.
                  </p>
                </div>

                {/* Resumo da Ficha */}
                <div className="p-4 sm:p-5 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] text-left space-y-2.5 text-xs">
                  <span className="font-semibold text-[#1D1D1F] block text-[11px] uppercase tracking-[0.08em]">
                    Resumo da Avaliação Registrada
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#6E6E73]">
                    <div>• <strong className="text-[#1D1D1F]">Aparelho:</strong> {selectedModel?.name} {selectedStorage?.displayName}</div>
                    <div>• <strong className="text-[#1D1D1F]">Bateria:</strong> {batteryHealthText}</div>
                    <div>• <strong className="text-[#1D1D1F]">Tela:</strong> {screenConditionText}</div>
                    <div>• <strong className="text-[#1D1D1F]">Traseira:</strong> {backConditionText}</div>
                    <div>• <strong className="text-[#1D1D1F]">Laterais:</strong> {sidesConditionText}</div>
                    <div>• <strong className="text-[#1D1D1F]">Peças:</strong> {replacedPartsSummaryText}</div>
                    <div>• <strong className="text-[#1D1D1F]">iCloud e IMEI:</strong> 100% Liberados</div>
                  </div>
                </div>

                {/* Botão de Agendamento */}
                <div className="space-y-3 pt-1 text-center">
                  <a
                    href={whatsappSaleUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm sm:text-base rounded-full shadow-[0_10px_24px_-10px_rgba(22,163,74,0.55)] transition-[background-color,transform,box-shadow] duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Agendar Retirada e Receber no PIX</span>
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      "Olha esse simulador da Mundo Apple! Dá pra descobrir na hora quanto vale seu iPhone usado no PIX ou na troca por um novo: https://mundoappledelivery.com/vender"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-semibold text-xs sm:text-sm rounded-full transition-[background-color,transform] duration-200 flex items-center justify-center gap-2"
                  >
                    <span>Compartilhar simulador com um amigo no WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868B] hover:text-[#1D1D1F] py-2 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Fazer nova simulação</span>
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULÁRIO DE CAPTURA */
              <div className="space-y-5">
                <div className="text-left space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-[0.08em] block">
                    Etapa Final · Quase lá
                  </span>
                  <h2 className="font-display text-xl sm:text-[26px] font-semibold text-[#1D1D1F] tracking-[-0.03em] leading-tight">
                    Para onde enviamos a sua avaliação?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6E73]">
                    Preencha seu nome e WhatsApp para visualizar o valor em dinheiro pelo seu iPhone.
                  </p>
                </div>

                {/* Ficha Resumo dos Dados Coletados */}
                <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5EA] text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-[0.08em]">
                      Ficha Técnica Declarada
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="text-xs text-[#0071E3] font-semibold hover:underline cursor-pointer"
                    >
                      Editar respostas
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-[#1D1D1F]">
                    <span className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                      {selectedModel?.name} {selectedStorage?.displayName}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                      Bateria: {batteryHealthText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                      Tela: {screenConditionText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                      Traseira: {backConditionText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                      Laterais: {sidesConditionText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-full border border-[#E5E5EA]">
                      {replacedPartsSummaryText}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                      iCloud e IMEI OK
                    </span>
                  </div>
                </div>

                {/* Formulário */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E5E5EA] space-y-4 text-left">
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    {submitError && (
                      <p role="alert" className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs sm:text-sm text-red-700">
                        {submitError}
                      </p>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        enterKeyHint="next"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo"
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] outline-none transition-[background-color,border-color,box-shadow] duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
                        WhatsApp com DDD <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        enterKeyHint="done"
                        required
                        value={customerWhatsapp}
                        onChange={handlePhoneChange}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,113,227,0.12)] outline-none transition-[background-color,border-color,box-shadow] duration-200 tabular-nums"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => goToStep(8)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="submit"
                        disabled={!isStepValid || submitting}
                        className="flex-1 py-3.5 bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-45 text-white font-semibold text-sm rounded-full shadow-[0_10px_24px_-12px_rgba(22,163,74,0.55)] active:scale-[0.98] transition-[background-color,transform,opacity,box-shadow] duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Calculando...</span>
                          </>
                        ) : (
                          <>
                            <span>Liberar Avaliação no PIX</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Aviso de Validação Presencial */}
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5EA] text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                <strong className="text-[#1D1D1F]">Garantia &amp; Segurança:</strong> O valor apresentado é uma pré-avaliação garantida com base nas informações fornecidas. O pagamento no PIX é concluído após conferência presencial no ato da entrega pelo nosso técnico credenciado.
              </p>
            </div>
          </div>
        )}

        {/* ── Barra de Navegação Inferior (Etapas 1 a 8) ── */}
        {step <= totalQuestionSteps && (
          <div className="flex items-center justify-between pt-5 mt-6 border-t border-[#F0F0F5]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => goToStep(Math.max(1, step - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] active:scale-95 transition-[background-color,color,transform] duration-150 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            ) : (
              <span className="text-[11px] font-medium text-[#86868B] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Avaliação gratuita e sem compromisso
              </span>
            )}

            {isStepValid && (
              <button
                type="button"
                onClick={() => goToStep(Math.min(9, step + 1))}
                className="animate-chip-in inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold rounded-full shadow-[0_8px_18px_-8px_rgba(0,113,227,0.5)] active:scale-95 transition-[background-color,transform,box-shadow] duration-150 cursor-pointer"
              >
                <span>{step === totalQuestionSteps ? "Ver Avaliação" : "Continuar"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
