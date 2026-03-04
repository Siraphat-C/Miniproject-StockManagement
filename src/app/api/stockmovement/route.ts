import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";
import { createStockMovement } from "@/lib/actions/stock.actions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const productId = searchParams.get("productId") || "";
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const typeParam = searchParams.get("type");

    const movements = await prisma.stockTransaction.findMany({
      where: {
        // Filter by date range (Thailand UTC+7 → subtract 7hrs for UTC)
        ...(from || to
          ? {
              createdAt: {
                ...(from ? { gte: new Date(`${from}T00:00:00.000+07:00`) } : {}),
                ...(to ? { lte: new Date(`${to}T23:59:59.999+07:00`) } : {}),
              },
            }
          : {}),
        // Filter by product
        ...(productId
          ? { product: { productId: { equals: productId, mode: "insensitive" } } }
          : search
          ? {
              OR: [
                { product: { name: { contains: search, mode: "insensitive" } } },
                { product: { productId: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
        // Filter by type
        ...(typeParam ? { type: typeParam as TransactionType } : {}),
      },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(movements);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch movements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, type, quantity, note } = body;

    const movement = await createStockMovement(
      productId,
      type as TransactionType,
      Number(quantity),
      note
    );

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create movement";
    const status = message === "จำนวนสินค้าไม่เพียงพอ" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}