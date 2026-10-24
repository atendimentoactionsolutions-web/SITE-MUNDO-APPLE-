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
  Sparkles,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { storeConfig } from "@/data/storeConfig";
import { formatCurrency } from "@/utils/formatters";
import { calculateInstallments } from "@/utils/installments";
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
  // 2 etapas de escolha do novo + 8 etapas idênticas ao SellWizard + Etapa 11 de Resultado/Dados
  const totalQuestionSteps = 10;
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

  useEffect(() => {
    const cat = searchParams.get("categoria");
    const prodName = searchParams.get("produto");
    const stgParam = searchParams.get("storage");
    const colParam = searchParams.get("cor");

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
        if (stgParam) setSelectedNewStorage(decodeURIComponent(stgParam));
        if (colParam) setSelectedNewColor(decodeURIComponent(colParam));
      }
    }
  }, [searchParams]);

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

  const availableColorsForStorage = useMemo(() => {
    if (!selectedNewProduct) return [];
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      const matching = selectedNewProduct.variants.filter(
        (v) => !selectedNewStorage || v.storage?.toLowerCase() === selectedNewStorage?.toLowerCase()
      );
      const colorsForStg = Array.from(
        new Set(matching.map((v) => v.color).filter(Boolean) as string[])
      );
      if (colorsForStg.length > 0) return colorsForStg;

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

  const selectedNewPrice = useMemo(() => {
    if (!selectedNewProduct) return 0;
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      let matched = selectedNewProduct.variants.find(
        (v) =>
          (!selectedNewStorage || v.storage?.toLowerCase() === selectedNewStorage.toLowerCase()) &&
          (!selectedNewColor || v.color?.toLowerCase() === selectedNewColor.toLowerCase())
      );
      if (!matched && selectedNewStorage) {
        matched = selectedNewProduct.variants.find(
          (v) => v.storage?.toLowerCase() === selectedNewStorage.toLowerCase()
        );
      }
      if (!matched && selectedNewColor) {
        matched = selectedNewProduct.variants.find(
          (v) => v.color?.toLowerCase() === selectedNewColor.toLowerCase()
        );
      }
      if (matched && matched.price > 0) return matched.price;
    }
    return selectedNewProduct.priceFrom || 0;
  }, [selectedNewProduct, selectedNewStorage, selectedNewColor]);

  // 2. Catálogo do Usado (Idêntico ao SellWizard)
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [modelSearch, setModelSearch] = useState("");

  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [loadingStorages, setLoadingStorages] = useState(false);

  // 3. Respostas do Usado (Exatamente iguais ao SellWizard)
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [batteryHealth, setBatteryHealth] = useState<string>("");
  const [screenCondition, setScreenCondition] = useState<string>("");
  const [backCondition, setBackCondition] = useState<string>("");
  const [sidesCondition, setSidesCondition] = useState<string>("");

  // Peças trocadas (Seleção direta de peças idêntica ao SellWizard)
  const [replacedPartsStatus, setReplacedPartsStatus] = useState<string>(""); // "no" | "yes"
  const [selectedReplacedParts, setSelectedReplacedParts] = useState<string[]>([]);

  // Triagem Crítica (Anti-Bucha idêntica ao SellWizard)
  const [boardStatus, setBoardStatus] = useState<string>(""); // "board_ok" | "board_issue"
  const [icloudStatus, setIcloudStatus] = useState<string>(""); // "unlocked" | "locked"

  // Dados do Cliente
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");

  // Cálculo Reativo + Cotação Final (Exatamente igual ao SellWizard)
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [calculationData, setCalculationData] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quotePublicCode, setQuotePublicCode] = useState("");

  // Lista ampliada de peças selecionáveis (Exatamente igual ao SellWizard)
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

  // Cálculo de Preço Reativo (Exatamente igual ao SellWizard)
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

  // Validação por etapa (Passos 3 a 11 espelham exatamente os Passos 1 a 9 do SellWizard)
  const isStepValid = useMemo(() => {
    switch (step) {
      case 1:
        return !!selectedNewProduct;
      case 2:
        return true;
      case 3:
        return !!selectedModel;
      case 4:
        return !!selectedStorage;
      case 5:
        return !!batteryHealth;
      case 6:
        return !!screenCondition;
      case 7:
        return !!backCondition;
      case 8:
        return !!sidesCondition;
      case 9:
        if (!replacedPartsStatus) return false;
        if (replacedPartsStatus === "yes" && selectedReplacedParts.length === 0) return false;
        return true;
      case 10:
        return icloudStatus === "unlocked";
      case 11:
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

  // Submit Final (Exatamente o mesmo payload do SellWizard + upgradeGoal)
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
          upgradeGoal: {
            category: selectedUpgradeCategory,
            productName: selectedNewProduct?.name,
            storage: selectedNewStorage,
            color: selectedNewColor,
            newPrice: selectedNewPrice,
          },
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
      if (data?.calculation?.finalPrice !== undefined) {
        setEstimatedPrice(data.calculation.finalPrice);
        setCalculationData(data.calculation);
      }
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

  // Rótulos de Resumo (sem emojis — idênticos ao SellWizard)
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
  }, [replacedPartsStatus, selectedReplacedParts]);

  const tradeInValue = estimatedPrice || 0;
  const targetPrice = selectedNewPrice || 0;
  const differenceToPay = Math.max(0, targetPrice - tradeInValue);
  const installments = differenceToPay > 0 ? calculateInstallments(differenceToPay) : [];
  const maxInstallment = installments.length > 0 ? installments[installments.length - 1] : null;

  const whatsappTradeInUrl = () => {
    const code = quotePublicCode || "COT-AVAL";
    const val = tradeInValue > 0 ? formatCurrency(tradeInValue) : "A combinar";
    const targetVal = targetPrice > 0 ? formatCurrency(targetPrice) : "Sob Consulta";
    const diffVal = formatCurrency(differenceToPay);
    const installmentLine =
      maxInstallment && differenceToPay > 0
        ? `\n- Ou em até 18x de ${formatCurrency(maxInstallment.installmentValue)} no cartão`
        : "";

    const message = `Olá Mundo Apple! Acabei de fazer uma simulação de Upgrade (Troca):

Código da Cotação: ${code}

APARELHO USADO (ENTRADA):
- Modelo: ${selectedModel?.name}
- Armazenamento: ${selectedStorage?.displayName}
- Saúde da Bateria: ${batteryHealthText}
- Condição da Tela: ${screenConditionText}
- Condição da Traseira: ${backConditionText}
- Condição das Laterais: ${sidesConditionText}
- Peças Trocadas: ${replacedPartsSummaryText}
- Placa-Mãe: 100% Original e Intacta
- iCloud e IMEI: Liberados para formatação
- Valor Pré-Avaliado: ${val}

PRODUTO NOVO DESEJADO:
- Modelo: ${selectedNewProduct?.name}
- Configuração: ${selectedNewStorage || ""}${selectedNewColor ? ` (${selectedNewColor})` : ""}
- Valor do Novo: ${targetVal}

VALOR DA DIFERENÇA (VOLTA A PAGAR):
- À vista no PIX: ${diffVal}${installmentLine}

DADOS DO CLIENTE:
- Nome: ${customerName.trim()}
- WhatsApp: ${customerWhatsapp.trim()}

CHECKLIST DE CONFERÊNCIA PRESENCIAL:
[ ] 1. Remover iCloud no ato da entrega
[ ] 2. Testar Face ID e Câmeras
[ ] 3. Checar aviso de Peça Desconhecida em Ajustes > Geral > Sobre
[ ] 4. Conferir integridade física dos vidros e carcaça

Gostaria de agendar a entrega e retirada simultânea em SP!`;

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
      {/* ── Card Principal Interativo ── */}
      <div className="bg-white rounded-3xl border border-[#E5E5E7] p-5 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative">
        {/* Barra de Progresso Superior (Passos 1 a 10) */}
        {step <= totalQuestionSteps && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between text-xs font-semibold text-[#86868B] mb-2">
              <span className="uppercase tracking-wider">
                Etapa {step} de {totalQuestionSteps}
              </span>
              <span className="text-[#0071E3] font-bold">
                {step === 1 && "1. Novo Desejado"}
                {step === 2 && "2. Configuração do Novo"}
                {step === 3 && "3. Modelo do Usado"}
                {step === 4 && "4. Armazenamento"}
                {step === 5 && "5. Saúde da Bateria"}
                {step === 6 && "6. Tela"}
                {step === 7 && "7. Traseira"}
                {step === 8 && "8. Laterais"}
                {step === 9 && "9. Peças Trocadas"}
                {step === 10 && "10. Bloqueios e Procedência"}
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

        {/* ── ETAPA 1: QUAL NOVO QUER COMPRAR ── */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">
                Passo 1: Novo Aparelho
              </span>
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
                      const pStorages =
                        p.variants && p.variants.length > 0
                          ? Array.from(
                              new Set(p.variants.map((v) => v.storage).filter(Boolean) as string[])
                            )
                          : p.storage || [];
                      const initialStorage = pStorages[0] || "";
                      setSelectedNewStorage(initialStorage);

                      const pColors =
                        p.variants && p.variants.length > 0
                          ? Array.from(
                              new Set(
                                p.variants
                                  .filter(
                                    (v) =>
                                      !initialStorage ||
                                      v.storage?.toLowerCase() === initialStorage.toLowerCase()
                                  )
                                  .map((v) => v.color)
                                  .filter(Boolean) as string[]
                              )
                            )
                          : p.colors || [];
                      setSelectedNewColor(pColors[0] || "");
                      setStep(2);
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
                          {p.priceFrom > 0
                            ? `A partir de ${formatCurrency(p.priceFrom)}`
                            : "Sob Consulta"}
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

        {/* ── ETAPA 2: CONFIGURAÇÃO DO NOVO ── */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0071E3] uppercase tracking-wider">
                Passo 2: Configuração do Novo
              </span>
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
                    const stgVariants =
                      selectedNewProduct?.variants?.filter(
                        (v) => v.storage?.toLowerCase() === stg.toLowerCase()
                      ) || [];
                    const minStgPrice =
                      stgVariants.length > 0
                        ? Math.min(...stgVariants.map((v) => v.price).filter((p) => p > 0))
                        : 0;

                    return (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => {
                          setSelectedNewStorage(stg);
                          if (stgVariants.length > 0) {
                            const colorsForThisStg = stgVariants
                              .map((v) => v.color)
                              .filter(Boolean) as string[];
                            if (
                              colorsForThisStg.length > 0 &&
                              !colorsForThisStg.some(
                                (c) => c.toLowerCase() === selectedNewColor.toLowerCase()
                              )
                            ) {
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
                          <span
                            className={`block text-[10px] mt-0.5 ${
                              isSel ? "text-blue-100 font-semibold" : "text-[#86868B]"
                            }`}
                          >
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
                <label className="text-xs font-semibold text-[#1D1D1F] block">Cor do Novo:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableColorsForStorage.map((col) => {
                    const isSel = selectedNewColor?.toLowerCase() === col.toLowerCase();
                    const colorHex = colorMap[col] || "#8E8E93";
                    const varForColor = selectedNewProduct?.variants?.find(
                      (v) =>
                        (!selectedNewStorage ||
                          v.storage?.toLowerCase() === selectedNewStorage.toLowerCase()) &&
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
                            <span
                              className={`text-xs font-bold ${
                                isSel ? "text-white" : "text-emerald-600"
                              }`}
                            >
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

        {/* ── ETAPA 3 (Igual Etapa 1 do Vender): MODELO ── */}
        {step === 3 && (
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

            {/* Grid de Modelos */}
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
                        setStep(4);
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

        {/* ── ETAPA 4 (Igual Etapa 2 do Vender): ARMAZENAMENTO (GB) ── */}
        {step === 4 && (
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
                        setStep(5);
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

        {/* ── ETAPA 5 (Igual Etapa 3 do Vender): PORCENTAGEM DA BATERIA ── */}
        {step === 5 && (
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
                      setStep(6);
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
                          isSelected
                            ? "bg-[#0071E3] border-[#0071E3] text-white"
                            : "border-[#D2D2D7]"
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

        {/* ── ETAPA 6 (Igual Etapa 4 do Vender): COMO ESTÁ A TELA? ── */}
        {step === 6 && (
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
          </div>
        )}

        {/* ── ETAPA 7 (Igual Etapa 5 do Vender): COMO ESTÁ A TRASEIRA? ── */}
        {step === 7 && (
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
                      setStep(8);
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
          </div>
        )}

        {/* ── ETAPA 8 (Igual Etapa 6 do Vender): COMO ESTÃO AS LATERAIS? ── */}
        {step === 8 && (
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
                      setStep(9);
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
          </div>
        )}

        {/* ── ETAPA 9 (Igual Etapa 7 do Vender): PEÇAS TROCADAS ── */}
        {step === 9 && (
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
                  setStep(10);
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
                  {replacedPartsStatus === "no" && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
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
                  {replacedPartsStatus === "yes" && (
                    <Check className="w-4 h-4 text-[#0071E3] shrink-0" />
                  )}
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
                      {selectedReplacedParts.length}{" "}
                      {selectedReplacedParts.length === 1
                        ? "peça selecionada"
                        : "peças selecionadas"}
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
                          <span
                            className={`block text-xs font-bold ${
                              isChecked ? "text-[#0071E3]" : "text-[#1D1D1F]"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span className="block text-[11px] text-[#6E6E73] mt-0.5">
                            {item.desc}
                          </span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChecked
                              ? "bg-[#0071E3] border-[#0071E3] text-white"
                              : "border-[#D2D2D7] bg-white"
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

        {/* ── ETAPA 10 (Igual Etapa 8 do Vender): TRIAGEM DE SEGURANÇA E PROCEDÊNCIA ── */}
        {step === 10 && (
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

        {/* ── ETAPA 11 (Igual Etapa 9 do Vender): RESULTADO & DADOS DO CLIENTE ── */}
        {step === 11 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {quoteSuccess ? (
              /* RESULTADO FINAL DE UPGRADE */
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Banner de confirmação WhatsApp */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 text-left">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Enviamos os dados e valores desta simulação de troca para o seu WhatsApp (
                    <strong>{customerWhatsapp}</strong>)!
                  </span>
                </div>

                {/* Cards: Seu Usado vs Novo Desejado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="p-4 rounded-2xl bg-[#F5F5F7] border border-[#D2D2D7] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#6E6E73] block">
                      Seu Usado (Entrada)
                    </span>
                    <div className="text-lg font-bold text-[#1D1D1F]">
                      {selectedModel?.name} {selectedStorage?.displayName}
                    </div>
                    <div className="text-xs text-emerald-700 font-bold">
                      Avaliado em: {tradeInValue > 0 ? formatCurrency(tradeInValue) : "Sob Consulta"}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#0071E3] block">
                      Novo Desejado (Lacrado)
                    </span>
                    <div className="text-lg font-bold text-[#1D1D1F]">
                      {selectedNewProduct?.name} {selectedNewStorage}
                    </div>
                    <div className="text-xs text-[#0071E3] font-bold">
                      {targetPrice > 0 ? `Valor: ${formatCurrency(targetPrice)}` : "Sob Consulta"}
                    </div>
                  </div>
                </div>

                {/* Diferença a Pagar */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1D1D1F] to-[#2D2D30] text-white space-y-3 text-center shadow-lg">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                    Valor da Diferença (Volta a Pagar):
                  </span>
                  <div className="text-3xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight font-display">
                    {calculating ? (
                      <span className="inline-flex items-center gap-2 text-xl font-semibold text-zinc-300">
                        <Loader2 className="w-5 h-5 animate-spin" /> Calculando proposta...
                      </span>
                    ) : (
                      formatCurrency(differenceToPay)
                    )}
                    {!calculating && (
                      <span className="text-lg sm:text-2xl text-emerald-300 font-bold ml-2">
                        no PIX
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300">
                    Com entrega do novo e retirada do usado simultânea em São Paulo e região!
                  </p>

                  {maxInstallment && differenceToPay > 0 && (
                    <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-zinc-300">
                      <CreditCard className="w-4 h-4 text-[#0071E3]" />
                      <span>
                        Ou em até{" "}
                        <strong className="text-white font-bold">
                          18x de {formatCurrency(maxInstallment.installmentValue)}
                        </strong>{" "}
                        no cartão
                      </span>
                    </div>
                  )}
                </div>

                {/* Resumo da Ficha (Igual ao SellWizard) */}
                <div className="p-4 bg-[#F5F5F7] rounded-2xl border border-[#E5E5E7] text-left space-y-2 text-xs">
                  <span className="font-bold text-[#1D1D1F] block text-xs uppercase tracking-wider">
                    Resumo da Avaliação Registrada ({quotePublicCode}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#6E6E73]">
                    <div>
                      - <strong>Aparelho Usado:</strong> {selectedModel?.name}{" "}
                      {selectedStorage?.displayName}
                    </div>
                    <div>
                      - <strong>Bateria:</strong> {batteryHealthText}
                    </div>
                    <div>
                      - <strong>Tela:</strong> {screenConditionText}
                    </div>
                    <div>
                      - <strong>Traseira:</strong> {backConditionText}
                    </div>
                    <div>
                      - <strong>Laterais:</strong> {sidesConditionText}
                    </div>
                    <div>
                      - <strong>Peças Trocadas:</strong> {replacedPartsSummaryText}
                    </div>
                    <div>
                      - <strong>iCloud e IMEI:</strong> 100% Liberados
                    </div>
                    <div>
                      - <strong>Valor de Avaliação:</strong>{" "}
                      {tradeInValue > 0 ? formatCurrency(tradeInValue) : "Sob Consulta"}
                    </div>
                  </div>
                </div>

                {/* Botão de Agendamento */}
                <div className="space-y-3 pt-2 text-center">
                  <a
                    href={whatsappTradeInUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Garantir Troca no WhatsApp</span>
                  </a>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      "Olha esse simulador de Upgrade da Mundo Apple! Dá pra calcular na hora quanto vale seu iPhone usado na troca por um novo lacrado: https://mundoappledelivery.com/troca"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] border border-[#D2D2D7] font-bold text-xs sm:text-sm rounded-full transition-all flex items-center justify-center gap-2"
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
              /* FORMULÁRIO DE CAPTURA (Idêntico ao SellWizard) */
              <div className="space-y-6">
                <div className="text-left space-y-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
                    Etapa Final: Seus Dados
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#1D1D1F] tracking-tight">
                    Para onde enviamos a sua avaliação?
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E6E73]">
                    Preencha seu nome e WhatsApp para visualizar o valor de avaliação do seu iPhone e a diferença exata da troca.
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
                      onClick={() => setStep(6)}
                      className="text-[11px] text-[#0071E3] font-semibold hover:underline"
                    >
                      Editar respostas
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-[#1D1D1F]">
                    <span className="px-2.5 py-1 bg-blue-50 text-[#0071E3] rounded-lg border border-blue-200">
                      Novo: {selectedNewProduct?.name} {selectedNewStorage}
                    </span>
                    <span className="px-2.5 py-1 bg-white rounded-lg border border-[#D2D2D7]">
                      Usado: {selectedModel?.name} {selectedStorage?.displayName}
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
                        onClick={() => setStep(10)}
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
                            <span>Liberar Avaliação de Troca</span>
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
                <strong>Garantia &amp; Segurança:</strong> O valor apresentado é uma pré-avaliação garantida com base nas informações fornecidas. A troca é concluída após conferência presencial no ato da entrega pelo nosso técnico credenciado.
              </p>
            </div>
          </div>
        )}

        {/* ── Barra de Navegação Inferior (Etapas 1 a 10) ── */}
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
                onClick={() => setStep((s) => Math.min(11, s + 1))}
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
