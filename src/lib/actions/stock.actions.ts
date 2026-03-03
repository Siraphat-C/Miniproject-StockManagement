import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export function calcNewQty(currentQty: number, delta: number, type: TransactionType): number {
  return type === "IN" ? currentQty + delta : currentQty - delta;
}

export function calcReversedQty(currentQty: number, delta: number, type: TransactionType): number {
  return type === "IN" ? currentQty - delta : currentQty + delta;
}

/**
 * สร้าง stock movement พร้อม update quantity ใน single transaction
 * แก้ race condition — ทุกอย่างอยู่ใน $transaction เดียว
 */
export async function createStockMovement(
  productId: string,
  type: TransactionType,
  qty: number,
  note?: string
) {
  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

    const newQty = calcNewQty(product.quantity, qty, type);
    if (newQty < 0) throw new Error("จำนวนสินค้าไม่เพียงพอ");

    const movement = await tx.stockTransaction.create({
      data: { productId, type, quantity: qty, note },
      include: { product: true },
    });

    await tx.product.update({
      where: { id: productId },
      data: { quantity: newQty },
    });

    return movement;
  });
}

/**
 * ลบ stock movement พร้อม reverse quantity ใน single transaction
 */
export async function deleteStockMovement(id: string) {
  return prisma.$transaction(async (tx) => {
    const movement = await tx.stockTransaction.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!movement) throw new Error("Not found");

    const reversedQty = calcReversedQty(
      movement.product.quantity,
      movement.quantity,
      movement.type
    );

    await tx.stockTransaction.delete({ where: { id } });
    await tx.product.update({
      where: { id: movement.productId },
      data: { quantity: Math.max(0, reversedQty) },
    });

    return { success: true };
  });
}