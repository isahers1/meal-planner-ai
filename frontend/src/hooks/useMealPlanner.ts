import { useState, useCallback } from "react";
import { DAYS_OF_WEEK, DEFAULT_DAY_INPUT } from "../types";
import type { DayInput, DayOfWeek, MealInfo } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2024";

type DayInputs = Record<DayOfWeek, DayInput>;

function createInitialDayInputs(): DayInputs {
  return DAYS_OF_WEEK.reduce(
    (acc, day) => ({
      ...acc,
      [day]: { ...DEFAULT_DAY_INPUT },
    }),
    {} as DayInputs
  );
}

export function useMealPlanner() {
  const [dayInputs, setDayInputs] = useState<DayInputs>(createInitialDayInputs);
  const [meals, setMeals] = useState<Record<string, MealInfo>>({});
  const [shoppingList, setShoppingList] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState<DayOfWeek | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateDay = useCallback(
    (day: DayOfWeek, updates: Partial<DayInput>) => {
      setDayInputs((prev) => ({
        ...prev,
        [day]: { ...prev[day], ...updates },
      }));
    },
    []
  );

  const reset = useCallback(() => {
    setMeals({});
    setShoppingList({});
    setError(null);
    setCurrentDay(null);
  }, []);

  const submit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMeals({});
    setShoppingList({});

    // Determine which days need processing to show loading states
    const daysToProcess = DAYS_OF_WEEK.filter((day) => dayInputs[day].dinner);
    if (daysToProcess.length > 0) {
      setCurrentDay(daysToProcess[0]);
    }

    try {
      const response = await fetch(`${API_URL}/runs/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assistant_id: "meal_planner",
          input: { meal_input: dayInputs },
          stream_mode: ["updates"],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          // Handle SSE format
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6);
              if (jsonStr === "[DONE]") continue;

              const data = JSON.parse(jsonStr);

              // LangGraph streams updates as {node_name: node_output}
              // We need to look inside each node's output for meal_output/shopping_list
              if (typeof data === "object" && data !== null) {
                for (const nodeOutput of Object.values(data)) {
                  const output = nodeOutput as Record<string, unknown>;

                  // Update meals as they come in
                  if (output?.meal_output) {
                    const mealOutput = output.meal_output as Record<
                      string,
                      MealInfo
                    >;
                    setMeals((prev) => ({ ...prev, ...mealOutput }));

                    // Update current day indicator
                    const newDays = Object.keys(mealOutput);
                    if (newDays.length > 0) {
                      const completedDay = newDays[0] as DayOfWeek;
                      const completedIndex =
                        daysToProcess.indexOf(completedDay);
                      if (
                        completedIndex >= 0 &&
                        completedIndex < daysToProcess.length - 1
                      ) {
                        setCurrentDay(daysToProcess[completedIndex + 1]);
                      }
                    }
                  }

                  // Update shopping list
                  if (output?.shopping_list) {
                    setShoppingList((prev) => ({
                      ...prev,
                      ...(output.shopping_list as Record<string, string>),
                    }));
                  }
                }
              }
            } catch {
              // Skip malformed JSON lines
            }
          }
        }
      }
    } catch (err) {
      console.error("Error generating meal plan:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
      setCurrentDay(null);
    }
  }, [dayInputs]);

  // Check if any days have dinner selected
  const hasDaysSelected = DAYS_OF_WEEK.some((day) => dayInputs[day].dinner);

  return {
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
  };
}
