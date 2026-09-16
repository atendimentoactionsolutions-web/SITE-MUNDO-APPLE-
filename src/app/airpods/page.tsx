import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Music, ShieldCheck, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AirPods Novos Lacrados | Mundo Apple Delivery",
  description: "AirPods 4, AirPods 4 ANC, AirPods Pro 3 e AirPods Max 2 com cancelamento de ruído e áudio espacial.",
};

export default async function AirPodsCategoryPage() {
  const products = await getProducts({ category: "airpods" });

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Linha AirPods"
          title="Mágica como você nunca ouviu."
          subtitle="AirPods 4, AirPods Pro e AirPods Max com áudio espacial, cancelamento ativo de ruído e 1 ano de garantia Apple."
        />

        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 -mt-4">
          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Áudio Espacial</h4>
              <p className="text-[11px] text-apple-muted">Som tridimensional imersivo</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-apple-border/60 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-apple-dark">Cancelamento Ativo</h4>
              <p className="text-[11px] text-apple-muted">Isolamento acústico de ponta</p>
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

        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
