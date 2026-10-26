"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  Search,
  ArrowLeft,
  Upload,
  Download,
  Check,
  Camera,
  Power,
  ToggleLeft,
  ToggleRight,
  Save,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Sliders,
  FileSpreadsheet
} from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils/formatters";

interface PriceItem {
  id: string;
  modelId: string;
  modelName: string;
  imageUrl: string;
  storageName: string;
  basePrice: number;
  minimumPrice: number;
  active: boolean;
}

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingAll, setTogglingAll] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Edit list states
  const [editValues, setEditValues] = useState<
    Record<
      string,
      {
        basePrice: string;
        minimumPrice: string;
        imageUrl: string;
        modelId: string;
        active: boolean;
      }
    >
  >({});
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // CSV Import States
  const [csvFileContent, setCsvFileContent] = useState<string>("");
  const [importing, setImporting] = useState(false);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sell/prices");
      const data = await res.json();
      if (data.success) {
        setPrices(data.prices);
        const initialEdits: Record<
          string,
          {
            basePrice: string;
            minimumPrice: string;
            imageUrl: string;
            modelId: string;
            active: boolean;
          }
        > = {};
        data.prices.forEach((p: PriceItem) => {
          initialEdits[p.id] = {
            basePrice: String(p.basePrice),
            minimumPrice: String(p.minimumPrice),
            imageUrl: p.imageUrl || "",
            modelId: p.modelId || "",
            active: p.active !== false,
          };
        });
        setEditValues(initialEdits);
      }
    } catch (e) {
      console.error(e);
      setAlertMsg({ type: "error", text: "Erro ao carregar lista de preços." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handlePriceChange = (
    id: string,
    field: "basePrice" | "minimumPrice" | "imageUrl",
    value: string
  ) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleToggleSingle = (id: string) => {
    setEditValues((prev) => {
      const current = prev[id];
      const nextActive = !current.active;
      return {
        ...prev,
        [id]: {
          ...current,
          active: nextActive,
        },
      };
    });
  };

  const handleSaveBulk = async () => {
    setSaving(true);
    setAlertMsg(null);
    try {
      const priceUpdates = Object.entries(editValues).map(([id, val]) => ({
        id,
        basePrice: val.basePrice,
        minimumPrice: val.minimumPrice,
        imageUrl: val.imageUrl,
        modelId: val.modelId,
        active: val.active,
      }));

      const res = await fetch("/api/admin/sell/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices: priceUpdates }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Alterações de preços e status salvas com sucesso!" });
        loadPrices();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Erro ao salvar preços." });
      }
    } catch (e) {
      setAlertMsg({ type: "error", text: "Erro na conexão com o servidor." });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAll = async (targetActive: boolean) => {
    const confirmText = targetActive
      ? "Deseja ATIVAR TODOS os valores de avaliação? Todos os iPhones poderão ser avaliados no site."
      : "Deseja DESATIVAR TODOS os valores de avaliação? Nenhuma avaliação de iPhone receberá preço até que sejam reativados.";

    if (!window.confirm(confirmText)) return;

    setTogglingAll(true);
    setAlertMsg(null);
    try {
      const res = await fetch("/api/admin/sell/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleAll: true, active: targetActive }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({
          type: "success",
          text: targetActive
            ? "Todos os valores foram ATIVADOS com sucesso!"
            : "Todos os valores foram DESATIVADOS com sucesso!",
        });
        await loadPrices();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Erro ao alterar todos os valores." });
      }
    } catch (e) {
      setAlertMsg({ type: "error", text: "Erro na conexão com o servidor." });
    } finally {
      setTogglingAll(false);
    }
  };

  // CSV Import implementation
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvFileContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleImportCsv = async () => {
    if (!csvFileContent) return;
    setImporting(true);
    setAlertMsg(null);
    try {
      const res = await fetch("/api/admin/sell/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData: csvFileContent }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({
          type: "success",
          text: `Importado com sucesso! ${data.updatedCount} preços atualizados.`,
        });
        loadPrices();
        setCsvFileContent("");
      } else {
        const errorList = data.errors ? data.errors.join("\n") : data.error || "Erro ao processar CSV.";
        setAlertMsg({ type: "error", text: `Erro de Validação CSV:\n${errorList}` });
      }
    } catch (err) {
      setAlertMsg({ type: "error", text: "Erro ao importar planilha." });
    } finally {
      setImporting(false);
    }
  };

  // CSV Export implementation
  const handleExportCsv = () => {
    const headers = "model,storage,base_price,minimum_price,status\n";
    const rows = prices
      .map((p) => {
        const isAct = editValues[p.id]?.active !== undefined ? editValues[p.id].active : p.active;
        return `"${p.modelName}","${p.storageName}",${p.basePrice},${p.minimumPrice},"${isAct ? "ATIVO" : "DESATIVADO"}"`;
      })
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "matriz_precos_vendas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPrices = prices.filter((p) => {
    const matchesSearch =
      p.modelName.toLowerCase().includes(search.toLowerCase()) ||
      p.storageName.toLowerCase().includes(search.toLowerCase());

    const isCurrentActive = editValues[p.id]?.active ?? p.active;
    if (filterStatus === "active") return matchesSearch && isCurrentActive;
    if (filterStatus === "inactive") return matchesSearch && !isCurrentActive;
    return matchesSearch;
  });

  const activeCount = prices.filter((p) => (editValues[p.id]?.active ?? p.active)).length;
  const inactiveCount = prices.length - activeCount;

  return (
    <div className="pt-24 pb-20 bg-apple-gray/20 min-h-screen text-apple-dark">
      <Container size="large">
        {/* Header Breadcrumbs & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/vendas"
              className="p-2.5 bg-white border border-apple-border rounded-xl hover:bg-apple-gray transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-apple-dark" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gerenciador de Valores</h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-apple-blue/10 text-apple-blue border border-apple-blue/20">
                  {prices.length} itens
                </span>
              </div>
              <p className="text-xs text-apple-muted mt-0.5">
                Edite preços base e mínimos, ative ou desative aparelhos avulsos ou todos de uma vez.
              </p>
            </div>
          </div>

          {/* Master Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Master Toggle Buttons */}
            <div className="flex items-center bg-white border border-apple-border rounded-2xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => handleToggleAll(true)}
                disabled={togglingAll || saving}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Ativar todas as avaliações no site"
              >
                <Power className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ativar Todos</span>
              </button>
              <div className="w-[1px] h-4 bg-apple-border mx-1" />
              <button
                type="button"
                onClick={() => handleToggleAll(false)}
                disabled={togglingAll || saving}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Desativar todas as avaliações no site"
              >
                <Power className="w-3.5 h-3.5 text-red-600" />
                <span>Desativar Todos</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveBulk}
              disabled={saving || togglingAll}
              className="px-4 py-2.5 bg-apple-blue hover:bg-apple-blue-hover text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Secondary CSV Bar & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-apple-muted block">Total de Modelos</span>
              <span className="text-xl font-bold text-apple-dark">{prices.length}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-apple-gray flex items-center justify-center">
              <Sliders className="w-4 h-4 text-apple-dark" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Valores Ativos</span>
              <span className="text-xl font-bold text-emerald-600">{activeCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-700 block">Valores Desativados</span>
              <span className="text-xl font-bold text-red-600">{inactiveCount}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>

          {/* Planilha actions */}
          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-2xs flex items-center justify-between gap-2">
            <label className="flex-1 px-3 py-2 bg-apple-gray hover:bg-slate-200 text-apple-dark rounded-xl text-[11px] font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar CSV</span>
              <input type="file" accept=".csv" onChange={handleCsvFileChange} className="hidden" />
            </label>

            <button
              onClick={handleExportCsv}
              className="px-3 py-2 bg-apple-gray hover:bg-slate-200 text-apple-dark rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Baixar planilha CSV atualizada"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {csvFileContent && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-900">
              Arquivo CSV selecionado pronto para importação!
            </span>
            <button
              onClick={handleImportCsv}
              disabled={importing}
              className="px-4 py-2 bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {importing ? "Importando..." : "Confirmar Importação"}
            </button>
          </div>
        )}

        {alertMsg && (
          <div
            className={`p-4 rounded-2xl text-xs font-semibold mb-6 whitespace-pre-line border flex items-center gap-2 ${
              alertMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {alertMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{alertMsg.text}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por iPhone ou capacidade (ex: 15 Pro, 256GB)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white text-xs rounded-2xl border border-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-apple-border rounded-2xl p-1 shadow-2xs self-start sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                filterStatus === "all" ? "bg-apple-dark text-white" : "text-apple-muted hover:text-apple-dark"
              }`}
            >
              Todos ({prices.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                filterStatus === "active" ? "bg-emerald-600 text-white" : "text-apple-muted hover:text-emerald-700"
              }`}
            >
              Ativos ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("inactive")}
              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                filterStatus === "inactive" ? "bg-red-600 text-white" : "text-apple-muted hover:text-red-700"
              }`}
            >
              Desativados ({inactiveCount})
            </button>
          </div>
        </div>

        {/* Pricing Matrix Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-apple-border">
            <Loader2 className="w-8 h-8 animate-spin text-apple-blue mb-2" />
            <p className="text-xs text-apple-muted font-semibold">Carregando matriz de valores...</p>
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-apple-border text-center text-apple-muted">
            <p className="text-sm font-semibold">Nenhum aparelho encontrado com os filtros selecionados.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-apple-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-apple-gray border-b border-apple-border font-bold text-apple-muted uppercase tracking-wider text-[10px]">
                    <th className="p-4 w-12 text-center">Foto</th>
                    <th className="p-4 w-1/4">Modelo</th>
                    <th className="p-4 w-28">Armazenamento</th>
                    <th className="p-4">Preço Base (R$)</th>
                    <th className="p-4">Preço Mínimo (R$)</th>
                    <th className="p-4 text-center w-36">Status no Site</th>
                    <th className="p-4 text-center w-28">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border/50">
                  {filteredPrices.map((p) => {
                    const currentItem = editValues[p.id];
                    const isActive = currentItem ? currentItem.active : p.active;

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-apple-gray/30 transition-colors ${
                          !isActive ? "bg-red-50/30 opacity-75" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="w-10 h-10 bg-apple-gray border border-apple-border rounded-xl overflow-hidden flex items-center justify-center relative shrink-0">
                            {currentItem?.imageUrl ? (
                              <Image
                                src={currentItem.imageUrl}
                                alt={p.modelName}
                                fill
                                className="object-contain p-1"
                                sizes="40px"
                              />
                            ) : (
                              <Camera className="w-4 h-4 text-apple-muted" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-apple-dark block text-sm">{p.modelName}</span>
                          <span className="text-[10px] text-apple-muted">ID: {p.id}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-apple-gray rounded-lg font-bold text-apple-dark border border-apple-border/60">
                            {p.storageName}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="relative max-w-[140px]">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-apple-muted">
                              R$
                            </span>
                            <input
                              type="number"
                              value={currentItem?.basePrice ?? ""}
                              onChange={(e) => handlePriceChange(p.id, "basePrice", e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-apple-border bg-apple-gray/50 focus:bg-white text-xs font-bold text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="relative max-w-[140px]">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-apple-muted">
                              R$
                            </span>
                            <input
                              type="number"
                              value={currentItem?.minimumPrice ?? ""}
                              onChange={(e) => handlePriceChange(p.id, "minimumPrice", e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-apple-border bg-apple-gray/50 focus:bg-white text-xs font-bold text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue"
                            />
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSingle(p.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all border ${
                              isActive
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                : "bg-red-50 text-red-800 border-red-300 hover:bg-red-100"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                              }`}
                            />
                            <span>{isActive ? "Ativo" : "Desativado"}</span>
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSingle(p.id)}
                            className={`p-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                              isActive
                                ? "text-red-700 bg-white border-red-200 hover:bg-red-50"
                                : "text-emerald-700 bg-white border-emerald-200 hover:bg-emerald-50"
                            }`}
                            title={isActive ? "Desativar este aparelho" : "Ativar este aparelho"}
                          >
                            {isActive ? (
                              <ToggleRight className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-red-500" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Floating Save reminder */}
            <div className="p-4 bg-apple-gray border-t border-apple-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-apple-muted font-medium">
                Você pode editar vários valores e ativar/desativar itens individualmente. Não se esqueça de clicar em <strong>Salvar Alterações</strong>.
              </span>
              <button
                onClick={handleSaveBulk}
                disabled={saving || togglingAll}
                className="px-6 py-2.5 bg-apple-blue hover:bg-apple-blue-hover text-white rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações Agora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
