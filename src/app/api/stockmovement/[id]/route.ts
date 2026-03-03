import { NextRequest, NextResponse } from "next/server";
import { deleteStockMovement } from "@/lib/actions/stock.actions";

// ✅ ใช้ deleteStockMovement() ที่ย้าย logic ออกแล้ว
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deleteStockMovement(id);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete movement";
    const status = message === "Not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}