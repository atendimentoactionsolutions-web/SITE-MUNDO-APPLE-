import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Cpu, BatteryCharging, ShieldCheck, Laptop } from "lucide-react";
import Link from "next/link";


interface PageProps {
  searchParams: Promise<{
    subcategoria?: string;
  }>;
}

export const metadata = {
  title: "MacBook Pro, MacBook Air e Mac M5/M4 | Mundo Apple Delivery",
  description: "Linha completa de MacBook Pro M5, MacBook Air M5, iMac M4, Mac mini e MacBook Neo com garantia oficial Apple.",
};

export default async function MacCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const subcategoryFilter = params.subcategoria;

  let products = await getProducts({ category: "mac" });

  if (subcategoryFilter) {
    products = products.filter((p) =>
      p.subcategory?.toLowerCase().includes(subcategoryFilter.toLowerCase())
    );
  }

  const subcategories = [
    { label: "Todos os Macs", slug: "" },
    { label: "MacBook Pro M5", slug: "MacBook Pro" },
    { label: "MacBook Air M5", slug: "MacBook Air" },
    { label: "MacBook Neo", slug: "MacBook Neo" },
    { label: "iMac 24\"", slug: "iMac" },
    { label: "Mac mini", slug: "Mac mini" },
  ];

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Linha Mac & MacBook"
          title="Potência extrema com Apple Silicon M5 e M4."
          subtitle="MacBook Pro, MacBook Air, MacBook Neo, iMac e Mac mini novos lacrados com 1 ano de garantia oficial Apple."
        />

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-4">
          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Chips M5 & M4</h4>
              <p className="text-[11px] text-apple-muted">Velocidade e IA de última geração</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Bateria para o dia todo</h4>
              <p className="text-[11px] text-apple-muted">Até 22 horas de autonomia</p>
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

            const href = sub.slug ? `/mac?subcategoria=${encodeURIComponent(sub.slug)}` : "/mac";

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
