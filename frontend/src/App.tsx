import { Loader2, RotateCcw, Info } from "lucide-react";
import { DayColumn } from "./components/DayColumn";
import { ShoppingListModal } from "./components/ShoppingListModal";
import { ShoppingButton } from "./components/ShoppingButton";
import { InfoModal } from "./components/InfoModal";
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
    isShoppingListOpen,
    isInfoOpen,
    shoppingListCount,
    updateDay,
    submit,
    reset,
    openShoppingList,
    closeShoppingList,
    openInfo,
    closeInfo,
  } = useMealPlanner();

  const hasMeals = Object.keys(meals).length > 0;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Error display */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <span className="font-medium">Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Main content - full width */}
      <main className="flex-1 flex flex-col w-full">
        {/* Week columns */}
        <div className="flex-1 bg-white border-b border-gray-200 overflow-hidden">
          <div className="h-full flex overflow-x-auto scroll-snap-x">
            {DAYS_OF_WEEK.map((day: DayOfWeek) => (
              <DayColumn
                key={day}
                day={day}
                input={dayInputs[day]}
                meal={meals[day]}
                isLoading={isLoading && currentDay === day}
                onUpdate={(updates) => updateDay(day, updates)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Fixed bottom bar */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Info button and Reset button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openInfo}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Info"
            >
              <Info className="w-5 h-5" />
            </button>
            {hasMeals && (
              <button
                onClick={reset}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            )}
          </div>

          {/* Center - Help text or status */}
          <div className="text-sm text-gray-500">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating meals...
              </span>
            ) : !hasDaysSelected && !hasMeals ? (
              <span>Tap a day to start planning</span>
            ) : hasMeals ? (
              <span>{Object.keys(meals).length} meals planned</span>
            ) : (
              <span>{DAYS_OF_WEEK.filter((d) => dayInputs[d].dinner).length} days selected</span>
            )}
          </div>

          {/* Right side - Generate button and shopping cart */}
          <div className="flex items-center gap-3">
            {shoppingListCount > 0 && (
              <ShoppingButton count={shoppingListCount} onClick={openShoppingList} />
            )}
            <button
              onClick={submit}
              disabled={isLoading || !hasDaysSelected || hasMeals}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Generate
            </button>
          </div>
        </div>
      </footer>

      {/* Shopping list modal */}
      <ShoppingListModal
        isOpen={isShoppingListOpen}
        onClose={closeShoppingList}
        items={shoppingList}
      />

      {/* Info modal */}
      <InfoModal isOpen={isInfoOpen} onClose={closeInfo} />
    </div>
  );
}

export default App;
