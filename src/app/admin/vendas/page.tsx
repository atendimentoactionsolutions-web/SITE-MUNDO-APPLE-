"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Award,
  CheckSquare,
  Eye,
  Play,
  Sparkles,
  Smartphone,
  RefreshCw,
  Sliders,
  Power,
  ArrowRight,
  Clock,
  MessageCircle,
  ExternalLink,
  LogOut
} from "lucide-react";
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
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                PRODUÇÃO
              </span>
            </div>
            <p className="text-sm text-apple-muted mt-1">
              Simulações recentes de Venda e Upgrade, cotações e controle geral de preços.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/produtos"
              className="px-4 py-2.5 bg-apple-dark hover:bg-black text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Produtos Novos Lacrados</span>
            </Link>

            <Link
              href="/admin/vendas/precos"
              className="px-4 py-2.5 bg-apple-blue hover:bg-apple-blue-hover text-white text-xs font-bold rounded-2xl transition-all shadow-sm flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Gerenciar Valores (Editar / Ativar)</span>
            </Link>

            <Link
              href="/admin/whatsapp"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl transition-colors flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Status WhatsApp</span>
            </Link>

            <Link
              href="/admin/vendas/deflatores"
              className="px-4 py-2.5 bg-white border border-apple-border text-xs font-bold rounded-2xl hover:bg-apple-gray transition-colors"
            >
              Deflatores
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-2xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Sair do painel"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Metrics Row */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-2xs space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-apple-blue" />
                <span>Simulações Hoje</span>
              </div>
              <p className="text-2xl font-bold text-apple-dark">{metrics.quotesTodayCount}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-2xs space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Valor Cotado Hoje</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(metrics.totalValueToday)}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-2xs space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>Clientes Hoje</span>
              </div>
              <p className="text-2xl font-bold text-apple-dark">{metrics.uniqueLeadsToday}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-apple-border/50 shadow-2xs space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Aceitas Hoje</span>
              </div>
              <p className="text-2xl font-bold text-apple-dark">{metrics.acceptedQuotesToday}</p>
            </div>

            <div className="col-span-2 md:col-span-1 bg-white p-5 rounded-2xl border border-apple-border/50 shadow-2xs space-y-1">
              <div className="text-[11px] font-semibold text-apple-muted uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-apple-dark" />
                <span>Total de Simulações</span>
              </div>
              <p className="text-2xl font-bold text-apple-dark">{metrics.totalQuotesCount}</p>
            </div>
          </div>
        )}

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* List and Filters */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-2xs flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 w-4 h-4 text-apple-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por cliente, WhatsApp, aparelho ou código..."
                  className="w-full pl-9 pr-4 py-2 bg-apple-gray text-xs rounded-xl border border-apple-border focus:outline-none focus:ring-2 focus:ring-apple-blue font-medium"
                />
              </div>

              {/* Date Filter */}
              <div className="flex gap-2 text-xs">
                <select
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2 bg-apple-gray rounded-xl border border-apple-border focus:outline-none font-medium cursor-pointer"
                >
                  <option value="all">Todas as datas</option>
                  <option value="today">Hoje</option>
                  <option value="7days">Últimos 7 dias</option>
                  <option value="30days">Últimos 30 dias</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-apple-gray rounded-xl border border-apple-border focus:outline-none font-medium cursor-pointer"
                >
                  <option value="all">Todos os Status</option>
                  <option value="QUOTED">QUOTED (Cotado)</option>
                  <option value="MANUAL_REVIEW">MANUAL_REVIEW (Revisão)</option>
                  <option value="CUSTOMER_ACCEPTED">CUSTOMER_ACCEPTED (Aceito)</option>
                  <option value="APPROVED">APPROVED (Aprovado)</option>
                  <option value="PAID">PAID (Pago no Pix)</option>
                  <option value="BLOCKED">BLOCKED (Bloqueado)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-apple-border">
                <Loader2 className="w-8 h-8 animate-spin text-apple-blue mb-2" />
                <p className="text-xs text-apple-muted font-semibold">Carregando simulações recentes...</p>
              </div>
            ) : quotes.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-apple-border text-center text-apple-muted">
                <Smartphone className="w-8 h-8 text-apple-muted/60 mx-auto mb-2" />
                <p className="text-sm font-semibold">Nenhuma simulação encontrada com os filtros atuais.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-apple-border overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-apple-gray border-b border-apple-border font-bold text-apple-muted uppercase tracking-wider text-[10px]">
                        <th className="p-4">Código / Data</th>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Aparelho</th>
                        <th className="p-4">Valor Avaliado</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-apple-border/50">
                      {quotes.map((q) => {
                        const dateFormatted = new Date(q.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <tr
                            key={q.id}
                            className={`hover:bg-apple-gray/30 transition-colors ${
                              selectedQuoteId === q.id ? "bg-apple-blue/5" : ""
                            }`}
                          >
                            <td className="p-4">
                              <span className="font-bold text-apple-dark block">{q.publicCode}</span>
                              <span className="text-[10px] text-apple-muted">{dateFormatted}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold block text-apple-dark">
                                {q.customer?.name || "Sem Nome"}
                              </span>
                              <span className="text-[11px] text-apple-muted font-medium">
                                {q.customer?.whatsapp}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold block text-apple-dark">{q.deviceName}</span>
                              <span className="text-[10px] text-apple-muted">{q.storageName}</span>
                            </td>
                            <td className="p-4 font-bold text-apple-blue text-sm">
                              {q.finalPrice > 0 ? formatCurrency(q.finalPrice) : "Sob Consulta"}
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
                                className="p-2 bg-apple-gray hover:bg-apple-dark hover:text-white rounded-xl transition-all inline-flex items-center justify-center cursor-pointer shadow-2xs"
                                title="Ver detalhes completos"
                              >
                                <Eye className="w-4 h-4" />
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
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5">
            {selectedQuoteId === null ? (
              <div className="bg-white p-10 rounded-3xl border border-apple-border text-center text-apple-muted shadow-2xs h-full min-h-[350px] flex flex-col items-center justify-center space-y-3">
                <Search className="w-10 h-10 text-apple-muted/40" />
                <h3 className="font-bold text-apple-dark text-sm">Selecione uma simulação</h3>
                <p className="text-xs max-w-xs text-apple-muted">
                  Clique no ícone de olho em qualquer simulação da lista para ver todas as respostas, dados do cliente e cálculo.
                </p>
              </div>
            ) : loadingDetail ? (
              <div className="bg-white p-10 rounded-3xl border border-apple-border text-center shadow-2xs h-full flex flex-col items-center justify-center space-y-2">
                <Loader2 className="w-8 h-8 animate-spin text-apple-blue" />
                <span className="text-xs font-semibold text-apple-muted">Carregando detalhes...</span>
              </div>
            ) : selectedQuoteDetail ? (
              <div className="bg-white p-6 rounded-3xl border border-apple-border shadow-sm space-y-6 animate-in fade-in duration-200 text-left">
                <div className="flex items-center justify-between border-b border-apple-border pb-4">
                  <div>
                    <span className="text-[10px] text-apple-muted font-bold uppercase tracking-wider block">
                      Ficha da Simulação
                    </span>
                    <h2 className="text-xl font-extrabold text-apple-dark">
                      {selectedQuoteDetail.quote.publicCode}
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-apple-muted bg-apple-gray px-2.5 py-1 rounded-lg">
                    {new Date(selectedQuoteDetail.quote.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Cliente */}
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">
                    Dados do Cliente
                  </h3>
                  <div className="p-3 bg-apple-gray/50 rounded-2xl border border-apple-border/50 space-y-1 text-xs">
                    <p className="font-bold text-sm text-apple-dark">
                      {selectedQuoteDetail.customer?.name || "Sem cadastro"}
                    </p>
                    <p className="text-apple-muted font-medium flex items-center gap-1.5">
                      <span>WhatsApp:</span>
                      <strong className="text-apple-dark font-bold">
                        {selectedQuoteDetail.customer?.whatsapp}
                      </strong>
                    </p>
                    {selectedQuoteDetail.customer?.whatsapp && (
                      <a
                        href={`https://wa.me/55${selectedQuoteDetail.customer.whatsapp.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline pt-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Conversar no WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Aparelho */}
                <div className="space-y-1.5 border-t border-apple-border/50 pt-4">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">
                    Aparelho Selecionado
                  </h3>
                  <div className="text-sm font-bold text-apple-dark flex items-center justify-between">
                    <span>
                      {selectedQuoteDetail.deviceName} ({selectedQuoteDetail.storageName})
                    </span>
                    <span className="text-apple-blue font-extrabold text-base">
                      {selectedQuoteDetail.quote.finalPrice > 0
                        ? formatCurrency(selectedQuoteDetail.quote.finalPrice)
                        : "Sob Consulta"}
                    </span>
                  </div>
                </div>

                {/* Respostas da Avaliação */}
                <div className="space-y-2 border-t border-apple-border/50 pt-4">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">
                    Respostas Declaradas no Questionário
                  </h3>
                  <div className="bg-apple-gray p-3.5 rounded-2xl max-h-48 overflow-y-auto text-[11px] space-y-1.5">
                    {selectedQuoteDetail.answers.map((ans: any) => (
                      <div
                        key={ans.id}
                        className="flex items-start justify-between border-b border-apple-border/40 pb-1.5 gap-2"
                      >
                        <span className="text-apple-muted font-medium shrink-0">
                          {ans.questionCode}:
                        </span>
                        <span className="font-semibold text-apple-dark text-right break-words">
                          {ans.answer}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detalhes do Cálculo */}
                <div className="space-y-2 border-t border-apple-border/50 pt-4 text-xs">
                  <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">
                    Demonstrativo de Cálculo
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-apple-muted">Preço Base Tabela:</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedQuoteDetail.quote.basePriceSnapshot)}
                    </span>
                  </div>
                  {selectedQuoteDetail.deflatorsApplied.map((def: any) => (
                    <div key={def.id} className="flex justify-between text-red-600 text-[11px]">
                      <span>
                        {def.labelSnapshot} (
                        {def.typeSnapshot === "PERCENTAGE" ? `${def.valueSnapshot}%` : "Fixo"}):
                      </span>
                      <span className="font-bold">-{formatCurrency(def.calculatedDiscount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-apple-border/60 pt-2 font-bold text-apple-blue text-sm">
                    <span>Valor Avaliado:</span>
                    <span>{formatCurrency(selectedQuoteDetail.quote.finalPrice)}</span>
                  </div>
                </div>

                {/* Vistoria Section */}
                <div className="border-t border-apple-border/50 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-apple-muted uppercase tracking-wider">
                      Vistoria Técnica & Fechamento
                    </h3>
                    {!inVistoria && (
                      <button
                        onClick={() => setInVistoria(true)}
                        className="px-3 py-1.5 bg-apple-dark text-white rounded-xl text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Play className="w-3 h-3" />
                        <span>Editar / Vistoriar</span>
                      </button>
                    )}
                  </div>

                  {inVistoria && (
                    <form
                      onSubmit={handleInspectionSubmit}
                      className="space-y-3 p-4 bg-apple-gray rounded-2xl text-xs border border-apple-border"
                    >
                      <div>
                        <label className="block font-bold mb-1">Status do Atendimento</label>
                        <select
                          value={vistoriaStatus}
                          onChange={(e) => setVistoriaStatus(e.target.value)}
                          className="w-full p-2 bg-white rounded-xl border border-apple-border font-medium cursor-pointer"
                        >
                          <option value="QUOTED">QUOTED (Cotado)</option>
                          <option value="CUSTOMER_ACCEPTED">CUSTOMER_ACCEPTED (Cliente Aceitou)</option>
                          <option value="APPROVED">APPROVED (Vistoria Aprovada)</option>
                          <option value="REVISED_OFFER">REVISED_OFFER (Contraproposta)</option>
                          <option value="PAID">PAID (Pago via Pix / Concluído)</option>
                          <option value="CUSTOMER_REJECTED">CUSTOMER_REJECTED (Cliente Recusou)</option>
                          <option value="CANCELED">CANCELED (Cancelada)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Valor Final Acordado (R$)</label>
                        <input
                          type="number"
                          value={vistoriaPrice}
                          onChange={(e) => setVistoriaPrice(Number(e.target.value))}
                          className="w-full p-2 bg-white rounded-xl border border-apple-border font-bold text-apple-dark"
                        />
                      </div>

                      <div>
                        <label className="block font-bold mb-1">Observações da Vistoria</label>
                        <textarea
                          rows={2}
                          value={vistoriaNotes}
                          onChange={(e) => setVistoriaNotes(e.target.value)}
                          placeholder="Ex: Aparelho impecável, bateria 92% confirmada, pago no PIX..."
                          className="w-full p-2 bg-white rounded-xl border border-apple-border resize-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setInVistoria(false)}
                          className="flex-1 py-2 bg-white border border-apple-border rounded-xl font-bold hover:bg-apple-gray text-xs cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-grow py-2 bg-apple-blue hover:bg-apple-blue-hover text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs"
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
