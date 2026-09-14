"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Plus, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function AdminDeflatorsPage() {
  const [deflators, setDeflators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Edit / Form state
  const [editValues, setEditValues] = useState<Record<string, { value: string; type: string; active: boolean }>>({});
  const [alertMsg, setAlertMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadDeflators = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sell/deflators");
      const data = await res.json();
      if (data.success) {
        setDeflators(data.deflators);
        const initialEdits: Record<string, { value: string; type: string; active: boolean }> = {};
        data.deflators.forEach((d: any) => {
          initialEdits[d.id] = {
            value: String(d.value),
            type: d.type,
            active: d.active,
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
    loadDeflators();
  }, []);

  const handleFieldChange = (id: string, field: "value" | "type" | "active", value: any) => {
    setEditValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleSaveDeflator = async (id: string) => {
    setSaving(id);
    setAlertMsg(null);
    try {
      const payload = {
        id,
        value: editValues[id].value,
        type: editValues[id].type,
        active: editValues[id].active,
      };

      const res = await fetch("/api/admin/sell/deflators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setAlertMsg({ type: "success", text: "Deflator atualizado com sucesso!" });
        loadDeflators();
      } else {
        setAlertMsg({ type: "error", text: data.error || "Erro ao atualizar." });
      }
    } catch (e) {
      setAlertMsg({ type: "error", text: "Erro ao conectar com o servidor." });
    } finally {
      setSaving(null);
    }
  };

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
              <h1 className="text-3xl font-semibold tracking-tight">Deflatores por Defeito</h1>
              <p className="text-sm text-apple-muted">Gerencie a taxa de desconto aplicada em cotações para cada tipo de avaria.</p>
            </div>
          </div>
        </div>

        {alertMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-medium mb-6 border ${
              alertMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {alertMsg.text}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-apple-border">
            <Loader2 className="w-8 h-8 animate-spin text-apple-blue mb-2" />
            <p className="text-xs text-apple-muted">Carregando deflatores...</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-apple-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-apple-gray border-b border-apple-border font-semibold text-apple-muted">
                    <th className="p-4 w-1/4">Deflator / Defeito</th>
                    <th className="p-4">Categoria</th>
                    <th className="p-4">Descrição</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Valor Desconto</th>
                    <th className="p-4 text-center">Ativo</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-apple-border/50">
                  {deflators.map((d) => (
                    <tr key={d.id} className="hover:bg-apple-gray/30 transition-colors">
                      <td className="p-4 font-semibold">
                        <span className="block">{d.name}</span>
                        <span className="text-[10px] font-mono text-apple-muted">{d.code}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-apple-gray border border-apple-border rounded text-[10px] font-semibold text-apple-muted">
                          {d.category}
                        </span>
                      </td>
                      <td className="p-4 text-apple-muted max-w-xs truncate" title={d.description}>
                        {d.description}
                      </td>
                      <td className="p-4">
                        <select
                          value={editValues[d.id]?.type || "FIXED"}
                          onChange={(e) => handleFieldChange(d.id, "type", e.target.value)}
                          className="p-1.5 rounded-lg border border-apple-border bg-apple-gray/50 text-xs font-semibold focus:outline-none"
                        >
                          <option value="FIXED">FIXED (R$ Fixo)</option>
                          <option value="PERCENTAGE">PERCENTAGE (% Perc)</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editValues[d.id]?.value || ""}
                          onChange={(e) => handleFieldChange(d.id, "value", e.target.value)}
                          className="w-24 p-1.5 rounded-lg border border-apple-border bg-apple-gray/50 focus:bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-apple-blue"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={editValues[d.id]?.active || false}
                          onChange={(e) => handleFieldChange(d.id, "active", e.target.checked)}
                          className="rounded text-apple-blue focus:ring-apple-blue w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleSaveDeflator(d.id)}
                          disabled={saving === d.id}
                          className="px-3 py-1.5 bg-apple-dark text-white rounded-lg text-[10px] font-semibold hover:bg-black transition-colors"
                        >
                          {saving === d.id ? "Salvando..." : "Salvar"}
                        </button>
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
