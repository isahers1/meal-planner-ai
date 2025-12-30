"""LangGraph agent for meal planning."""

from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, ToolMessage
from pydantic import BaseModel, Field

from meal_agent.state import MealPlannerState, MealInfo
from meal_agent.tools import get_recipe_search_tool
from meal_agent.constants import DAYS_OF_WEEK, PANTRY_STAPLES


class RecipeIngredient(BaseModel):
    """A single ingredient with quantity."""
    name: str = Field(description="Name of the ingredient, lowercase with underscores, e.g. 'onion', 'ground_beef'")
    quantity: float = Field(description="Numeric quantity needed")
    unit: str = Field(description="Unit of measurement. Use weight (lb, oz) for meats/proteins, volume (cup, tbsp, tsp) for liquids/powders, count with specifier for produce (clove, slice, medium, large). Examples: 'lb', 'oz', 'cup', 'tbsp', 'clove', 'medium', 'slice'")
    is_fresh: bool = Field(description="Whether this is a fresh/perishable ingredient that spoils within a week")


class ParsedRecipe(BaseModel):
    """Structured recipe information."""
    name: str = Field(description="Name of the recipe")
    ingredients: list[RecipeIngredient] = Field(description="List of ingredients with quantities")
    instructions: list[str] = Field(description="Step-by-step cooking instructions")


# Set up tools and LLM
recipe_search_tool = get_recipe_search_tool()
tools = [recipe_search_tool]

llm = ChatOpenAI(model="gpt-4o", temperature=0.7)
llm_with_tools = llm.bind_tools(tools)
structured_llm = llm.with_structured_output(ParsedRecipe)


def initialize(state: MealPlannerState) -> dict:
    """Initialize processing state - build list of days to process."""
    meal_input = state.get("meal_input", {})

    # Build list of days that need meals (in order)
    days_to_process = [
        day for day in DAYS_OF_WEEK
        if meal_input.get(day, {}).get("dinner", False)
    ]

    return {
        "days_to_process": days_to_process,
        "current_day_index": 0,
        "meal_output": {},
        "shopping_list": {},
        "fresh_inventory": {},
        "messages": [],
    }


def generate_meal(state: MealPlannerState) -> dict:
    """Generate a meal for the current day - call LLM with tools."""
    days_to_process = state.get("days_to_process", [])
    current_index = state.get("current_day_index", 0)

    if current_index >= len(days_to_process):
        return {"messages": []}

    day = days_to_process[current_index]
    meal_input = state.get("meal_input", {})
    day_input = meal_input.get(day, {})

    time_limit = day_input.get("dinner_time_limit", 60)
    has_leftovers = day_input.get("dinner_leftovers", False)
    servings = 2 if has_leftovers else 1

    # Get fresh inventory for context
    fresh_inventory = state.get("fresh_inventory", {})

    # Build prompt with context about remaining ingredients
    inventory_context = ""
    if fresh_inventory:
        inventory_items = [f"{name}: {qty:.2f}" for name, qty in fresh_inventory.items() if qty > 0.1]
        if inventory_items:
            inventory_context = (
                "\n\nIMPORTANT - You have these fresh ingredients remaining that should be used up "
                "to avoid waste. STRONGLY prefer recipes that use these ingredients:\n"
                + "\n".join(f"- {item}" for item in inventory_items)
            )

    system_prompt = f"""You are a helpful meal planning assistant. Your task is to find and suggest a dinner recipe.

Requirements:
- The recipe must take {time_limit} minutes or less total (prep + cooking time)
- The recipe should serve {servings} person(s)
- Choose recipes with commonly available ingredients
- Prefer simple, home-cooked meals{inventory_context}

Use the recipe_search tool to find a recipe, then provide complete details including:
- Recipe name
- Full ingredient list with quantities
- Step-by-step cooking instructions"""

    human_prompt = f"""Find a dinner recipe for {day.capitalize()} that takes {time_limit} minutes or less.
Search for a recipe and provide the complete details."""

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=human_prompt),
    ]

    response = llm_with_tools.invoke(messages)
    return {"messages": messages + [response]}


def should_use_tools(state: MealPlannerState) -> str:
    """Check if the last message has tool calls."""
    messages = state.get("messages", [])
    if not messages:
        return "process"

    last_message = messages[-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return "process"


def process_tool_response(state: MealPlannerState) -> dict:
    """After tools run, continue the conversation to get the full recipe."""
    messages = state.get("messages", [])

    # Continue the conversation to get the full recipe details
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


def process_recipe(state: MealPlannerState) -> dict:
    """Process the LLM response to extract and structure the recipe."""
    messages = state.get("messages", [])
    days_to_process = state.get("days_to_process", [])
    current_index = state.get("current_day_index", 0)

    if current_index >= len(days_to_process):
        return {}

    day = days_to_process[current_index]
    meal_input = state.get("meal_input", {})
    day_input = meal_input.get(day, {})
    has_leftovers = day_input.get("dinner_leftovers", False)
    servings = 2 if has_leftovers else 1

    # Get the last AI message (the recipe response)
    last_ai_message = None
    for msg in reversed(messages):
        if isinstance(msg, AIMessage) and msg.content:
            last_ai_message = msg
            break

    if not last_ai_message:
        # Create a fallback meal if no response
        meal_info: MealInfo = {
            "name": f"Simple dinner for {day}",
            "ingredients": {"chicken_breast": "1 lb", "vegetables": "mixed"},
            "instructions": ["Season and cook chicken", "Serve with vegetables"],
        }
        return {
            "meal_output": {day: meal_info},
            "shopping_list": {"chicken_breast": 1.0},
        }

    # Use structured output to parse the recipe
    parse_prompt = f"""Parse the following recipe information into a structured format.
Scale all ingredient quantities for {servings} serving(s).

Recipe text:
{last_ai_message.content}

Extract:
1. Recipe name
2. All ingredients with precise quantities and PROPER UNITS
3. Step-by-step instructions
4. Mark each ingredient as fresh (spoils within a week) or not

CRITICAL - Unit formatting rules:
- Meats/proteins: use weight (lb or oz). Example: "0.5 lb chicken_breast", "4 oz salmon"
- Garlic: use "clove" not whole heads. Example: "2 clove garlic"
- Onions/peppers/tomatoes: use "medium" or "large" or weight. Example: "1 medium onion"
- Liquids: use volume (cup, tbsp, tsp). Example: "0.25 cup soy_sauce"
- Cheese: use weight or volume. Example: "0.25 cup parmesan" or "2 oz cheddar"
- Herbs: use "tbsp" for chopped or "sprig" for whole. Example: "2 tbsp cilantro"
- Pasta/rice/grains: use weight or volume. Example: "4 oz pasta" or "0.5 cup rice"

For ingredient names, use lowercase with underscores (e.g., 'ground_beef', 'bell_pepper', 'garlic').
Common fresh items: meat, poultry, fish, vegetables, fruits, dairy, eggs, fresh herbs.
Non-fresh: canned goods, pasta, rice, dried spices, condiments."""

    try:
        parsed: ParsedRecipe = structured_llm.invoke(parse_prompt)
    except Exception as e:
        # If parsing fails, create a simple fallback
        print(f"Recipe parsing failed: {e}")
        meal_info = {
            "name": f"Dinner for {day}",
            "ingredients": {},
            "instructions": ["See recipe details above"],
        }
        return {"meal_output": {day: meal_info}}

    # Build the meal info
    ingredients_dict = {}
    shopping_updates = {}
    fresh_updates = {}
    current_inventory = dict(state.get("fresh_inventory", {}))

    # Track units separately for proper shopping list formatting
    ingredient_units = {}

    for ing in parsed.ingredients:
        ing_name = ing.name.lower().replace(" ", "_")

        # Skip pantry staples
        if ing_name in PANTRY_STAPLES or any(staple in ing_name for staple in PANTRY_STAPLES):
            continue

        ingredients_dict[ing_name] = f"{ing.quantity} {ing.unit}"

        # Update shopping list - aggregate quantities and track units
        current_qty = shopping_updates.get(ing_name, 0)
        shopping_updates[ing_name] = current_qty + ing.quantity
        ingredient_units[ing_name] = ing.unit  # Store the unit

        # Track fresh ingredients
        if ing.is_fresh:
            if ing_name not in current_inventory:
                # First time using this ingredient - "buy" a standard unit
                # For simplicity, we'll track what's been used
                fresh_updates[ing_name] = ing.quantity
            else:
                # Already have some, add to usage
                fresh_updates[ing_name] = current_inventory[ing_name] + ing.quantity

    # Format shopping list with units
    formatted_shopping = {}
    for ing_name, qty in shopping_updates.items():
        unit = ingredient_units.get(ing_name, "")
        if qty == int(qty):
            formatted_shopping[ing_name] = f"{int(qty)} {unit}".strip()
        else:
            formatted_shopping[ing_name] = f"{qty:.2g} {unit}".strip()

    meal_info: MealInfo = {
        "name": parsed.name,
        "ingredients": ingredients_dict,
        "instructions": parsed.instructions,
    }

    return {
        "meal_output": {day: meal_info},
        "shopping_list": formatted_shopping,
        "fresh_inventory": fresh_updates,
        "messages": [],  # Clear messages for next day
    }


def advance_day(state: MealPlannerState) -> dict:
    """Move to the next day in the processing queue."""
    current_index = state.get("current_day_index", 0)
    return {"current_day_index": current_index + 1}


def should_continue(state: MealPlannerState) -> str:
    """Determine if there are more days to process."""
    days_to_process = state.get("days_to_process", [])
    current_index = state.get("current_day_index", 0)

    if current_index < len(days_to_process):
        return "continue"
    return "end"


def format_output(state: MealPlannerState) -> dict:
    """Format the final output - shopping list is already formatted with units."""
    # Shopping list is already formatted as "quantity unit" strings
    # Just pass through as-is
    return {}


# Build the graph
builder = StateGraph(MealPlannerState)

# Add nodes
builder.add_node("initialize", initialize)
builder.add_node("generate_meal", generate_meal)
builder.add_node("tools", ToolNode(tools))
builder.add_node("process_tool_response", process_tool_response)
builder.add_node("process_recipe", process_recipe)
builder.add_node("advance_day", advance_day)
builder.add_node("format_output", format_output)

# Add edges
builder.add_edge(START, "initialize")
builder.add_edge("initialize", "generate_meal")

# After generate_meal, check if tools need to be called
builder.add_conditional_edges(
    "generate_meal",
    should_use_tools,
    {
        "tools": "tools",
        "process": "process_recipe",
    }
)

# After tools, continue conversation
builder.add_edge("tools", "process_tool_response")

# After tool response, check again for more tool calls
builder.add_conditional_edges(
    "process_tool_response",
    should_use_tools,
    {
        "tools": "tools",
        "process": "process_recipe",
    }
)

# After processing recipe, advance day
builder.add_edge("process_recipe", "advance_day")

# After advancing day, check if we should continue or end
builder.add_conditional_edges(
    "advance_day",
    should_continue,
    {
        "continue": "generate_meal",
        "end": "format_output",
    }
)

builder.add_edge("format_output", END)

# Compile the graph
graph = builder.compile()
