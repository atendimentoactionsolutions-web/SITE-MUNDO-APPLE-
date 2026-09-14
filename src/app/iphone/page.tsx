import { getProducts } from "@/lib/data";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "iPhones Novos e Lacrados | Mundo Apple Delivery",
  description: "Confira a linha completa de lançamentos e modelos lacrados com 1 ano de garantia oficial Apple.",
};

const iphoneOrder = [
  "iphone-duo",
  "iphone-18-pro-max",
  "iphone-18-pro",
  "iphone-17-pro-max",
  "iphone-17-pro",
  "iphone-17-air",
  "iphone-17e",
  "iphone-17",
  "iphone-16",
  "iphone-15",
];

export default async function IPhoneCategoryPage() {
  const rawProducts = await getProducts({ category: "iphone", condition: "new" });
  const sortedProducts = [...rawProducts].sort((a, b) => {
    const idxA = iphoneOrder.indexOf(a.slug);
    const idxB = iphoneOrder.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  return (
    <div className="pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <Container>
        <SectionHeading
          eyebrow="Linha iPhone"
          title="Os smartphones mais inovadores do mundo."
          subtitle="Aparelhos 100% novos e lacrados na caixa com 1 ano de garantia oficial Apple e entrega rápida."
        />

        <ProductGrid products={sortedProducts} />
      </Container>
    </div>
  );
}
