import { DayBox } from "./components/DayBox";
import { ShoppingList } from "./components/ShoppingList";
import { useMealPlanner } from "./hooks/useMealPlanner";
import { DAYS_OF_WEEK } from "./types";
import type { DayOfWeek } from "./types";

function App() {
  const {
    dayInputs,
    meals,
    shoppingList,
    isLoading,
    currentDay,
    error,
    hasDaysSelected,
    updateDay,
    submit,
    reset,
  } = useMealPlanner();

  const hasMeals = Object.keys(meals).length > 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Weekly Meal Planner
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Select which days you want to cook dinner, set your time constraints,
          and let AI plan your meals.
        </p>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Day Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {DAYS_OF_WEEK.map((day: DayOfWeek) => (
            <DayBox
              key={day}
              day={day}
              dayInput={dayInputs[day]}
              meal={meals[day] || null}
              isLoading={isLoading}
              isCurrentDay={currentDay === day}
              onChange={updateDay}
            />
          ))}
        </div>

        {/* Shopping List */}
        {Object.keys(shoppingList).length > 0 && (
          <div className="mb-8">
            <ShoppingList items={shoppingList} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          {hasMeals && (
            <button
              onClick={reset}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Start Over
            </button>
          )}
          <button
            onClick={submit}
            disabled={isLoading || !hasDaysSelected || hasMeals}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Meals...
              </>
            ) : (
              "Generate Meal Plan"
            )}
          </button>
        </div>

        {/* Help text */}
        {!hasDaysSelected && !hasMeals && (
          <p className="text-center text-gray-500 mt-4">
            Check "Want to cook dinner" on at least one day to get started.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
