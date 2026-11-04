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
    <div className="pt-20 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        

        

        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
