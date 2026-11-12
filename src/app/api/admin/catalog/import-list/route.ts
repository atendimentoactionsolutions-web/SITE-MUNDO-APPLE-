import { NextRequest, NextResponse } from "next/server";
import { parseCatalogText } from "@/lib/catalog-parser";
import { products as initialProducts } from "@/data/products";
import { getProductOverrides, saveOverrides } from "@/lib/products-store";

import { updateExistingCatalogPrices } from "@/lib/catalog-price-update";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { catalogText } = await request.json();

    if (!catalogText || typeof catalogText !== "string") {
      return NextResponse.json(
        { success: false, error: "Nenhum texto de catálogo enviado." },
        { status: 400 }
      );
    }

    const allExistingIds = initialProducts.map((p) => p.id);
    const parsed = parseCatalogText(catalogText, allExistingIds);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error || "Falha ao processar a lista." },
        { status: 400 }
      );
    }

    const result = updateExistingCatalogPrices(initialProducts, getProductOverrides(), parsed.productOverrides);
    if (!result.matchedVariants) {
      return NextResponse.json({ success: false, error: "Nenhuma configuração existente corresponde à lista. O catálogo foi preservado." }, { status: 400 });
    }
    saveOverrides(result.overrides);

    return NextResponse.json({
      success: true,
      message: "Preços atualizados sem adicionar, excluir ou desativar produtos.",
      stats: {
        sections: parsed.sectionsCount,
        configurations: parsed.configsCount,
        variants: parsed.variantsCount,
        activeProducts: initialProducts.filter(p => result.overrides[p.id]?.active ?? p.active).length,
        deactivatedProducts: 0,
        matchedVariants: result.matchedVariants,
        updatedVariants: result.updatedVariants,
      },
    });
  } catch (error: any) {
    console.error("Error updating catalog via list paste:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erro interno ao atualizar catálogo." },
      { status: 500 }
    );
  }
}
