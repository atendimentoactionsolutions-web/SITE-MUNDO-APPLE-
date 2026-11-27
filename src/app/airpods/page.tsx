import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";

export const metadata = {
  title: "AirPods 5, Pro 3, 4 ANC e Max Novos Lacrados | Mundo Apple Delivery",
  description: "AirPods 5, AirPods Pro 3, AirPods 4 ANC e AirPods Max 2 novos lacrados com cancelamento de ruído e áudio espacial.",
};

export default async function AirPodsCategoryPage() {
  const products = await getProducts({ category: "airpods", condition: "new" });

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Áudio Apple"
          title="AirPods"
          subtitle="Cancelamento Ativo de Ruído, Áudio Espacial e qualidade sonora oficial Apple."
        />
        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
