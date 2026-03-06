import { prisma } from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export function calcNewQty(
  currentQty: number,
  delta: number,
  type: TransactionType
): number {
  return type === "IN" ? currentQty + delta : currentQty - delta;
}

export function calcReversedQty(
  currentQty: number,
  delta: number,
  type: TransactionType
): number {
  return type === "IN" ? currentQty - delta : currentQty + delta;
}

// เลือกเฉพาะ field ที่ใช้จริงใน StockMovement response
// ไม่ดึง imageUrl (base64) ที่อาจหนักมาก
const PRODUCT_SELECT = {
  id: true,
  productId: true,
  name: true,
  unitPrice: true,
} as const;

/**
 * สร้าง stock movement พร้อม update quantity ใน single transaction
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

    // แก้: เปลี่ยนจาก include: { product: true }
    // เป็น select เฉพาะ field ที่ใช้ — ไม่ดึง imageUrl กลับมา
    const movement = await tx.stockTransaction.create({
      data: { productId, type, quantity: qty, note },
      include: { product: { select: PRODUCT_SELECT } },
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
      include: { product: { select: { ...PRODUCT_SELECT, quantity: true } } },
    });
    if (!movement) throw new Error("Not found");

    const reversedQty = calcReversedQty(
      movement.product.quantity,
      movement.quantity,
      movement.type
    );

    // แก้: เดิมใช้ Math.max(0, reversedQty) ซึ่งซ่อน error เงียบๆ
    // ถ้า reversedQty ติดลบ แปลว่า data ไม่ consistent — ควร throw แทน
    if (reversedQty < 0) {
      throw new Error(
        "ไม่สามารถลบรายการนี้ได้: จะทำให้จำนวนสินค้าติดลบ"
      );
    }

    await tx.stockTransaction.delete({ where: { id } });
    await tx.product.update({
      where: { id: movement.productId },
      data: { quantity: reversedQty },
    });

    return { success: true };
  });
}
