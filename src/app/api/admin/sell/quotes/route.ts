import { NextRequest, NextResponse } from "next/server";
import { db, QuoteStatus } from "@/lib/sell/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // all, today, 7days, 30days
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";
    const statusFilter = searchParams.get("status") || "all";

    let list = [...db.sellQuotes];

    // Filter by date
    const now = Date.now();
    if (filter === "today") {
      const todayStart = new Date().setHours(0, 0, 0, 0);
      list = list.filter((q) => new Date(q.createdAt).getTime() >= todayStart);
    } else if (filter === "7days") {
      const boundary = now - 7 * 24 * 60 * 60 * 1000;
      list = list.filter((q) => new Date(q.createdAt).getTime() >= boundary);
    } else if (filter === "30days") {
      const boundary = now - 30 * 24 * 60 * 60 * 1000;
      list = list.filter((q) => new Date(q.createdAt).getTime() >= boundary);
    }

    // Filter by status
    if (statusFilter !== "all") {
      list = list.filter((q) => q.status === statusFilter);
    }

    // Map variant/customer/model info
    const fullList = list.map((q) => {
      const customer = db.customers.find((c) => c.id === q.customerId);
      const variant = db.deviceVariants.find((v) => v.id === q.deviceVariantId);
      const model = variant
        ? db.deviceModels.find((dm) => dm.id === variant.deviceModelId)
        : null;
      const storage = variant
        ? db.storageOptions.find((so) => so.id === variant.storageOptionId)
        : null;

      return {
        ...q,
        customer,
        deviceName: model?.name || "iPhone",
        storageName: storage?.displayName || "",
      };
    });

    // Filter by search query
    let filteredList = fullList;
    if (searchQuery) {
      filteredList = fullList.filter(
        (item) =>
          item.publicCode.toLowerCase().includes(searchQuery) ||
          item.customer?.name.toLowerCase().includes(searchQuery) ||
          item.customer?.whatsapp.includes(searchQuery) ||
          item.deviceName.toLowerCase().includes(searchQuery)
      );
    }

    // Calculate aggregated metrics
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const quotesToday = db.sellQuotes.filter((q) => new Date(q.createdAt).getTime() >= todayStart);
    
    // Quotes count
    const quotesTodayCount = quotesToday.length;
    // Total value today
    const totalValueToday = quotesToday.reduce((sum, q) => sum + q.finalPrice, 0);
    // Unique leads today (based on customer presence)
    const uniqueLeadsToday = new Set(quotesToday.filter(q => q.customerId).map(q => q.customerId)).size;
    // Accepted quotes
    const acceptedQuotesToday = quotesToday.filter((q) => q.status === "CUSTOMER_ACCEPTED").length;

    return NextResponse.json({
      success: true,
      quotes: filteredList,
      metrics: {
        quotesTodayCount,
        totalValueToday,
        uniqueLeadsToday,
        acceptedQuotesToday,
        totalQuotesCount: db.sellQuotes.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
