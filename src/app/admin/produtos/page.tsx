"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  Filter,
  Package,
  Power,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Sliders,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  ArrowDownCircle,
  Zap,
  LogOut,
  Layers,
  EyeOff,
  Eye,
  DollarSign,
  Edit3,
  X,
  Save,
  FileText,
  UploadCloud,
  Check,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils/formatters";
import { Product, ProductVariant } from "@/types/product";

const CATEGORIES = [
  { id: "all", name: "Todos os Produtos", icon: Layers },
  { id: "iphone", name: "iPhones Lacrados", icon: Smartphone },
  { id: "mac", name: "MacBooks & Mac", icon: Laptop },
  { id: "ipad", name: "iPads", icon: Tablet },
  { id: "watch", name: "Apple Watch", icon: Watch },
  { id: "airpods", name: "AirPods", icon: Headphones },
  { id: "accessories", name: "Acessórios", icon: Sparkles },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [conditionFilter, setConditionFilter] = useState<"new" | "used" | "all">("new");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Global Price Hiding ("Modo Sob Consulta")
  const [hideAllPrices, setHideAllPrices] = useState(false);
  const [loadingPriceMode, setLoadingPriceMode] = useState(false);

  // Modal de Edição de Valores do Produto Individual
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPriceFrom, setEditPriceFrom] = useState<number | string>("");
  const [editVariants, setEditVariants] = useState<ProductVariant[]>([]);
  const [savingPrices, setSavingPrices] = useState(false);

  // Modal de Importação em Massa (Colar Lista Oficial)
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [importing, setImporting] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      router.push("/admin/login");
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setHideAllPrices(Boolean(data.settings.hideAllPrices));
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
  };

  const handleToggleHideAllPrices = async () => {
    const nextVal = !hideAllPrices;
    const confirmMsg = nextVal
      ? "Tem certeza que deseja TIRAR TODOS OS VALORES DO AR?\n\nO site inteiro passará a exibir 'Sob Consulta' em todos os produtos, vitrine e simuladores de venda/upgrade, sem remover nenhum produto do catálogo."
      : "Deseja RESTAURAR a exibição de todos os valores no site?";

    if (!confirm(confirmMsg)) return;

    setLoadingPriceMode(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hideAllPrices: nextVal }),
      });
      const data = await res.json();
      if (data.success) {
        setHideAllPrices(nextVal);
        setFeedback({
          type: "success",
          text: data.message || (nextVal ? "Valores retirados do ar com sucesso!" : "Valores restaurados com sucesso!"),
        });
      } else {
        setFeedback({ type: "error", text: data.error || "Erro ao atualizar configuração." });
      }
    } catch (e: any) {
      setFeedback({ type: "error", text: "Erro ao comunicar com o servidor." });
    } finally {
      setLoadingPriceMode(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      } else {
        setFeedback({ type: "error", text: data.error || "Erro ao carregar catálogo." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Erro na conexão com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadSettings();
  }, []);

  const handleToggleProduct = async (product: Product) => {
    const newStatus = !product.active;
    setUpdatingId(product.id);
    setFeedback(null);

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: newStatus } : p))
    );

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          active: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: `"${product.name}" agora está ${newStatus ? "ATIVO no site" : "DESATIVADO no site"}.`,
        });
      } else {
        // Rollback
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, active: !newStatus } : p))
        );
        setFeedback({ type: "error", text: data.error || "Erro ao atualizar produto." });
      }
    } catch (e: any) {
      // Rollback
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: !newStatus } : p))
      );
      setFeedback({ type: "error", text: "Erro ao comunicar com o servidor." });
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Edit Price Modal
  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditPriceFrom(product.priceFrom || 0);
    setEditVariants(
      product.variants ? product.variants.map((v) => ({ ...v })) : []
    );
  };

  // Close Edit Price Modal
  const handleCloseEdit = () => {
    setEditingProduct(null);
    setEditPriceFrom("");
    setEditVariants([]);
  };

  // Save Product Prices
  const handleSavePrices = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSavingPrices(true);
    setFeedback(null);

    try {
      const numericPriceFrom = Number(editPriceFrom) || 0;
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: editingProduct.id,
          priceFrom: numericPriceFrom,
          variants: editVariants,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? data.product : p))
        );
        setFeedback({
          type: "success",
          text: `Valores de "${editingProduct.name}" atualizados com sucesso no site!`,
        });
        handleCloseEdit();
      } else {
        setFeedback({
          type: "error",
          text: data.error || "Erro ao salvar valores do produto.",
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Erro ao salvar alterações no servidor." });
    } finally {
      setSavingPrices(false);
    }
  };

  // Process Imported Catalog Text
  const handleImportCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) {
      alert("Por favor, cole o texto da lista antes de prosseguir.");
      return;
    }

    setImporting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/catalog/import-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalogText: importText }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: `Lista oficial processada com sucesso! ${data.stats.activeProducts} produtos ativados (${data.stats.variants} variantes com preços atualizados) e ${data.stats.deactivatedProducts} produtos ausentes desativados.`,
        });
        setImportModalOpen(false);
        setImportText("");
        await loadProducts();
      } else {
        setFeedback({
          type: "error",
          text: data.error || "Erro ao processar a lista enviada.",
        });
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: "Erro na conexão ao importar lista." });
    } finally {
      setImporting(false);
    }
  };

  // Toggle all in current category or view
  const handleBatchToggle = async (active: boolean) => {
    const categoryName =
      CATEGORIES.find((c) => c.id === selectedCategory)?.name || "selecionados";
    const confirmMsg = active
      ? `Tem certeza que deseja ATIVAR todos os produtos de "${categoryName}"? Eles ficarão visíveis para compra e upgrade no site.`
      : `Tem certeza que deseja DESATIVAR todos os produtos de "${categoryName}"? Eles ficarão ocultos no site e nas buscas.`;

    if (!confirm(confirmMsg)) return;

    setBatchLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batch: true,
          active,
          category: selectedCategory,
          condition: conditionFilter,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: `${data.affected} produtos foram ${active ? "ATIVADOS" : "DESATIVADOS"} com sucesso!`,
        });
        await loadProducts();
      } else {
        setFeedback({ type: "error", text: data.error || "Falha ao aplicar alteração em lote." });
      }
    } catch (e: any) {
      setFeedback({ type: "error", text: "Erro na comunicação ao atualizar lote." });
    } finally {
      setBatchLoading(false);
    }
  };

  // Filter products by category, search, status, and condition
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === "active" && !p.active) return false;
      if (statusFilter === "inactive" && p.active) return false;
      // Condition filter
      if (conditionFilter !== "all" && p.condition !== conditionFilter) {
        return false;
      }
      // Search term
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSub = p.subcategory?.toLowerCase().includes(q);
        const matchSlug = p.slug.toLowerCase().includes(q);
        return matchName || matchSub || matchSlug;
      }
      return true;
    });
  }, [products, selectedCategory, statusFilter, conditionFilter, search]);

  const activeCount = useMemo(() => products.filter((p) => p.active).length, [products]);
  const inactiveCount = useMemo(() => products.filter((p) => !p.active).length, [products]);

  return (
    <div className="pt-24 pb-20 bg-apple-gray/20 min-h-screen text-apple-dark">
      <Container size="large">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/vendas"
              className="p-2 bg-white rounded-xl border border-apple-border hover:bg-apple-gray transition-colors text-apple-dark"
              title="Voltar ao Painel Geral"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Produtos Novos Lacrados
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  CATÁLOGO OFICIAL
                </span>
              </div>
              <p className="text-xs md:text-sm text-apple-muted mt-0.5">
                Edite valores, atualize pela lista oficial diária e controle a ativação dos produtos no site.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setImportModalOpen(true)}
              className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Colar Lista Diária Oficial</span>
            </button>
            <Link
              href="/admin/vendas"
              className="px-3.5 py-2 bg-white border border-apple-border text-xs font-bold rounded-xl hover:bg-apple-gray transition-colors shadow-2xs"
            >
              Painel Geral
            </Link>
            <Link
              href="/admin/vendas/precos"
              className="px-3.5 py-2 bg-white border border-apple-border text-xs font-bold rounded-xl hover:bg-apple-gray transition-colors shadow-2xs"
            >
              Preços de Usados
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sair do painel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Master Box: MODO TIRAR TODOS OS VALORES DO AR */}
        <div
          className={`p-5 rounded-3xl border mb-6 transition-all shadow-sm ${
            hideAllPrices
              ? "bg-amber-500/10 border-amber-300 text-amber-950"
              : "bg-white border-apple-border/70 text-apple-dark"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`p-3 rounded-2xl shrink-0 ${
                  hideAllPrices ? "bg-amber-500 text-white shadow-sm" : "bg-apple-gray text-apple-dark"
                }`}
              >
                {hideAllPrices ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold tracking-tight">
                    Modo: Tirar Todos os Valores do Ar (Sob Consulta)
                  </h3>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      hideAllPrices
                        ? "bg-amber-200 text-amber-900 border border-amber-300 animate-pulse"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {hideAllPrices ? "MODO ATIVO: VALORES OCULTADOS" : "MODO NORMAL: PREÇOS VISÍVEIS"}
                  </span>
                </div>
                <p className="text-xs text-apple-muted mt-1 max-w-2xl leading-relaxed">
                  {hideAllPrices
                    ? "ATENÇÃO: Todos os valores numéricos do site inteiro estão ocultados. Os produtos continuam no ar, mas exibem 'Sob Consulta' com botão de direcionamento para o WhatsApp."
                    : "Ao ativar este modo, todos os preços do site (novos, usados, vitrine e simuladores) são substituídos por 'Sob Consulta' instantaneamente, mantendo os produtos no ar."}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleHideAllPrices}
              disabled={loadingPriceMode}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 ${
                hideAllPrices
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {loadingPriceMode ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : hideAllPrices ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4" />
              )}
              <span>
                {hideAllPrices
                  ? "Restaurar Todos os Valores no Site"
                  : "Tirar Todos os Valores do Ar Agora"}
              </span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl mb-6 flex items-start gap-3 border shadow-sm transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 text-xs md:text-sm font-medium">{feedback.text}</div>
            <button
              onClick={() => setFeedback(null)}
              className="text-current opacity-60 hover:opacity-100 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="p-4 bg-white rounded-2xl border border-apple-border/70 shadow-2xs">
            <span className="text-[11px] font-semibold text-apple-muted block mb-1">
              Total Cadastrado
            </span>
            <span className="text-2xl font-bold tracking-tight text-apple-dark">
              {products.length}
            </span>
            <span className="text-[10px] text-apple-muted block mt-1">
              Modelos no sistema
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-apple-border/70 shadow-2xs">
            <span className="text-[11px] font-semibold text-emerald-700 block mb-1">
              Ativos no Site
            </span>
            <span className="text-2xl font-bold tracking-tight text-emerald-600">
              {activeCount}
            </span>
            <span className="text-[10px] text-emerald-700/80 block mt-1">
              Visíveis para clientes
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-apple-border/70 shadow-2xs">
            <span className="text-[11px] font-semibold text-apple-muted block mb-1">
              Ocultos / Desativados
            </span>
            <span className="text-2xl font-bold tracking-tight text-apple-muted">
              {inactiveCount}
            </span>
            <span className="text-[10px] text-apple-muted block mt-1">
              Fora do ar
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-apple-border/70 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-apple-muted block">
              Ações Rápidas em Lote
            </span>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => handleBatchToggle(true)}
                disabled={batchLoading}
                className="flex-1 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] rounded-lg border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Power className="w-3 h-3" />
                <span>Ativar Todos</span>
              </button>
              <button
                onClick={() => handleBatchToggle(false)}
                disabled={batchLoading}
                className="flex-1 py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Power className="w-3 h-3" />
                <span>Ocultar Todos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-apple-border/70 mb-6 shadow-2xs space-y-4">
          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-apple-dark text-white shadow-sm"
                      : "bg-apple-gray/50 hover:bg-apple-gray text-apple-dark border border-apple-border/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-white text-apple-muted border border-apple-border/50"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search and Secondary Filters */}
          <div className="flex flex-col md:flex-row items-center gap-3 pt-2 border-t border-apple-border/40">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-apple-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por modelo, cor, capacidade..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-apple-gray/40 border border-apple-border/60 rounded-xl text-xs text-apple-dark focus:outline-none focus:border-[#0071E3] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-muted hover:text-apple-dark p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 w-full md:w-auto">
              <span className="text-[11px] font-semibold text-apple-muted whitespace-nowrap hidden lg:inline">
                Status:
              </span>
              <div className="inline-flex rounded-xl bg-apple-gray/50 p-0.5 border border-apple-border/40 text-xs font-medium w-full md:w-auto">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === "all"
                      ? "bg-white text-apple-dark shadow-2xs font-bold"
                      : "text-apple-muted hover:text-apple-dark"
                  }`}
                >
                  Todos ({products.length})
                </button>
                <button
                  onClick={() => setStatusFilter("active")}
                  className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === "active"
                      ? "bg-white text-emerald-600 shadow-2xs font-bold"
                      : "text-apple-muted hover:text-apple-dark"
                  }`}
                >
                  Ativos ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter("inactive")}
                  className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === "inactive"
                      ? "bg-white text-red-600 shadow-2xs font-bold"
                      : "text-apple-muted hover:text-apple-dark"
                  }`}
                >
                  Ocultos ({inactiveCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table / List */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-apple-border">
            <Loader2 className="w-8 h-8 animate-spin text-[#0071E3] mb-3" />
            <p className="text-xs text-apple-muted font-medium">Carregando catálogo completo...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-apple-border">
            <Package className="w-12 h-12 text-apple-muted/50 mx-auto mb-3" />
            <h3 className="text-base font-bold text-apple-dark">Nenhum produto encontrado</h3>
            <p className="text-xs text-apple-muted mt-1 max-w-sm mx-auto">
              Tente mudar o termo de busca ou selecione outra categoria nos filtros acima.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-apple-border/70 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-apple-border/60 bg-apple-gray/30 text-apple-muted uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3.5 px-4">Produto</th>
                    <th className="py-3.5 px-4 hidden sm:table-cell">Categoria</th>
                    <th className="py-3.5 px-4">Preço no Site</th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Variantes (Cores/Capacidades)</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border/40">
                  {filteredProducts.map((p) => {
                    const isUpdating = updatingId === p.id;
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-apple-gray/20 transition-colors ${
                          !p.active ? "opacity-60 bg-apple-gray/10" : ""
                        }`}
                      >
                        {/* Image & Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-11 bg-apple-gray/40 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-apple-border/40">
                              {p.image ? (
                                <Image
                                  src={p.image}
                                  alt={p.name}
                                  fill
                                  className="object-contain p-1"
                                  sizes="44px"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-apple-muted" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-apple-dark text-xs sm:text-sm block truncate">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-apple-muted block truncate">
                                {p.subcategory || p.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 hidden sm:table-cell">
                          <span className="capitalize text-apple-dark font-medium px-2 py-0.5 rounded-md bg-apple-gray/60 text-[11px]">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="text-[10px] text-apple-muted block">A partir de</span>
                            <span className="font-extrabold text-apple-dark text-xs sm:text-sm">
                              {formatCurrency(p.priceFrom || 0)}
                            </span>
                          </div>
                        </td>

                        {/* Variants Count */}
                        <td className="py-3.5 px-4 hidden md:table-cell">
                          <span className="text-apple-muted font-medium">
                            {p.variants && p.variants.length > 0
                              ? `${p.variants.length} combinações cadastradas`
                              : "Sem variantes"}
                          </span>
                        </td>

                        {/* Toggle Status */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleToggleProduct(p)}
                            disabled={isUpdating}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              p.active
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            } ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
                            title={p.active ? "Clique para ocultar do site" : "Clique para ativar no site"}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : p.active ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Power className="w-3 h-3 text-red-600" />
                            )}
                            <span>{p.active ? "Ativo" : "Oculto"}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-apple-gray/60 hover:bg-apple-gray text-apple-dark rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            title="Editar valores e variantes"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Editar</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Importação em Massa (Colar Lista Oficial) */}
        {importModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-apple-border w-full max-w-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-apple-border/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0071E3] flex items-center justify-center shrink-0">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-apple-dark">
                      Importar / Atualizar Catálogo via Lista Oficial
                    </h2>
                    <p className="text-xs text-apple-muted">
                      Cole o texto da lista diária completa abaixo para sincronizar todos os preços e variantes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setImportModalOpen(false)}
                  className="p-2 text-apple-muted hover:text-apple-dark rounded-xl hover:bg-apple-gray transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleImportCatalog} className="p-6 flex flex-col gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-apple-dark flex items-center justify-between">
                    <span>Texto da Lista Oficial (com seções e valores em R$)</span>
                    <span className="text-[11px] text-apple-muted font-normal">
                      Ex: IPHONES NOVOS, IPADS, MACBOOKS...
                    </span>
                  </label>
                  <textarea
                    rows={12}
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Cole aqui o texto completo da lista oficial enviada todos os dias..."
                    className="w-full p-4 font-mono text-xs bg-apple-gray/30 border border-apple-border/70 rounded-2xl focus:outline-none focus:border-[#0071E3] text-apple-dark resize-y"
                    required
                  />
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 text-blue-900 text-xs space-y-1 leading-relaxed">
                  <p className="font-bold">Como funciona a atualização:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-blue-800">
                    <li>Os produtos e capacidades presentes na lista terão seus valores atualizados ao centavo.</li>
                    <li>O valor "A partir de" será recalculado automaticamente para a menor opção ativa.</li>
                    <li>Qualquer produto ausente da lista será mantido no sistema, mas desativado do site público.</li>
                  </ul>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-apple-border/50">
                  <button
                    type="button"
                    onClick={() => setImportModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-apple-border text-xs font-bold text-apple-dark hover:bg-apple-gray transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={importing || !importText.trim()}
                    className="px-6 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {importing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>{importing ? "Processando Lista..." : "Atualizar Catálogo com a Lista"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Edição de Preços Individual */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl border border-apple-border w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-apple-border/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-apple-gray/50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-apple-border/50">
                    {editingProduct.image ? (
                      <Image
                        src={editingProduct.image}
                        alt={editingProduct.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-apple-muted" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-apple-dark">
                      Editar Valores: {editingProduct.name}
                    </h2>
                    <p className="text-xs text-apple-muted">
                      Altere o valor inicial ("A partir de") e os preços individuais por capacidade e cor.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseEdit}
                  className="p-2 text-apple-muted hover:text-apple-dark rounded-xl hover:bg-apple-gray transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleSavePrices} className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Master PriceFrom */}
                <div className="bg-apple-gray/30 p-4 rounded-2xl border border-apple-border/50">
                  <label className="block text-xs font-bold text-apple-dark mb-1">
                    Preço de Entrada ("A partir de") em R$
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-apple-muted">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      value={editPriceFrom}
                      onChange={(e) => setEditPriceFrom(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm font-bold text-apple-dark focus:outline-none focus:border-[#0071E3]"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Variants Editor */}
                {editVariants.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-apple-muted mb-3">
                      Preços por Opção / Capacidade / Cor
                    </h3>
                    <div className="space-y-2.5">
                      {editVariants.map((v, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-apple-border/70 rounded-xl hover:border-apple-border transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {v.storage && (
                              <span className="font-bold px-2 py-0.5 rounded bg-apple-gray text-apple-dark text-[11px]">
                                {v.storage}
                              </span>
                            )}
                            {v.screenSize && (
                              <span className="font-semibold px-2 py-0.5 rounded bg-apple-gray text-apple-dark text-[11px]">
                                {v.screenSize}
                              </span>
                            )}
                            {v.chip && (
                              <span className="font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 text-[10px]">
                                {v.chip}
                              </span>
                            )}
                            {v.ram && (
                              <span className="font-semibold px-1.5 py-0.5 rounded bg-apple-gray text-apple-muted text-[10px]">
                                {v.ram}
                              </span>
                            )}
                            {v.color && (
                              <span className="text-apple-dark font-medium truncate">
                                {v.color}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-apple-muted">R$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={v.price}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setEditVariants((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, price: val } : item
                                  )
                                );
                              }}
                              className="w-28 px-3 py-1.5 bg-apple-gray/20 border border-apple-border rounded-lg text-xs font-bold text-apple-dark text-right focus:outline-none focus:border-[#0071E3]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer */}
                <div className="pt-4 border-t border-apple-border/70 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-apple-muted hover:text-apple-dark hover:bg-apple-gray transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingPrices}
                    className="px-5 py-2.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {savingPrices ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Salvar Novos Valores</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
