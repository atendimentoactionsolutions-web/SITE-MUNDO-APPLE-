import { NextRequest, NextResponse } from "next/server";
import { parseCatalogText } from "@/lib/catalog-parser";
import { products as initialProducts } from "@/data/products";
import { saveOverrides } from "@/lib/products-store";

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

    // Save overrides to products_override.json
    saveOverrides(parsed.productOverrides);

    return NextResponse.json({
      success: true,
      message: "Catálogo atualizado com sucesso!",
      stats: {
        sections: parsed.sectionsCount,
        configurations: parsed.configsCount,
        variants: parsed.variantsCount,
        activeProducts: parsed.activeProductIds.length,
        deactivatedProducts: allExistingIds.length - parsed.activeProductIds.length,
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
