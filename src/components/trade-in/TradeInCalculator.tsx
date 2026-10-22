"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
  Cpu,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { storeConfig } from "@/data/storeConfig";
import { formatCurrency } from "@/utils/formatters";
import { calculateInstallments, InstallmentOption } from "@/utils/installments";
import { products } from "@/data/products";
import { Product } from "@/types/product";

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

const colorMap: Record<string, string> = {
  "Black": "#1D1D1F",
  "Space Black": "#18181A",
  "Midnight": "#1B212C",
  "White": "#F5F5F7",
  "Cloud White": "#FAFAFC",
  "Starlight": "#F0EBE3",
  "Silver": "#E3E4E6",
  "Space Gray": "#535150",
  "Natural": "#8E8B82",
  "Natural Titanium": "#8E8B82",
  "Black Titanium": "#1E1E20",
  "White Titanium": "#F5F5F7",
  "Desert Titanium": "#C5B49E",
  "Deep Blue": "#223854",
  "Dark Blue": "#223854",
  "Blue": "#3B6B96",
  "Mist Blue": "#6E93B2",
  "Sky Blue": "#7EA2C6",
  "Teal": "#43828A",
  "Ultramarine": "#38529A",
  "Pink": "#E8B2C0",
  "Soft Pink": "#EAC2CE",
  "Sage": "#829383",
  "Lavender": "#B1A1C6",
  "Light Gold": "#E5D4B3",
  "Gold": "#E5D4B3",
  "Cosmic Orange": "#D85E30",
  "Citrus": "#D9E24C",
  "Indigo": "#3B485A",
  "Blush": "#E8CBCB",
  "Green": "#4C8A68",
  "Yellow": "#F2D358",
  "Jet Black": "#121214",
  "Rose Gold": "#E5B09E",
  "Orange": "#D85E30",
  "Purple": "#A594B8",
  "Red": "#D32F2F",
  "Preto": "#1D1D1F",
  "Titânio Preto": "#1E1E20",
  "Prateado": "#E3E4E6",
  "Titânio Natural": "#8E8B82",
  "Bordô": "#5A1827",
  "Burgundy": "#5A1827",
  "Glacier": "#B5C8D5",
  "Céu Noturno": "#1C1F26",
  "Branco-Estrela": "#F0EBE3",
  "Branco": "#F5F5F7",
};

const upgradeCategories = [
  { id: "iphone", label: "iPhones", icon: Smartphone },
  { id: "mac", label: "Mac & MacBooks", icon: Laptop },
  { id: "ipad", label: "iPads", icon: Tablet },
  { id: "watch", label: "Apple Watch", icon: Watch },
  { id: "airpods", label: "AirPods", icon: Headphones },
  { id: "accessories", label: "Acessórios", icon: Sparkles },
];

export const TradeInCalculator: React.FC = () => {
  const totalSteps = 8;
  const [step, setStep] = useState(1);

  // 1. Desired New Sealed Product for Upgrade
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] = useState<string>("iphone");
  const [liveCatalog, setLiveCatalog] = useState<Product[]>(products);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/products/live")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && Array.isArray(data.products) && data.products.length > 0) {
          setLiveCatalog(data.products);
        }
      })
      .catch((err) => console.warn("Fallback to static products:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  const newProductsInCategory = useMemo(() => {
    return liveCatalog.filter(
      (p) =>
        p.category.toLowerCase() === selectedUpgradeCategory.toLowerCase() &&
        p.condition === "new" &&
        p.active
    );
  }, [selectedUpgradeCategory, liveCatalog]);

  const [selectedNewProduct, setSelectedNewProduct] = useState<Product | null>(null);
  const [selectedNewStorage, setSelectedNewStorage] = useState<string>("");
  const [selectedNewColor, setSelectedNewColor] = useState<string>("");

  const searchParams = useSearchParams();

  // Read URL query params
  useEffect(() => {
    const cat = searchParams.get("categoria");
    const prodName = searchParams.get("produto");

    if (cat && ["iphone", "mac", "ipad", "watch", "airpods", "accessories"].includes(cat.toLowerCase())) {
      setSelectedUpgradeCategory(cat.toLowerCase());
    }

    if (prodName) {
      const decoded = decodeURIComponent(prodName).toLowerCase();
      const found = products.find(
        (p) => p.name.toLowerCase() === decoded && p.active && p.condition === "new"
      );
      if (found) {
        setSelectedNewProduct(found);
      }
    }
  }, [searchParams]);

  // Sync category product
  useEffect(() => {
    if (newProductsInCategory.length > 0 && !selectedNewProduct) {
      const prodName = searchParams.get("produto");
      if (prodName) {
        const decoded = decodeURIComponent(prodName).toLowerCase();
        const found = newProductsInCategory.find((p) => p.name.toLowerCase() === decoded);
        if (found) {
          setSelectedNewProduct(found);
          return;
        }
      }
      setSelectedNewProduct(newProductsInCategory[0]);
    }
  }, [selectedUpgradeCategory, newProductsInCategory, selectedNewProduct, searchParams]);

  // Derived options for selected new product
  const selectedProductStorages = useMemo(() => {
    if (!selectedNewProduct) return [];
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      const set = new Set(
        selectedNewProduct.variants.map((v) => v.storage).filter(Boolean) as string[]
      );
      const arr = Array.from(set);
      if (arr.length > 0) return arr;
    }
    if (selectedNewProduct.storage && selectedNewProduct.storage.length > 0) {
      return selectedNewProduct.storage;
    }
    return [];
  }, [selectedNewProduct]);

  // Derived available colors for the currently selected storage
  const availableColorsForStorage = useMemo(() => {
    if (!selectedNewProduct) return [];
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      // 1. Try colors matching the currently selected storage
      const matching = selectedNewProduct.variants.filter(
        (v) => !selectedNewStorage || v.storage?.toLowerCase() === selectedNewStorage?.toLowerCase()
      );
      const colorsForStg = Array.from(
        new Set(matching.map((v) => v.color).filter(Boolean) as string[])
      );
      if (colorsForStg.length > 0) return colorsForStg;

      // 2. Fallback to all variant colors
      const allVariantColors = Array.from(
        new Set(selectedNewProduct.variants.map((v) => v.color).filter(Boolean) as string[])
      );
      if (allVariantColors.length > 0) return allVariantColors;
    }
    if (selectedNewProduct.colors && selectedNewProduct.colors.length > 0) {
      return selectedNewProduct.colors;
    }
    return [];
  }, [selectedNewProduct, selectedNewStorage]);

  // Keep storage and color strictly synchronized with available options
  useEffect(() => {
    if (!selectedNewProduct) return;

    if (selectedProductStorages.length > 0) {
      const hasValidStorage = selectedProductStorages.some(
        (s) => s.toLowerCase() === selectedNewStorage.toLowerCase()
      );
      if (!selectedNewStorage || !hasValidStorage) {
        setSelectedNewStorage(selectedProductStorages[0]);
      }
    }
  }, [selectedNewProduct, selectedProductStorages, selectedNewStorage]);

  useEffect(() => {
    if (!selectedNewProduct) return;

    if (availableColorsForStorage.length > 0) {
      const hasValidColor = availableColorsForStorage.some(
        (c) => c.toLowerCase() === selectedNewColor.toLowerCase()
      );
      if (!selectedNewColor || !hasValidColor) {
        setSelectedNewColor(availableColorsForStorage[0]);
      }
    }
  }, [selectedNewProduct, availableColorsForStorage, selectedNewColor]);

  // Calculate new target price with bulletproof precision
  const selectedNewPrice = useMemo(() => {
    if (!selectedNewProduct) return 0;
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      // 1. Exact match: Storage AND Color (case-insensitive)
      let matched = selectedNewProduct.variants.find(
        (v) =>
          (!selectedNewStorage || v.storage?.toLowerCase() === selectedNewStorage.toLowerCase()) &&
          (!selectedNewColor || v.color?.toLowerCase() === selectedNewColor.toLowerCase())
      );
      // 2. Fallback: Match by storage alone
      if (!matched && selectedNewStorage) {
        matched = selectedNewProduct.variants.find(
          (v) => v.storage?.toLowerCase() === selectedNewStorage.toLowerCase()
        );
      }
      // 3. Fallback: Match by color alone
      if (!matched && selectedNewColor) {
        matched = selectedNewProduct.variants.find(
          (v) => v.color?.toLowerCase() === selectedNewColor.toLowerCase()
        );
      }
      if (matched && matched.price > 0) return matched.price;
    }
    return selectedNewProduct.priceFrom || 0;
  }, [selectedNewProduct, selectedNewStorage, selectedNewColor]);

  // 2. Used Device Catalog
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [modelSearch, setModelSearch] = useState("");

  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [loadingStorages, setLoadingStorages] = useState(false);

  // Used Device Form State — NO PRE-SELECTION
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [deviceColor, setDeviceColor] = useState("");

  // Question Answers (Anti-Bucha Flow)
  const [powerOnStatus, setPowerOnStatus] = useState<string>("normal");
  const [icloudStatus, setIcloudStatus] = useState<string>("unlocked");
  const [screenHistory, setScreenHistory] = useState<string>("original");
  const [batteryHealth, setBatteryHealth] = useState<string>("90_plus");
  const [screenGlass, setScreenGlass] = useState<string>("perfect");
  const [bodyBackGlass, setBodyBackGlass] = useState<string>("perfect");
  const [sensorsAllOk, setSensorsAllOk] = useState<boolean>(true);
  const [selectedMalfunctions, setSelectedMalfunctions] = useState<string[]>([]);

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

  // Load active models from API
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

  // Load storage options when used model changes
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

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "").slice(0, 8);

    if (!digits) {
      setCustomerCep("");
      return;
    }

    let formatted = digits;
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }

    setCustomerCep(formatted);
  };

  const filteredModels = useMemo(() => {
    if (!modelSearch.trim()) return models;
    const q = modelSearch.toLowerCase();
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [models, modelSearch]);

  // Step Validation Checkers (8-step flow)
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!selectedNewProduct;
      case 2:
        return true; // Config of new product
      case 3:
        return !!selectedModel;
      case 4:
        return !!selectedStorage;
      case 5:
        return powerOnStatus === "normal" && icloudStatus === "unlocked" && !!screenHistory;
      case 6:
        return !!batteryHealth && !!screenGlass && !!bodyBackGlass;
      case 7:
        return true; // Sensors
      case 8:
        return (
          customerName.trim().length >= 2 &&
          customerWhatsapp.replace(/\D/g, "").length >= 10
        );
      default:
        return false;
    }
  }, [
    step,
    selectedNewProduct,
    selectedModel,
    selectedStorage,
    powerOnStatus,
    icloudStatus,
    screenHistory,
    batteryHealth,
    screenGlass,
    bodyBackGlass,
    customerName,
    customerWhatsapp,
  ]);

  // Submit Final Quote
  const handleFinalSubmit = async () => {
    if (!selectedModel || !selectedStorage || !isStepValid) return;

    try {
      setSubmitting(true);
      const isDisplayIssue = screenGlass === "display_damaged";
      const isScreenCracked = screenGlass === "cracked";
      const isBackCracked = bodyBackGlass === "cracked";
      const isBodyDented = bodyBackGlass === "heavy_dents";

      const payload = {
        deviceModelId: selectedModel.id,
        storageOptionId: selectedStorage.id,
        answers: {
          deviceColor: deviceColor.trim() || "Não informada",
          powerOn: powerOnStatus === "normal",
          powerOnStatus: powerOnStatus === "normal" ? "normal" : "board_issue",
          boardProblem: powerOnStatus === "board_issue",
          icloudStatus,
          icloudClear: icloudStatus === "unlocked",
          imeiRegular: icloudStatus === "unlocked",

          // Peças Trocadas
          screenHistory: screenHistory === "original" ? "original" : screenHistory === "apple_genuine" ? "apple_genuine" : screenHistory === "parallel" ? "parallel" : "original",
          replacedPartsStatus: screenHistory === "original" ? "no" : "yes",
          replacedParts: screenHistory === "parallel" ? ["screen"] : screenHistory === "apple_genuine" ? ["apple_genuine"] : screenHistory === "repaired_other" ? ["other_part"] : [],

          // Bateria
          batteryHealth,

          // Vidros e Carcaça
          screenGlass: isScreenCracked ? "cracked" : screenGlass === "light_scratches" ? "light_scratches" : "perfect",
          screenDisplay: isDisplayIssue ? "spots" : "perfect",
          bodyBackGlass: isBackCracked ? "cracked" : "perfect",
          bodySides: isBodyDented ? "heavy_dents" : bodyBackGlass === "light_scratches" ? "light_scratches" : "perfect",

          // Sensores e Funcionamento
          cameraFront: "perfect",
          cameraRear: selectedMalfunctions.includes("camera") ? "broken" : "perfect",
          cameraGlass: "perfect",
          faceId: selectedMalfunctions.includes("face_id") ? "broken" : "perfect",
          audioSpeakers: "perfect",
          audioMicrophone: "perfect",
          networkWifi: selectedMalfunctions.includes("wifi") ? "broken" : "perfect",
          networkCellular: selectedMalfunctions.includes("wifi") ? "broken" : "perfect",
          charging: selectedMalfunctions.includes("charging") ? "broken" : "perfect",
          malfunctions: selectedMalfunctions,

          customerName: customerName.trim(),
          customerWhatsapp: customerWhatsapp.trim(),
          customerCep: customerCep.trim(),
          upgradeGoal: {
            category: selectedUpgradeCategory,
            productName: selectedNewProduct?.name,
            storage: selectedNewStorage,
            color: selectedNewColor,
            newPrice: selectedNewPrice,
          },
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
        alert(data.error || "Ocorreu um erro ao calcular a avaliação.");
      }
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      alert("Falha na conexão. Tente novamente.");
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
    setScreenHistory("original");
    setBatteryHealth("90_plus");
    setScreenGlass("perfect");
    setBodyBackGlass("perfect");
    setSensorsAllOk(true);
    setSelectedMalfunctions([]);
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

  const selectOptionAndAdvance = (setter: (val: string) => void, val: string) => {
    setter(val);
  };

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
  // RESULT SCREEN — TRADE-IN SIMULATION
  // ----------------------------------------------------
  if (quoteResult) {
    const isBlocked = quoteResult.calculation?.blocked;
    const isManual = quoteResult.calculation?.manualReview;
    const tradeInValue = quoteResult.calculation?.finalPrice || 0;
    const targetPrice = selectedNewPrice || 0;
    const differenceToPay = Math.max(0, targetPrice - tradeInValue);
    const installments = differenceToPay > 0 ? calculateInstallments(differenceToPay) : [];
    const maxInstallment = installments.length > 0 ? installments[installments.length - 1] : null;

    const whatsappTradeInUrl = () => {
      const code = quoteResult.quote?.publicCode || "TRC-VAL";
      const message = `Olá! Gostaria de fechar meu Upgrade (Troca) na Mundo Apple:

Código da Simulação: ${code}

MEU APARELHO USADO (ENTRADA):
- Modelo: ${selectedModel?.name} (${selectedStorage?.displayName})
- Cor: ${deviceColor || "Padrão"}
- Histórico de Peças: ${screenHistory === "original" ? "100% Original de Fábrica" : screenHistory === "apple_genuine" ? "Peça Original Apple" : screenHistory === "parallel" ? "Tela Paralela" : "Reparo Realizado"}
- Saúde da Bateria: ${batteryHealth === "90_plus" ? "90%+" : batteryHealth === "85_89" ? "85-89%" : batteryHealth === "80_84" ? "80-84%" : "Abaixo de 80% (Manutenção)"}
- Avaliação Pré-Aprovada: ${formatCurrency(tradeInValue)}

PRODUTO NOVO DESEJADO:
- Modelo: ${selectedNewProduct?.name}
- Configuração: ${selectedNewStorage || ""} ${selectedNewColor ? `(${selectedNewColor})` : ""}
- Valor do Novo: ${targetPrice > 0 ? formatCurrency(targetPrice) : "Sob Consulta"}

VALOR DA DIFERENÇA (VOLTA A PAGAR):
- À vista no Pix: ${formatCurrency(differenceToPay)}${maxInstallment && differenceToPay > 0 ? `\n- Ou em até 18x de ${formatCurrency(maxInstallment.installmentValue)} no cartão` : ""}

MEUS DADOS:
- Nome: ${customerName.trim()}
- WhatsApp: ${customerWhatsapp.trim()}${customerCep ? `\n- CEP: ${customerCep.trim()}` : ""}

CHECKLIST DE CONFERÊNCIA TÉCNICA NA ENTREGA:
[ ] 1. Remover e desvincular conta iCloud no ato
[ ] 2. Testar Face ID e Câmeras (0.5x, 1x e zoom)
[ ] 3. Checar se há alerta de 'Peça Desconhecida' em Ajustes > Geral > Sobre
[ ] 4. Conferir integridade física dos vidros e saúde da bateria

Gostaria de agendar a troca com entrega e retirada simultânea em SP!`;

      return `https://wa.me/${storeConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
    };

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
                <RefreshCw className="w-8 h-8" />
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5F5F7] text-xs font-semibold text-[#1D1D1F] border border-[#D2D2D7]">
              <span>Cotação de Troca:</span>
              <strong className="text-[#0071E3] font-bold tracking-wider">
                {quoteResult.quote?.publicCode}
              </strong>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F]">
              {isBlocked
                ? "Aparelho Não Elegível para Troca"
                : isManual
                ? "Avaliação Manual na Loja"
                : "Simulação de Troca Concluída!"}
            </h2>

            <p className="text-xs sm:text-sm text-[#6E6E73] max-w-md">
              {isBlocked
                ? "Identificamos que o aparelho possui restrição ou bloqueio de iCloud ativo."
                : isManual
                ? "Pelo estado técnico informado, realizaremos a conferência física do aparelho para fechar o valor final da troca."
                : "Seu aparelho usado entra como entrada com valorização garantida."}
            </p>
          </div>

          {!isBlocked && (
            <div className="space-y-4 text-left">
              {/* WhatsApp Notification Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Disparamos uma confirmação com os dados e valores desta simulação para o seu WhatsApp (<strong>{customerWhatsapp}</strong>)!
                </span>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#6E6E73] block">
                    Seu Usado (Entrada)
                  </span>
                  <div className="text-lg font-bold text-[#1D1D1F]">
                    {selectedModel?.name}
                  </div>
                  <div className="text-xs text-emerald-700 font-bold">
                    Avaliado em: + {formatCurrency(tradeInValue)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0071E3] block">
                    Novo Desejado (Lacrado)
                  </span>
                  <div className="text-lg font-bold text-[#1D1D1F]">
                    {selectedNewProduct?.name}
                  </div>
                  <div className="text-xs text-[#0071E3] font-bold">
                    {targetPrice > 0 ? `Valor: ${formatCurrency(targetPrice)}` : "Sob Consulta"}
                  </div>
                </div>
              </div>

              {/* Difference Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1D1D1F] to-[#2D2D30] text-white space-y-3 text-center shadow-lg">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Valor da Diferença (Volta a Pagar):
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">
                  {formatCurrency(differenceToPay)}
                </div>
                <p className="text-xs text-zinc-300">
                  À vista no Pix com entrega e retirada rápida em SP!
                </p>

                {maxInstallment && differenceToPay > 0 && (
                  <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-zinc-300">
                    <CreditCard className="w-4 h-4 text-[#0071E3]" />
                    <span>
                      Ou em até <strong className="text-white font-bold">18x de {formatCurrency(maxInstallment.installmentValue)}</strong> no cartão
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {!isBlocked && (
              <a
                href={whatsappTradeInUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#00C853] hover:bg-[#00B048] text-white font-bold text-base shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Garantir Troca no WhatsApp</span>
              </a>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="py-4 px-6 rounded-2xl font-bold border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7] transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Nova Simulação</span>
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
            ETAPA 1 — QUAL NOVO QUER COMPRAR
        ---------------------------------------------------- */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 1: Novo Aparelho</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Qual produto Apple NOVO você quer adquirir?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Selecione a categoria e o modelo novo lacrado que você deseja.
              </p>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {upgradeCategories.map((c) => {
                const Icon = c.icon;
                const isSel = selectedUpgradeCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedUpgradeCategory(c.id);
                      setSelectedNewProduct(null);
                      setSelectedNewStorage("");
                      setSelectedNewColor("");
                    }}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSel
                        ? "bg-[#0071E3] text-white shadow-sm"
                        : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E5E5E7]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
              {newProductsInCategory.map((p) => {
                const isSel = selectedNewProduct?.slug === p.slug;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setSelectedNewProduct(p);
                      const pStorages = p.variants && p.variants.length > 0
                        ? Array.from(new Set(p.variants.map((v) => v.storage).filter(Boolean) as string[]))
                        : (p.storage || []);
                      const initialStorage = pStorages[0] || "";
                      setSelectedNewStorage(initialStorage);

                      const pColors = p.variants && p.variants.length > 0
                        ? Array.from(
                            new Set(
                              p.variants
                                .filter((v) => !initialStorage || v.storage?.toLowerCase() === initialStorage.toLowerCase())
                                .map((v) => v.color)
                                .filter(Boolean) as string[]
                            )
                          )
                        : (p.colors || []);
                      setSelectedNewColor(pColors[0] || "");
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                      isSel
                        ? "bg-blue-50/80 border-[#0071E3] shadow-sm ring-1 ring-[#0071E3]/30"
                        : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 relative rounded-xl bg-[#F5F5F7] flex items-center justify-center p-1">
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-[#1D1D1F] text-xs sm:text-sm block">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-[#0071E3] font-bold">
                          {p.priceFrom > 0 ? `A partir de ${formatCurrency(p.priceFrom)}` : "Sob Consulta"}
                        </span>
                      </div>
                    </div>
                    {isSel && <Check className="w-4 h-4 text-[#0071E3]" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 2 — CONFIGURAÇÃO DO NOVO
        ---------------------------------------------------- */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 2: Configuração do Novo</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                {selectedNewProduct?.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Escolha a capacidade e a cor desejada do novo aparelho.
              </p>
            </div>

            {selectedProductStorages.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Armazenamento do Novo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedProductStorages.map((stg) => {
                    const isSel = selectedNewStorage?.toLowerCase() === stg.toLowerCase();
                    const stgVariants = selectedNewProduct?.variants?.filter(
                      (v) => v.storage?.toLowerCase() === stg.toLowerCase()
                    ) || [];
                    const minStgPrice = stgVariants.length > 0
                      ? Math.min(...stgVariants.map((v) => v.price).filter((p) => p > 0))
                      : 0;

                    return (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => {
                          setSelectedNewStorage(stg);
                          if (stgVariants.length > 0) {
                            const colorsForThisStg = stgVariants.map((v) => v.color).filter(Boolean) as string[];
                            if (colorsForThisStg.length > 0 && !colorsForThisStg.some((c) => c.toLowerCase() === selectedNewColor.toLowerCase())) {
                              setSelectedNewColor(colorsForThisStg[0]);
                            }
                          }
                        }}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSel
                            ? "bg-[#0071E3] text-white border-[#0071E3] shadow-md ring-2 ring-[#0071E3]/20"
                            : "bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7]"
                        }`}
                      >
                        <span className="block text-sm font-bold">{stg}</span>
                        {minStgPrice > 0 && (
                          <span className={`block text-[10px] mt-0.5 ${isSel ? "text-blue-100 font-semibold" : "text-[#86868B]"}`}>
                            a partir de {formatCurrency(minStgPrice)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {availableColorsForStorage.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#1D1D1F] block">
                  Cor do Novo:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableColorsForStorage.map((col) => {
                    const isSel = selectedNewColor?.toLowerCase() === col.toLowerCase();
                    const colorHex = colorMap[col] || "#8E8E93";
                    const varForColor = selectedNewProduct?.variants?.find(
                      (v) =>
                        (!selectedNewStorage || v.storage?.toLowerCase() === selectedNewStorage.toLowerCase()) &&
                        v.color?.toLowerCase() === col.toLowerCase()
                    );
                    const colPrice = varForColor?.price;

                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedNewColor(col)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all cursor-pointer ${
                          isSel
                            ? "bg-[#0071E3] text-white border-[#0071E3] shadow-md ring-2 ring-[#0071E3]/20"
                            : "bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-xs"
                            style={{ backgroundColor: colorHex }}
                          />
                          <span className="text-xs font-bold truncate">{col}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {colPrice && colPrice > 0 && (
                            <span className={`text-xs font-bold ${isSel ? "text-white" : "text-emerald-600"}`}>
                              {formatCurrency(colPrice)}
                            </span>
                          )}
                          {isSel && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <span className="text-xs text-[#0071E3] font-semibold">Valor do Novo Lacrado:</span>
              <span className="text-lg font-bold text-[#0071E3]">
                {selectedNewPrice > 0 ? formatCurrency(selectedNewPrice) : "Sob Consulta"}
              </span>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 3 — MODELO DO APARELHO USADO
        ---------------------------------------------------- */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 3: Seu iPhone Usado</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Qual é o modelo do seu iPhone usado?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Aparelho que você dará de entrada para abater no valor do novo.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Buscar modelo usado (ex: iPhone 13 Pro, iPhone 12...)"
                className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0071E3] text-[#1D1D1F]"
              />
            </div>

            {loadingCatalog ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-[#6E6E73]">
                <Loader2 className="w-8 h-8 animate-spin text-[#0071E3]" />
                <p className="text-xs font-semibold">Carregando modelos...</p>
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
            ETAPA 4 — ARMAZENAMENTO DO USADO
        ---------------------------------------------------- */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 4: Capacidade do Usado</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Qual é a memória do seu {selectedModel?.name}?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Selecione a capacidade do aparelho de entrada.
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
                Cor do aparelho usado (opcional):
              </label>
              <input
                type="text"
                value={deviceColor}
                onChange={(e) => setDeviceColor(e.target.value)}
                placeholder="Ex: Preto, Azul, Prateado..."
                className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3]"
              />
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 5 — SEGURANÇA, PLACA & PEÇAS TROCADAS
        ---------------------------------------------------- */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 5: Segurança & Originalidade</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Triagem Técnica e Procedência
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Responda sobre a inicialização, bloqueios e histórico de peças do seu {selectedModel?.name}.
              </p>
            </div>

            {/* Pergunta 1: Placa-Mãe / Inicialização */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#0071E3]" />
                <span>1. O aparelho liga e a placa-mãe funciona normalmente?</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPowerOnStatus("normal")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    powerOnStatus === "normal"
                      ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">Sim, liga e funciona 100% estável</span>
                    <span className="block text-[11px] text-[#6E6E73]">Sem desligamentos ou travamentos</span>
                  </div>
                  {powerOnStatus === "normal" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setPowerOnStatus("board_issue")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    powerOnStatus === "board_issue"
                      ? "bg-red-50 border-red-500 shadow-xs ring-1 ring-red-500/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-red-700">Não liga / Defeito de placa</span>
                    <span className="block text-[11px] text-red-600">Preso na maçã ou desliga sozinho</span>
                  </div>
                  {powerOnStatus === "board_issue" && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              </div>

              {powerOnStatus === "board_issue" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Atenção: A Mundo Apple Delivery <strong>não adquire</strong> aparelhos inoperantes ou com defeito de placa-mãe.</span>
                </div>
              )}
            </div>

            {/* Pergunta 2: iCloud e Restrições */}
            <div className="space-y-2 pt-2 border-t border-[#E5E5E7]">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#0071E3]" />
                <span>2. O iCloud está livre para remoção imediata e o IMEI limpo?</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIcloudStatus("unlocked")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    icloudStatus === "unlocked"
                      ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">Sim, 100% liberado e sem vínculo</span>
                    <span className="block text-[11px] text-[#6E6E73]">Pronto para formatar no ato da troca</span>
                  </div>
                  {icloudStatus === "unlocked" && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIcloudStatus("locked")}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    icloudStatus === "locked"
                      ? "bg-red-50 border-red-500 shadow-xs ring-1 ring-red-500/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-red-700">Não, possui bloqueio ou senha</span>
                    <span className="block text-[11px] text-red-600">iCloud vinculado ou restrição de rede</span>
                  </div>
                  {icloudStatus === "locked" && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              </div>

              {icloudStatus === "locked" && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium flex items-center gap-2 mt-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Atenção: Aparelhos com bloqueio de ativação (iCloud) ou operadora <strong>não são aceitos</strong> para troca.</span>
                </div>
              )}
            </div>

            {/* Pergunta 3: Histórico de Peças e Reparos */}
            <div className="space-y-2 pt-2 border-t border-[#E5E5E7]">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0071E3]" />
                <span>3. Histórico de Peças: Alguma peça já foi trocada ou o aparelho já foi aberto?</span>
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setScreenHistory("original")}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    screenHistory === "original"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">100% Original de Fábrica (Nunca aberto)</span>
                    <span className="block text-[11px] text-[#6E6E73]">Todas as peças originais Apple de fabricação.</span>
                  </div>
                  {screenHistory === "original" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setScreenHistory("apple_genuine")}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    screenHistory === "apple_genuine"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">Peça trocada Original Apple</span>
                    <span className="block text-[11px] text-[#6E6E73]">Substituída em autorizada oficial Apple (com histórico nos Ajustes).</span>
                  </div>
                  {screenHistory === "apple_genuine" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setScreenHistory("parallel")}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    screenHistory === "parallel"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">Tela trocada por Paralela / Primeira linha</span>
                    <span className="block text-[11px] text-[#6E6E73]">Sem True Tone ou com aviso de 'Peça Desconhecida' nos Ajustes.</span>
                  </div>
                  {screenHistory === "parallel" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setScreenHistory("repaired_other")}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    screenHistory === "repaired_other"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">Outro reparo (Bateria, Conector ou Câmera)</span>
                    <span className="block text-[11px] text-[#6E6E73]">Aparelho já passou por manutenção em assistência técnica.</span>
                  </div>
                  {screenHistory === "repaired_other" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 6 — ESTADO FÍSICO & BATERIA
        ---------------------------------------------------- */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 6: Conservação & Bateria</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Estado Físico e Bateria
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Informe com honestidade para garantir a aprovação rápida na vistoria.
              </p>
            </div>

            {/* Bateria */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1D1D1F] flex items-center gap-1.5">
                <BatteryCharging className="w-4 h-4 text-[#0071E3]" />
                <span>1. Saúde da Bateria (em Ajustes &gt; Bateria &gt; Saúde):</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "90_plus", label: "90% ou mais", sub: "Excelente" },
                  { id: "85_89", label: "85% a 89%", sub: "Muito boa" },
                  { id: "80_84", label: "80% a 84%", sub: "Bom estado" },
                  { id: "below_80", label: "Abaixo de 80%", sub: "Manutenção" },
                ].map((b) => {
                  const isSel = batteryHealth === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBatteryHealth(b.id)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSel
                          ? "bg-[#0071E3] text-white border-[#0071E3] shadow-md ring-2 ring-[#0071E3]/20"
                          : "bg-white border-[#D2D2D7] text-[#1D1D1F] hover:bg-[#F5F5F7]"
                      }`}
                    >
                      <span className="block text-xs sm:text-sm font-bold">{b.label}</span>
                      <span className={`block text-[10px] mt-0.5 ${isSel ? "text-blue-100" : "text-[#86868B]"}`}>
                        {b.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tela Frontal */}
            <div className="space-y-2 pt-2 border-t border-[#E5E5E7]">
              <label className="text-xs font-bold text-[#1D1D1F] block">
                2. Estado da Tela Frontal:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScreenGlass("perfect")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    screenGlass === "perfect"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">💎 Impecável (Sem Riscos)</span>
                    <span className="block text-[11px] text-[#6E6E73]">Vidro e display como novos.</span>
                  </div>
                  {screenGlass === "perfect" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setScreenGlass("light_scratches")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    screenGlass === "light_scratches"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">✨ Riscos Leves de Uso</span>
                    <span className="block text-[11px] text-[#6E6E73]">Apenas riscos superficiais normais.</span>
                  </div>
                  {screenGlass === "light_scratches" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setScreenGlass("cracked")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    screenGlass === "cracked"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">🔨 Vidro Trincado (Touch OK)</span>
                    <span className="block text-[11px] text-[#6E6E73]">Vidro quebrado, mas touch e imagem 100%.</span>
                  </div>
                  {screenGlass === "cracked" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setScreenGlass("display_damaged")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    screenGlass === "display_damaged"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">🚫 Manchas ou Touch Falhando</span>
                    <span className="block text-[11px] text-[#6E6E73]">Dano no painel OLED/LCD interno.</span>
                  </div>
                  {screenGlass === "display_damaged" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>
              </div>
            </div>

            {/* Traseira e Laterais */}
            <div className="space-y-2 pt-2 border-t border-[#E5E5E7]">
              <label className="text-xs font-bold text-[#1D1D1F] block">
                3. Vidro Traseiro e Carcaça (Laterais):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBodyBackGlass("perfect")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    bodyBackGlass === "perfect"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">💎 Impecável (Sem Marcas)</span>
                    <span className="block text-[11px] text-[#6E6E73]">Traseira e bordas sem detalhes.</span>
                  </div>
                  {bodyBackGlass === "perfect" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setBodyBackGlass("light_scratches")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    bodyBackGlass === "light_scratches"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">✨ Marcas Leves de Capinha</span>
                    <span className="block text-[11px] text-[#6E6E73]">Micropontos normais de uso.</span>
                  </div>
                  {bodyBackGlass === "light_scratches" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setBodyBackGlass("cracked")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    bodyBackGlass === "cracked"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">🔨 Vidro Traseiro Trincado</span>
                    <span className="block text-[11px] text-[#6E6E73]">Trincas ou quebras no vidro posterior.</span>
                  </div>
                  {bodyBackGlass === "cracked" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setBodyBackGlass("heavy_dents")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    bodyBackGlass === "heavy_dents"
                      ? "bg-blue-50/80 border-[#0071E3] shadow-xs ring-1 ring-[#0071E3]/30"
                      : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
                  }`}
                >
                  <div>
                    <span className="block text-xs font-bold text-[#1D1D1F]">⚠️ Amassados ou Batidas</span>
                    <span className="block text-[11px] text-[#6E6E73]">Carcaça com marcas profundas.</span>
                  </div>
                  {bodyBackGlass === "heavy_dents" && <Check className="w-4 h-4 text-[#0071E3] shrink-0" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 7 — SENSORES & FUNCIONAMENTO
        ---------------------------------------------------- */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 7: Sensores e Funções</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Sensores, Câmeras e Conectores
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Se tudo estiver funcionando perfeitamente, avance com 1 clique!
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSensorsAllOk(true);
                setSelectedMalfunctions([]);
              }}
              className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                sensorsAllOk
                  ? "bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/30"
                  : "bg-white border-[#D2D2D7] hover:bg-[#F5F5F7]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sensorsAllOk ? "bg-emerald-600 text-white" : "bg-[#F5F5F7] text-[#1D1D1F]"}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-bold text-[#1D1D1F]">Tudo funcionando 100% perfeitamente!</span>
                  <span className="block text-xs text-[#6E6E73]">Face ID, câmeras (0.5x, 1x, zoom), conector de carga, Wi-Fi e som.</span>
                </div>
              </div>
              {sensorsAllOk && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSensorsAllOk(!sensorsAllOk)}
                className="text-xs font-semibold text-[#0071E3] hover:underline cursor-pointer block mb-3"
              >
                {!sensorsAllOk ? "Ocultar detalhes de avarias funcionais" : "Meu aparelho tem algum detalhe técnico (clique para informar)"}
              </button>

              {!sensorsAllOk && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-[#F5F5F7] rounded-2xl border border-[#D2D2D7]">
                  {[
                    { id: "face_id", label: "Face ID não funciona", sub: "Sensor TrueDepth inoperante" },
                    { id: "camera", label: "Câmera treme ou com manchas", sub: "Problema no foco / estabilizador" },
                    { id: "charging", label: "Conector de carga com mau contato", sub: "Não carrega ou posição específica" },
                    { id: "wifi", label: "Wi-Fi ou sinal com falha", sub: "Quedas de conexão frequentes" },
                  ].map((item) => {
                    const isChecked = selectedMalfunctions.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setSelectedMalfunctions(selectedMalfunctions.filter((x) => x !== item.id));
                          } else {
                            setSelectedMalfunctions([...selectedMalfunctions, item.id]);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                          isChecked
                            ? "bg-amber-50 border-amber-500 shadow-xs ring-1 ring-amber-500/30 text-amber-950"
                            : "bg-white border-[#D2D2D7] hover:bg-gray-100 text-[#1D1D1F]"
                        }`}
                      >
                        <div>
                          <span className="block text-xs font-bold">{item.label}</span>
                          <span className="block text-[10px] text-[#6E6E73]">{item.sub}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${isChecked ? "bg-amber-600 border-amber-600 text-white" : "border-gray-300 bg-white"}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 8 — DADOS DO CLIENTE & VISTORIA PRESENCIAL
        ---------------------------------------------------- */}
        {step === 8 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">Passo 8: Quase Lá!</span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1D1D1F]">
                Onde enviamos sua Proposta Oficial?
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6E73]">
                Preencha para calcularmos a volta exata e enviar o protocolo de atendimento.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">
                  Seu Nome Completo: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: João Silva"
                  className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">
                  WhatsApp com DDD: <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerWhatsapp}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1D1D1F] block mb-1">
                  CEP para entrega simultânea em SP (opcional):
                </label>
                <input
                  type="text"
                  value={customerCep}
                  onChange={handleCepChange}
                  placeholder="01001-000"
                  className="w-full px-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] focus:outline-hidden focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>
            </div>

            {/* Selo de Garantia e Vistoria Presencial */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Garantia de Avaliação sob Vistoria Presencial</span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
                No momento da entrega do seu novo aparelho com retirada do usado, nosso especialista realiza um teste rápido de 3 minutos (conferindo Face ID, originalidade da tela, bateria e remoção do iCloud). Estando tudo conforme informado, a troca é concluída imediatamente!
              </p>
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
                <span>Calculando Simulação de Troca...</span>
              </>
            ) : step === totalSteps ? (
              <>
                <span>Ver Avaliação</span>
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
