import { getProductBySlug, getProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductDetailOptions } from "@/components/products/ProductDetailOptions";
import { ProductCard } from "@/components/products/ProductCard";
import { ShieldCheck, Truck, Store, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { storeConfig } from "@/data/storeConfig";


interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Produto não encontrado" };
  }

  const priceText = product.priceFrom > 0
    ? ` a partir de R$ ${product.priceFrom.toLocaleString("pt-BR")}`
    : "";

  return {
    title: `${product.name}${priceText} em São Paulo | Mundo Apple Delivery`,
    description: `${product.description} Compre ${product.name} com 1 ano de garantia Apple, entrega expressa em SP ou dê seu iPhone usado na troca (Upgrade).`,
    keywords: [
      product.name,
      `Comprar ${product.name}`,
      `${product.name} preço`,
      `${product.name} São Paulo`,
      `${product.name} Santa Ifigênia`,
      `Troca ${product.name}`,
      `Upgrade para ${product.name}`,
      "Mundo Apple Delivery",
    ],
    openGraph: {
      title: `${product.name}${priceText} | Mundo Apple Delivery`,
      description: `${product.description} Aceitamos seu iPhone usado na troca com avaliação online imediata!`,
      url: `https://mundoappledelivery.com/produtos/${product.slug}`,
      images: product.image ? [{ url: `https://mundoappledelivery.com${product.image}` }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProducts({ category: product.category }))
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image ? `https://mundoappledelivery.com${product.image}` : "https://mundoappledelivery.com/images/hero/hero-main.jpg",
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Apple",
    },
    "sku": product.id,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": storeConfig.socialProof.googleRating,
      "reviewCount": storeConfig.socialProof.googleReviewsCount,
      "bestRating": "5",
      "worstRating": "1",
    },
    "offers": {
      "@type": "Offer",
      "url": `https://mundoappledelivery.com/produtos/${product.slug}`,
      "priceCurrency": "BRL",
      "price": product.priceFrom > 0 ? product.priceFrom : undefined,
      "itemCondition": product.condition === "used" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": storeConfig.name,
      },
    },
  };

  return (
    <div className="pt-24 sm:pt-28 pb-20 bg-apple-gray/30 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Container>
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-apple-muted hover:text-apple-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todos os produtos</span>
          </Link>
        </div>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-apple-border shadow-apple-card mb-16">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery
              mainImage={product.image}
              gallery={product.gallery}
              name={product.name}
            />
          </div>

          {/* Right Column: Options & CTAs */}
          <div className="lg:col-span-5">
            <ProductDetailOptions product={product} />
          </div>
        </div>

        {/* Specs & Description Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-apple-border shadow-apple-card mb-16 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-apple-dark mb-4">
              Descrição do Produto
            </h2>
            <p className="text-base text-apple-muted leading-relaxed font-normal">
              {product.description}
            </p>
          </div>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="pt-6 border-t border-apple-border">
              <h3 className="text-lg font-semibold text-apple-dark mb-4">
                Especificações Técnicas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-apple-gray/60 border border-apple-border/50 text-xs"
                  >
                    <span className="text-apple-muted font-medium block uppercase tracking-wider text-[10px] mb-1">
                      {key}
                    </span>
                    <span className="text-apple-dark font-semibold text-sm">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-apple-dark">
              Produtos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
