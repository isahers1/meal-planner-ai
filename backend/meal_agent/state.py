"""State schema for the meal planner agent."""

from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage
import operator


class DayInput(TypedDict, total=False):
    """Input configuration for a single day."""
    dinner: bool
    dinner_leftovers: bool
    dinner_time_limit: int


class IngredientInfo(TypedDict):
    """Information about a single ingredient."""
    quantity: str  # e.g., "0.5 lb", "2 cloves"
    category: str  # e.g., "produce", "protein", "dairy", "grains", "pantry", "aromatics"


class MealInfo(TypedDict, total=False):
    """Information about a generated meal."""
    name: str
    ingredients: dict[str, IngredientInfo]  # ingredient name -> info with quantity and category
    instructions: list[str]
    time_estimate: int  # Total time in minutes
    equipment: list[str]  # Required equipment: "stovetop", "oven", "air_fryer", "microwave", "no_cook"
    image_url: str  # URL of a relevant food image


class MealPlannerState(TypedDict, total=False):
    """Main state for the meal planner graph."""

    # Input from frontend
    meal_input: dict[str, DayInput]  # day name -> DayInput

    # Processing state
    current_day_index: int
    days_to_process: list[str]  # List of days that need meals generated

    # Output - uses reducer to merge updates incrementally
    meal_output: Annotated[dict[str, MealInfo], operator.or_]
    shopping_list: Annotated[dict[str, IngredientInfo], operator.or_]  # ingredient -> {quantity, category}

    # Fresh ingredient tracking for waste minimization
    # Tracks remaining quantities of perishable ingredients
    # e.g., {"onion": 0.75, "ground_beef_lb": 0.5}
    fresh_inventory: Annotated[dict[str, float], operator.or_]

    # Messages for LLM interactions
    messages: Annotated[list[BaseMessage], operator.add]
