import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProductId } from "@/lib/actions/product.actions";

// ✅ เพิ่ม try/catch ใน GET
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const products = await prisma.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { productId: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, quantity, unitPrice } = body;

    const productId = await generateProductId();
    const product = await prisma.product.create({
      data: {
        productId,
        name,
        category,
        quantity: Number(quantity),
        unitPrice: Number(unitPrice),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}