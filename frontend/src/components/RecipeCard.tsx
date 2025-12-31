import { Clock, Flame, Wind, Zap, Snowflake, Square } from "lucide-react";
import type { MealInfo, Equipment } from "../types";

interface RecipeCardProps {
  meal: MealInfo;
  onClick: () => void;
}

const EQUIPMENT_ICONS: Record<Equipment, React.ReactNode> = {
  stovetop: <Flame className="w-4 h-4" />,
  oven: <Square className="w-4 h-4" />,
  air_fryer: <Wind className="w-4 h-4" />,
  microwave: <Zap className="w-4 h-4" />,
  no_cook: <Snowflake className="w-4 h-4" />,
};

const EQUIPMENT_LABELS: Record<Equipment, string> = {
  stovetop: "Stovetop",
  oven: "Oven",
  air_fryer: "Air Fryer",
  microwave: "Microwave",
  no_cook: "No Cook",
};

export function RecipeCard({ meal, onClick }: RecipeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full h-full flex flex-col items-center justify-center text-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
    >
      {/* Recipe name */}
      <h4 className="font-semibold text-sm text-gray-900 leading-tight mb-3">
        {meal.name}
      </h4>

      {/* Time and equipment */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {meal.time_estimate} min
        </span>
        {meal.equipment[0] && (
          <span className="flex items-center gap-1">
            {EQUIPMENT_ICONS[meal.equipment[0]]}
            {EQUIPMENT_LABELS[meal.equipment[0]]}
          </span>
        )}
      </div>

      {/* Tap hint */}
      <p className="text-xs text-gray-400">Tap for details</p>
    </button>
  );
}
