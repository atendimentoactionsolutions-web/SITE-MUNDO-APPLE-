"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  MessageCircle,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Package,
  CreditCard,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Sliders,
  BatteryCharging,
  Camera,
  Wifi,
  Volume2,
  Lock,
  Wrench,
  Layers,
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

const upgradeCategories = [
  { id: "iphone", label: "iPhones", icon: Smartphone },
  { id: "mac", label: "Mac & MacBooks", icon: Laptop },
  { id: "ipad", label: "iPads", icon: Tablet },
  { id: "watch", label: "Apple Watch", icon: Watch },
  { id: "airpods", label: "AirPods", icon: Headphones },
  { id: "accessories", label: "Acessórios", icon: Sparkles },
];

export const TradeInCalculator: React.FC = () => {
  const totalSteps = 11;
  const [step, setStep] = useState(1);

  // 1. Used Device Catalog
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [modelSearch, setModelSearch] = useState("");

  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [loadingStorages, setLoadingStorages] = useState(false);

  // Used Device Form State
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

  // 10. Histórico Tela, 11. Histórico Bateria & 12. Outros Reparos
  const [screenHistory, setScreenHistory] = useState<string>("original");
  const [batteryHistory, setBatteryHistory] = useState<string>("never");
  const [otherRepairs, setOtherRepairs] = useState<string[]>(["none"]);

  // 2. Desired New Sealed Product for Upgrade (ONLY NEW)
  const [selectedUpgradeCategory, setSelectedUpgradeCategory] = useState<string>("iphone");

  const newProductsInCategory = useMemo(() => {
    return products.filter(
      (p) =>
        p.category.toLowerCase() === selectedUpgradeCategory.toLowerCase() &&
        p.condition === "new" &&
        p.active
    );
  }, [selectedUpgradeCategory]);

  const [selectedNewProduct, setSelectedNewProduct] = useState<Product>(
    newProductsInCategory[0] || products[0]
  );
  const [selectedNewSize, setSelectedNewSize] = useState<string>("");
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
    if (newProductsInCategory.length > 0) {
      const prodName = searchParams.get("produto");
      if (prodName) {
        const decoded = decodeURIComponent(prodName).toLowerCase();
        const found = newProductsInCategory.find((p) => p.name.toLowerCase() === decoded);
        if (found) {
          setSelectedNewProduct(found);
          return;
        }
      }
      const first = newProductsInCategory[0];
      setSelectedNewProduct(first);
    }
  }, [selectedUpgradeCategory, newProductsInCategory, searchParams]);

  // Derived options for selected new product
  const selectedProductSizes = useMemo(() => {
    if (!selectedNewProduct) return [];
    if (selectedNewProduct.sizes && selectedNewProduct.sizes.length > 0) {
      return selectedNewProduct.sizes;
    }
    if (selectedNewProduct.screenSizes && selectedNewProduct.screenSizes.length > 0) {
      return selectedNewProduct.screenSizes;
    }
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      const set = new Set(
        selectedNewProduct.variants
          .map((v) => v.size || v.screenSize)
          .filter(Boolean) as string[]
      );
      return Array.from(set);
    }
    return [];
  }, [selectedNewProduct]);

  const selectedProductStorages = useMemo(() => {
    if (!selectedNewProduct) return [];
    if (selectedNewProduct.storage && selectedNewProduct.storage.length > 0) {
      return selectedNewProduct.storage;
    }
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      const set = new Set(
        selectedNewProduct.variants.map((v) => v.storage).filter(Boolean) as string[]
      );
      return Array.from(set);
    }
    return [];
  }, [selectedNewProduct]);

  const selectedProductColors = useMemo(() => {
    if (!selectedNewProduct) return [];
    if (selectedNewProduct.colors && selectedNewProduct.colors.length > 0) {
      return selectedNewProduct.colors;
    }
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      const set = new Set(
        selectedNewProduct.variants.map((v) => v.color).filter(Boolean) as string[]
      );
      return Array.from(set);
    }
    return [];
  }, [selectedNewProduct]);

  useEffect(() => {
    if (selectedNewProduct) {
      setSelectedNewSize(selectedProductSizes[0] || "");
      setSelectedNewStorage(selectedProductStorages[0] || "");
      setSelectedNewColor(selectedProductColors[0] || "");
    }
  }, [selectedNewProduct, selectedProductSizes, selectedProductStorages, selectedProductColors]);

  const currentNewPrice = useMemo(() => {
    if (!selectedNewProduct) return 0;
    if (selectedNewProduct.variants && selectedNewProduct.variants.length > 0) {
      const directMatch = selectedNewProduct.variants.find((v) => {
        const vSize = v.size || v.screenSize || "";
        if (selectedNewSize && vSize && vSize !== selectedNewSize) return false;
        if (selectedNewStorage && v.storage && v.storage !== selectedNewStorage) return false;
        if (selectedNewColor && v.color && v.color !== selectedNewColor) return false;
        return true;
      });
      if (directMatch) return directMatch.price;

      const partialMatch = selectedNewProduct.variants.find((v) => {
        const vSize = v.size || v.screenSize || "";
        if (selectedNewSize && vSize && vSize !== selectedNewSize) return false;
        if (selectedNewStorage && v.storage && v.storage !== selectedNewStorage) return false;
        return true;
      });
      if (partialMatch) return partialMatch.price;

      if (selectedNewStorage) {
        const stgMatch = selectedNewProduct.variants.find((v) => v.storage === selectedNewStorage);
        if (stgMatch) return stgMatch.price;
      }

      return selectedNewProduct.variants[0].price;
    }
    return selectedNewProduct.priceFrom || 0;
  }, [selectedNewProduct, selectedNewSize, selectedNewStorage, selectedNewColor]);

  // 3. Customer Data
  const [customerName, setCustomerName] = useState("");
  const [customerWhatsapp, setCustomerWhatsapp] = useState("");
  const [customerCep, setCustomerCep] = useState("");

  // 4. Submission & Result State
  const [submitting, setSubmitting] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{
    publicCode: string;
    finalPrice: number;
    basePrice: number;
    calculation?: any;
  } | null>(null);

  const [paymentMode, setPaymentMode] = useState<"pix" | "card">("pix");
  const [selectedInstallmentCount, setSelectedInstallmentCount] = useState<number>(12);

  // Load catalog
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

  // Load storages when model selected
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

  // Input masks
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

  // Step Validation
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
        return !!selectedNewProduct;
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
    selectedNewProduct,
    currentNewPrice,
    customerName,
    customerWhatsapp,
  ]);

  // Calculate Price API
  const handleCalculate = async () => {
    if (!selectedModel || !selectedStorage) return;

    try {
      setSubmitting(true);
      const answersPayload = {
        deviceColor: deviceColor.trim() || "Cor não especificada",
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
        upgradeGoal: {
          category: selectedUpgradeCategory,
          productName: selectedNewProduct.name,
          productSize: selectedNewSize,
          productStorage: selectedNewStorage,
          productColor: selectedNewColor,
          productPrice: currentNewPrice,
        },
      };

      const res = await fetch("/api/sell/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceModelId: selectedModel.id,
          storageOptionId: selectedStorage.id,
          answers: answersPayload,
        }),
      });

      const data = await res.json();
      if (data.success && data.calculation) {
        const chars = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
        let randCode = "";
        for (let i = 0; i < 6; i++) {
          randCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setQuoteResult({
          publicCode: `UPG-${randCode}`,
          finalPrice: data.calculation.finalPrice || 0,
          basePrice: data.calculation.basePrice || 0,
          calculation: data.calculation,
        });
      } else {
        alert("Erro ao calcular cotação. Tente novamente.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Falha de conexão ao calcular. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleCalculate();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleReset = () => {
    setQuoteResult(null);
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
    setCustomerName("");
    setCustomerWhatsapp("");
    setCustomerCep("");
    setSelectedUpgradeCategory("iphone");
  };

  const tradeInCredit = quoteResult ? quoteResult.finalPrice : 0;
  const differenceToPay = Math.max(0, currentNewPrice - tradeInCredit);

  const installmentOptions = useMemo(() => {
    return calculateInstallments(differenceToPay);
  }, [differenceToPay]);

  const activeInstallment = useMemo(() => {
    return (
      installmentOptions.find((opt) => opt.installments === selectedInstallmentCount) ||
      installmentOptions[11] ||
      installmentOptions[0]
    );
  }, [installmentOptions, selectedInstallmentCount]);

  const whatsappUrl = useMemo(() => {
    if (!quoteResult || !selectedModel || !selectedStorage || !selectedNewProduct) return "#";

    const code = quoteResult.publicCode;
    const creditFormatted = formatCurrency(tradeInCredit);
    const newPriceFormatted = currentNewPrice > 0 ? formatCurrency(currentNewPrice) : "Sob Consulta (Pré-venda / Lançamento)";
    const differenceFormatted = currentNewPrice > 0 ? formatCurrency(differenceToPay) : "A confirmar com valor de lançamento";

    const specsDetails = [selectedNewSize, selectedNewStorage, selectedNewColor]
      .filter(Boolean)
      .join(" · ");

    const paymentText =
      paymentMode === "pix"
        ? `À vista no Pix: ${differenceFormatted}`
        : activeInstallment
        ? `${activeInstallment.installments}x no Cartão: ${activeInstallment.installments}x de ${formatCurrency(activeInstallment.installmentValue)} (Total: ${formatCurrency(activeInstallment.totalValue)})`
        : `À vista no Pix: ${differenceFormatted}`;

    const message = `Olá! Simulei meu UPGRADE pelo site Mundo Apple Delivery:

Código da Cotação: ${code}

📱 MEU APARELHO ATUAL (ENTRADA):
• Modelo: ${selectedModel.name}
• Armazenamento: ${selectedStorage.displayName}
• Cor: ${deviceColor.trim() || "Não informada"}
• Funcionamento: ${powerOnStatus === "normal" ? "Liga e funciona 100%" : powerOnStatus}
• Bateria: ${batteryHealth === "good" ? "85% a 100%" : batteryHealth === "below_85" ? "Abaixo de 85%" : "Manutenção"}
• iCloud: ${icloudStatus === "unlocked" ? "Desbloqueado" : "Bloqueado"}
• Avaliação de entrada: ${creditFormatted}

✨ NOVO PRODUTO LACRADO DESEJADO:
• Categoria: ${selectedUpgradeCategory.toUpperCase()}
• Modelo: ${selectedNewProduct.name} ${specsDetails ? `(${specsDetails})` : ""}
• Valor oficial lacrado: ${newPriceFormatted}

💰 VOLTA NO UPGRADE:
👉 ${differenceFormatted}
💳 Condição: ${paymentText}

Nome: ${customerName.trim()}
WhatsApp: ${customerWhatsapp.trim()}
CEP/Cidade: ${customerCep.trim() || "Não informado"}

Gostaria de falar com um especialista sobre meu upgrade!`;

    return `https://wa.me/${storeConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
  }, [
    quoteResult,
    selectedModel,
    selectedStorage,
    selectedUpgradeCategory,
    selectedNewProduct,
    selectedNewSize,
    selectedNewStorage,
    selectedNewColor,
    currentNewPrice,
    tradeInCredit,
    differenceToPay,
    paymentMode,
    activeInstallment,
    deviceColor,
    powerOnStatus,
    batteryHealth,
    icloudStatus,
    customerName,
    customerWhatsapp,
    customerCep,
  ]);

  // ----------------------------------------------------
  // RESULT SCREEN
  // ----------------------------------------------------
  if (quoteResult) {
    const isBlocked = quoteResult.calculation?.blocked;
    const isManual = quoteResult.calculation?.manualReview;

    return (
      <div className="w-full max-w-3xl mx-auto py-4 px-4 sm:px-0 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-apple-border space-y-8 text-center">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-inner ${
              isBlocked ? "bg-red-50 text-red-600" : isManual ? "bg-amber-50 text-amber-600" : "bg-apple-blue/10 text-apple-blue"
            }`}>
              {isBlocked ? <AlertCircle className="w-8 h-8" /> : isManual ? <ShieldCheck className="w-8 h-8" /> : <RefreshCw className="w-8 h-8" />}
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-apple-gray text-xs font-semibold text-apple-dark border border-apple-border">
              <span>Cotação de Upgrade:</span>
              <strong className="text-apple-blue font-bold tracking-wider">{quoteResult.publicCode}</strong>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-apple-dark">
              {isBlocked ? "Aparelho Não Aceito para Compra / Troca" : "Simulação de Upgrade Concluída!"}
            </h2>
            <p className="text-xs sm:text-sm text-apple-muted max-w-md">
              {isBlocked
                ? "Identificamos restrição de ativação ou bloqueio de iCloud no aparelho informado."
                : isManual
                ? "Devido às características técnicas informadas, seu aparelho é elegível para avaliação técnica presencial especializada."
                : "Confira a avaliação do seu aparelho, o valor oficial do novo lacrado e simule o pagamento da volta."}
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
            <div className="bg-gradient-to-br from-[#F5F5F7] via-white to-[#F5F5F7] rounded-3xl p-5 sm:p-8 border border-apple-border shadow-sm space-y-6 text-left">
              {/* Box Entrada vs Novo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-apple-border/70">
                {/* Box Entrada */}
                <div className="bg-white rounded-2xl p-5 border border-apple-border/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-apple-muted uppercase tracking-wider">
                    <Smartphone className="w-4 h-4 text-apple-blue" />
                    <span>Seu Aparelho Atual (Entrada)</span>
                  </div>
                  <div className="font-bold text-apple-dark text-base sm:text-lg">
                    {selectedModel?.name} · {selectedStorage?.displayName}
                  </div>
                  <div className="text-xs text-apple-muted">
                    Cor: {deviceColor || "Padrão"}
                  </div>
                  <div className="pt-2">
                    <span className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wider block">
                      Avaliação de Entrada:
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                      {formatCurrency(tradeInCredit)}
                    </div>
                  </div>
                </div>

                {/* Box Novo */}
                <div className="bg-white rounded-2xl p-5 border border-apple-border/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-apple-muted uppercase tracking-wider">
                    <Package className="w-4 h-4 text-purple-600" />
                    <span>Novo Lacrado Desejado</span>
                  </div>
                  <div className="font-bold text-apple-dark text-base sm:text-lg">
                    {selectedNewProduct.name}
                    {selectedNewStorage ? ` · ${selectedNewStorage}` : ""}
                    {selectedNewSize ? ` · ${selectedNewSize}` : ""}
                  </div>
                  <div className="text-xs text-apple-muted">
                    {selectedNewColor ? `Cor: ${selectedNewColor} · ` : ""}1 Ano Garantia Apple Oficial
                  </div>
                  <div className="pt-2">
                    <span className="text-[11px] text-apple-muted font-semibold uppercase tracking-wider block">
                      Valor Oficial Lacrado:
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-apple-dark">
                      {currentNewPrice > 0 ? formatCurrency(currentNewPrice) : "Sob Consulta (Lançamento)"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Volta a Pagar */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-apple-border shadow-sm space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-apple-border/60">
                  <div>
                    <span className="text-[11px] font-bold text-apple-muted uppercase tracking-wider block">
                      Quanto você dará de volta no Upgrade:
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-apple-dark tracking-tight">
                      {currentNewPrice > 0 ? formatCurrency(differenceToPay) : "A confirmar no lançamento"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode("pix")}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                        paymentMode === "pix"
                          ? "bg-apple-dark text-white shadow"
                          : "bg-apple-gray text-apple-dark hover:bg-apple-gray/70"
                      }`}
                    >
                      À Vista no Pix
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode("card")}
                      className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                        paymentMode === "card"
                          ? "bg-apple-dark text-white shadow"
                          : "bg-apple-gray text-apple-dark hover:bg-apple-gray/70"
                      }`}
                    >
                      Cartão em até 18x
                    </button>
                  </div>
                </div>

                {paymentMode === "pix" ? (
                  <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                      PIX
                    </div>
                    <div>
                      <div className="font-bold text-emerald-900 text-sm">
                        Economia máxima garantida no Pix à vista
                      </div>
                      <div className="text-xs text-emerald-700">
                        Pague apenas a volta de {formatCurrency(differenceToPay)} na entrega em mãos.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-apple-dark uppercase tracking-wider">
                        Escolha o número de parcelas:
                      </span>
                      <span className="text-xs font-medium text-apple-muted">Taxa oficial da máquina</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {installmentOptions.map((opt) => {
                        const isSelected = selectedInstallmentCount === opt.installments;
                        return (
                          <button
                            key={opt.installments}
                            type="button"
                            onClick={() => setSelectedInstallmentCount(opt.installments)}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? "bg-apple-blue/10 border-apple-blue shadow-sm"
                                : "bg-white border-apple-border hover:bg-apple-gray/40"
                            }`}
                          >
                            <div className="font-extrabold text-sm text-apple-dark">
                              {opt.installments}x de {formatCurrency(opt.installmentValue)}
                            </div>
                            <div className="text-[10px] text-apple-muted">
                              Total: {formatCurrency(opt.totalValue)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                <span>Enviar Simulação pelo WhatsApp</span>
              </a>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              className="py-4 px-6 rounded-2xl font-bold border-apple-border text-apple-dark hover:bg-apple-gray transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Nova Simulação</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Helper Option Card Component
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
            ETAPA 1 — MODELO DO APARELHO ATUAL
        ---------------------------------------------------- */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 1: Aparelho Atual</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Qual o modelo do seu iPhone atual?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Selecione o modelo do aparelho que você dará como entrada no Upgrade.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-apple-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Buscar modelo (ex: iPhone 13 Pro, iPhone 15...)"
                className="w-full pl-11 pr-4 py-3.5 bg-apple-gray/40 rounded-2xl text-sm font-medium border border-apple-border focus:border-apple-blue focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {loadingCatalog ? (
              <div className="py-12 flex flex-col items-center justify-center text-apple-muted space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
                <span className="text-xs font-medium">Carregando catálogo de iPhones...</span>
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
                Informe o armazenamento interno e a cor do aparelho de entrada.
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
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 3: Inicialização & Conta</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Como está o funcionamento inicial e conta iCloud?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                1. Funcionamento Inicial &amp; Bloqueio de iCloud da Tabela Oficial.
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
                Avalie o vidro exterior e a imagem interna do display separadamente.
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
                  subtitle="Apenas marcas superficiais contra a luz."
                />
                <OptionRadioCard
                  selected={screenGlass === "moderate_scratches"}
                  onClick={() => setScreenGlass("moderate_scratches")}
                  title="Arranhões moderados"
                  subtitle="Visíveis com tela acesa."
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
                subtitle="Fissuras, trincos nos cantos ou estilhaçado."
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
                  title="Perfeita, cores e brilho normais"
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
                  subtitle="Pequenos pontinhos pretos fixos na tela."
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
                  subtitle="Aparelho vibra/toca mas a tela fica totalmente preta."
                />
              </div>

              <div className="p-3 bg-apple-gray/50 rounded-xl text-[11px] text-apple-muted flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-apple-blue flex-shrink-0" />
                <span>
                  <strong>Regra de Proteção ao Cliente:</strong> Se o vidro e o display necessitarem de reparo juntos, aplicamos apenas o maior abatimento da troca do módulo, sem somar duplamente.
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
                Avalie o acabamento estético do vidro traseiro e do chassi.
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
                  subtitle="Pequenas marcas normais de capinha."
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
                  subtitle="Vidro estilhaçado ou com pedaços soltos."
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
                  subtitle="Chassi entortado ou desnivelado."
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
                Avaliação dos sensores frontal, traseiros, lentes e biometria facial.
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
                  title="Funcionam perfeitamente (0.5x, 1x, Zoom)"
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
                  subtitle="Desbloqueia na velocidade original."
                />
                <OptionRadioCard
                  selected={faceId === "glitches"}
                  onClick={() => setFaceId("glitches")}
                  title="Apresenta falhas intermitentes"
                  subtitle="Dificuldade frequente para ler ou cadastrar o rosto."
                />
                <OptionRadioCard
                  selected={faceId === "broken"}
                  onClick={() => setFaceId("broken")}
                  title="Não funciona"
                  subtitle="Aviso de Face ID desativado nas configurações."
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
                  subtitle="Bateria desgastada pelo ciclo normal de uso."
                />
                <OptionRadioCard
                  selected={batteryHealth === "service_unknown"}
                  onClick={() => setBatteryHealth("service_unknown")}
                  title="Mensagem de manutenção / Não é possível consultar a saúde"
                  subtitle="Aviso de manutenção ou peça desconhecida."
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
                  subtitle="Conexão firme e estável ao plugar o cabo."
                />
                <OptionRadioCard
                  selected={charging === "specific_positions"}
                  onClick={() => setCharging("specific_positions")}
                  title="Carrega apenas em determinadas posições"
                  subtitle="Precisa dobrar ou pressionar o cabo para engatar."
                />
                <OptionRadioCard
                  selected={charging === "bad_contact"}
                  onClick={() => setCharging("bad_contact")}
                  title="Apresenta mau contato frequente"
                  subtitle="Fica conectando e desconectando."
                />
                <OptionRadioCard
                  selected={charging === "broken"}
                  onClick={() => setCharging("broken")}
                  title="Não carrega"
                  subtitle="Nenhuma reação ao colocar na tomada."
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
                  title="Quedas frequentes / sinal fraco"
                />
                <OptionRadioCard
                  selected={networkWifi === "broken"}
                  onClick={() => setNetworkWifi("broken")}
                  title="Não ativa ou não conecta"
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
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 9: Histórico de Manutenção</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                O aparelho já passou por trocas de peças ou reparos?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Consulte em Ajustes &gt; Geral &gt; Sobre &gt; Histórico de Peças e Serviço.
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
            ETAPA 10 — ESCOLHA DO NOVO LACRADO (UPGRADE)
        ---------------------------------------------------- */}
        {step === 10 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Passo 10: Novo Aparelho</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Qual produto Apple lacrado você quer pegar?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Selecione a categoria e o modelo 100% novo com 1 ano de garantia Apple.
              </p>
            </div>

            {/* Category Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {upgradeCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedUpgradeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedUpgradeCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold flex-shrink-0 transition-all ${
                      isSelected
                        ? "bg-apple-dark text-white shadow-md"
                        : "bg-apple-gray text-apple-dark hover:bg-apple-gray/70"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Products in selected Category */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-apple-muted uppercase tracking-wider">
                Selecione o Modelo Lacrado
              </label>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {newProductsInCategory.map((prod) => {
                  const isSelected = selectedNewProduct?.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setSelectedNewProduct(prod)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? "bg-purple-50 border-purple-500 shadow-sm"
                          : "bg-white border-apple-border hover:bg-apple-gray/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-apple-gray flex items-center justify-center text-apple-dark overflow-hidden relative">
                          {prod.image ? (
                            <Image
                              src={prod.image}
                              alt={prod.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-apple-muted" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-apple-dark text-sm block">
                            {prod.name}
                          </span>
                          <span className="text-xs text-apple-muted">
                            A partir de {formatCurrency(prod.priceFrom)}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "border-apple-border bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variants of the selected product */}
            {selectedNewProduct && (
              <div className="p-4 bg-apple-gray/40 rounded-2xl border border-apple-border space-y-4">
                {/* Storage */}
                {selectedProductStorages.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-apple-muted uppercase tracking-wider">
                      Armazenamento:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProductStorages.map((stg) => (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => setSelectedNewStorage(stg)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            selectedNewStorage === stg
                              ? "bg-apple-dark text-white border-apple-dark"
                              : "bg-white text-apple-dark border-apple-border hover:bg-apple-gray"
                          }`}
                        >
                          {stg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {selectedProductSizes.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-apple-muted uppercase tracking-wider">
                      Tamanho / Caixa:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProductSizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedNewSize(sz)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            selectedNewSize === sz
                              ? "bg-apple-dark text-white border-apple-dark"
                              : "bg-white text-apple-dark border-apple-border hover:bg-apple-gray"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                {selectedProductColors.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-apple-muted uppercase tracking-wider">
                      Cor Desejada:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProductColors.map((clr) => (
                        <button
                          key={clr}
                          type="button"
                          onClick={() => setSelectedNewColor(clr)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            selectedNewColor === clr
                              ? "bg-apple-dark text-white border-apple-dark"
                              : "bg-white text-apple-dark border-apple-border hover:bg-apple-gray"
                          }`}
                        >
                          {clr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-apple-border/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-apple-dark">Valor Oficial Lacrado:</span>
                  <span className="text-lg font-extrabold text-apple-dark">
                    {currentNewPrice > 0 ? formatCurrency(currentNewPrice) : "Sob Consulta (Lançamento)"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            ETAPA 11 — DADOS DO CLIENTE & CALCULAR
        ---------------------------------------------------- */}
        {step === 11 && (
          <div className="space-y-6 animate-in fade-in duration-200 text-left">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-apple-blue uppercase tracking-wider">Passo 11: Seus Dados</span>
              <h2 className="text-xl sm:text-2xl font-bold text-apple-dark">
                Onde enviamos a sua simulação oficial?
              </h2>
              <p className="text-xs sm:text-sm text-apple-muted">
                Preencha seus dados para emitir o código exclusivo de Trade-In e falar com nossa equipe.
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

            <div className="p-4 bg-apple-gray/50 rounded-2xl border border-apple-border flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="text-xs text-apple-muted">
                Garantimos total sigilo e proteção dos seus dados sob as diretrizes da LGPD.
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
                Calculando Cotação...
              </span>
            ) : step === totalSteps ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Calcular Trade-In &amp; Ver Oferta
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
