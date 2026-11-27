import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";

export const metadata = {
  title: "Acessórios Apple Originais | Mundo Apple Delivery",
  description: "Magic Mouse, Magic Keyboard, Magic Trackpad, Apple Pencil Pro, Apple TV 4K e AirTags novos lacrados com garantia oficial Apple.",
};

export default async function AccessoriesCategoryPage() {
  const products = await getProducts({ category: "accessories", condition: "new" });

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Acessórios Originais"
          title="Acessórios Apple"
          subtitle="Magic Mouse, Magic Keyboard, Apple Pencil, Apple TV 4K e AirTag novos com garantia oficial."
        />
        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
