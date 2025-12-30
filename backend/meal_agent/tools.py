"""Tools for the meal planner agent."""

from langchain_community.tools.tavily_search import TavilySearchResults


def get_recipe_search_tool() -> TavilySearchResults:
    """Create a Tavily search tool configured for recipe search."""
    return TavilySearchResults(
        name="recipe_search",
        description=(
            "Search for recipes online. Use this to find dinner recipes based on "
            "time constraints, ingredients to use up, or cuisine preferences. "
            "Returns recipe names, URLs, and snippets."
        ),
        max_results=5,
    )
