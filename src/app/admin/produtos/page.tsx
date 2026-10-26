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
  LogOut,
  Layers,
  EyeOff,
  Eye,
  DollarSign,
  Edit3,
  X,
  Save,
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

  // Modal de Edição de Valores do Produto
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPriceFrom, setEditPriceFrom] = useState<number | string>("");
  const [editVariants, setEditVariants] = useState<ProductVariant[]>([]);
  const [savingPrices, setSavingPrices] = useState(false);

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
    } catch (e) {
      setFeedback({ type: "error", text: "Erro ao comunicar com o servidor." });
    } finally {
      setLoadingPriceMode(false);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      } else {
        setFeedback({ type: "error", text: data.error || "Erro ao carregar produtos." });
      }
    } catch (e: any) {
      setFeedback({ type: "error", text: "Erro na conexão ao carregar produtos." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadSettings();
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Condition filter (default "new" = produtos novos lacrados)
      if (conditionFilter !== "all" && p.condition !== conditionFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all") {
        const cat = selectedCategory.toLowerCase();
        const normCat = cat === "acessorios" ? "accessories" : cat;
        if (p.category.toLowerCase() !== normCat) return false;
      }

      // Status filter
      if (statusFilter === "active" && !p.active) return false;
      if (statusFilter === "inactive" && p.active) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q);
        const subMatch = p.subcategory?.toLowerCase().includes(q);
        const slugMatch = p.slug?.toLowerCase().includes(q);
        if (!nameMatch && !subMatch && !slugMatch) return false;
      }

      return true;
    });
  }, [products, conditionFilter, selectedCategory, statusFilter, search]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, { total: number; active: number }> = {};
    CATEGORIES.forEach((cat) => {
      counts[cat.id] = { total: 0, active: 0 };
    });

    products.forEach((p) => {
      if (conditionFilter !== "all" && p.condition !== conditionFilter) return;

      // "all"
      counts["all"].total++;
      if (p.active) counts["all"].active++;

      const catId = p.category.toLowerCase();
      if (counts[catId]) {
        counts[catId].total++;
        if (p.active) counts[catId].active++;
      }
    });

    return counts;
  }, [products, conditionFilter]);

  // Toggle single product active
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
                Edite valores, preços por cor e capacidade, e controle a ativação dos aparelhos no site.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
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
            <div className="flex-1 text-sm font-medium">{feedback.text}</div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100 ml-2"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Category Filter Tabs */}
        <div className="bg-white rounded-2xl border border-apple-border/50 p-2 shadow-2xs mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || { total: 0, active: 0 };
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-apple-dark text-white shadow-sm"
                      : "text-apple-muted hover:text-apple-dark hover:bg-apple-gray/50"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-apple-gray text-apple-muted"
                    }`}
                  >
                    {count.active}/{count.total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls & Batch Operations */}
        <div className="bg-white rounded-2xl border border-apple-border/50 p-4 shadow-2xs mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-apple-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, modelo, série..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-apple-gray/40 border border-apple-border/70 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-apple-blue/30"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-apple-gray/40 border border-apple-border/70 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-apple-blue/30 cursor-pointer"
              >
                <option value="all">Status: Todos</option>
                <option value="active">Somente Ativos</option>
                <option value="inactive">Somente Desativados</option>
              </select>

              <select
                value={conditionFilter}
                onChange={(e: any) => setConditionFilter(e.target.value)}
                className="px-3 py-2 bg-apple-gray/40 border border-apple-border/70 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-apple-blue/30 cursor-pointer"
              >
                <option value="new">Novos Lacrados</option>
                <option value="used">Seminovos / Usados</option>
                <option value="all">Todas as Condições</option>
              </select>
            </div>
          </div>

          {/* Master Batch Buttons */}
          <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-apple-border/50">
            <button
              onClick={() => handleBatchToggle(false)}
              disabled={batchLoading}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
              title="Desativar todos da categoria atual"
            >
              <Power className="w-3.5 h-3.5 text-red-600" />
              <span>Desativar Todos ({CATEGORIES.find((c) => c.id === selectedCategory)?.name})</span>
            </button>

            <button
              onClick={() => handleBatchToggle(true)}
              disabled={batchLoading}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
              title="Ativar todos da categoria atual"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ativar Todos</span>
            </button>

            <button
              onClick={loadProducts}
              disabled={loading}
              className="p-2 bg-apple-gray hover:bg-apple-gray-hover rounded-xl text-apple-dark transition-colors cursor-pointer"
              title="Recarregar lista"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-apple-border/50 p-16 flex flex-col items-center justify-center text-center shadow-2xs">
            <Loader2 className="w-10 h-10 animate-spin text-apple-blue mb-3" />
            <p className="text-sm text-apple-muted font-medium">Carregando catálogo de produtos...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-apple-border/50 p-16 flex flex-col items-center justify-center text-center shadow-2xs">
            <Package className="w-12 h-12 text-apple-muted mb-3 opacity-40" />
            <h3 className="text-base font-bold text-apple-dark">Nenhum produto encontrado</h3>
            <p className="text-xs text-apple-muted mt-1 max-w-sm">
              Não foram encontrados produtos com os filtros selecionados. Tente limpar os filtros ou a busca.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((p) => {
              const isUpdating = updatingId === p.id;
              const isActive = p.active !== false;

              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm ${
                    isActive
                      ? "border-apple-border/60 hover:border-apple-blue/40"
                      : "border-red-200/80 bg-red-50/20 opacity-75"
                  }`}
                >
                  {/* Top Bar: Category badge & Active status */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-apple-gray text-apple-dark/70">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isActive
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        />
                        {isActive ? "Ativo no Site" : "Desativado"}
                      </span>
                    </div>

                    {/* Image & Title */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-16 h-16 bg-apple-gray/40 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-apple-border/30">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-contain p-1"
                            sizes="64px"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-apple-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-apple-dark truncate" title={p.name}>
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-apple-muted truncate">
                          {p.subcategory || p.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs font-extrabold text-apple-dark">
                            {p.priceFrom && p.priceFrom > 0
                              ? `A partir de ${formatCurrency(p.priceFrom)}`
                              : "Sob Consulta"}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 rounded-lg bg-blue-50 text-apple-blue hover:bg-blue-100 transition-colors"
                            title="Editar Valores deste Produto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Extra specs badges */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.condition && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-apple-gray rounded text-apple-muted font-medium">
                          {p.condition === "new" ? "Novo Lacrado" : "Seminovo"}
                        </span>
                      )}
                      {p.variants && p.variants.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-apple-blue rounded font-semibold">
                          {p.variants.length} opções/cores
                        </span>
                      )}
                      {p.storage && p.storage.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-apple-gray rounded text-apple-muted font-medium">
                          {p.storage.slice(0, 3).join(", ")}
                          {p.storage.length > 3 && "..."}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: Edit Prices & Active Toggle */}
                  <div className="pt-3 border-t border-apple-border/50 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-apple-gray text-apple-dark border border-apple-border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-apple-blue" />
                      <span>Editar Valores</span>
                    </button>

                    <button
                      onClick={() => handleToggleProduct(p)}
                      disabled={isUpdating || batchLoading}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 ${
                        isActive
                          ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : "bg-red-50 hover:bg-red-100 text-red-700 border border-red-300"
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isActive ? (
                        <ToggleRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-red-600" />
                      )}
                      <span>{isActive ? "Ativado" : "Desativado"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MODAL DE EDIÇÃO DE VALORES */}
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
                  type="button"
                  onClick={handleCloseEdit}
                  className="p-2 text-apple-muted hover:text-apple-dark hover:bg-apple-gray rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form Body */}
              <form onSubmit={handleSavePrices} className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Preço "A partir de" */}
                <div className="p-4 bg-apple-gray/40 rounded-2xl border border-apple-border/60 space-y-2">
                  <label className="block text-xs font-bold text-apple-dark uppercase tracking-wider">
                    Preço Principal ("A partir de"):
                  </label>
                  <div className="relative max-w-xs">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-apple-muted">
                      R$
                    </span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editPriceFrom}
                      onChange={(e) => setEditPriceFrom(e.target.value)}
                      placeholder="Ex: 7500"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-apple-border rounded-xl text-sm font-bold text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/30"
                    />
                  </div>
                  <p className="text-[11px] text-apple-muted">
                    Este valor é exibido como vitrine nos cards do site. Caso seja 0, será exibido como "Sob Consulta".
                  </p>
                </div>

                {/* Preços das Variantes (Cores / Capacidades) */}
                {editVariants.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-apple-dark uppercase tracking-wider">
                        Valores por Cor & Capacidade ({editVariants.length} variantes):
                      </label>
                      <span className="text-[11px] text-apple-muted">
                        Valores cobrados no PIX à vista
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {editVariants.map((v, idx) => (
                        <div
                          key={`${v.storage}-${v.color}-${idx}`}
                          className="p-3 bg-white border border-apple-border rounded-2xl flex items-center justify-between gap-3 shadow-2xs hover:border-apple-blue/40 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-apple-blue shrink-0" />
                            <div>
                              <div className="text-xs font-bold text-apple-dark">
                                {v.storage ? `${v.storage} — ` : ""}
                                {v.color || "Padrão"}
                                {v.size ? ` (${v.size})` : ""}
                              </div>
                              <span className="text-[10px] text-apple-muted">
                                {v.chip ? `Chip: ${v.chip} ` : ""}
                                {v.available ? "Disponível" : "Indisponível"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-apple-muted">R$</span>
                            <input
                              type="number"
                              step="1"
                              min="0"
                              value={v.price}
                              onChange={(e) => {
                                const newPrice = Number(e.target.value) || 0;
                                setEditVariants((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, price: newPrice } : item
                                  )
                                );
                              }}
                              className="w-28 px-3 py-1.5 bg-apple-gray/40 border border-apple-border rounded-xl text-xs font-bold text-apple-dark text-right focus:outline-none focus:ring-2 focus:ring-apple-blue/30"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-2xl text-xs text-blue-900">
                    Este produto não possui variantes individuais cadastradas. O valor principal acima define o preço do produto no site.
                  </div>
                )}

                {/* Modal Footer Controls */}
                <div className="pt-4 border-t border-apple-border/70 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleCloseEdit}
                    disabled={savingPrices}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold border border-apple-border text-apple-dark hover:bg-apple-gray transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingPrices}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-apple-blue hover:bg-apple-blue-hover text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
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
