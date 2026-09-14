"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Search, Filter, Calendar, DollarSign, Users, Award, CheckSquare, Eye, Play, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatCurrency } from "@/utils/formatters";

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("all"); // all, today, 7days, 30days
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected Quote Detail Modal
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(null);
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Checklist for inspection/vistoria
  const [inVistoria, setInVistoria] = useState(false);
  const [vistoriaNotes, setVistoriaNotes] = useState("");
  const [vistoriaStatus, setVistoriaStatus] = useState("APPROVED");
  const [vistoriaPrice, setVistoriaPrice] = useState<number>(0);
  const [vistoriaIssues, setVistoriaIssues] = useState<string>("");

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        filter: filterDate,
        status: statusFilter,
      });
      const res = await fetch(`/api/admin/sell/quotes?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setQuotes(data.quotes);
        setMetrics(data.metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, [search, filterDate, statusFilter]);

  const loadQuoteDetail = async (id: string) => {
    setLoadingDetail(true);
    setSelectedQuoteId(id);
    setInVistoria(false);
    try {
      const res = await fetch(`/api/admin/sell/quotes/${id}`);
      const data = await res.json();
      if (data.success) {
        setSelectedQuoteDetail(data);
        setVistoriaPrice(data.quote.finalPrice);
        setVistoriaStatus(data.quote.status);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleInspectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteDetail) return;

    try {
      const issuesList = vistoriaIssues
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line) => ({ description: line.trim(), discount: 0 }));

      const res = await fetch(`/api/admin/sell/quotes/${selectedQuoteDetail.quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: vistoriaStatus,
          finalPrice: Number(vistoriaPrice),
          notes: vistoriaNotes,
          inspection: {
            notes: vistoriaNotes,
            issues: issuesList,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Reload details and list
        loadQuoteDetail(selectedQuoteDetail.quote.id);
        loadQuotes();
        setInVistoria(false);
        setVistoriaNotes("");
        setVistoriaIssues("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-apple-gray/20 min-h-screen text-apple-dark">
      <Container size="large">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Cotações de venda</h1>
            <p className="text-sm text-apple-muted">Gerencie leads, ofertas e vistorias de iPhones usados.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/vendas/precos"
              className="px-4 py-2 bg-white border border-apple-border text-xs font-semibold rounded-xl hover:bg-apple-gray transition-colors"
            >
              Matriz de Preços
            </Link>
            <Link
              href="/admin/vendas/deflatores"
              className="px-4 py-2 bg-white border border-apple-border text-xs font-semibold rounded-xl hover:bg-apple-gray transition-colors"
            >
              Deflatores
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-sm space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-apple-blue" />
                <span>Cotações Hoje</span>
              </div>
              <p className="text-2xl font-bold">{metrics.quotesTodayCount}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-sm space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Valor Cotado Hoje</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(metrics.totalValueToday)}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-sm space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>Leads Hoje</span>
              </div>
              <p className="text-2xl font-bold">{metrics.uniqueLeadsToday}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-sm space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Aceitas Hoje</span>
              </div>
              <p className="text-2xl font-bold">{metrics.acceptedQuotesToday}</p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-white p-5 rounded-2xl border border-apple-border/50 shadow-sm space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-apple-dark" />
                <span>Total Geral</span>
              </div>
              <p className="text-2xl font-bold">{metrics.totalQuotesCount}</p>
            </div>
          </div>
        )}

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List and Filters */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 w-4 h-4 text-apple-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por cliente, WhatsApp ou código..."
                  className="w-full pl-9 pr-4 py-2 bg-apple-gray text-xs rounded-xl border border-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue"
                />
              </div>

              {/* Date Filter */}
              <div className="flex gap-2 text-xs">
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2 bg-apple-gray rounded-xl border border-apple-border focus:outline-none"
                >
                  <option value="all">Todas as datas</option>
                  <option value="today">Hoje</option>
                  <option value="7days">Últimos 7 dias</option>
                  <option value="30days">Últimos 30 dias</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-apple-gray rounded-xl border border-apple-border focus:outline-none"
                >
                  <option value="all">Todos os Status</option>
                  <option value="QUOTED">QUOTED</option>
                  <option value="MANUAL_REVIEW">MANUAL_REVIEW</option>
                  <option value="CUSTOMER_ACCEPTED">CUSTOMER_ACCEPTED</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REVISED_OFFER">REVISED_OFFER</option>
                  <option value="PAID">PAID</option>
                  <option value="BLOCKED">BLOCKED</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-apple-border">
                <Loader2 className="w-8 h-8 animate-spin text-apple-blue mb-2" />
                <p className="text-xs text-apple-muted">Carregando cotações...</p>
              </div>
            ) : quotes.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-apple-border text-center text-apple-muted">
                <p className="text-sm">Nenhuma cotação de venda encontrada.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-apple-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-apple-gray border-b border-apple-border font-semibold text-apple-muted">
                        <th className="p-4">Código</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Aparelho</th>
                        <th className="p-4">Valor Estimado</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-apple-border/50">
                      {quotes.map((q) => (
                        <tr
                          key={q.id}
                          className={`hover:bg-apple-gray/30 transition-colors ${
                            selectedQuoteId === q.id ? "bg-apple-blue/5" : ""
                          }`}
                        >
                          <td className="p-4 font-bold">{q.publicCode}</td>
                          <td className="p-4">
                            <span className="font-semibold block">{q.customer?.name || "Sem Nome"}</span>
                            <span className="text-[10px] text-apple-muted">{q.customer?.whatsapp}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold block">{q.deviceName}</span>
                            <span className="text-[10px] text-apple-muted">{q.storageName}</span>
                          </td>
                          <td className="p-4 font-bold text-apple-blue">
                            {q.finalPrice > 0 ? formatCurrency(q.finalPrice) : "Revisão"}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                q.status === "CUSTOMER_ACCEPTED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : q.status === "MANUAL_REVIEW"
                                  ? "bg-amber-100 text-amber-800"
                                  : q.status === "BLOCKED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-apple-gray text-apple-dark border border-apple-border"
                              }`}
                            >
                              {q.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => loadQuoteDetail(q.id)}
                              className="p-2 bg-apple-gray hover:bg-apple-dark hover:text-white rounded-lg transition-all inline-flex items-center justify-center"
                              title="Visualizar Cotação"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5">
            {selectedQuoteId === null ? (
              <div className="bg-white p-10 rounded-3xl border border-apple-border text-center text-apple-muted shadow-sm h-full flex flex-col items-center justify-center space-y-2">
                <Search className="w-8 h-8 text-apple-muted/60" />
                <p className="text-xs">Selecione uma cotação na lista para visualizar todos os detalhes de cálculo e vistoria.</p>
              </div>
            ) : loadingDetail ? (
              <div className="bg-white p-10 rounded-3xl border border-apple-border text-center shadow-sm h-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-apple-blue" />
              </div>
            ) : selectedQuoteDetail ? (
              <div className="bg-white p-6 rounded-3xl border border-apple-border shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-apple-border pb-4">
                  <div>
                    <span className="text-[10px] text-apple-muted font-semibold uppercase tracking-wider block">Detalhes da Cotação</span>
                    <h2 className="text-xl font-bold">{selectedQuoteDetail.quote.publicCode}</h2>
                  </div>
                  <span className="text-[10px] text-apple-muted">{new Date(selectedQuoteDetail.quote.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>

                {/* Cliente */}
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">Cliente</h3>
                  <div className="text-xs">
                    <p className="font-semibold text-sm">{selectedQuoteDetail.customer?.name || "Sem cadastro"}</p>
                    <p className="text-apple-muted">{selectedQuoteDetail.customer?.whatsapp}</p>
                    {selectedQuoteDetail.customer?.email && <p className="text-apple-muted">{selectedQuoteDetail.customer?.email}</p>}
                    {selectedQuoteDetail.customer?.cep && <p className="text-apple-muted">CEP: {selectedQuoteDetail.customer?.cep}</p>}
                  </div>
                </div>

                {/* Aparelho */}
                <div className="space-y-2 border-t border-apple-border/50 pt-4">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">Aparelho e Capacidade</h3>
                  <div className="text-xs font-semibold">
                    {selectedQuoteDetail.deviceName} ({selectedQuoteDetail.storageName})
                  </div>
                </div>

                {/* Respostas da Avaliação */}
                <div className="space-y-2 border-t border-apple-border/50 pt-4">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">Respostas informadas</h3>
                  <div className="bg-apple-gray p-4 rounded-2xl max-h-40 overflow-y-auto text-[11px] space-y-2">
                    {selectedQuoteDetail.answers.map((ans: any) => (
                      <div key={ans.id} className="flex justify-between border-b border-apple-border/30 pb-1">
                        <span className="text-apple-muted">{ans.questionCode}:</span>
                        <span className="font-medium text-apple-dark">{ans.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detalhes do Cálculo */}
                <div className="space-y-2.5 border-t border-apple-border/50 pt-4 text-xs animate-in fade-in">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">Cálculo de Preço Interno</h3>
                  <div className="flex justify-between">
                    <span className="text-apple-muted">Preço Base:</span>
                    <span className="font-semibold">{formatCurrency(selectedQuoteDetail.quote.basePriceSnapshot)}</span>
                  </div>
                  {selectedQuoteDetail.deflatorsApplied.map((def: any) => (
                    <div key={def.id} className="flex justify-between text-red-600 text-[11px]">
                      <span>{def.labelSnapshot} ({def.typeSnapshot === "PERCENTAGE" ? `${def.valueSnapshot}%` : "Fixo"}):</span>
                      <span>-{formatCurrency(def.calculatedDiscount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-apple-border/30 pt-2 text-apple-muted text-[11px]">
                    <span>Soma Descontos Percentuais:</span>
                    <span>-{formatCurrency(selectedQuoteDetail.quote.percentageDiscountTotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-apple-muted text-[11px]">
                    <span>Soma Descontos Fixos:</span>
                    <span>-{formatCurrency(selectedQuoteDetail.quote.fixedDiscountTotal || 0)}</span>
                  </div>
                  <div className="flex justify-between text-apple-muted text-[11px]">
                    <span>Preço Calculado:</span>
                    <span>{formatCurrency(selectedQuoteDetail.quote.calculatedPrice || selectedQuoteDetail.quote.finalPrice)}</span>
                  </div>
                  {selectedQuoteDetail.quote.minimumPriceSnapshot > 0 && (
                    <div className="flex justify-between text-apple-muted text-[11px]">
                      <span>Preço Mínimo Cadastrado:</span>
                      <span>{formatCurrency(selectedQuoteDetail.quote.minimumPriceSnapshot)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-apple-border/60 pt-2 font-bold text-apple-blue text-sm">
                    <span>Valor Estimado Final:</span>
                    <span>{formatCurrency(selectedQuoteDetail.quote.finalPrice)}</span>
                  </div>
                </div>

                {/* Vistoria Section */}
                <div className="border-t border-apple-border/50 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">Vistoria Técnica</h3>
                    {!inVistoria && (
                      <button
                        onClick={() => setInVistoria(true)}
                        className="px-2.5 py-1 bg-apple-dark text-white rounded-lg text-[10px] font-bold hover:bg-black transition-colors flex items-center gap-1"
                      >
                        <Play className="w-2.5 h-2.5" />
                        <span>Iniciar Vistoria</span>
                      </button>
                    )}
                  </div>

                  {selectedQuoteDetail.inspection && (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-[11px] text-emerald-800 space-y-1">
                      <p className="font-semibold">Vistoria Técnica realizada em {new Date(selectedQuoteDetail.inspection.inspectedAt).toLocaleDateString("pt-BR")}</p>
                      <p><span className="font-semibold">Nota:</span> {selectedQuoteDetail.inspection.notes}</p>
                      {selectedQuoteDetail.inspection.approvedPrice && (
                        <p><span className="font-semibold">Valor Final Vistoriado:</span> {formatCurrency(selectedQuoteDetail.inspection.approvedPrice)}</p>
                      )}
                    </div>
                  )}

                  {inVistoria && (
                    <form onSubmit={handleInspectionSubmit} className="space-y-3 p-4 bg-apple-gray rounded-2xl text-xs">
                      <div>
                        <label className="block font-semibold mb-1">Status da Vistoria</label>
                        <select
                          value={vistoriaStatus}
                          onChange={(e) => setVistoriaStatus(e.target.value)}
                          className="w-full p-2 bg-white rounded-lg border border-apple-border"
                        >
                          <option value="APPROVED">APPROVED (Aprovado)</option>
                          <option value="REVISED_OFFER">REVISED_OFFER (Nova Proposta)</option>
                          <option value="PAID">PAID (Pago via Pix)</option>
                          <option value="CUSTOMER_REJECTED">CUSTOMER_REJECTED (Cliente Recusou)</option>
                          <option value="CANCELED">CANCELED (Cancelada)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Preço Final Confirmado (R$)</label>
                        <input
                          type="number"
                          value={vistoriaPrice}
                          onChange={(e) => setVistoriaPrice(Number(e.target.value))}
                          className="w-full p-2 bg-white rounded-lg border border-apple-border"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Diferenças encontradas / Defeitos não informados</label>
                        <textarea
                          rows={2}
                          value={vistoriaIssues}
                          onChange={(e) => setVistoriaIssues(e.target.value)}
                          placeholder="Ex: Riscos na traseira, Câmera embaçada..."
                          className="w-full p-2 bg-white rounded-lg border border-apple-border resize-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Notas da Vistoria</label>
                        <textarea
                          rows={2}
                          value={vistoriaNotes}
                          onChange={(e) => setVistoriaNotes(e.target.value)}
                          placeholder="E.g., Vistoria física aprovada pelo técnico Marcelo..."
                          className="w-full p-2 bg-white rounded-lg border border-apple-border resize-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setInVistoria(false)}
                          className="flex-1 py-2 bg-white border border-apple-border rounded-xl font-semibold hover:bg-apple-gray text-[11px]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-grow py-2 bg-apple-blue text-white rounded-xl font-semibold hover:bg-apple-blue-hover text-[11px]"
                        >
                          Salvar Vistoria
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
