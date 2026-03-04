import { prisma } from "@/lib/prisma";
import { PRODUCT_ID_PREFIX, PRODUCT_ID_PAD_LENGTH } from "@/lib/constants";

/**
 * Generate productId ถัดไป (เช่น INV001, INV002)
 * แก้ bug เดิมที่ใช้ count() — พอลบสินค้าแล้ว ID อาจซ้ำได้
 * วิธีใหม่: หา productId ล่าสุดแล้วบวก 1
 */
export async function generateProductId(): Promise<string> {
  const last = await prisma.product.findFirst({
    where: { productId: { startsWith: PRODUCT_ID_PREFIX } },
    orderBy: { productId: "desc" },
    select: { productId: true },
  });

  let nextNum = 1;
  if (last?.productId) {
    const numPart = parseInt(last.productId.replace(PRODUCT_ID_PREFIX, ""), 10);
    if (!isNaN(numPart)) nextNum = numPart + 1;
  }

  return `${PRODUCT_ID_PREFIX}${String(nextNum).padStart(PRODUCT_ID_PAD_LENGTH, "0")}`;
}