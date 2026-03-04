import { ArrowUp, ArrowDown } from "lucide-react";

interface StockTypeBadgeProps {
    type: "IN" | "OUT";
}

/**
 * Reusable badge component that displays stock movement type (IN/OUT)
 * with consistent color coding and icon across all pages.
 */
export function StockTypeBadge({ type }: StockTypeBadgeProps) {
    const isIn = type === "IN";
    return (
        <span
            className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${isIn ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                }`}
        >
            {isIn ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {isIn ? "รับเข้า" : "เบิกออก"}
        </span>
    );
}
