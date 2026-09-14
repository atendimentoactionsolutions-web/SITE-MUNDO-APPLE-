import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ShieldCheck, BatteryCharging, CheckCircle, Tag } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    modelo?: string;
  }>;
}

export const metadata = {
  title: "Seminovos Certificados Apple (Do 11 ao 16 Pro Max) | Mundo Apple Delivery",
  description: "iPhones seminovos rigorosamente testados, 100% originais, inspecionados em mais de 30 pontos e com garantia de 90 dias.",
};

export default async function SeminovosPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const modelFilter = params.modelo;

  let seminovos = await getProducts({ condition: "used" });

  if (modelFilter) {
    seminovos = seminovos.filter((p) =>
      p.name.toLowerCase().includes(modelFilter.toLowerCase())
    );
  }

  const modelFilters = [
    { label: "Todos os Seminovos", query: "" },
    { label: "iPhone 16", query: "iPhone 16" },
    { label: "iPhone 15", query: "iPhone 15" },
    { label: "iPhone 14", query: "iPhone 14" },
    { label: "iPhone 13", query: "iPhone 13" },
    { label: "iPhone 12", query: "iPhone 12" },
    { label: "iPhone 11", query: "iPhone 11" },
  ];

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Procedência & Garantia"
          title="Seminovos Selecionados"
          subtitle="Do iPhone 11 ao iPhone 16 Pro Max. Aparelhos 100% originais, rigorosamente testados e com garantia de 90 dias."
        />

        {/* Quality Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <BatteryCharging className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-apple-dark text-sm">Bateria de Alta Performance</h3>
              <p className="text-xs text-apple-muted">Aparelhos selecionados com saúde da bateria preservada.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-apple-blue rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-apple-dark text-sm">Garantia de 90 Dias</h3>
              <p className="text-xs text-apple-muted">Suporte técnico direto pela nossa loja na Santa Ifigênia.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-apple-border/60 shadow-apple-card flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-apple-dark text-sm">Peças 100% Originais</h3>
              <p className="text-xs text-apple-muted">Nenhum componente genérico ou recondicionado de baixa qualidade.</p>
            </div>
          </div>
        </div>

        {/* Generation Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {modelFilters.map((f) => {
            const isSelected =
              (!modelFilter && f.query === "") ||
              (modelFilter && modelFilter === f.query);

            const href = f.query ? `/seminovos?modelo=${encodeURIComponent(f.query)}` : "/seminovos";

            return (
              <Link
                key={f.label}
                href={href}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-apple-dark text-white shadow"
                    : "bg-white text-apple-dark border border-apple-border hover:bg-gray-100"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={seminovos}
          emptyMessage="Nenhum produto seminovo encontrado neste filtro. Fale no WhatsApp para consultar novos lotes!"
        />
      </Container>
    </div>
  );
}
