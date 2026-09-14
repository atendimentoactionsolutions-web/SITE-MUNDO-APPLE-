import { NextRequest, NextResponse } from "next/server";
import { db, QuoteStatus } from "@/lib/sell/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { publicCode: string } }
) {
  try {
    const code = params.publicCode;
    const body = await request.json();
    const { status } = body;

    const quoteIndex = db.sellQuotes.findIndex((q) => q.publicCode === code);

    if (quoteIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Quote not found" },
        { status: 404 }
      );
    }

    const quote = db.sellQuotes[quoteIndex];
    quote.status = status as QuoteStatus;
    quote.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, quote });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
