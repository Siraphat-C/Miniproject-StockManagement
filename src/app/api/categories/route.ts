import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ✅ เพิ่ม try/catch
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    const categories = products.map((p) => p.category);
    return NextResponse.json(categories);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}