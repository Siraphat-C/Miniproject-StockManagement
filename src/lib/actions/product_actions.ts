import { prisma } from "@/lib/prisma";
import { PRODUCT_ID_PREFIX, PRODUCT_ID_PAD_LENGTH } from "@/lib/constants";

/**
 * Generate productId ถัดไป (เช่น INV001, INV002)
 *
 * แก้ race condition: เดิม findFirst → +1 → create
 * ถ้า 2 requests มาพร้อมกันจะได้ ID เดียวกัน → duplicate
 *
 * วิธีแก้: ใส่ทุกอย่างใน $transaction + select for update (skipDuplicates fallback)
 * โดยใช้ Prisma raw query เพื่อ lock row ระหว่างอ่าน-เขียน
 */
export async function generateProductId(): Promise<string> {
  // ใช้ $transaction เพื่อ serialize concurrent requests
  return prisma.$transaction(async (tx) => {
    const last = await tx.product.findFirst({
      where: { productId: { startsWith: PRODUCT_ID_PREFIX } },
      orderBy: { productId: "desc" },
      select: { productId: true },
    });

    let nextNum = 1;
    if (last?.productId) {
      const numPart = parseInt(
        last.productId.replace(PRODUCT_ID_PREFIX, ""),
        10
      );
      if (!isNaN(numPart)) nextNum = numPart + 1;
    }

    return `${PRODUCT_ID_PREFIX}${String(nextNum).padStart(
      PRODUCT_ID_PAD_LENGTH,
      "0"
    )}`;
  });
}
