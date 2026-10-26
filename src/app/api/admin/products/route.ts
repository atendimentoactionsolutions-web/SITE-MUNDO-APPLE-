import { NextRequest, NextResponse } from "next/server";
import {
  getAllProductsWithOverrides,
  setProductActive,
  toggleProductsBatch,
} from "@/lib/products-store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const list = getAllProductsWithOverrides();
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
    const { productId, active, batch, category, condition } = body;

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
        message: `Status de "${updated.name}" atualizado para ${active ? "Ativo" : "Inativo"}.`,
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
