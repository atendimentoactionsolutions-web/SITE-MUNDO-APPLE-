const fs = require('fs');
let code = fs.readFileSync('src/app/admin/produtos/page.tsx', 'utf8');

// Add ArrowDownCircle, Zap icons to imports
if (!code.includes('ArrowDownCircle')) {
  code = code.replace('RefreshCw,', 'RefreshCw, ArrowDownCircle, Zap,');
}

// Add state for syncing
const stateTarget = 'const [savingPrices, setSavingPrices] = useState(false);';
const stateAddition = `const [savingPrices, setSavingPrices] = useState(false);
  const [syncingSupplier, setSyncingSupplier] = useState(false);
  const [lastSyncInfo, setLastSyncInfo] = useState<any>(null);`;

if (!code.includes('const [syncingSupplier, setSyncingSupplier]')) {
  code = code.replace(stateTarget, stateAddition);
}

// Add handleSyncSupplier function
const funcTarget = 'const handleToggleProduct = async (product: Product) => {';
const syncFunc = `const handleSyncSupplier = async () => {
    if (!confirm("Deseja sincronizar agora os preços de todos os produtos novos lacrados direto do fornecedor (sem margem)?\\n\\nOs preços do catálogo da loja e do simulador de Upgrade serão atualizados instantaneamente.")) {
      return;
    }

    setSyncingSupplier(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/supplier-sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setLastSyncInfo(data);
        setFeedback({
          type: "success",
          text: \`Sincronização ao vivo concluída com sucesso! \${data.matchedProductsCount} produtos e \${data.updatedVariantsCount} opções/cores atualizados com preço puro do fornecedor.\`,
        });
        await loadProducts();
      } else {
        setFeedback({
          type: "error",
          text: (data.errors && data.errors.join(", ")) || data.error || "Erro ao sincronizar com fornecedor.",
        });
      }
    } catch (err) {
      setFeedback({ type: "error", text: "Erro ao comunicar com a API do fornecedor." });
    } finally {
      setSyncingSupplier(false);
    }
  };

  const handleToggleProduct = async (product: Product) => {`;

if (!code.includes('const handleSyncSupplier = async () => {')) {
  code = code.replace(funcTarget, syncFunc);
}

// Add Live Sync Banner right below Master Box
const masterBoxTarget = '{/* Feedback Alert */}';
const syncBanner = `{/* Live Supplier Sync Box */}
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
        </div>

        {/* Feedback Alert */}`;

if (!code.includes('Sincronização Ao Vivo com Fornecedor')) {
  code = code.replace(masterBoxTarget, syncBanner);
}

fs.writeFileSync('src/app/admin/produtos/page.tsx', code, 'utf8');
console.log('src/app/admin/produtos/page.tsx updated with Supplier Sync UI!');
