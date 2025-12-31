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

// Ingredient category type
export type IngredientCategory =
  | "produce"
  | "protein"
  | "dairy"
  | "grains"
  | "pantry"
  | "aromatics";

// Information about a single ingredient
export interface IngredientInfo {
  quantity: string; // e.g., "0.5 lb", "2 cloves"
  category: IngredientCategory;
}

// Equipment type
export type Equipment =
  | "stovetop"
  | "oven"
  | "air_fryer"
  | "microwave"
  | "no_cook";

// Information about a generated meal
export interface MealInfo {
  name: string;
  ingredients: Record<string, IngredientInfo>; // ingredient name -> info with quantity and category
  instructions: string[];
  time_estimate: number; // Total time in minutes
  equipment: Equipment[];
  image_url?: string; // URL of a relevant food image
}

// Shopping list item with category
export interface ShoppingListItem {
  quantity: string;
  category: IngredientCategory;
}

// Response from the meal planner
export interface MealPlannerResponse {
  meal_output: Record<string, MealInfo>;
  shopping_list: Record<string, ShoppingListItem>;
}

// Default values for a day's input
export const DEFAULT_DAY_INPUT: DayInput = {
  dinner: false,
  dinner_leftovers: false,
  dinner_time_limit: 30,
};
