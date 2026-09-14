import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Mouse, Edit3, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Acessórios Apple Originais | Mundo Apple Delivery",
  description: "Magic Mouse 3, Magic Mouse 2, Apple Pencil Pro, Apple Pencil 2, Apple Pencil USB-C e AirTags 1 e 4 Pack novos com garantia oficial Apple.",
};

export default async function AccessoriesCategoryPage() {
  const products = await getProducts({ category: "accessories" });

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Acessórios Originais"
          title="O complemento perfeito para o seu Apple."
          subtitle="Magic Mouse, Apple Pencil e AirTags 100% originais, novos e lacrados de fábrica com garantia Apple."
        />

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 -mt-4">
          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shrink-0">
              <Mouse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Navegação Multi-Touch</h4>
              <p className="text-[11px] text-apple-muted">Fluidez e precisão sem fio</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Precisão de Pixel</h4>
              <p className="text-[11px] text-apple-muted">Apple Pencil com resposta imediata</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">100% Originais Apple</h4>
              <p className="text-[11px] text-apple-muted">1 ano de garantia oficial</p>
            </div>
          </div>
        </div>

        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
