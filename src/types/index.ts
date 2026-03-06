// types/index.ts

// แยก Product เป็น 2 type ให้ตรงกับที่ API return จริง:
// - ProductListItem  → GET /api/products       (ไม่มี imageUrl เพราะหนัก)
// - ProductDetail    → GET /api/products/:id   (มี imageUrl สำหรับหน้า detail)

export interface ProductListItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends ProductListItem {
  imageUrl?: string | null; // มีเฉพาะ GET /api/products/:id
}

// backward-compat alias — ค่อยๆ migrate ไปใช้ ProductListItem แทน
export type Product = ProductListItem;

export interface StockMovement {
  id: string;
  productId: string;
  type: "IN" | "OUT";
  quantity: number;
  note?: string | null;
  createdAt: string;
  product?: Pick<ProductListItem, "id" | "productId" | "name" | "unitPrice">;
}

export interface StockStatus {
  label: string;
  className: string;
}
