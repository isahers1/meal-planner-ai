import type { DayInput, DayOfWeek, MealInfo } from "../types";
import { MealDisplay } from "./MealDisplay";

interface DayBoxProps {
  day: DayOfWeek;
  dayInput: DayInput;
  meal: MealInfo | null;
  isLoading: boolean;
  isCurrentDay: boolean;
  onChange: (day: DayOfWeek, updates: Partial<DayInput>) => void;
}

export function DayBox({
  day,
  dayInput,
  meal,
  isLoading,
  isCurrentDay,
  onChange,
}: DayBoxProps) {
  const displayName = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow-sm transition-all ${
        isCurrentDay && isLoading
          ? "ring-2 ring-blue-400 ring-opacity-50"
          : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{displayName}</h3>

      {meal ? (
        // Show meal after generation
        <MealDisplay meal={meal} />
      ) : isLoading && isCurrentDay ? (
        // Show loading state for current day
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Finding recipe...</span>
        </div>
      ) : (
        // Show input form
        <div className="space-y-3">
          {/* Dinner checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={dayInput.dinner}
              onChange={(e) => onChange(day, { dinner: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Want to cook dinner</span>
          </label>

          {/* Conditional fields - only show when dinner is checked */}
          {dayInput.dinner && (
            <div className="ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
              {/* Leftovers checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dayInput.dinner_leftovers}
                  onChange={(e) =>
                    onChange(day, { dinner_leftovers: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Want leftovers for lunch tomorrow
                </span>
              </label>

              {/* Time limit input */}
              <div className="flex items-center gap-2">
                <label className="text-gray-700">Time limit:</label>
                <input
                  type="number"
                  value={dayInput.dinner_time_limit}
                  onChange={(e) =>
                    onChange(day, {
                      dinner_time_limit: parseInt(e.target.value) || 30,
                    })
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  min={10}
                  max={180}
                />
                <span className="text-gray-700">min</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
