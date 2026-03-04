// Shared TypeScript interfaces for the Stock Management application

export interface Product {
    id: string;
    productId: string;
    name: string;
    category: string;
    quantity: number;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
}

export interface StockMovement {
    id: string;
    productId: string;
    type: "IN" | "OUT";
    quantity: number;
    note?: string | null;
    createdAt: string;
    product?: Pick<Product, "id" | "productId" | "name" | "unitPrice">;
}

export interface StockStatus {
    label: string;
    className: string;
}
