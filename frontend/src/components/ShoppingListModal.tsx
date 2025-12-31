import { useState } from "react";
import { X, Check } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import type { ShoppingListItem, IngredientCategory } from "../types";

interface ShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Record<string, ShoppingListItem>;
}

const CATEGORY_ORDER: IngredientCategory[] = [
  "produce",
  "protein",
  "dairy",
  "aromatics",
  "grains",
  "pantry",
];

const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  produce: "Produce",
  protein: "Protein",
  dairy: "Dairy",
  aromatics: "Aromatics",
  grains: "Grains",
  pantry: "Pantry",
};

export function ShoppingListModal({
  isOpen,
  onClose,
  items,
}: ShoppingListModalProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  // Group items by category
  const groupedItems = CATEGORY_ORDER.reduce(
    (acc, category) => {
      const categoryItems = Object.entries(items).filter(
        ([, item]) => item.category === category
      );
      if (categoryItems.length > 0) {
        acc[category] = categoryItems;
      }
      return acc;
    },
    {} as Record<IngredientCategory, [string, ShoppingListItem][]>
  );

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-sm h-full shadow-xl animate-slide-in-right overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Shopping List</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No items yet</p>
              <p className="text-gray-400 text-xs mt-1">
                Generate a meal plan to see your shopping list
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {CATEGORY_ORDER.map((category) => {
                const categoryItems = groupedItems[category];
                if (!categoryItems) return null;

                return (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {CATEGORY_LABELS[category]}
                    </h3>
                    <ul className="space-y-2">
                      {categoryItems.map(([name, item]) => {
                        const isChecked = checkedItems.has(name);
                        return (
                          <li key={name}>
                            <button
                              type="button"
                              onClick={() => toggleItem(name)}
                              className={`w-full flex items-center gap-3 text-left py-1.5 transition-opacity ${
                                isChecked ? "opacity-50" : ""
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isChecked
                                    ? "bg-gray-900 border-gray-900"
                                    : "border-gray-300"
                                }`}
                              >
                                {isChecked && (
                                  <Check className="w-3 h-3 text-white" />
                                )}
                              </span>
                              <CategoryIcon category={category} className="flex-shrink-0" />
                              <span
                                className={`text-sm flex-1 ${
                                  isChecked
                                    ? "line-through text-gray-400"
                                    : "text-gray-700"
                                }`}
                              >
                                {name.replace(/_/g, " ")}
                              </span>
                              <span className="text-xs text-gray-400">
                                {item.quantity}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            {checkedItems.size} of {Object.keys(items).length} items checked
          </div>
        </div>
      </div>
    </div>
  );
}
