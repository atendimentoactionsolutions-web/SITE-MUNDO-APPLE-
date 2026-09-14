"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, ArrowLeft, Upload, Download, Check, Camera } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils/formatters";

export default function AdminPricesPage() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // Edit list states
  const [editValues, setEditValues] = useState<Record<string, { basePrice: string; minimumPrice: string; imageUrl: string; modelId: string }>>({});
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
        // Initialize editing record values
        const initialEdits: Record<string, { basePrice: string; minimumPrice: string; imageUrl: string; modelId: string }> = {};
        data.prices.forEach((p: any) => {
          initialEdits[p.id] = {
            basePrice: String(p.basePrice),
            minimumPrice: String(p.minimumPrice),
            imageUrl: p.imageUrl || "",
            modelId: p.modelId || "",
          };
        });
        setEditValues(initialEdits);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, []);

  const handlePriceChange = (id: string, field: "basePrice" | "minimumPrice" | "imageUrl", value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
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
      }));

      const res = await fetch("/api/admin/sell/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prices: priceUpdates }),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Preços e imagens salvos com sucesso!" });
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
        setAlertMsg({ type: "success", text: `Importado com sucesso! ${data.updatedCount} preços atualizados.` });
        loadPrices();
        setCsvFileContent("");
      } else {
        const errorList = data.errors ? data.errors.join("\n") : (data.error || "Erro ao processar CSV.");
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
    const headers = "model,storage,base_price,minimum_price\n";
    const rows = prices
      .map((p) => `"${p.modelName}","${p.storageName}",${p.basePrice},${p.minimumPrice}`)
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

  const filteredPrices = prices.filter(
    (p) =>
      p.modelName.toLowerCase().includes(search.toLowerCase()) ||
      p.storageName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 bg-apple-gray/20 min-h-screen text-apple-dark">
      <Container size="large">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/vendas"
              className="p-2 bg-white border border-apple-border rounded-lg hover:bg-apple-gray transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Cadastro de Preços</h1>
              <p className="text-sm text-apple-muted">Ajuste os valores base e mínimo de cotação do catálogo.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {/* Import file input label */}
            <label className="px-4 py-2 bg-white border border-apple-border rounded-xl hover:bg-apple-gray transition-colors cursor-pointer flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Selecionar CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="hidden"
              />
            </label>

            {csvFileContent && (
              <button
                onClick={handleImportCsv}
                disabled={importing}
                className="px-4 py-2 bg-apple-blue text-white rounded-xl hover:bg-apple-blue-hover transition-colors flex items-center gap-1.5"
              >
                {importing ? "Importando..." : "Confirmar Importação"}
              </button>
            )}

            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-white border border-apple-border rounded-xl hover:bg-apple-gray transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handleSaveBulk}
              disabled={saving}
              className="px-4 py-2 bg-apple-dark text-white rounded-xl hover:bg-black transition-colors flex items-center gap-1.5"
            >
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>

        {alertMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-medium mb-6 whitespace-pre-line border ${
              alertMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {alertMsg.text}
          </div>
        )}

        {/* Filter Input */}
        <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-apple-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por modelo de iPhone..."
              className="w-full pl-9 pr-4 py-2 bg-apple-gray text-xs rounded-xl border border-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-apple-border">
            <Loader2 className="w-8 h-8 animate-spin text-apple-blue mb-2" />
            <p className="text-xs text-apple-muted">Carregando matriz de preços...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-apple-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-apple-gray border-b border-apple-border font-semibold text-apple-muted">
                    <th className="p-4 w-12 text-center">Foto</th>
                    <th className="p-4 w-1/4">Modelo</th>
                    <th className="p-4 w-1/6">Armazenamento</th>
                    <th className="p-4">Preço Base (R$)</th>
                    <th className="p-4">Preço Mínimo (R$)</th>
                    <th className="p-4">URL da Imagem</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border/50">
                  {filteredPrices.map((p) => (
                    <tr key={p.id} className="hover:bg-apple-gray/30 transition-colors">
                      <td className="p-4">
                        <div className="w-10 h-10 bg-apple-gray border border-apple-border rounded-lg overflow-hidden flex items-center justify-center relative shrink-0">
                          {editValues[p.id]?.imageUrl ? (
                            <Image
                              src={editValues[p.id].imageUrl}
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
                      <td className="p-4 font-semibold">{p.modelName}</td>
                      <td className="p-4 font-medium text-apple-muted">{p.storageName}</td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editValues[p.id]?.basePrice || ""}
                          onChange={(e) => handlePriceChange(p.id, "basePrice", e.target.value)}
                          className="w-24 p-1.5 rounded-lg border border-apple-border bg-apple-gray/50 focus:bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-apple-blue"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editValues[p.id]?.minimumPrice || ""}
                          onChange={(e) => handlePriceChange(p.id, "minimumPrice", e.target.value)}
                          className="w-24 p-1.5 rounded-lg border border-apple-border bg-apple-gray/50 focus:bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-apple-blue"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editValues[p.id]?.imageUrl || ""}
                          onChange={(e) => handlePriceChange(p.id, "imageUrl", e.target.value)}
                          placeholder="/images/products/..."
                          className="w-full min-w-36 p-1.5 rounded-lg border border-apple-border bg-apple-gray/50 focus:bg-white text-[10px] focus:outline-none focus:ring-1 focus:ring-apple-blue"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center p-1 bg-emerald-100 text-emerald-800 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
