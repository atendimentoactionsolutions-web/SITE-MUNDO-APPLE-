const fs = require('fs');
let code = fs.readFileSync('src/app/admin/vendas/page.tsx', 'utf8');

// Add Eye, EyeOff to lucide-react imports if not present
if (!code.includes('EyeOff,')) {
  code = code.replace('Eye,', 'Eye, EyeOff,');
}

// Add state for hideAllPrices
const stateTarget = 'const [metrics, setMetrics] = useState<any>(null);';
const stateAddition = `const [metrics, setMetrics] = useState<any>(null);
  const [hideAllPrices, setHideAllPrices] = useState(false);
  const [loadingPriceMode, setLoadingPriceMode] = useState(false);`;

if (!code.includes('const [hideAllPrices, setHideAllPrices]')) {
  code = code.replace(stateTarget, stateAddition);
}

// Add loadSettings inside useEffect or call
const loadQuotesTarget = 'const loadQuotes = async () => {';
const settingsFunc = `const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setHideAllPrices(Boolean(data.settings.hideAllPrices));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleHideAllPrices = async () => {
    const nextVal = !hideAllPrices;
    const confirmMsg = nextVal
      ? "Tem certeza que deseja TIRAR TODOS OS VALORES DO AR?\\n\\nO site inteiro passará a exibir 'Sob Consulta' em todos os produtos, vitrine e simuladores de venda/upgrade, sem remover nenhum produto do catálogo."
      : "Deseja RESTAURAR a exibição de todos os valores no site?";

    if (!confirm(confirmMsg)) return;

    setLoadingPriceMode(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hideAllPrices: nextVal }),
      });
      const data = await res.json();
      if (data.success) {
        setHideAllPrices(nextVal);
        alert(data.message || (nextVal ? "Valores retirados do ar!" : "Valores restaurados!"));
      } else {
        alert(data.error || "Erro ao atualizar configuração.");
      }
    } catch (e) {
      alert("Erro ao comunicar com o servidor.");
    } finally {
      setLoadingPriceMode(false);
    }
  };

  const loadQuotes = async () => {`;

if (!code.includes('const loadSettings = async () => {')) {
  code = code.replace(loadQuotesTarget, settingsFunc);
}

// Call loadSettings in useEffect
const effectTarget = 'loadQuotes();';
if (!code.includes('loadSettings();')) {
  code = code.replace(effectTarget, 'loadQuotes();\n    loadSettings();');
}

// Add banner right before {/* Metrics Row */}
const bannerTarget = '{/* Metrics Row */}';
const bannerComponent = `{/* Master Box: MODO TIRAR TODOS OS VALORES DO AR */}
        <div
          className={\`p-4 sm:p-5 rounded-3xl border mb-6 transition-all shadow-sm \${
            hideAllPrices
              ? "bg-amber-500/10 border-amber-300 text-amber-950"
              : "bg-white border-apple-border/70 text-apple-dark"
          }\`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={\`p-3 rounded-2xl shrink-0 \${
                  hideAllPrices ? "bg-amber-500 text-white shadow-sm" : "bg-apple-gray text-apple-dark"
                }\`}
              >
                {hideAllPrices ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold tracking-tight">
                    Modo: Tirar Todos os Valores do Ar (Sob Consulta)
                  </h3>
                  <span
                    className={\`text-[10px] font-extrabold px-2 py-0.5 rounded-full \${
                      hideAllPrices
                        ? "bg-amber-200 text-amber-900 border border-amber-300 animate-pulse"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }\`}
                  >
                    {hideAllPrices ? "MODO ATIVO: VALORES OCULTADOS" : "MODO NORMAL: PREÇOS VISÍVEIS"}
                  </span>
                </div>
                <p className="text-xs text-apple-muted mt-0.5 max-w-2xl leading-relaxed">
                  {hideAllPrices
                    ? "ATENÇÃO: Todos os preços do site inteiro estão ocultados. Os produtos continuam no ar, mas exibem 'Sob Consulta' com botão de direcionamento para o WhatsApp."
                    : "Ao ativar este modo, todos os preços do site (novos, usados, vitrine e simuladores) são substituídos por 'Sob Consulta' instantaneamente, mantendo os produtos no ar."}
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleHideAllPrices}
              disabled={loadingPriceMode}
              className={\`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 \${
                hideAllPrices
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }\`}
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

        {/* Metrics Row */}`;

if (!code.includes('Modo: Tirar Todos os Valores do Ar')) {
  code = code.replace(bannerTarget, bannerComponent);
}

fs.writeFileSync('src/app/admin/vendas/page.tsx', code, 'utf8');
console.log('src/app/admin/vendas/page.tsx updated with Master Toggle!');
