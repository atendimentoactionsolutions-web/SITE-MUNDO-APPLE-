"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, KeyRound, Loader2, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/vendas";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(from);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Usuário ou senha incorretos.");
      }
    } catch (err) {
      setErrorMsg("Erro de conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl border border-[#D2D2D7] p-8 shadow-xl space-y-6 text-center animate-in fade-in duration-200">
      {/* Header Icon */}
      <div className="flex flex-col items-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#1D1D1F] text-white flex items-center justify-center shadow-md mb-2">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Painel Admin</h1>
        <p className="text-xs text-[#86868B]">Acesso restrito Mundo Apple Delivery</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-bold text-[#1D1D1F] mb-1.5">Usuário</label>
          <div className="relative">
            <User className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="adm"
              autoCapitalize="none"
              className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3] font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1D1D1F] mb-1.5">Senha</label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full pl-10 pr-4 py-3 bg-[#F5F5F7] border border-[#D2D2D7] rounded-2xl text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#0071E3] font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#0071E3] hover:bg-[#0077ED] active:scale-95 text-white font-bold text-xs sm:text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <span>Entrar no Painel</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-[11px] text-[#86868B] pt-2">
        Mundo Apple Delivery • Sistema de Gestão Interna
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm bg-white rounded-3xl border border-[#D2D2D7] p-8 shadow-xl text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#0071E3] mx-auto mb-2" />
            <span className="text-xs text-[#86868B]">Carregando...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
