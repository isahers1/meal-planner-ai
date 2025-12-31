import { Leaf, Drumstick, Milk, Wheat, Package, CircleDot } from "lucide-react";
import type { IngredientCategory } from "../types";

const CATEGORY_ICONS: Record<IngredientCategory, React.ReactNode> = {
  produce: <Leaf className="w-3.5 h-3.5" />,
  protein: <Drumstick className="w-3.5 h-3.5" />,
  dairy: <Milk className="w-3.5 h-3.5" />,
  grains: <Wheat className="w-3.5 h-3.5" />,
  pantry: <Package className="w-3.5 h-3.5" />,
  aromatics: <CircleDot className="w-3.5 h-3.5" />,
};

interface CategoryIconProps {
  category: IngredientCategory;
  className?: string;
}

export function CategoryIcon({ category, className = "" }: CategoryIconProps) {
  return (
    <span className={`text-gray-400 ${className}`}>
      {CATEGORY_ICONS[category] || <CircleDot className="w-3.5 h-3.5" />}
    </span>
  );
}
