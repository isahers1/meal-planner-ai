import { X, Clock, Flame, Square, Wind, Zap, Snowflake } from "lucide-react";
import { CategoryIcon } from "./CategoryIcon";
import type { MealInfo, Equipment } from "../types";

interface RecipeDetailModalProps {
  meal: MealInfo;
  day: string;
  isOpen: boolean;
  onClose: () => void;
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

export function RecipeDetailModal({
  meal,
  day,
  isOpen,
  onClose,
}: RecipeDetailModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Close button - absolute positioned */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Header with Title and Image side by side */}
          <div className="flex flex-col md:flex-row border-b border-gray-200 md:max-h-[300px]">
            {/* Left side - Title and metadata */}
            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                {day}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {meal.name}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {meal.time_estimate} minutes
                </span>
                {meal.equipment[0] && (
                  <span className="flex items-center gap-1.5">
                    {EQUIPMENT_ICONS[meal.equipment[0]]}
                    {EQUIPMENT_LABELS[meal.equipment[0]]}
                  </span>
                )}
              </div>
            </div>

            {/* Right side - Image */}
            <div className="md:w-[45%] flex-shrink-0">
              {meal.image_url ? (
                <div className="relative w-full h-40 md:h-full min-h-[160px] bg-gray-100">
                  <img
                    src={meal.image_url}
                    alt={meal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-40 md:h-full min-h-[160px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Two-column content */}
          <div className="flex flex-col md:flex-row">
            {/* Left column - Ingredients */}
            <div className="md:w-[35%] p-6 md:border-r border-gray-200">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 pb-2 mb-4 border-b-2 border-gray-900">
                Ingredients
              </h3>
              <ul className="space-y-3">
                {Object.entries(meal.ingredients).map(([name, info]) => (
                  <li key={name} className="flex items-start gap-2 text-sm">
                    <CategoryIcon
                      category={info.category}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <span className="text-gray-900 capitalize">
                        {name.replace(/_/g, " ")}
                      </span>
                      <span className="text-gray-500 ml-2">{info.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right column - Instructions */}
            <div className="md:w-[65%] p-6 bg-gray-50/50">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-900 pb-2 mb-4 border-b-2 border-gray-900">
                Preparation
              </h3>
              <ol className="space-y-6">
                {meal.instructions.map((step, i) => (
                  <li key={i} className="text-sm">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Step {i + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
