const fs = require('fs');

let code = fs.readFileSync('src/app/admin/produtos/page.tsx', 'utf8');

// Add category margins state
const stateTarget = 'const [lastSyncInfo, setLastSyncInfo] = useState<any>(null);';
const stateAddition = `const [lastSyncInfo, setLastSyncInfo] = useState<any>(null);
  const [margins, setMargins] = useState({
    iphone: 300,
    mac: 300,
    ipad: 200,
    watch: 200,
    airpods: 150,
    accessories: 100,
  });
  const [savingMargins, setSavingMargins] = useState(false);`;

if (!code.includes('const [margins, setMargins]')) {
  code = code.replace(stateTarget, stateAddition);
}

// Update loadSettings to load margins
const loadSettingsTarget = 'setHideAllPrices(Boolean(data.settings.hideAllPrices));';
const loadSettingsAddition = `setHideAllPrices(Boolean(data.settings.hideAllPrices));
        if (data.settings.categoryMargins) {
          setMargins(data.settings.categoryMargins);
        }`;

if (!code.includes('setMargins(data.settings.categoryMargins);')) {
  code = code.replace(loadSettingsTarget, loadSettingsAddition);
}

// Add handleSaveMargins
const saveMarginsFunc = `  const handleSaveMargins = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSavingMargins(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryMargins: margins,
          resyncNow: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({
          type: "success",
          text: "Margens de lucro atualizadas e preços sincronizados com sucesso no site!",
        });
        await loadProducts();
      } else {
        setFeedback({ type: "error", text: data.error || "Erro ao salvar margens." });
      }
    } catch (err) {
      setFeedback({ type: "error", text: "Erro ao comunicar com o servidor." });
    } finally {
      setSavingMargins(false);
    }
  };

  const handleSyncSupplier = async () => {`;

if (!code.includes('const handleSaveMargins = async')) {
  code = code.replace('const handleSyncSupplier = async () => {', saveMarginsFunc);
}

// Replace the Supplier Sync banner with interactive Margins Controls + Sync Button
const bannerTarget = `        {/* Live Supplier Sync Box */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-3xl p-5 mb-6 text-white shadow-md border border-blue-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-white/10 rounded-2xl shrink-0 backdrop-blur-xs">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold tracking-tight text-white">
                    Sincronização Ao Vivo com Fornecedor (Sem Margem)
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AUTO A CADA 5 MIN
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 mt-1 max-w-2xl leading-relaxed">
                  Os valores dos produtos novos lacrados (iPhones, Macs, iPads, Watch, AirPods e Acessórios) são mantidos sincronizados com a tabela do fornecedor em tempo real. O simulador de Upgrade consome esses mesmos valores ao vivo.
                </p>
              </div>
            </div>

            <button
              onClick={handleSyncSupplier}
              disabled={syncingSupplier}
              className="px-5 py-3 rounded-2xl text-xs font-bold bg-white text-blue-950 hover:bg-blue-50 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 disabled:opacity-60"
            >
              <RefreshCw className={\`w-4 h-4 text-blue-600 \${syncingSupplier ? "animate-spin" : ""}\`} />
              <span>{syncingSupplier ? "Sincronizando..." : "Sincronizar Fornecedor Agora"}</span>
            </button>
          </div>
        </div>`;

const bannerReplacement = `        {/* Live Supplier Sync & Category Margins Controls Box */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 mb-6 text-white shadow-lg border border-indigo-800/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 bg-white/10 rounded-2xl shrink-0 backdrop-blur-xs">
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold tracking-tight text-white">
                    Sincronização Ao Vivo & Margens de Lucro
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AUTO A CADA 5 MIN
                  </span>
                </div>
                <p className="text-xs text-blue-200/80 mt-1 max-w-2xl leading-relaxed">
                  Os valores base são capturados diretamente do fornecedor e acrescidos da margem configurada abaixo. Os produtos e o simulador de Upgrade refletem essa margem ao vivo.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSyncSupplier}
                disabled={syncingSupplier || savingMargins}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/20 disabled:opacity-50"
                title="Forçar sincronização com a tabela do fornecedor agora"
              >
                <RefreshCw className={\`w-3.5 h-3.5 text-blue-300 \${syncingSupplier ? "animate-spin" : ""}\`} />
                <span>{syncingSupplier ? "Sincronizando..." : "Sincronizar Agora"}</span>
              </button>

              <button
                onClick={() => handleSaveMargins()}
                disabled={savingMargins || syncingSupplier}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
              >
                {savingMargins ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Salvar Margens & Aplicar</span>
              </button>
            </div>
          </div>

          {/* Grid de Margens Configuráveis */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                iPhones
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white/60">+ R$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={margins.iphone}
                  onChange={(e) => setMargins({ ...margins, iphone: Number(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs font-extrabold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                MacBooks & iMac
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white/60">+ R$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={margins.mac}
                  onChange={(e) => setMargins({ ...margins, mac: Number(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs font-extrabold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                iPads
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white/60">+ R$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={margins.ipad}
                  onChange={(e) => setMargins({ ...margins, ipad: Number(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs font-extrabold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                Apple Watch
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white/60">+ R$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={margins.watch}
                  onChange={(e) => setMargins({ ...margins, watch: Number(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs font-extrabold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                AirPods
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white/60">+ R$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={margins.airpods}
                  onChange={(e) => setMargins({ ...margins, airpods: Number(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs font-extrabold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-blue-300 block mb-1">
                Acessórios
              </span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white/60">+ R$</span>
                <input
                  type="number"
                  step="10"
                  min="0"
                  value={margins.accessories}
                  onChange={(e) => setMargins({ ...margins, accessories: Number(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs font-extrabold text-white text-right focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>
          </div>
        </div>`;

if (code.includes(bannerTarget)) {
  code = code.replace(bannerTarget, bannerReplacement);
} else {
  code = code.replace(bannerTarget.replace(/\n/g, '\r\n'), bannerReplacement.replace(/\n/g, '\r\n'));
}

fs.writeFileSync('src/app/admin/produtos/page.tsx', code, 'utf8');
console.log('src/app/admin/produtos/page.tsx updated with Margins UI!');
