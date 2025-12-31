import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { TimeSlider } from "./TimeSlider";
import { SegmentedControl } from "./SegmentedControl";
import { RecipeCard } from "./RecipeCard";
import { RecipeDetailModal } from "./RecipeDetailModal";
import type { DayInput, DayOfWeek, MealInfo } from "../types";

interface DayColumnProps {
  day: DayOfWeek;
  input: DayInput;
  meal?: MealInfo;
  isLoading: boolean;
  onUpdate: (updates: Partial<DayInput>) => void;
}

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function DayColumn({
  day,
  input,
  meal,
  isLoading,
  onUpdate,
}: DayColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isActive = input.dinner;

  const handleColumnClick = () => {
    if (!meal && !isLoading) {
      onUpdate({ dinner: !input.dinner });
    }
  };

  return (
    <div
      className={`flex-shrink-0 w-[calc(100%/7)] min-w-[140px] h-full border-r border-gray-200 last:border-r-0 flex flex-col ${
        isActive ? "bg-white" : "bg-gray-50"
      }`}
    >
      {/* Day header */}
      <button
        type="button"
        onClick={handleColumnClick}
        disabled={!!meal || isLoading}
        className={`px-3 py-4 text-center border-b border-gray-200 transition-colors ${
          !meal && !isLoading ? "cursor-pointer hover:bg-gray-100" : ""
        }`}
      >
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            isActive ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {DAY_LABELS[day]}
        </span>
      </button>

      {/* Content area */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            <span className="text-xs text-gray-400">Finding recipe...</span>
          </div>
        ) : meal ? (
          <RecipeCard meal={meal} onClick={() => setIsModalOpen(true)} />
        ) : isActive ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <TimeSlider
              value={input.dinner_time_limit}
              onChange={(value) => onUpdate({ dinner_time_limit: value })}
            />
            <SegmentedControl
              value={input.dinner_leftovers}
              onChange={(value) => onUpdate({ dinner_leftovers: value })}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleColumnClick}
            className="w-full flex-1 flex flex-col items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6 text-gray-300" />
            <span className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Tap to plan meals
            </span>
          </button>
        )}
      </div>

      {/* Active indicator */}
      {isActive && !meal && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-900" />
      )}

      {/* Recipe detail modal */}
      {meal && (
        <RecipeDetailModal
          meal={meal}
          day={DAY_FULL_LABELS[day]}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
