import { NextRequest, NextResponse } from "next/server";
import {
  getAllProductsWithOverrides,
  setProductActive,
  toggleProductsBatch,
  updateProductPrices,
} from "@/lib/products-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // In admin panel, pass true to ignore global price hiding so the admin still sees the catalog prices
    const list = getAllProductsWithOverrides(true);
    return NextResponse.json({
      success: true,
      count: list.length,
      products: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, active, batch, category, condition, priceFrom, variants } = body;

    // Price update for product (and its variants if provided)
    if (productId && (priceFrom !== undefined || variants !== undefined)) {
      const parsedPrice = priceFrom !== undefined ? Number(priceFrom) : 0;
      const updated = updateProductPrices(productId, parsedPrice, variants);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Produto não encontrado." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Valores de "${updated.name}" atualizados com sucesso!`,
        product: updated,
      });
    }

    // Batch toggle (e.g., all products or all in a category)
    if (batch && typeof active === "boolean") {
      const affected = toggleProductsBatch({
        active,
        category: category || "all",
        condition: condition || "all",
      });

      return NextResponse.json({
        success: true,
        message: `${affected} produtos atualizados com sucesso.`,
        affected,
      });
    }

    // Single product toggle
    if (productId && typeof active === "boolean") {
      const updated = setProductActive(productId, active);
      if (!updated) {
        return NextResponse.json(
          { success: false, error: "Produto não encontrado." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Status de "${updated.name}" atualizado para ${active ? "Ativo" : "Desativado"}.`,
        product: updated,
      });
    }

    return NextResponse.json(
      { success: false, error: "Parâmetros inválidos." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
