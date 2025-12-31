"""Tools for the meal planner agent."""

from langchain_community.tools.tavily_search import TavilySearchResults
from tavily import TavilyClient
from langchain_anthropic import ChatAnthropic
from pydantic import BaseModel, Field
import os


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


class ImageRelevance(BaseModel):
    """Whether an image is relevant to a recipe."""
    is_relevant: bool = Field(description="True if the image matches the recipe, False otherwise")


# Fast model for image validation with structured output
_validation_llm = None


def get_validation_llm():
    """Get or create the fast validation LLM (Claude Haiku) with structured output."""
    global _validation_llm
    if _validation_llm is None:
        base_llm = ChatAnthropic(
            model="claude-3-haiku-20240307",
            temperature=0,
            max_tokens=100,
        )
        _validation_llm = base_llm.with_structured_output(ImageRelevance)
    return _validation_llm


def search_recipe_image(recipe_name: str) -> str | None:
    """
    Search for a relevant image for the recipe using Tavily.
    Validates image descriptions with a fast model to ensure relevance.

    Args:
        recipe_name: The name of the recipe to find an image for

    Returns:
        URL of a relevant image, or None if no good match found
    """
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        return None

    try:
        client = TavilyClient(api_key=api_key)

        # Search for images of the recipe
        response = client.search(
            query=f"{recipe_name} food recipe dish",
            search_depth="basic",
            include_images=True,
            include_image_descriptions=True,
            max_results=3,
        )

        images = response.get("images", [])
        if not images:
            return None

        # Get the validation LLM with structured output
        llm = get_validation_llm()

        # Check up to 5 images for relevance
        for image in images[:5]:
            # Handle both formats: string URL or dict with url/description
            if isinstance(image, str):
                # No description available, just return the first image
                return image

            image_url = image.get("url", "")
            image_desc = image.get("description", "")

            if not image_url:
                continue

            # If no description, use the image
            if not image_desc:
                return image_url

            # Validate with fast model using structured output
            validation_prompt = f"""Does this image description match the recipe "{recipe_name}"?

Image description: {image_desc}"""

            try:
                result: ImageRelevance = llm.invoke(validation_prompt)
                if result.is_relevant:
                    return image_url
            except Exception:
                # If validation fails, just use this image
                return image_url

        # Fallback: return first image URL if available
        first_image = images[0]
        if isinstance(first_image, str):
            return first_image
        return first_image.get("url")

    except Exception as e:
        print(f"Image search failed: {e}")
        return None
