import { ShoppingCart } from "lucide-react";

interface ShoppingButtonProps {
  count: number;
  onClick: () => void;
}

export function ShoppingButton({ count, onClick }: ShoppingButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      aria-label={`Shopping list (${count} items)`}
    >
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-gray-900 text-xs font-semibold rounded-full flex items-center justify-center shadow">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
