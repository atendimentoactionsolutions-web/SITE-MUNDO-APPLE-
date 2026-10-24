"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  MessageCircle,
  Loader2,
  BatteryCharging,
  Cpu,
  Lock,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
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

  // 1. Catálogo
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [modelSearch, setModelSearch] = useState("");

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

  const togglePartSelection = (key: string) => {
    setSelectedReplacedParts((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Cálculo de Preço Reativo
  useEffect(() => {
    if (!selectedModel || !selectedStorage) {
      setEstimatedPrice(null);
      setCalculationData(null);
      return;
    }

    if (boardStatus === "board_issue" || icloudStatus === "locked") {
      setEstimatedPrice(0);
      setCalculationData({ blocked: true, finalPrice: 0 });
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

  const filteredModels = useMemo(() => {
    if (!modelSearch.trim()) return models;
    const q = modelSearch.toLowerCase();
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [models, modelSearch]);

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
    setStep(1);
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Cabeçalho Principal ── */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0071E3] bg-blue-50 px-3 py-1 rounded-full border border-blue-100 inline-block mb-2">
          Avaliação de Usados
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1D1D1F] tracking-tight font-display">
          Venda seu iPhone na Mundo Apple
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] mt-1.5 max-w-lg mx-auto">
          Cotação rápida e objetiva. Pagamento imediato via PIX na retirada presencial.
        </p>
      </div>

      {/* ── Card Principal Interativo ── */}
      <div className="bg-white rounded-3xl border border-[#E5E5E7] p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
        {/* Barra de Progresso Superior (Passos 1 a 8) */}
        {step <= totalQuestionSteps && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#86868B] mb-2">
              <span className="uppercase tracking-wider">
                Etapa {step} de {totalQuestionSteps}
              </span>
              <span className="text-[#0071E3] font-bold">
                {step === 1 && "1. Modelo"}
                {step === 2 && "2. Armazenamento"}
                {step === 3 && "3. Saúde da Bateria"}
                {step === 4 && "4. Tela"}
                {step === 5 && "5. Traseira"}
                {step === 6 && "6. Laterais"}
                {step === 7 && "7. Peças Trocadas"}
                {step === 8 && "8. Bloqueios e Procedência"}
              </span>
            </div>
            <div className="w-full bg-[#F5F5F7] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0071E3] h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(step / totalQuestionSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── ETAPA 1: MODELO (SEM GERAÇÃO) ── */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Qual é o modelo do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Selecione o modelo do seu aparelho abaixo.
              </p>
            </div>

            {/* Campo de Busca */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868B]" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Buscar modelo (ex: iPhone 15, iPhone 14 Pro, iPhone 11...)"
                className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-transparent focus:border-[#0071E3] focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Grid de Modelos sem "Geração" */}
            {loadingCatalog ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#86868B]">
                <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
                <span className="text-xs font-semibold">Carregando catálogo de iPhones...</span>
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
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between min-h-[64px] cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                          : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                      }`}
                    >
                      <span className="font-bold text-xs sm:text-sm text-[#1D1D1F] leading-tight">
                        {m.name}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                          isSelected
                            ? "bg-[#0071E3] border-[#0071E3] text-white"
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

        {/* ── ETAPA 2: ARMAZENAMENTO (GB) ── */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Qual a capacidade de armazenamento?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Consulte em Ajustes &gt; Geral &gt; Sobre no seu {selectedModel?.name}.
              </p>
            </div>

            {loadingStorages ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#86868B]">
                <Loader2 className="w-6 h-6 animate-spin text-[#0071E3]" />
                <span className="text-xs font-semibold">Carregando capacidades...</span>
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
                          ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                          : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                      }`}
                    >
                      <span className="block text-base sm:text-lg font-bold text-[#1D1D1F]">
                        {stg.displayName}
                      </span>
                      <span className="text-[11px] text-[#86868B] font-medium">Capacidade</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 3: PORCENTAGEM DA BATERIA ── */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight flex items-center gap-2">
                <BatteryCharging className="w-5 h-5 text-[#0071E3]" />
                <span>Qual a saúde da bateria?</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Consulte em <strong>Ajustes &gt; Bateria &gt; Saúde da Bateria</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: "90_plus",
                  title: "90% a 100% (Excelente)",
                  desc: "Bateria original com alta capacidade e autonomia máxima.",
                },
                {
                  key: "85_89",
                  title: "85% a 89% (Boa)",
                  desc: "Autonomia padrão para o uso diário regular.",
                },
                {
                  key: "80_84",
                  title: "80% a 84% (Moderada)",
                  desc: "Desgaste natural decorrente do tempo de uso.",
                },
                {
                  key: "below_80",
                  title: "Abaixo de 80% ou Aviso de Manutenção",
                  desc: "Bateria degradada com aviso de manutenção do sistema.",
                },
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
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-xs sm:text-sm text-[#1D1D1F]">
                        {opt.title}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7]"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#6E6E73] leading-relaxed">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── ETAPA 4: COMO ESTÁ A TELA? ── */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Como está a tela do seu iPhone?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Avalie o vidro frontal e o painel de exibição (display).
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "perfect",
                  title: "Impecável / Sem riscos",
                  desc: "Vidro perfeito sem arranhões e exibição de imagem 100% nítida.",
                },
                {
                  key: "light_scratches",
                  title: "Riscos leves superficiais",
                  desc: "Marcas sutis de uso comum, imperceptíveis com a tela ligada.",
                },
                {
                  key: "deep_scratches",
                  title: "Riscos profundos",
                  desc: "Arranhões fortes perceptíveis ao toque ou ao passar a unha.",
                },
                {
                  key: "cracked",
                  title: "Vidro trincado ou quebrado",
                  desc: "Vidro frontal rachado, porém touch e imagem funcionando perfeitamente.",
                },
                {
                  key: "display_damaged",
                  title: "Display danificado / Manchas ou listras",
                  desc: "Manchas pretas, linhas coloridas, falha no touch ou tela sem imagem.",
                },
              ].map((opt) => {
                const isSelected = screenCondition === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setScreenCondition(opt.key);
                      setStep(5);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                    }`}
                  >
                    <div>
                      <span className="block text-xs sm:text-sm font-bold text-[#1D1D1F]">
                        {opt.title}
                      </span>
                      <span className="block text-[11px] text-[#6E6E73] mt-0.5">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7]"
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

        {/* ── ETAPA 5: COMO ESTÁ A TRASEIRA? ── */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Como está a traseira e as lentes?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Avalie o vidro traseiro e as lentes externas das câmeras.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "perfect",
                  title: "Impecável / Sem marcas",
                  desc: "Vidro traseiro e lentes sem nenhum arranhão ou detalhe.",
                },
                {
                  key: "light_marks",
                  title: "Riscos leves / Marcas de capinha",
                  desc: "Marcas sutis causadas por poeira ou atrito com a capa de proteção.",
                },
                {
                  key: "cracked",
                  title: "Vidro traseiro trincado ou quebrado",
                  desc: "Trincas, rachaduras ou estilhaçamento no vidro traseiro.",
                },
                {
                  key: "camera_broken",
                  title: "Lente da câmera trincada ou arranhada",
                  desc: "Vidro protetor de alguma das câmeras danificado.",
                },
              ].map((opt) => {
                const isSelected = backCondition === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setBackCondition(opt.key);
                      setStep(6);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                    }`}
                  >
                    <div>
                      <span className="block text-xs sm:text-sm font-bold text-[#1D1D1F]">
                        {opt.title}
                      </span>
                      <span className="block text-[11px] text-[#6E6E73] mt-0.5">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7]"
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

        {/* ── ETAPA 6: COMO ESTÃO AS LATERAIS? ── */}
        {step === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Como estão as laterais e bordas?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                Estrutura de alumínio, aço ou titânio do chassi do aparelho.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  key: "perfect",
                  title: "Impecáveis / Sem detalhes",
                  desc: "Bordas perfeitas, sem batidas, marcas de impacto ou amassados.",
                },
                {
                  key: "light_scratches",
                  title: "Marcas leves de uso",
                  desc: "Pequenos arranhões ou desgaste suave na pintura das quinas.",
                },
                {
                  key: "dents",
                  title: "Amassados, batidas ou marcas de queda",
                  desc: "Quinas batidas, amassados no aro ou marcas fortes de impacto.",
                },
              ].map((opt) => {
                const isSelected = sidesCondition === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setSidesCondition(opt.key);
                      setStep(7);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                        : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                    }`}
                  >
                    <div>
                      <span className="block text-xs sm:text-sm font-bold text-[#1D1D1F]">
                        {opt.title}
                      </span>
                      <span className="block text-[11px] text-[#6E6E73] mt-0.5">{opt.desc}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7]"
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

        {/* ── ETAPA 7: PEÇAS TROCADAS (SELEÇÃO AMPLA E DIRETA DE PEÇAS) ── */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-left">
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Alguma peça já foi substituída ou o aparelho já foi aberto?
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
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
                  setStep(8);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  replacedPartsStatus === "no"
                    ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
                    : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[#1D1D1F]">
                    Não, 100% original de fábrica
                  </span>
                  {replacedPartsStatus === "no" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-[#6E6E73] mt-1">
                  Aparelho nunca foi aberto; todas as peças são originais de fábrica.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setReplacedPartsStatus("yes")}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  replacedPartsStatus === "yes"
                    ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                    : "bg-[#F5F5F7] hover:bg-[#EAEAEA] border-[#E5E5E7]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[#1D1D1F]">
                    Sim, já foi trocada peça
                  </span>
                  {replacedPartsStatus === "yes" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </div>
                <p className="text-[11px] text-[#6E6E73] mt-1">
                  Já passou por troca de tela, bateria, tampa ou outros componentes.
                </p>
              </button>
            </div>

            {/* SE "SIM", GRID COMPLETO DE PEÇAS SELECIONÁVEIS */}
            {replacedPartsStatus === "yes" && (
              <div className="p-4 sm:p-5 bg-blue-50/40 rounded-2xl border border-blue-200/80 space-y-4 animate-in fade-in duration-200 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1D1D1F]">
                    Selecione quais peças foram trocadas (seleção múltipla):
                  </span>
                  {selectedReplacedParts.length > 0 && (
                    <span className="text-[11px] font-semibold text-[#0071E3]">
                      {selectedReplacedParts.length} {selectedReplacedParts.length === 1 ? "peça selecionada" : "peças selecionadas"}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availablePartsList.map((item) => {
                    const isChecked = selectedReplacedParts.includes(item.key);
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => togglePartSelection(item.key)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isChecked
                            ? "bg-blue-50/90 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]"
                            : "bg-white hover:bg-[#FAFAFA] border-[#D2D2D7]"
                        }`}
                      >
                        <div>
                          <span className={`block text-xs font-bold ${isChecked ? "text-[#0071E3]" : "text-[#1D1D1F]"}`}>
                            {item.label}
                          </span>
                          <span className="block text-[11px] text-[#6E6E73] mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked ? "bg-[#0071E3] border-[#0071E3] text-white" : "border-[#D2D2D7] bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ETAPA 8: TRIAGEM CRÍTICA DE PLACA-MÃE & ICLOUD (ANTI-BUCHA) ── */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 inline-block mb-1">
                Filtro Obrigatório de Procedência
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#1D1D1F] tracking-tight">
                Triagem de Segurança e Procedência
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] mt-0.5">
                A Mundo Apple <strong>não compra</strong> aparelhos com bloqueio de ativação ou restrição de operadora/IMEI.
              </p>
            </div>

            {/* Pergunta: iCloud e IMEI */}
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5E7] space-y-3">
              <label className="text-xs sm:text-sm font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#0071E3]" />
                <span>O iCloud está livre para remoção no ato e o IMEI totalmente limpo?</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setIcloudStatus("unlocked")}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    icloudStatus === "unlocked"
                      ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/30 text-emerald-900"
                      : "bg-white border-[#D2D2D7] hover:bg-[#FAFAFA] text-[#1D1D1F]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Sim, 100% Livre</span>
                    {icloudStatus === "unlocked" && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <span className="block text-[11px] text-[#6E6E73] mt-0.5">
                    Sem vínculo, pronto para formatar e IMEI nacional regular.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setIcloudStatus("locked")}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    icloudStatus === "locked"
                      ? "bg-red-50 border-red-500 ring-1 ring-red-500/30 text-red-900"
                      : "bg-white border-[#D2D2D7] hover:bg-[#FAFAFA] text-[#1D1D1F]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-700">Não, possui bloqueio</span>
                    {icloudStatus === "locked" && <Check className="w-4 h-4 text-red-600" />}
                  </div>
                  <span className="block text-[11px] text-red-600 mt-0.5">
                    iCloud preso, senha esquecida ou restrição de operadora.
                  </span>
                </button>
              </div>

              {/* BLOQUEIO DE ICLOUD */}
              {icloudStatus === "locked" && (
                <div className="p-4 bg-red-100 border border-red-300 rounded-2xl flex items-start gap-3 text-red-900 animate-in fade-in duration-200">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-extrabold block text-sm text-red-800">
                      Aparelho com Bloqueio de Ativação
                    </span>
                    <p className="leading-relaxed">
                      Não adquirimos sob nenhuma hipótese aparelhos vinculados ao iCloud ou com restrições de operadora/IMEI.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ETAPA 9: RESULTADO & DADOS DO CLIENTE ── */}
        {step === 9 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {quoteSuccess ? (
              /* RESULTADO FINAL */
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Banner de confirmação WhatsApp */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 text-left">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Enviamos os dados completos e o valor desta avaliação para o seu WhatsApp (
                    <strong>{customerWhatsapp}</strong>)!
                  </span>
                </div>

                <div className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200 text-center space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0071E3] block">
                    Valor Pré-Avaliado do seu iPhone:
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
                    {estimatedPrice && estimatedPrice > 0 ? (
                      <span className="text-lg sm:text-2xl text-emerald-600 font-bold ml-2">no PIX</span>
                    ) : null}
                  </div>
                  <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md mx-auto leading-relaxed">
                    Pagamento imediato via PIX no ato da retirada presencial em São Paulo e região.
                  </p>
                </div>

                {/* Resumo da Ficha */}
                <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5E7] text-left space-y-2 text-xs">
                  <span className="font-bold text-[#1D1D1F] block text-xs uppercase tracking-wider">
                    Resumo da Avaliação Registrada:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#6E6E73]">
                    <div>- <strong>Aparelho:</strong> {selectedModel?.name} {selectedStorage?.displayName}</div>
                    <div>- <strong>Bateria:</strong> {batteryHealthText}</div>
                    <div>- <strong>Tela:</strong> {screenConditionText}</div>
                    <div>- <strong>Traseira:</strong> {backConditionText}</div>
                    <div>- <strong>Laterais:</strong> {sidesConditionText}</div>
                    <div>- <strong>Peças Trocadas:</strong> {replacedPartsSummaryText}</div>
                    <div>- <strong>iCloud e IMEI:</strong> 100% Liberados</div>
                  </div>
                </div>

                {/* Botão de Agendamento */}
                <div className="space-y-3 pt-2">
                  <a
                    href={whatsappSaleUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Agendar Retirada e Receber no PIX</span>
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
              <div className="space-y-6">
                <div className="text-left space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    Etapa Final: Seus Dados
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                    Para onde enviamos a sua avaliação?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6E73]">
                    Preencha seu nome e WhatsApp para visualizar o valor em dinheiro pelo seu iPhone.
                  </p>
                </div>

                {/* Ficha Resumo dos Dados Coletados */}
                <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5E7] text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#1D1D1F] uppercase tracking-wider">
                      Ficha Técnica Declarada:
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="text-[11px] text-[#0071E3] font-semibold hover:underline"
                    >
                      Editar respostas
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-[#1D1D1F]">
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                      {selectedModel?.name} {selectedStorage?.displayName}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                      Bateria: {batteryHealthText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                      Tela: {screenConditionText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                      Traseira: {backConditionText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                      Laterais: {sidesConditionText}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                      {replacedPartsSummaryText}
                    </span>
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                      iCloud e IMEI OK
                    </span>
                  </div>
                </div>

                {/* Formulário */}
                <div className="p-6 rounded-3xl bg-white border border-[#E5E5E7] shadow-xs space-y-4 text-left">
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1D1D1F] mb-1.5">
                        Nome Completo: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Ex: Carlos Eduardo"
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-[#D2D2D7] focus:border-[#0071E3] focus:bg-white outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1D1D1F] mb-1.5">
                        WhatsApp com DDD: <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerWhatsapp}
                        onChange={handlePhoneChange}
                        placeholder="(11) 99999-9999"
                        className="w-full px-4 py-3 bg-[#F5F5F7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] placeholder:text-[#86868B] border border-[#D2D2D7] focus:border-[#0071E3] focus:bg-white outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(8)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#6E6E73] hover:text-[#1D1D1F] rounded-full hover:bg-[#F5F5F7] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="submit"
                        disabled={!isStepValid || submitting}
                        className="flex-1 py-3.5 bg-[#00C853] hover:bg-[#00B048] disabled:opacity-50 text-white font-extrabold text-sm rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
            <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#E5E5E7] text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#86868B] leading-relaxed">
                <strong>Garantia &amp; Segurança:</strong> O valor apresentado é uma pré-avaliação garantida com base nas informações fornecidas. O pagamento no PIX é concluído após conferência presencial no ato da entrega pelo nosso técnico credenciado.
              </p>
            </div>
          </div>
        )}

        {/* ── Barra de Navegação Inferior (Etapas 1 a 8) ── */}
        {step <= totalQuestionSteps && (
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
                onClick={() => setStep((s) => Math.min(9, s + 1))}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs sm:text-sm font-semibold rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
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
