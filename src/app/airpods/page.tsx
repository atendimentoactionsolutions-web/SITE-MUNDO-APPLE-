import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Music, ShieldCheck, Zap } from "lucide-react";


export const metadata = {
  title: "AirPods Novos Lacrados | Mundo Apple Delivery",
  description: "AirPods 4, AirPods 4 ANC, AirPods Pro 3 e AirPods Max 2 com cancelamento de ruído e áudio espacial.",
};

export default async function AirPodsCategoryPage() {
  const products = await getProducts({ category: "airpods" });

  return (
    <div className="pt-20 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        

        

        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
