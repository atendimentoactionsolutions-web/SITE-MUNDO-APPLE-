import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Tablet, PenTool, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";


interface PageProps {
  searchParams: Promise<{
    subcategoria?: string;
  }>;
}

export const metadata = {
  title: "iPad Pro M5 e iPad 11 | Mundo Apple Delivery",
  description: "Linha completa de iPad Pro M5 de 11\" e 13\" e iPad 11ª Geração novos lacrados com garantia Apple de 1 ano.",
};

export default async function IPadCategoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const subcategoryFilter = params.subcategoria;

  let products = await getProducts({ category: "ipad" });

  if (subcategoryFilter) {
    products = products.filter((p) =>
      p.subcategory?.toLowerCase().includes(subcategoryFilter.toLowerCase())
    );
  }

  const subcategories = [
    { label: "Todos os iPads", slug: "" },
    { label: "iPad Pro M5", slug: "iPad Pro M5" },
    { label: "iPad 11ª Geração", slug: "iPad 11" },
  ];

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Linha iPad"
          title="Sua tela mágica para tudo."
          subtitle="iPad Pro com chip M5 e tela Ultra Retina XDR OLED, e novo iPad 11 em cores incríveis. 100% novos e lacrados."
        />

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 -mt-4">
          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Chip M5 & Ultra OLED</h4>
              <p className="text-[11px] text-apple-muted">Velocidade e contraste infinito</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Apple Pencil Pro</h4>
              <p className="text-[11px] text-apple-muted">Precisão cirúrgica para desenhar</p>
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

            const href = sub.slug ? `/ipad?subcategoria=${encodeURIComponent(sub.slug)}` : "/ipad";

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
