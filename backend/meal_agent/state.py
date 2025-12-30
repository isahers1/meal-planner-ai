"""State schema for the meal planner agent."""

from typing import TypedDict, Annotated
from langchain_core.messages import BaseMessage
import operator


class DayInput(TypedDict, total=False):
    """Input configuration for a single day."""
    dinner: bool
    dinner_leftovers: bool
    dinner_time_limit: int


class MealInfo(TypedDict):
    """Information about a generated meal."""
    name: str
    ingredients: dict[str, str]  # ingredient name -> quantity with unit
    instructions: list[str]


class MealPlannerState(TypedDict, total=False):
    """Main state for the meal planner graph."""

    # Input from frontend
    meal_input: dict[str, DayInput]  # day name -> DayInput

    # Processing state
    current_day_index: int
    days_to_process: list[str]  # List of days that need meals generated

    # Output - uses reducer to merge updates incrementally
    meal_output: Annotated[dict[str, MealInfo], operator.or_]
    shopping_list: Annotated[dict[str, str], operator.or_]  # ingredient -> "quantity unit" (e.g., "0.5 lb")

    # Fresh ingredient tracking for waste minimization
    # Tracks remaining quantities of perishable ingredients
    # e.g., {"onion": 0.75, "ground_beef_lb": 0.5}
    fresh_inventory: Annotated[dict[str, float], operator.or_]

    # Messages for LLM interactions
    messages: Annotated[list[BaseMessage], operator.add]
