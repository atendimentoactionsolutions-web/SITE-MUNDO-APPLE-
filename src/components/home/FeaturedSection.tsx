import React from "react";
import { Product } from "@/types/product";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

interface FeaturedSectionProps {
  products: Product[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ products }) => {
  return (
    <section className="py-20 bg-white border-t border-apple-border/40">
      <Container>
        <SectionHeading
          eyebrow="Seleção Especial"
          title="Produtos em Destaque"
          subtitle="Aparelhos selecionados a dedo com as melhores condições de pagamento e pronta entrega."
        />

        <ProductGrid products={products} />

        <div className="mt-14 text-center">
          <Button href="/produtos" variant="secondary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
            Explorar catálogo completo
          </Button>
        </div>
      </Container>
    </section>
  );
};
