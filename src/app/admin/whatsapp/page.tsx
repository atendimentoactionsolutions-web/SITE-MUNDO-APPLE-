"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  QrCode,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Send,
  ArrowLeft,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function WhatsAppAdminPage() {
  const [status, setStatus] = useState<"DISCONNECTED" | "SCAN_QR" | "CONNECTED" | "CONNECTING">("DISCONNECTED");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Test send state
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("Olá! Este é um teste da automação de WhatsApp do Mundo Apple. 🍏");
  const [testStatus, setTestStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  // Fetch status
  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/whatsapp/status", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setPhoneNumber(data.phoneNumber);
      }
    } catch (err) {
      console.error("Erro ao obter status do WhatsApp:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Fast polling every 1.5s to catch QR code update smoothly
    const interval = setInterval(fetchStatus, 1500);
    return () => clearInterval(interval);
  }, []);

  // Connect / Generate QR
  const handleConnect = async (forceReset = false) => {
    try {
      setActionLoading(true);
      setStatus("CONNECTING");
      const res = await fetch("/api/whatsapp/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceReset }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
        setQrCodeDataUrl(data.qrCodeDataUrl);
        setPhoneNumber(data.phoneNumber);
      }
    } catch (err) {
      console.error("Erro ao conectar WhatsApp:", err);
    } finally {
      setActionLoading(false);
      fetchStatus();
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    if (!confirm("Deseja realmente desconectar o WhatsApp da loja?")) return;
    try {
      setActionLoading(true);
      await fetch("/api/whatsapp/disconnect", { method: "POST" });
      await fetchStatus();
    } catch (err) {
      console.error("Erro ao desconectar WhatsApp:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Send test message
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;

    try {
      setTestStatus({ message: "Enviando mensagem de teste..." });
      const res = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: testPhone, text: testMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setTestStatus({ success: true, message: "Mensagem enviada com sucesso no WhatsApp!" });
      } else {
        setTestStatus({ success: false, message: data.error || "Falha ao enviar mensagem." });
      }
    } catch (err: any) {
      setTestStatus({ success: false, message: err.message || "Erro na requisição." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/vendas"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Painel de Vendas
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 font-semibold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Automação Ativa
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-emerald-600" />
            Conexão WhatsApp da Loja
          </h1>
          <p className="text-slate-600 mt-1">
            Conecte o número do WhatsApp da sua loja via QR Code para disparar mensagens automáticas de cotação para os clientes.
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  status === "CONNECTED"
                    ? "bg-emerald-100 text-emerald-600"
                    : status === "SCAN_QR"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {status === "CONNECTED" ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : status === "SCAN_QR" ? (
                  <QrCode className="w-8 h-8" />
                ) : (
                  <Smartphone className="w-8 h-8" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">Status da Conexão:</h2>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      status === "CONNECTED"
                        ? "bg-emerald-500 text-white"
                        : status === "SCAN_QR"
                        ? "bg-amber-500 text-white animate-pulse"
                        : status === "CONNECTING"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {status === "CONNECTED"
                      ? "Conectado"
                      : status === "SCAN_QR"
                      ? "Aguardando Leitura do QR"
                      : status === "CONNECTING"
                      ? "Iniciando..."
                      : "Desconectado"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {status === "CONNECTED"
                    ? `WhatsApp autenticado e pronto para disparos (${phoneNumber || "Número da Loja"}).`
                    : status === "SCAN_QR"
                    ? "Aponte a câmera do WhatsApp no seu celular para o QR Code abaixo."
                    : "Clique no botão abaixo para gerar o QR Code de conexão."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {status === "CONNECTED" ? (
                <button
                  onClick={handleDisconnect}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition"
                >
                  <LogOut className="w-4 h-4" />
                  Desconectar WhatsApp
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(true)}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition"
                >
                  <RefreshCw className={`w-4 h-4 ${actionLoading ? "animate-spin" : ""}`} />
                  {status === "SCAN_QR" ? "Gerar Novo QR Code" : "Conectar WhatsApp"}
                </button>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          {status === "SCAN_QR" && qrCodeDataUrl && (
            <div className="pt-8 flex flex-col items-center text-center">
              <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar um Aparelho
              </div>
              <div className="p-4 bg-white border-2 border-dashed border-emerald-400 rounded-3xl shadow-lg inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code WhatsApp"
                  className="w-72 h-72 object-contain rounded-2xl"
                />
              </div>
              <p className="text-xs text-slate-500 mt-4 max-w-sm">
                O QR Code é atualizado automaticamente. Após escanear, o status mudará para conectado em instantes.
              </p>
            </div>
          )}

          {/* Connected State View */}
          {status === "CONNECTED" && (
            <div className="pt-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <h3 className="font-bold text-emerald-900">Automação de Cotações 100% Pronta!</h3>
                  <p className="text-emerald-700 mt-1 leading-relaxed">
                    Sempre que um cliente finalizar a avaliação em <strong>/vender</strong> e preencher o número de WhatsApp, o seu número da loja enviará a mensagem de confirmação e detalhes do orçamento imediatamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test Message Box (Available when connected) */}
        {status === "CONNECTED" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Send className="w-5 h-5 text-emerald-600" />
              Testar Envio de Mensagem
            </h2>
            <form onSubmit={handleSendTest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Número de Telefone (com DDD)
                  </label>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="Ex: 11999999999"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mensagem
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  required
                />
              </div>

              {testStatus && (
                <div
                  className={`text-sm p-3 rounded-xl flex items-center gap-2 ${
                    testStatus.success === true
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : testStatus.success === false
                      ? "bg-rose-50 text-rose-800 border border-rose-200"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {testStatus.success === true ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : testStatus.success === false ? (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                  )}
                  {testStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-sm"
              >
                <Send className="w-4 h-4" />
                Enviar Mensagem de Teste
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
