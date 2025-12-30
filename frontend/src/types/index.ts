/**
 * TypeScript types for the meal planner application.
 */

// Days of the week
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Input configuration for a single day
export interface DayInput {
  dinner: boolean;
  dinner_leftovers: boolean;
  dinner_time_limit: number;
}

// The meal input sent to the backend
export interface MealInput {
  meal_input: Record<DayOfWeek, DayInput>;
}

// Information about a generated meal
export interface MealInfo {
  name: string;
  ingredients: Record<string, string>; // ingredient name -> quantity with unit
  instructions: string[];
}

// Response from the meal planner
export interface MealPlannerResponse {
  meal_output: Record<string, MealInfo>;
  shopping_list: Record<string, string>;
}

// Default values for a day's input
export const DEFAULT_DAY_INPUT: DayInput = {
  dinner: false,
  dinner_leftovers: false,
  dinner_time_limit: 30,
};
