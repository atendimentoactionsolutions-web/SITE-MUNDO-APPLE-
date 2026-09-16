import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { HeartPulse, Compass, ShieldCheck } from "lucide-react";
import Link from "next/link";


interface PageProps {
  searchParams: Promise<{
    subcategoria?: string;
  }>;
}

export const metadata = {
  title: "Apple Watch Series 11, Ultra 3 e SE 3 | Mundo Apple Delivery",
  description: "Linha completa de Apple Watch Series 11, Ultra 3 de titânio e SE 3 novos lacrados com garantia oficial Apple.",
};

export default async function WatchCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const subcategoryFilter = params.subcategoria;

  let products = await getProducts({ category: "watch" });

  if (subcategoryFilter) {
    products = products.filter((p) =>
      p.subcategory?.toLowerCase().includes(subcategoryFilter.toLowerCase())
    );
  }

  const subcategories = [
    { label: "Todos os Watches", slug: "" },
    { label: "Series 11", slug: "Series 11" },
    { label: "Ultra 3", slug: "Ultra 3" },
    { label: "SE 3", slug: "SE 3" },
  ];

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Linha Apple Watch"
          title="O dispositivo definitivo no seu pulso."
          subtitle="Apple Watch Series 11, Ultra 3 e SE 3 para saúde, esportes, segurança e alta conectividade."
        />

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-4">
          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Saúde & Bem-estar</h4>
              <p className="text-[11px] text-apple-muted">ECG, oxímetro e sono avançado</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">GPS & Performance</h4>
              <p className="text-[11px] text-apple-muted">Métricas precisas para atletas</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">100% Originais</h4>
              <p className="text-[11px] text-apple-muted">1 ano de garantia oficial Apple</p>
            </div>
          </div>
        </div>

        {/* Subcategory Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {subcategories.map((sub) => {
            const isSelected =
              (!subcategoryFilter && sub.slug === "") ||
              (subcategoryFilter && subcategoryFilter === sub.slug);

            const href = sub.slug ? `/apple-watch?subcategoria=${encodeURIComponent(sub.slug)}` : "/apple-watch";

            return (
              <Link
                key={sub.label}
                href={href}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-apple-dark text-white shadow"
                    : "bg-white text-apple-dark border border-apple-border hover:bg-gray-100"
                }`}
              >
                {sub.label}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
