import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { technicalServices } from "@/data/services";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { TechnicalService } from "@/types/service";

// Abstraction layer for Data Access.
// In the storefront, only "new" products are displayed for sale.
// Seminovos are kept in the database and catalog for Trade-in (upgrade) and valuation.

export async function getProducts(options?: {
  category?: string;
  condition?: "new" | "used" | "all";
  featured?: boolean;
  searchQuery?: string;
}): Promise<Product[]> {
  // 1. Filter active
  let list = products.filter((p) => p.active);

  // 2. Filter condition: default to "new" for storefront sales unless "all" or "used" explicitly specified
  if (options?.condition === "all") {
    // Keep all
  } else if (options?.condition === "used") {
    list = list.filter((p) => p.condition === "used");
  } else {
    // Default: only new products for direct store sales
    list = list.filter((p) => p.condition === "new");
  }

  // 3. Filter category
  if (options?.category) {
    const rawCat = options.category.toLowerCase();
    const cat = rawCat === "acessorios" ? "accessories" : rawCat;
    list = list.filter((p) => p.category.toLowerCase() === cat);
  }

  // 4. Filter featured
  if (options?.featured !== undefined) {
    list = list.filter((p) => p.featured === options.featured);
  }

  // 5. Filter search query
  if (options?.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.subcategory?.toLowerCase().includes(query)
    );
  }

  // 6. Sort by exact model hierarchy ordering (launches first)
  const modelOrder = [
    "iphone-duo",
    "iphone-18-pro-max",
    "iphone-18-pro",
    "iphone-17-pro-max",
    "iphone-17-pro",
    "iphone-17-air",
    "iphone-17e",
    "iphone-17",
    "iphone-16e",
    "iphone-16",
    "iphone-15",
    "apple-watch-ultra-4",
    "apple-watch-s12",
    "apple-watch-ultra-3",
    "apple-watch-s11",
    "apple-watch-se-3",
    "airpods-5",
    "airpods-pro-3",
    "airpods-4-anc",
    "airpods-4",
    "airpods-max-2"
  ];

  list.sort((a, b) => {
    const idxA = modelOrder.indexOf(a.slug);
    const idxB = modelOrder.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  return list;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true, condition: "new" });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = products.find((p) => p.slug === slug && p.active);
  return product || null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return getProducts({ category: categorySlug, condition: "new" });
}

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = categories.find((c) => c.slug === slug);
  return cat || null;
}

export async function getTechnicalServices(): Promise<TechnicalService[]> {
  return technicalServices;
}

export async function getHomeTechnicalServices(): Promise<TechnicalService[]> {
  return technicalServices.filter((s) => s.featuredHome);
}
