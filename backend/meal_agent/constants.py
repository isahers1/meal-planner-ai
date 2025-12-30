"""Constants for the meal planner agent."""

# Days of the week in order (Monday to Sunday)
DAYS_OF_WEEK = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]

# Pantry staples - items that are assumed to be available and don't need to be on shopping list
# Unless used in a non-standard way (e.g., butter as main ingredient, not just for cooking)
PANTRY_STAPLES = {
    "salt",
    "pepper",
    "black pepper",
    "white pepper",
    "olive oil",
    "vegetable oil",
    "canola oil",
    "cooking oil",
    "butter",
    "garlic powder",
    "onion powder",
    "paprika",
    "cumin",
    "oregano",
    "basil",
    "thyme",
    "rosemary",
    "bay leaves",
    "cinnamon",
    "nutmeg",
    "cayenne pepper",
    "red pepper flakes",
    "water",
    "ice",
    "flour",
    "sugar",
    "brown sugar",
    "baking soda",
    "baking powder",
    "vanilla extract",
    "soy sauce",
    "vinegar",
    "apple cider vinegar",
    "white vinegar",
    "balsamic vinegar",
    "worcestershire sauce",
    "hot sauce",
    "mustard",
    "ketchup",
    "mayonnaise",
}

# Fresh ingredients that spoil within a week and need tracking
# These are categories - the LLM will classify specific ingredients
FRESH_INGREDIENT_CATEGORIES = {
    "vegetables",
    "fruits",
    "fresh_herbs",
    "meat",
    "poultry",
    "seafood",
    "dairy",
    "eggs",
}

# Standard purchase units for fresh ingredients
# Maps ingredient type to (unit_name, quantity)
# These represent typical minimum purchase amounts at a grocery store
STANDARD_PURCHASE_UNITS = {
    # Meats (typically sold by the pound)
    "ground_beef": ("lb", 1.0),
    "chicken_breast": ("lb", 1.0),
    "chicken_thighs": ("lb", 1.0),
    "pork_chops": ("lb", 1.0),
    "bacon": ("package", 1.0),  # ~12oz package
    "sausage": ("lb", 1.0),
    "steak": ("lb", 1.0),
    "salmon": ("lb", 0.5),  # Often sold in ~8oz fillets
    "shrimp": ("lb", 1.0),

    # Vegetables (typically sold individually or by bunch)
    "onion": ("whole", 1.0),
    "yellow_onion": ("whole", 1.0),
    "red_onion": ("whole", 1.0),
    "garlic": ("head", 1.0),
    "bell_pepper": ("whole", 1.0),
    "tomato": ("whole", 1.0),
    "potato": ("lb", 1.0),
    "carrot": ("lb", 1.0),
    "celery": ("bunch", 1.0),
    "broccoli": ("head", 1.0),
    "cauliflower": ("head", 1.0),
    "zucchini": ("whole", 1.0),
    "cucumber": ("whole", 1.0),
    "lettuce": ("head", 1.0),
    "spinach": ("bag", 1.0),  # ~5oz bag
    "mushrooms": ("package", 1.0),  # ~8oz package
    "green_beans": ("lb", 0.5),
    "asparagus": ("bunch", 1.0),
    "corn": ("ear", 2.0),
    "cabbage": ("head", 1.0),

    # Fresh herbs
    "cilantro": ("bunch", 1.0),
    "parsley": ("bunch", 1.0),
    "basil_fresh": ("bunch", 1.0),
    "mint": ("bunch", 1.0),
    "dill": ("bunch", 1.0),
    "green_onion": ("bunch", 1.0),
    "scallions": ("bunch", 1.0),

    # Dairy
    "milk": ("gallon", 0.5),  # Half gallon
    "heavy_cream": ("pint", 1.0),
    "sour_cream": ("container", 1.0),  # ~16oz
    "cream_cheese": ("package", 1.0),  # 8oz block
    "cheddar_cheese": ("block", 1.0),  # ~8oz
    "mozzarella": ("package", 1.0),
    "parmesan": ("wedge", 1.0),
    "yogurt": ("container", 1.0),

    # Eggs
    "eggs": ("dozen", 1.0),  # 12 eggs

    # Fruits
    "lemon": ("whole", 2.0),
    "lime": ("whole", 2.0),
    "avocado": ("whole", 2.0),
    "apple": ("whole", 3.0),
    "banana": ("bunch", 1.0),
}

# Non-perishable items that don't need fresh inventory tracking
NON_PERISHABLES = {
    "pasta",
    "rice",
    "canned_tomatoes",
    "canned_beans",
    "chicken_broth",
    "beef_broth",
    "vegetable_broth",
    "coconut_milk",
    "dried_beans",
    "lentils",
    "quinoa",
    "oats",
    "bread_crumbs",
    "panko",
    "cornstarch",
    "honey",
    "maple_syrup",
    "peanut_butter",
    "jam",
    "crackers",
    "tortillas",
    "bread",
    "nuts",
    "dried_fruit",
}
